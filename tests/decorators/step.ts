import { test } from '@playwright/test';

export function step(description?: string) {
  return function (target: Function, context: ClassMethodDecoratorContext) {
    return function replacementMethod(...args: any) {
      const className = this.constructor.name;
      const methodName = context.name as string;
      const stepName = description || `${className}.${methodName}`;
      
      return test.step(stepName, async () => {
        return await target.call(this, ...args);
      });
    };
  };
}

// @step()
// async launchApp()
// {
//       await this.page.goto(this.ENV.BASE_URL)
//       await this.utility.waitUntilPageIsLoaded()
// }

export function boxedStep(description?: string) {
    return function (target: Function, context: ClassMethodDecoratorContext) {
      return function replacementMethod(...args: any) {
        const className = this.constructor.name;
        const methodName = context.name as string;
        const stepName = description || `${className}.${methodName}`;
        
        return test.step(stepName, async () => {
          return await target.call(this, ...args);
        }, { box: true });
      };
    };
  }

  export function timeout(maxTimeout: number, description?: string) {
    return function (target: Function, context: ClassMethodDecoratorContext) {
      return function replacementMethod(...args: any) {
        const className = this.constructor.name;
        const methodName = context.name as string;
        const stepName = description || `${className}.${methodName}`;
        
        return test.step(stepName, async () => {
          return await target.call(this, ...args);
        }, { timeout: maxTimeout });
      };
    };
  }

  export function retry(attempts: number = 3, delay: number = 1000) {
    return function (target: Function, context: ClassMethodDecoratorContext) {
      return async function replacementMethod(...args: any) {
        const className = this.constructor.name;
        const methodName = context.name as string;
        
        return test.step(`${className}.${methodName} (with retry)`, async () => {
          let lastError: Error;
          
          for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
              return await target.call(this, ...args);
            } catch (error) {
              lastError = error as Error;
              
              if (attempt === attempts) {
                throw new Error(
                  `Method failed after ${attempts} attempts. Last error: ${lastError.message}`
                );
              }
              
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        });
      };
    };
  }

  export function performance(configOptions: { warnThreshold?: number; errorThreshold?: number; trackMemory?: boolean } = {}) {
  
    // Set default values if they are not provided
    const { warnThreshold = 0, errorThreshold = 0, trackMemory = false } = configOptions
   
     return function (target: Function, context: ClassMethodDecoratorContext) {
       return async function replacementMethod(...args: any) {
         const className = this.constructor.name
         const methodName = context.name as string
         
         return test.step(`${className}.${methodName} (performance tracked)`, async () => {
           const startTime = Date.now()
           const startMemory = configOptions.trackMemory ? process.memoryUsage() : null
           
           try {
             const result = await target.call(this, ...args)
             const duration = Date.now() - startTime
             
             // Log performance metrics
             console.log(`Performance: ${className}.${methodName} took ${duration}ms`)
             
             if (configOptions.warnThreshold && duration > configOptions.warnThreshold) {
               console.warn(`Warning: ${className}.${methodName} exceeded warn threshold (${duration}ms > ${configOptions.warnThreshold}ms)`)
             }
             
             if (configOptions.errorThreshold && duration > configOptions.errorThreshold) {
               throw new Error(`Performance error: ${className}.${methodName} exceeded error threshold (${duration}ms > ${configOptions.errorThreshold}ms)`)
             }
             
             if (startMemory && configOptions.trackMemory) {
               const endMemory = process.memoryUsage()
               const memoryDiff = endMemory.heapUsed - startMemory.heapUsed
               console.log(`Memory: ${className}.${methodName} used ${memoryDiff} bytes`)
             }
             
             return result
           } catch (error) {
             const duration = Date.now() - startTime
             console.error(`Performance: ${className}.${methodName} failed after ${duration}ms`)
             throw error
           }
         })
       }
     }
   }

   export function screenshot(configOptions:{onError?: boolean; onSuccess?: boolean; beforeExecution?: boolean; afterExecution?: boolean; path?: string}={}) {
    // Set default values if they are not provided
  const { onError = false, onSuccess = true, beforeExecution = false,afterExecution=false } = configOptions
   return function (target: Function, context: ClassMethodDecoratorContext) {
     return async function replacementMethod(...args: any) {
       const className = this.constructor.name
       const methodName = context.name as string
       const page = this.page as Page // Assuming page is available on 'this'
       
       return test.step(`${className}.${methodName} (with screenshots)`, async () => {
         const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
         const basePath = configOptions.path || `screenshots/${className}-${methodName}-${timestamp}`
         
         try {
           // Before execution screenshot
           if (configOptions.beforeExecution) {
             await page.screenshot({ 
               path: `${basePath}-before.png`,
               fullPage: true, 
             })
           }
           
           const result = await target.call(this, ...args)
           
           // Success screenshot
           if (configOptions.onSuccess || configOptions.afterExecution) {
             await page.screenshot({ 
               path: `${basePath}-success.png`,
               fullPage: true, 
             })
           }
           
           return result
         } catch (error) {
           // Error screenshot
           if (configOptions.onError) {
             await page.screenshot({ 
               path: `${basePath}-error.png`,
               fullPage: true, 
             })
           }
           throw error
         }
       })
     }
   }
 }

 // params like onSuccess,onError,beforeExecution,afterExecution are optional
