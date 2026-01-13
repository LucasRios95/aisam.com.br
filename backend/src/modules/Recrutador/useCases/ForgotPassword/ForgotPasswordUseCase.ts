import { inject, injectable } from "tsyringe";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { AppError } from "@shared/errors/AppError";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject("RecrutadorRepository")
    private recrutadorRepository: IRecrutadorRepository,
    @inject("MailProvider")
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    // Buscar recrutador por email
    const recrutador = await this.recrutadorRepository.findByEmail(email);

    if (!recrutador) {
      // Por segurança, não revelamos que o e-mail não existe
      // Retornamos sucesso mesmo assim
      return;
    }

    // Gerar token único
    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2); // Token válido por 2 horas

    // Salvar token no banco
    recrutador.reset_password_token = resetToken;
    recrutador.reset_password_expires_at = expiresAt;
    await this.recrutadorRepository.save(recrutador);

    // URL para reset de senha
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/redefinir-senha?token=${resetToken}`;

    // Enviar e-mail
    try {
      await this.mailProvider.sendMail({
        to: email,
        subject: "Recuperação de Senha - AISAM",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0066E6; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">AISAM</h1>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9;">
              <h2 style="color: #333;">Recuperação de Senha</h2>
              <p style="color: #666; line-height: 1.6;">
                Olá, ${recrutador.nome}!
              </p>
              <p style="color: #666; line-height: 1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta no sistema AISAM.
              </p>
              <p style="color: #666; line-height: 1.6;">
                Para criar uma nova senha, clique no botão abaixo:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}"
                   style="background-color: #0066E6; color: white; padding: 12px 30px;
                          text-decoration: none; border-radius: 5px; display: inline-block;
                          font-weight: bold;">
                  Redefinir Senha
                </a>
              </div>
              <p style="color: #666; line-height: 1.6; font-size: 14px;">
                Ou copie e cole este link no seu navegador:
              </p>
              <p style="color: #0066E6; word-break: break-all; font-size: 12px;">
                ${resetUrl}
              </p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px;">
                <strong>Importante:</strong> Este link é válido por 2 horas.
              </p>
              <p style="color: #999; font-size: 12px;">
                Se você não solicitou a recuperação de senha, ignore este e-mail.
                Sua senha permanecerá inalterada.
              </p>
            </div>
            <div style="background-color: #333; padding: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} AISAM - Associação das Indústrias de Santa Maria da Serra e Região
              </p>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      throw new AppError("Erro ao enviar e-mail de recuperação. Tente novamente mais tarde.");
    }
  }
}
