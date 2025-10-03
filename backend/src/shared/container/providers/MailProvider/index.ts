import { container } from "tsyringe";
import { IMailProvider } from "./IMailProvider";
import { NodemailerMailProvider } from "./implementations/NodemailerMailProvider";

container.registerSingleton<IMailProvider>(
    "MailProvider",
    NodemailerMailProvider
);
