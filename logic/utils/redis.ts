// Import the Redis client library to establish a connection
import { redis } from "../redishelpers.js";
// this could be helped by a dependency injection framework but for simplicity we will just create an instance here
// Initialize the Redis client instance for the application
const redisClient = redis;

// Base class containing static helper methods for error handling and debugging
export class RedisHelper {
    // this is good place to use sql logic in case redis is down or to log all redis operations for debugging purposes
    // Generic method to execute Redis operations with built-in error handling
    static async execute<T>(operationName: string, operation: () => Promise<T>): Promise<T | null> {
        // Open a try block to catch any potential runtime errors during execution
        try {
            // Log the start of the operation to the console for easy debugging
            console.log(`[Redis] Executing: ${operationName}`);
            // Await the execution of the passed operation and store the result
            const result = await operation();
            // Log a success message once the operation completes without errors
            console.log(`[Redis] Success: ${operationName}`);
            // Return the successful result back to the caller
            return result;
            // Catch any errors thrown by the Redis client or network issues
        } catch (error) {
            // Log the specific error along with the operation name for quick tracing
            console.error(`[Redis Error] Failed at ${operationName}:`, error);
            // Return null instead of crashing the application to ensure graceful degradation
            return null;
        }
    }
}

// Static class dedicated to managing Redis String operations
export class RedisString {
    // Method to store a string value under a specific key
    static async set(key: string, value: string): Promise<string | null> {
        // Call the helper method to execute the SET command safely
        return RedisHelper.execute(`SET ${key}`, () => redisClient.set(key, value));
    }

    // Method to retrieve a string value using its key
    static async get(key: string): Promise<string | null> {
        // Call the helper method to execute the GET command safely
        return RedisHelper.execute(`GET ${key}`, () => redisClient.get(key));
    }
}

// Static class dedicated to managing Redis Hash operations
export class RedisHash {
    // Method to set a specific field within a hash map
    static async hset(key: string, field: string, value: string): Promise<number | null> {
        // Call the helper method to execute the HSET command safely
        return RedisHelper.execute(`HSET ${key} ${field}`, () => redisClient.hset(key, field, value));
    }

    // Method to retrieve all fields and values from a hash map
    static async hgetall(key: string): Promise<Record<string, string> | null> {
        // Call the helper method to execute the HGETALL command safely
        return RedisHelper.execute(`HGETALL ${key}`, () => redisClient.hgetall(key));
    }
}

// Static class dedicated to managing Redis List operations
export class RedisList {
    // Method to insert a new value at the head (left side) of a list
    static async lpush(key: string, value: string): Promise<number | null> {
        // Call the helper method to execute the LPUSH command safely
        return RedisHelper.execute(`LPUSH ${key}`, () => redisClient.lpush(key, value));
    }

    // Method to retrieve a specific range of elements from a list
    static async lrange(key: string, start: number, stop: number): Promise<string[] | null> {
        // Call the helper method to execute the LRANGE command safely
        return RedisHelper.execute(`LRANGE ${key} ${start}-${stop}`, () => redisClient.lrange(key, start, stop));
    }
}

// Static class dedicated to managing Redis Set operations
export class RedisSet {
    // Method to add a unique member to a set
    static async sadd(key: string, value: string): Promise<number | null> {
        // Call the helper method to execute the SADD command safely
        return RedisHelper.execute(`SADD ${key}`, () => redisClient.sadd(key, value));
    }

    // Method to retrieve all unique members from a set
    static async smembers(key: string): Promise<string[] | null> {
        // Call the helper method to execute the SMEMBERS command safely
        return RedisHelper.execute(`SMEMBERS ${key}`, () => redisClient.smembers(key));
    }
}

// Static class dedicated to managing Redis Sorted Set operations
export class RedisSortedSet {
    // Method to add a member with an associated score to a sorted set
    static async zadd(key: string, score: number, value: string): Promise<number | string | null> {
        // Call the helper method to execute the ZADD command safely
        return RedisHelper.execute(`ZADD ${key}`, () => redisClient.zadd(key, score, value));
    }

    // Method to retrieve a range of members from a sorted set based on index
    static async zrange(key: string, start: number, stop: number): Promise<string[] | null> {
        // Call the helper method to execute the ZRANGE command safely
        return RedisHelper.execute(`ZRANGE ${key}`, () => redisClient.zrange(key, start, stop));
    }
}