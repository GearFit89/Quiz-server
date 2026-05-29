export default class Rand {
    // Private static helper to handle all string/char/hex generation logic
    private static generateFromSet(chars: string, length: number): string {
        let result = ''; // Initialize an empty string to store the result
        for (let i = 0; i < length; i++) { // Iterate until the desired length is reached
            result += chars.charAt(Math.floor(Math.random() * chars.length)); // Pick and append a random character
        }
        return result; // Return the completed random string
    }

    static chancePercent(per: number): boolean {
        return this.randomChance(per / 100); // Convert percentage to a decimal and pass to randomChance
    }

    static chanceFloat(per: number): boolean {
        return this.randomChance(per); // Map the float probability directly to randomChance
    }

    static randomChance(chance: number): boolean {
        return Math.random() < chance; // Check if a random decimal is less than the provided threshold
    }

    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min; // Calculate a random integer within the inclusive range
    }

    static chanceRange(min: number, max: number): number {
        return this.randomInt(min, max); // Reuse the integer logic to maintain consistency
    }

    static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min; // Generate a floating point number between min and max
    }

    static randString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Define the alphanumeric character set
        return this.generateFromSet(chars, length); // Use the static helper to build the string
    }

    static randShoestring(length: number): string {
        return this.randString(length); // Alias for randString to provide naming flexibility
    }

    static RandomChar(length: number): string {
        return this.randString(length); // Alias for randString for legacy compatibility
    }

    static randomHex(length: number): string {
        return this.generateFromSet('0123456789abcdef', length); // Generate a hex string using only 0-9 and a-f
    }

    static randArray<T>(arr: T[]): T {
        return arr[this.randomInt(0, arr.length - 1)]; // Pick a random element using a random index
    }

    static randObject<T extends object>(obj: T): T[keyof T] {
        const keys = Object.keys(obj) as (keyof T)[]; // Extract all keys from the object
        return obj[this.randArray(keys)]; // Select a random key and return its corresponding value
    }

    static randomBool(): boolean {
        return this.randomChance(0.5); // Return true or false based on a 50% probability
    }

    static randRegex(pattern: RegExp, length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Define characters to test against
        let result = ''; // Start with an empty string
        let attempts = 0; // Initialize a counter to prevent potential infinite loops
        while (result.length < length && attempts < 1000) { // Continue until the length is met or attempts exceed limit
            const char = chars.charAt(Math.floor(Math.random() * chars.length)); // Select a candidate character
            if (pattern.test(result + char)) { // Validate the new string against the provided regex pattern
                result += char; // Append the character if it passes the regex test
            }
            attempts++; // Increment the attempt counter
        }
        return result; // Return the generated string that matches the pattern
    }
}