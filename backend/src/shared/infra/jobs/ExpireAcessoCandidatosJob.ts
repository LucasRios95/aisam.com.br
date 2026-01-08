import cron from "node-cron";
import { container } from "tsyringe";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { IAuditLogRepository } from "@modules/Auditoria/repositories/IAuditLogRepository";
import { AuditAction } from "@modules/Auditoria/infra/typeorm/entities/AuditLog";

class ExpireAcessoCandidatosJob {
    async execute(): Promise<void> {
        console.log("[EXPIRAÇÃO] Iniciando rotina de expiração de acessos...");

        try {
            const candidatoRepository = container.resolve<ICandidatoRepository>("CandidatoRepository");
            const auditLogRepository = container.resolve<IAuditLogRepository>("AuditLogRepository");

            const candidatos = await candidatoRepository.findAll();
            const now = new Date();
            let expirados = 0;

            for (const candidato of candidatos) {
                // Calcula data de expiração (30 dias após cadastro)
                const expirationDate = candidato.acesso_expirado || new Date(
                    new Date(candidato.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
                );

                // Se já expirou e não foi marcado
                if (now > expirationDate && !candidato.acesso_expirado) {
                    candidato.acesso_expirado = expirationDate;
                    await candidatoRepository.update(candidato);

                    // Registra na auditoria
                    await auditLogRepository.create({
                        action: AuditAction.EXPIRE,
                        entity_type: "Candidato",
                        entity_id: candidato.id,
                        description: `Acesso expirado automaticamente após 30 dias`,
                        metadata: {
                            created_at: candidato.created_at,
                            expired_at: expirationDate
                        }
                    });

                    expirados++;
                    console.log(`[EXPIRAÇÃO] Acesso expirado: ${candidato.nome} (${candidato.email})`);
                }
            }

            console.log(`[EXPIRAÇÃO] Rotina concluída. ${expirados} acessos expirados.`);
        } catch (error) {
            console.error("[EXPIRAÇÃO] Erro na rotina de expiração:", error);
        }
    }

    start(): void {
        // Executa diariamente às 2h da manhã
        cron.schedule("0 2 * * *", async () => {
            await this.execute();
        });

        console.log("[EXPIRAÇÃO] Job de expiração de acessos agendado (diariamente às 2h)");
    }
}

export { ExpireAcessoCandidatosJob };
