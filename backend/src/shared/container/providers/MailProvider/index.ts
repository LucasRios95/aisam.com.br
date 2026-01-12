import { container } from "tsyringe";
import { IMailProvider } from "./IMailProvider";
import { NodemailerMailProvider } from "./implementations/NodemailerMailProvider";
import { SendGridMailProvider } from "./implementations/SendGridMailProvider";

// Escolhe o provider baseado na variável de ambiente MAIL_PROVIDER
// Valores: "sendgrid" ou "smtp" (padrão: smtp)
const mailProvider = process.env.MAIL_PROVIDER || "smtp";

if (mailProvider === "sendgrid") {
    console.log("📧 Usando SendGrid como provedor de e-mail");
    container.registerSingleton<IMailProvider>(
        "MailProvider",
        SendGridMailProvider
    );
} else {
    console.log("📧 Usando SMTP (Nodemailer) como provedor de e-mail");
    container.registerSingleton<IMailProvider>(
        "MailProvider",
        NodemailerMailProvider
    );
}
