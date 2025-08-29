
export class AppError {
    public readonly message: string;
    public readonly statusCode: number

    constructor(message: string, statusCode = 400) { //status code padrão para erro definido nos params do contrutor
        this.message = message;
        this.statusCode = statusCode;
    }
}

