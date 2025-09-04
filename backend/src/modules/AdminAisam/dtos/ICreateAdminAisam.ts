interface ICreateAdminAisamDTO {
    id?: string;
    nome: string;
    email: string;
    senha: string;
    mfa_enabled: boolean;
}

export { ICreateAdminAisamDTO }