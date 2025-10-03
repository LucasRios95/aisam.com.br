interface ICreateCandidatoDTO {
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
    estado: string;
    resumo_curriculo: string;
    areas_atuacao?: string[];
    curriculo_url?: string;
    curriculo_upload_date?: Date;
    consentimento_dados: boolean;
    acesso_expirado?: Date;
}

export { ICreateCandidatoDTO };
