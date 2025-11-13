
import { step } from "../utils/report/ReportAction";

export class Helper {
  // Internal storage for locators
  const locatorStorage = new Map();

  /**
 * The `delay` function is an asynchronous function that waits for a specified amount of time before
 * resolving.
 * @param {number} time - The `time` parameter is a number that represents the duration of the delay
 * in seconds.
 * @returns a Promise that resolves to void.
 */
  @step('delay')
  async delay(time: number): Promise<void> {
    return new Promise(function (resolve) {
      setTimeout(resolve, time * 1000);
    });
  }

  /**
   * Validates whether the provided string is a valid date parsable by `Date.parse()`.
   * @param {string} date - The date string to validate.
   * @returns {Promise<boolean>} Resolves to true if the date string is valid; otherwise false.
   */
  @step('isValidDate')
  async isValidDate(date: string): Promise<boolean> {
    if (Date.parse(date)) {
      return true;
    } else {
      return false;
    }
  }

  /**
    * Clears all stored locators
    */
  clearStoredLocators() {
    this.locatorStorage.clear();
  }


}
