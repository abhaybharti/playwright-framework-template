import * as fs from 'fs';

class JsonReader {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * Reads a JSON file from the given path and returns its content as an object.
     * @returns Parsed JSON object or null if an error occurs.
     */
    readJsonFile(): any {
        try {
            const fileContent = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error("Error reading or parsing JSON file:", error);
            return null;
        }
    }

    /**
     * Retrieves a value from a nested JSON object using a JSON path hierarchy.
     * @param jsonObj - The JSON object.
     * @param path - The dot-separated JSON path (e.g., "user.address.city").
     * @returns The value at the specified path or undefined if not found.
     */
    getJsonValue(jsonObj: any, path: string): any {
        return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), jsonObj);
    }
}

// Example usage
const jsonReader = new JsonReader('./config.json'); // Update with your actual JSON file path
const jsonData = jsonReader.readJsonFile();

if (jsonData) {
    const value = jsonReader.getJsonValue(jsonData, 'address.street'); // Example: Reading "city" from "user.address.city"
    console.log("Extracted Value:", value);
}
