import test from "@playwright/test";

export function step<T>(_stepName?: string) {
  return function (target: (...args: any[]) => Promise<T>, context: ClassMethodDecoratorContext) {
    return function (this: any, ...args: any[]): Promise<T> {
      const isStatic = typeof this === 'function';
      const className = isStatic ? this.name : getOriginalClass(this, context.name.toString());
      const methodDetails = `${className}.${context.name.toString()}`;

      // Extract function parameter names and default values
      const { paramNames, defaultValues } = extractFunctionParamNames(target);

      // Replace placeholders, considering default values
      const name = _stepName 
        ? `${replacePlaceholders(_stepName, args, paramNames, defaultValues)} - ${methodDetails}`
        : methodDetails;

      const error = new Error('Capturing stack trace');
      const stackLines = error.stack?.split('\n') || [];
      const stack = stackLines.find(line => line.includes('.ts:') && !line.includes('step-decorator.ts'));

      const filePath = stack?.match(/tests\/(.+)/);
      const finalPath = filePath ? `.../${filePath[1]}` : null;

      const stepNameWithStack = `${name} — ${finalPath}`;

      return test.step(stepNameWithStack, async () => {
        return await target.call(this, ...args) as T; 
      });
    };
  };
}

// Converts complex objects (like JSON) into a human-readable format
function formatValue(value: any): string {
  if (value instanceof Set) {
    return JSON.stringify([...value], null, 2); // Convert Set to Array before stringifying
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2); // Pretty-print objects for readability
  }
  return value as string; // Ensure it is always a string
}

/**
 * Replaces placeholders in the step name template with actual function arguments,
 * including handling default parameter values when arguments are not provided.
 */
function replacePlaceholders(template: string, values: any[], paramNames: string[], defaultValues: Record<string, any>): string {
  let result = template;
  
  for (const [index, param] of paramNames.entries()) {
    const value = values[index] == null ? defaultValues[param] : values[index]; // Use passed value or default
    
    // handle for named parameters
    if (param.startsWith("{") && typeof value === "object" && value !== null) {
      
      // Iterate over all keys in the object
      for (const key of Object.keys(value)) {
          replacePlaceholderParam(key, value[key]);
      }

    }

    else{
      replacePlaceholderParam(param, value);
    }
    
  }

  function replacePlaceholderParam(replaceParamName:string, value:any): void{
    const regex = new RegExp(`{${replaceParamName}}`, "g");
    result = result.replace(regex, formatValue(value) ?? "null"); // Replace only if param exists
  }

  return result;
}

/**
 * Extracts function parameter names and their default values.
 */
function extractFunctionParamNames(func: (...args: any[]) => any): { paramNames: string[], defaultValues: Record<string, any> } {
  const fnStr = func.toString();
  const match = fnStr.match(/\((.*?)\)/s); // Match function parameters inside ()
  if (!match) return { paramNames: [], defaultValues: {} };

  let paramStr = match[1].replace(/\s+/, ' ').trim(); // Normalize spaces
  const paramNames: string[] = [];
  const defaultValues: Record<string, any> = {};
  let braceCount = 0;
  let currentParam = "";

  for (const char of paramStr) {
    if (char === '{') braceCount++; // Handle destructured objects
    if (char === '}') braceCount--;

    if (char === ',' && braceCount === 0) {
      processParam(currentParam.trim());
      currentParam = "";
    } else {
      currentParam += char;
    }
  }
  if (currentParam) processParam(currentParam.trim()); // Process the last parameter

  function processParam(param: string): void {
    if (!param) return;
    
    const [paramName, defaultValue] = param.split("=").map(p => p.trim());

    paramNames.push(paramName);
    if (defaultValue !== undefined) {
      try {
        // Convert default values from string to proper type (number, boolean, object)
        defaultValues[paramName] = eval(`(${defaultValue})`);
      } catch {
        defaultValues[paramName] = defaultValue; // Fallback to string if parsing fails
      }
    }
  }

  return { paramNames, defaultValues };
}

// to get parent class name
function getOriginalClass(instance: any, methodName: string): string {
  let proto = instance;
  while (proto && proto !== Object.prototype) {
    if (Object.prototype.hasOwnProperty.call(proto, methodName)) {
      return proto.constructor.name; // Return the defining class name
    } else {
      proto = Object.getPrototypeOf(proto);
    }
  }
  return instance.constructor.name; // Fallback to the instance class
}
