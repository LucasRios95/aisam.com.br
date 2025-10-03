import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendEmailUseCase } from "./SendEmailUseCase";

class SendEmailController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { to, subject, body, from } = request.body;

        const sendEmailUseCase = container.resolve(SendEmailUseCase);

        await sendEmailUseCase.execute({
            to,
            subject,
            body,
            from
        });

        return response.status(200).json({ message: "E-mail enviado com sucesso!" });
    }
}

export { SendEmailController };
