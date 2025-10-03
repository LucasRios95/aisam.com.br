import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider } from "../IMailProvider";
import { ISendMailDTO } from "modules/Notificacao/dtos/ISendMailDTO";

class NodemailerMailProvider implements IMailProvider {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || "smtp.gmail.com",
            port: Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    }

    async sendMail({ to, subject, body, from }: ISendMailDTO): Promise<void> {
        await this.transporter.sendMail({
            from: from || process.env.MAIL_FROM || "noreply@aisam.com.br",
            to,
            subject,
            html: body
        });
    }
}

export { NodemailerMailProvider };
