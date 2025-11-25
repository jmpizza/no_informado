export class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundException';
    this.statusCode = 404;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundException);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode
    };
  }
}