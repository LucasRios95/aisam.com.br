import { Request, Response } from "express";
import { container } from "tsyringe";
import { GenerateMagicLinkUseCase } from "./GenerateMagicLinkUseCase";

class GenerateMagicLinkController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { email } = request.body;

        const generateMagicLinkUseCase = container.resolve(GenerateMagicLinkUseCase);

        const result = await generateMagicLinkUseCase.execute({ email });

        return response.json(result);
    }
}

export { GenerateMagicLinkController };
