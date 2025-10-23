import { IsString, IsEmail, IsBoolean, IsOptional, IsArray, IsDateString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateCandidatoDTO {
    @IsString({ message: 'Nome deve ser uma string' })
    @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
    @MaxLength(255, { message: 'Nome deve ter no máximo 255 caracteres' })
    nome: string;

    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsString({ message: 'Telefone deve ser uma string' })
    @Matches(/^(\(?\d{2}\)?\s?)?9?\d{4}-?\d{4}$/, {
        message: 'Telefone inválido. Use formato: (11) 91234-5678 ou 11912345678'
    })
    telefone: string;

    @IsString({ message: 'Cidade deve ser uma string' })
    @MinLength(2, { message: 'Cidade deve ter no mínimo 2 caracteres' })
    @MaxLength(100, { message: 'Cidade deve ter no máximo 100 caracteres' })
    cidade: string;

    @IsString({ message: 'Estado deve ser uma string' })
    @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma sigla válida (ex: SP, RJ)' })
    estado: string;

    @IsString({ message: 'Resumo do currículo deve ser uma string' })
    @MinLength(50, { message: 'Resumo do currículo deve ter no mínimo 50 caracteres' })
    @MaxLength(5000, { message: 'Resumo do currículo deve ter no máximo 5000 caracteres' })
    resumo_curriculo: string;

    @IsOptional()
    @IsArray({ message: 'Áreas de atuação devem ser um array' })
    @IsString({ each: true, message: 'Cada área de atuação deve ser uma string' })
    areas_atuacao?: string[];

    @IsOptional()
    @IsString({ message: 'URL do currículo deve ser uma string' })
    curriculo_url?: string;

    @IsOptional()
    @IsDateString({}, { message: 'Data de upload do currículo deve ser uma data válida' })
    curriculo_upload_date?: Date;

    @IsBoolean({ message: 'Consentimento de dados deve ser verdadeiro ou falso' })
    consentimento_dados: boolean;
}
