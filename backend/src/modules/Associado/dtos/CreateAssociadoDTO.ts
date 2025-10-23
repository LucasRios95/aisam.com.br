import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateAssociadoDTO {
    @IsString({ message: 'Razão social deve ser uma string' })
    @MinLength(3, { message: 'Razão social deve ter no mínimo 3 caracteres' })
    @MaxLength(255, { message: 'Razão social deve ter no máximo 255 caracteres' })
    razao_social: string;

    @IsString({ message: 'Nome fantasia deve ser uma string' })
    @MinLength(3, { message: 'Nome fantasia deve ter no mínimo 3 caracteres' })
    @MaxLength(255, { message: 'Nome fantasia deve ter no máximo 255 caracteres' })
    nome_fantasia: string;

    @IsString({ message: 'CNPJ deve ser uma string' })
    @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, {
        message: 'CNPJ inválido. Use formato: 00.000.000/0000-00 ou 00000000000000'
    })
    cnpj: string;

    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @IsString({ message: 'Telefone deve ser uma string' })
    @Matches(/^(\(?\d{2}\)?\s?)?9?\d{4}-?\d{4}$/, {
        message: 'Telefone inválido. Use formato: (11) 91234-5678 ou 11912345678'
    })
    telefone: string;

    @IsString({ message: 'Endereço deve ser uma string' })
    @MinLength(5, { message: 'Endereço deve ter no mínimo 5 caracteres' })
    @MaxLength(255, { message: 'Endereço deve ter no máximo 255 caracteres' })
    endereco: string;

    @IsString({ message: 'Cidade deve ser uma string' })
    @MinLength(2, { message: 'Cidade deve ter no mínimo 2 caracteres' })
    @MaxLength(100, { message: 'Cidade deve ter no máximo 100 caracteres' })
    cidade: string;

    @IsString({ message: 'Estado deve ser uma string' })
    @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma sigla válida (ex: SP, RJ)' })
    estado: string;

    @IsString({ message: 'CEP deve ser uma string' })
    @Matches(/^\d{5}-?\d{3}$/, {
        message: 'CEP inválido. Use formato: 00000-000 ou 00000000'
    })
    cep: string;
}
