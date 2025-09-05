
import { step } from "../utils/report/ReportAction";

export class Helper {
  @step('isValidDate')
  async isValidDate(date: string) {
    if (Date.parse(date)) {
      return true;
    } else {
      return false;
    }
  }
}
