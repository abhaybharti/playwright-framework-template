"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonReader = void 0;
var fs = require("fs");
var path = require("path");
var JsonReader = /** @class */ (function () {
    function JsonReader(filePath) {
        // Resolve the path relative to the project root
        // Adjust the path resolution based on where the file is located
        this.filePath = path.resolve(__dirname, '..', '..', '..', 'tests', 'resources', 'uiMap', filePath);
        console.log('Reading JSON from:', this.filePath);
        this.readJsonFile();
    }
    /**
     * Reads a JSON file from the given path and returns its content as an object.
     * @returns Parsed JSON object or null if an error occurs.
     */
    JsonReader.prototype.readJsonFile = function () {
        try {
            if (!fs.existsSync(this.filePath)) {
                console.error("File not found: ".concat(this.filePath));
                return false;
            }
            var fileContent = fs.readFileSync(this.filePath, 'utf-8');
            this.jsonData = JSON.parse(fileContent);
            console.log(this.jsonData);
        }
        catch (error) {
            console.error("Error reading or parsing JSON file:", error);
            this.jsonData = null;
            return false;
        }
    };
    /**
     * Retrieves a value from a nested JSON object using a JSON path hierarchy.
     * @param jsonObj - The JSON object.
     * @param path - The dot-separated JSON path (e.g., "user.address.city").
     * @returns The value at the specified path or undefined if not found.
     */
    /**
    * Retrieves a value from a nested JSON object using a JSON path hierarchy.
    * @param path - The dot-separated JSON path to the parent object (e.g., "user.profile.address").
    * @param key - The specific key to retrieve from the parent object (e.g., "city").
    * @returns The value at the specified key in the parent object or undefined if not found.
    */
    JsonReader.prototype.getJsonValue = function (path, key) {
        if (!this.jsonData) {
            console.log("No Json Data loaded");
            return undefined;
        }
        // First navigate to the parent object using the path
        var parentObject = path.split('.').reduce(function (acc, part) {
            if (acc && acc[part] !== undefined) {
                return acc[part];
            }
            return undefined;
        }, this.jsonData);
        // If we found the parent object, return the value for the specific key
        if (parentObject && parentObject[key] !== undefined) {
            return parentObject[key];
        }
        console.log("Path or key not found: ".concat(path, ".").concat(key));
        return undefined;
    };
    return JsonReader;
}());
exports.JsonReader = JsonReader;
// Example usage
function readData() {
    var jsonReader = new JsonReader('./orangeHRM.json'); // Update with your actual JSON file path
    // const jsonData = jsonReader.readJsonFile();
    if (jsonReader.jsonData) {
        var value = jsonReader.getJsonValue("user.profile.address", 'city'); // Example: Reading "city" from "user.address.city"
        console.log("Extracted Value:", value);
    }
}
readData();
