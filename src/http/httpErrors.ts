export class HttpError extends Error {
    statusCode: number;
    context?: object;

    constructor(statusCode: number, message: string, context?: object) {
        super(message);
        this.statusCode = statusCode;
        this.context = context;
    }
}
