
interface IUpdateStatusDTO {
    id: string;
    status: "pendente" | "aprovado" | "recusado";
}

export { IUpdateStatusDTO };