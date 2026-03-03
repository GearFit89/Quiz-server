export class BaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BaseError';
  }
}
export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}
