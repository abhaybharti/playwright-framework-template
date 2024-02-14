import { promisify } from "util";
import fs from "fs";

export class JsonReader {
  private fileName: string;
  private jsonData: any = "";
  private readFile: any;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.readFile = promisify(fs.readFile);
    this.jsonData = this.readJson();
  }

  async readJson() {
    return await JSON.parse(this.readFile(this.fileName, "utf-8"));
  }

  //function to read a given path and return the data
  async getParamData(jsonPath: string) {}

  //function to return all element matching keyType & keyVal
  async getTabName() {}
  //

  async getParamLabels(jsonHierarchy: string) {}

  async getAllParamsInHierarchy(jsonHierarchy: string) {}

  async getEndPointNames() {}
}