//  @screenshot({onSuccess: true, onError: true,beforeExecution: true, afterExecution: true})
//  async launchApp()
//  {
//        await this.page.goto(this.ENV.BASE_URL)
//        await this.utility.waitUntilPageIsLoaded()
//  }

// // You can send only one param like onSuccess
//  @screenshot({onSuccess: true})
//  async launchApp()
//  {
//        await this.page.goto(this.ENV.BASE_URL)
//        await this.utility.waitUntilPageIsLoaded()
//  }

 
// // You can also choose not to send any params
//  @screenshot()
//  async launchApp()
//  {
//        await this.page.goto(this.ENV.BASE_URL)
//        await this.utility.waitUntilPageIsLoaded()
//  }


export function waitFor(configOptions:{element?: string; state?: 'visible' | 'hidden' | 'attached' | 'detached'; timeout?: number; url?: string | RegExp} = {}) {
    // Set default values if they are not provided
  
     const { element = null, state = 'visible', timeout = 30000,url=null } = configOptions
    return function (target: Function, context: ClassMethodDecoratorContext) {
      return async function replacementMethod(...args: any) {
        const className = this.constructor.name
        const methodName = context.name as string
        const page = this.page as Page
        
        return test.step(`${className}.${methodName} (with wait conditions)`, async () => {
          // Pre-execution waits
          if (configOptions.element) {
            await page.locator(configOptions.element).waitFor({ 
              state: configOptions.state || 'visible',
              timeout: configOptions.timeout, 
            })
          }
          
          if (configOptions.url) {
            await page.waitForURL(configOptions.url, { timeout: configOptions.timeout })
          }
          
          return await target.call(this, ...args)
        })
      }
    }
  }

  export function log(configOptions:{level?: 'debug' | 'info' | 'warn' | 'error'; logArgs?: boolean; logResult?: boolean; logDuration?: boolean} = {}) {
    // Set default values if they are not provided
    const { level = 'info', logArgs = true, logResult = true, logDuration = true } = configOptions
    return function (target: Function, context: ClassMethodDecoratorContext) {
      return async function replacementMethod(...args: any) {
        const className = this.constructor.name
        const methodName = context.name as string
        const level = configOptions.level || 'info'
        
        return test.step(`${className}.${methodName}`, async () => {
          const startTime = Date.now()
          
          // Log method entry
          console[level](`[${level.toUpperCase()}] Entering ${className}.${methodName}`)
          
          if (configOptions.logArgs) {
            console[level](`[${level.toUpperCase()}] Arguments:`, args)
          }
          
          try {
            const result = await target.call(this, ...args)
            const duration = Date.now() - startTime
            
            // Log successful completion
            console[level](`[${level.toUpperCase()}] Completed ${className}.${methodName}`)
            
            if (configOptions.logDuration) {
              console[level](`[${level.toUpperCase()}] Duration: ${duration}ms`)
            }
            
            if (configOptions.logResult && result !== undefined) {
              console[level](`[${level.toUpperCase()}] Result:`, result)
            }
            
            return result
          } catch (error) {
            const duration = Date.now() - startTime
            console.error(`[ERROR] Failed ${className}.${methodName} after ${duration}ms:`, error)
            throw error
          }
        })
      }
    }
  }

  export function environment(config: {
    production?: boolean
    staging?: boolean
    development?: boolean
    skip?: boolean
  }) {
    return function (target: Function, context: ClassMethodDecoratorContext) {
      return function replacementMethod(...args: any) {
        const env = process.env.NODE_ENV || 'development'
        
        // Skip logic
        if (config.skip && (
          (env === 'production' && config.production) ||
          (env === 'staging' && config.staging) ||
          (env === 'development' && config.development)
        )) {
          return test.step.skip(`Test Step Skipped as the env is: ${env}`, async () => {
            console.log(`Skipping method in ${env} environment`)
          })
        }
        
        return test.step(`${env.toUpperCase()}: ${context.name as string}`, async () => {
          return await target.call(this, ...args)
        })
      }
    }
  }
  
  // Usage
