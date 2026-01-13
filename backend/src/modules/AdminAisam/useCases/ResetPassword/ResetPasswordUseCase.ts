import { inject, injectable } from "tsyringe";
import { IAdminAisamRepository } from "@modules/AdminAisam/repositories/IAdminAisamRepository";
import { AppError } from "@shared/errors/AppError";
import { hash } from "bcryptjs";

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject("AdminAisamRepository")
    private adminRepository: IAdminAisamRepository
  ) {}

  async execute(token: string, senha: string): Promise<void> {
    // Buscar admin por token
    const admin = await this.adminRepository.findByResetToken(token);

    if (!admin) {
      throw new AppError("Token inválido ou expirado", 400);
    }

    // Verificar se o token expirou
    const now = new Date();
    if (!admin.reset_password_expires_at || admin.reset_password_expires_at < now) {
      throw new AppError("Token expirado. Solicite uma nova recuperação de senha.", 400);
    }

    // Hash da nova senha
    const hashedPassword = await hash(senha, 8);

    // Atualizar senha e limpar tokens
    admin.senha = hashedPassword;
    admin.reset_password_token = null;
    admin.reset_password_expires_at = null;

    await this.adminRepository.save(admin);
  }
}
