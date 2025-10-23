import fs from "fs";
import handlebars from "handlebars";
import path from "path";

interface ITemplateVariables {
    [key: string]: string | number | boolean | Date;
}

interface IParseMailTemplate {
    template: string;
    variables: ITemplateVariables;
}

export class MailTemplateProvider {
    public parse({ template, variables }: IParseMailTemplate): string {
        const templatePath = path.resolve(
            __dirname,
            "..",
            "..",
            "..",
            "..",
            "views",
            "emails",
            `${template}.hbs`
        );

        const templateFileContent = fs.readFileSync(templatePath, "utf-8");

        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }
}
