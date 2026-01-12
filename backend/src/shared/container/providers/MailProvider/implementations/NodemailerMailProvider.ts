import nodemailer, { Transporter } from "nodemailer";
import { IMailProvider } from "../IMailProvider";
import { ISendMailDTO } from "@modules/Notificacao/dtos/ISendMailDTO";
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
            },
            tls: {
                // Não verificar certificado em desenvolvimento
                rejectUnauthorized: false // Desabilitado para compatibilidade com KingHost
            },
            connectionTimeout: 30000, // 30 segundos
            greetingTimeout: 30000,
            socketTimeout: 60000, // 60 segundos
            debug: process.env.NODE_ENV === 'development', // Habilita debug em dev
            logger: process.env.NODE_ENV === 'development' // Habilita logs em dev
        });

        // Verifica a conexão SMTP no startup (com timeout)
        console.log('🔄 Verificando configuração SMTP...');
        console.log(`   Host: ${process.env.MAIL_HOST}`);
        console.log(`   Port: ${mailPort}`);
        console.log(`   User: ${process.env.MAIL_USER}`);
        console.log(`   Secure: ${mailPort === 465}`);

        this.transporter.verify((error, success) => {
            if (error) {
                console.error('❌ Erro na configuração SMTP:', error);
                console.error('⚠️  O envio de e-mails pode não funcionar!');
                console.error('💡 Dica: Verifique se o host está correto e se a porta não está bloqueada pelo firewall');
            } else {
                console.log('✅ Servidor SMTP pronto para enviar e-mails');
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
