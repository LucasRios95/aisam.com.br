import { Request, Response } from "express";
import { container } from "tsyringe";
import { ValidateMagicLinkUseCase } from "./ValidateMagicLinkUseCase";

class ValidateMagicLinkController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { token } = request.body;

        const validateMagicLinkUseCase = container.resolve(ValidateMagicLinkUseCase);

        const result = await validateMagicLinkUseCase.execute({ token });

        return response.status(200).json(result);
    }
}

export { ValidateMagicLinkController };
