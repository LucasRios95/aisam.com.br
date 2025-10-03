import { inject, injectable } from "tsyringe";
import { IMailProvider } from "shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "shared/errors/AppError";

interface IRequest {
    to: string;
    subject: string;
    body: string;
    from?: string;
}

@injectable()
class SendEmailUseCase {
    constructor(
        @inject("MailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute({ to, subject, body, from }: IRequest): Promise<void> {
        if (!to || !subject || !body) {
            throw new AppError("Campos obrigatórios não fornecidos!", 400);
        }

        await this.mailProvider.sendMail({
            to,
            subject,
            body,
            from
        });
    }
}

export { SendEmailUseCase };
