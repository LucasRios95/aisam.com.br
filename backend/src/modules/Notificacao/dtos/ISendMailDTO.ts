interface ISendMailDTO {
    to: string;
    subject: string;
    body: string;
    from?: string;
}

export { ISendMailDTO };
