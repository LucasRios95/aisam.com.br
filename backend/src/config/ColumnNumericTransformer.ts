// CLASSE USADA PARA CONTORNAR BUG DO TYPEORM ONDE OS VALORES SÃO
export class ColumnNumericTransformer {
    to(data: number): number {
        return data;
    }

    from(data: string): number {
        return parseFloat(data);
    }
}