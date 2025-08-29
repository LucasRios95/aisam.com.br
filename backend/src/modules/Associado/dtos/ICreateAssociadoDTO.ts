interface ICreateAssociadoDTO {
    id?: string;
    razao_social: string;
    cnpj: string;
    status: string;
    created_at: Date;
}

export { ICreateAssociadoDTO }