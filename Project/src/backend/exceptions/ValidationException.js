export class ValidationException extends Error {
  constructor(message) {
    super(Array.isArray(message) ? message.join(', ') : message);
    this.name = 'ValidationException';
    this.errors = Array.isArray(message) ? message : [message];
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationException);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors
    };
  }
}