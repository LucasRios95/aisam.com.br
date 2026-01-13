import { Request, Response } from "express";
import { container } from "tsyringe";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

export class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token, senha } = request.body;

    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    await resetPasswordUseCase.execute(token, senha);

    return response.status(200).json({
      message: "Senha redefinida com sucesso!",
    });
  }
}