//   export class LoginPage {
//     @environment({ production: true, skip: true })
//     // This will be skipped in Production
//       async launchApp()
//       {
  
//             await this.page.goto(this.ENV.BASE_URL)
//             await this.utility.waitUntilPageIsLoaded()
//       }


// // pages/EcommercePage.ts
// import { Page, expect } from '@playwright/test';
// import { 
//   step, 
//   boxedStep, 
//   timeout, 
//   retry, 
//   performance, 
//   screenshot, 
//   waitFor, 
//   log,
//   asyncBoundary,
//   environment 
// } from '../decorators';

// export class EcommercePage {
//   constructor(private page: Page) {}
  
//   @boxedStep('Product Search and Selection')
//   @performance({ warnThreshold: 2000 })
//   @log({ level: 'info', logArgs: true, logDuration: true })
//   async searchAndSelectProduct(searchTerm: string, productIndex: number = 0) {
//     await this.searchForProduct(searchTerm);
//     await this.selectProduct(productIndex);
//     return this;
//   }
  
//   @step('Search for product')
//   @waitFor({ element: '[data-testid="search-input"]', state: 'visible' })
//   @retry(2, 1000)
//   private async searchForProduct(term: string) {
//     await this.page.fill('[data-testid="search-input"]', term);
//     await this.page.press('[data-testid="search-input"]', 'Enter');
//     await this.page.waitForSelector('[data-testid="search-results"]');
//   }
  
//   @step('Select product from results')
//   @screenshot({ onError: true })
//   @timeout(10000, 'Product selection and navigation')
//   private async selectProduct(index: number) {
//     const products = this.page.locator('[data-testid^="product-"]');
//     await products.nth(index).click();
//     await this.page.waitForURL(/\/product\//);
//   }
  
//   @boxedStep('Add to Cart Process')
//   @asyncBoundary({ 
//     timeout: 15000,
//     onError: async (error) => {
//       console.error('Add to cart failed:', error.message);
//       await this.page.screenshot({ path: 'add-to-cart-error.png' });
//     }
//   })
//   @performance({ errorThreshold: 5000 })
//   async addToCart(quantity: number = 1) {
//     await this.selectQuantity(quantity);
//     await this.clickAddToCart();
//     await this.verifyCartUpdate();
//     return this;
//   }
  
//   @step()
//   @waitFor({ element: '[data-testid="quantity-selector"]' })
//   private async selectQuantity(quantity: number) {
//     await this.page.selectOption('[data-testid="quantity-selector"]', quantity.toString());
//   }
  
