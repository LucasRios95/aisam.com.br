
interface IUpdateStatusDTO {
    id: string;
    status: "pendente" | "aprovado" | "recusado";
    Aprovado_Por: string;

}

export { IUpdateStatusDTO };