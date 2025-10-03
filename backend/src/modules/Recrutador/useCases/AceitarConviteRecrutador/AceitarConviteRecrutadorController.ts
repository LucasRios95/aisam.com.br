import { Request, Response } from "express";
import { container } from "tsyringe";
import { AceitarConviteRecrutadorUseCase } from "./AceitarConviteRecrutadorUseCase";

class AceitarConviteRecrutadorController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { token, senha } = request.body;

        const aceitarConviteRecrutadorUseCase = container.resolve(AceitarConviteRecrutadorUseCase);

        await aceitarConviteRecrutadorUseCase.execute({
            token,
            senha
        });

        return response.json({ message: "Convite aceito com sucesso" });
    }
}

export { AceitarConviteRecrutadorController };
