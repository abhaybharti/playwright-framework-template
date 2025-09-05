import test from "@playwright/test";

export function step(_stepName?: string) {
  return function (target: any, context: ClassMethodDecoratorContext) {
    return function (...args: any) {
      // get the class and method details
      const methodDetails = this.constructor.name + '.' + (context.name as string)
      // Get the step details and add the parameter value with steps
      const name = _stepName ? `${_replacePlaceholders(_stepName, args)} - ${methodDetails} ` : methodDetails
      return test.step(name, async () => {
        return await target.call(this, ...args)
      })
    }
  }
}

function _replacePlaceholders(template: string, values: any[]): string {
  values.forEach(value => {
    if (typeof value === 'string' || typeof value === 'number') {
      // add support for other data types if needed
      template = template.replace(/{(.*?)}/, value as any)
    }
  })
  return template
}