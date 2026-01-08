import { ISendMailDTO } from "@modules/Notificacao/dtos/ISendMailDTO";

interface IMailProvider {
    sendMail(data: ISendMailDTO): Promise<void>;
}

export { IMailProvider };
