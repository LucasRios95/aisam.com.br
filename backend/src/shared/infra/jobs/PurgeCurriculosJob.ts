import cron from "node-cron";
import { container } from "tsyringe";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";
import { IAuditLogRepository } from "@modules/Auditoria/repositories/IAuditLogRepository";
import { AuditAction } from "@modules/Auditoria/infra/typeorm/entities/AuditLog";

class PurgeCurriculosJob {
    async execute(): Promise<void> {
        console.log("[PURGA] Iniciando rotina de purga de currículos...");

        try {
            const candidatoRepository = container.resolve<ICandidatoRepository>("CandidatoRepository");
            const storageProvider = container.resolve<IStorageProvider>("StorageProvider");
            const auditLogRepository = container.resolve<IAuditLogRepository>("AuditLogRepository");

            // Busca candidatos com currículos que devem ser purgados (30 dias)
            const candidatos = await candidatoRepository.findAll();

            const now = new Date();
            let purgados = 0;

            for (const candidato of candidatos) {
                if (!candidato.curriculo_url || !candidato.curriculo_upload_date) {
                    continue;
                }

                const uploadDate = new Date(candidato.curriculo_upload_date);
                const daysSinceUpload = Math.floor(
                    (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Purga após 30 dias
                if (daysSinceUpload >= 30) {
                    const filename = candidato.curriculo_url.split('/').pop();

                    if (filename) {
                        try {
                            // Remove arquivo do storage
                            await storageProvider.delete(filename, "curriculos");

                            // Limpa URL do currículo
                            candidato.curriculo_url = null;
                            candidato.curriculo_upload_date = null;
                            await candidatoRepository.update(candidato);

                            // Registra na auditoria
                            await auditLogRepository.create({
                                action: AuditAction.PURGE,
                                entity_type: "Candidato",
                                entity_id: candidato.id,
                                description: `Currículo purgado automaticamente após 30 dias`,
                                metadata: {
                                    filename,
                                    upload_date: uploadDate,
                                    purge_date: now
                                }
                            });

                            purgados++;
                            console.log(`[PURGA] Currículo purgado: ${candidato.nome} (${candidato.email})`);
                        } catch (error) {
                            console.error(`[PURGA] Erro ao purgar currículo de ${candidato.email}:`, error);
                        }
                    }
                }
            }

            console.log(`[PURGA] Rotina concluída. ${purgados} currículos purgados.`);
        } catch (error) {
            console.error("[PURGA] Erro na rotina de purga:", error);
        }
    }

    start(): void {
        // Executa diariamente às 3h da manhã
        cron.schedule("0 3 * * *", async () => {
            await this.execute();
        });

        console.log("[PURGA] Job de purga de currículos agendado (diariamente às 3h)");
    }
}

export { PurgeCurriculosJob };
