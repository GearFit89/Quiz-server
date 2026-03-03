import * as fs from 'fs'; // Import the file system module using ESM syntax
import * as path from 'path'; // Import the path module to handle directories

// Define an interface to ensure the logger follows a specific structure
interface ILogger {
    log(message: string): void; // Method signature for logging a string
    clear(): void; // Method signature for clearing the log file
}

class FileLogger implements ILogger {
    // Use a private property so the file path cannot be changed from outside
    private readonly logFile: string; // The path to our log file

    constructor(fileName: string = 'serverApp.log') {
        // Determine the absolute path using the current working directory
        this.logFile = path.join(process.cwd(), fileName);
    }

    public log(message: string): void {
        // Create a standardized timestamp
        const timestamp: string = new Date().toISOString();
        // Format the line with a newline at the end
        const logEntry: string = `[${timestamp}] ${message}\n`;

        try {
            // Synchronously append the string to the file
            fs.appendFileSync(this.logFile, logEntry);
        } catch (error) {
            // Print the error to console if file access fails
            console.error('Logging failed:', error);
        }
    }

    public clear(): void {
        try {
            // Overwrite the file with an empty string
            fs.writeFileSync(this.logFile, '');
        } catch (error) {
            // Handle potential permission errors or missing directories
            console.error('Clear failed:', error);
        }
    }
}

export default FileLogger; // Export the class as the default module