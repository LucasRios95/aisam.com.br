import sendgrid from "@sendgrid/mail";
import { IMailProvider } from "../IMailProvider";
import { ISendMailDTO } from "@modules/Notificacao/dtos/ISendMailDTO";
import { MailTemplateProvider } from "./MailTemplateProvider";

class SendGridMailProvider implements IMailProvider {
    private templateProvider: MailTemplateProvider;

    constructor() {
        // Configura a API Key do SendGrid
        const apiKey = process.env.SENDGRID_API_KEY;

        if (!apiKey) {
            console.error('❌ SENDGRID_API_KEY não configurado!');
            console.error('⚠️  O envio de e-mails não funcionará!');
            console.error('💡 Configure SENDGRID_API_KEY nas variáveis de ambiente');
        } else {
            sendgrid.setApiKey(apiKey);
            console.log('✅ SendGrid configurado com sucesso');
            console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
        }

        this.templateProvider = new MailTemplateProvider();
    }

    async sendMail({ to, subject, body, template, variables, from }: ISendMailDTO): Promise<void> {
        let htmlContent = body;

        // Se um template foi especificado, usar o template provider
        if (template && variables) {
            htmlContent = this.templateProvider.parse({ template, variables });
        }

        const fromEmail = from || process.env.MAIL_FROM || "noreply@aisam.com.br";

        try {
            await sendgrid.send({
                from: fromEmail,
                to,
                subject,
                html: htmlContent,
            });

            console.log(`📧 Email enviado via SendGrid para: ${to}`);
        } catch (error: any) {
            console.error('❌ Erro ao enviar email via SendGrid:', error);

            if (error.response) {
                console.error('Response body:', error.response.body);
            }

            throw error;
        }
    }
}

export { SendGridMailProvider };
