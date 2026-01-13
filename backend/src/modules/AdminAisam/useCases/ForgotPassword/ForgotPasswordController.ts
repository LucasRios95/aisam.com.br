import { Request, Response } from "express";
import { container } from "tsyringe";
import { ForgotPasswordUseCase } from "./ForgotPasswordUseCase";

export class ForgotPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const forgotPasswordUseCase = container.resolve(ForgotPasswordUseCase);

    await forgotPasswordUseCase.execute(email);

    return response.status(200).json({
      message: "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.",
    });
  }
}