//   @step('Click add to cart button')
//   @retry(3, 500)
//   private async clickAddToCart() {
//     await this.page.click('[data-testid="add-to-cart"]');
//   }
  
//   @step('Verify cart was updated')
//   @timeout(8000, 'Cart update verification')
//   private async verifyCartUpdate() {
//     // Wait for cart count to update
//     await this.page.waitForFunction(() => {
//       const cartCount = document.querySelector('[data-testid="cart-count"]');
//       return cartCount && parseInt(cartCount.textContent || '0') > 0;
//     });
//   }
  
//   @environment({ production: false })
//   @step('Clear cart for testing')
//   @log({ level: 'debug' })
//   async clearCartForTesting() {
//     // Only available in non-production environments
//     await this.page.evaluate(() => {
//       localStorage.removeItem('cart');
//       sessionStorage.removeItem('cart');
//     });
//   }
// }

// // Usage in tests
// test.describe('E-commerce Flow', () => {
//   test('complete purchase flow with decorators', async ({ page }) => {
//     const ecommercePage = new EcommercePage(page);
    
//     await page.goto('https://example-store.com');
    
//     await ecommercePage
//       .searchAndSelectProduct('laptop', 0)
//       .addToCart(2)
//       .clearCartForTesting(); // Only runs in non-production
//   });
// });


// decorators/dataProvider.ts
// import { test } from '@playwright/test';

export function dataProvider<T>(data: T[] | (() => T[])) {
  return function (target: Function, context: ClassMethodDecoratorContext): any {
    return async function replacementMethod(...args: any) {
      const className = this.constructor.name
      const methodName = context.name as string
      const testData = typeof data === 'function' ? data() : data
      
      return test.step(`${className}.${methodName} (data-driven with results)`, async () => {
        const results = []
        let hasResults = false
        
        for (let i = 0; i < testData.length; i++) {
          const item = testData[i]
          const result = await test.step(`Dataset ${i + 1}: ${JSON.stringify(item)}`, async () => {
            return await target.call(this, item, ...args)
          })
          
          // Only collect results if the method actually returns something
          if (result !== undefined && result !== null) {
            results.push(result)
            hasResults = true
          }
        }
        
        // Only return results array if there were actual results, otherwise return void/undefined
        return hasResults ? results : undefined
      })
    }
  }
}

// Usage
// export class FormPage {
//   constructor(private page: Page) {}
  
//   @dataProvider([
//     { email: 'test1@example.com', password: 'password123' },
//     { email: 'test2@example.com', password: 'mypassword' },
//     { email: 'admin@example.com', password: 'adminpass' }
//   ])
//   @step()
//   async testLoginWithCredentials(credentials: { email: string; password: string }) {
//     await this.page.fill('[data-testid="email"]', credentials.email);
//     await this.page.fill('[data-testid="password"]', credentials.password);
//     await this.page.click('[data-testid="login-button"]');
    
//     // Verify login success or failure based on credentials
//     const isSuccessful = await this.page.locator('[data-testid="dashboard"]').isVisible();
//     console.log(`Login with ${credentials.email}: ${isSuccessful ? 'Success' : 'Failed'}`);
    
//     return isSuccessful;
//   }
// }

// @step()        // Executes third (outermost)
// @retry(3)      // Executes second
// @performance() // Executes first (closest to method)
// async myMethod() {
//   // Method implementation
// }

export function debug() {
    return function (target: Function, context: ClassMethodDecoratorContext): any {
      return async function replacementMethod(...args: any): Promise<any> {
        console.log(`🐛 Entering ${context.name as string} with args:`, args)
        
        try {
          const result = await target.call(this, ...args)
          console.log(`✅ ${context.name as string} completed with result:`, result)
          return result
        } catch (error) {
          console.error(`❌ ${context.name as string} failed:`, error)
          throw error
        }
      }
    }
  }