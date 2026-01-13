import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcryptjs";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("RecrutadorRepository")
    private recrutadorRepository: IRecrutadorRepository
  ) {}

  async execute(token: string, senha: string): Promise<void> {
    // Buscar recrutador por token
    const recrutador = await this.recrutadorRepository.findByResetToken(token);

    if (!recrutador) {
      throw new AppError("Token inválido ou expirado", 400);
    }

    // Verificar se o token expirou
    const now = new Date();
    if (!recrutador.reset_password_expires_at || recrutador.reset_password_expires_at < now) {
      throw new AppError("Token expirado. Solicite uma nova recuperação de senha.", 400);
    }

    // Hash da nova senha
    const hashedPassword = await hash(senha, 8);

    // Atualizar senha e limpar tokens
    recrutador.senha = hashedPassword;
    recrutador.reset_password_token = null;
    recrutador.reset_password_expires_at = null;

    await this.recrutadorRepository.save(recrutador);
  }
}
