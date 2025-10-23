interface ITemplateVariables {
    [key: string]: string | number | boolean | Date;
}

interface ISendMailDTO {
    to: string;
    subject: string;
    body?: string;
    template?: string;
    variables?: ITemplateVariables;
    from?: string;
}

export { ISendMailDTO, ITemplateVariables };
