import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider } from "../IMailProvider";
import { ISendMailDTO } from "modules/Notificacao/dtos/ISendMailDTO";
import { MailTemplateProvider } from "./MailTemplateProvider";

class NodemailerMailProvider implements IMailProvider {
    private transporter: Transporter;
    private templateProvider: MailTemplateProvider;

    constructor() {
        const mailPort = Number(process.env.MAIL_PORT) || 587;

        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || "smtp.gmail.com",
            port: mailPort,
            secure: mailPort === 465, // true para porta 465 (SSL), false para outras portas (TLS)
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        this.templateProvider = new MailTemplateProvider();
    }

    async sendMail({ to, subject, body, template, variables, from }: ISendMailDTO): Promise<void> {
        let htmlContent = body;

        // Se um template foi especificado, usar o template provider
        if (template && variables) {
            htmlContent = this.templateProvider.parse({ template, variables });
        }

        await this.transporter.sendMail({
            from: from || process.env.MAIL_FROM || "noreply@aisam.com.br",
            to,
            subject,
            html: htmlContent
        });
    }
}

export { NodemailerMailProvider };
