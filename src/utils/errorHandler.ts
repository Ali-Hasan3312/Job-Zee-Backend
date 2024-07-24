class ErrorHandler extends Error {
    constructor(public message: string, public statusCode: number, public path?: string, public keyValue?: string, public code?: number) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  export default ErrorHandler;