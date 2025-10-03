declare namespace Express {
    export interface Request {
        user: {
            id: string;
            role: "ADMIN_AISAM" | "RECRUTADOR" | "CANDIDATO";
        };
    }
}
