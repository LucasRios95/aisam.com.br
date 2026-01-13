import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDTO {
  @IsString({ message: "Token deve ser uma string" })
  @IsNotEmpty({ message: "Token é obrigatório" })
  token: string;

  @IsString({ message: "Senha deve ser uma string" })
  @IsNotEmpty({ message: "Senha é obrigatória" })
  @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
  senha: string;
}
