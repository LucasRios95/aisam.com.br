import cron from "node-cron";
import { container } from "tsyringe";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { INotificacaoRepository } from "@modules/Notificacao/repositories/INotificacaoRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { TipoNotificacao } from "@modules/Notificacao/infra/typeorm/entities/Notificacao";

class NotificacaoExpiracaoJob {
    async execute(): Promise<void> {
        console.log("[NOTIFICAÇÃO] Iniciando rotina de notificações de expiração...");

        try {
            const candidatoRepository = container.resolve<ICandidatoRepository>("CandidatoRepository");
            const notificacaoRepository = container.resolve<INotificacaoRepository>("NotificacaoRepository");
            const mailProvider = container.resolve<IMailProvider>("MailProvider");

            const candidatos = await candidatoRepository.findAll();
            const now = new Date();
            let notificacoesEnviadas = 0;

            const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";

            for (const candidato of candidatos) {
                const expirationDate = candidato.acesso_expirado || new Date(
                    new Date(candidato.created_at).getTime() + 30 * 24 * 60 * 60 * 1000
                );

                const diasRestantes = Math.ceil(
                    (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                );

                // Notificação D-7
                if (diasRestantes === 7) {
                    await notificacaoRepository.create({
                        destinatario_id: candidato.id,
                        tipo: TipoNotificacao.SISTEMA,
                        titulo: "Seu acesso expira em 7 dias",
                        mensagem: `Olá ${candidato.nome}, seu acesso à plataforma expirará em 7 dias. Entre em contato para renovar seu acesso.`,
                        metadata: {
                            tipo: "expiracao_d7",
                            dias_restantes: 7,
                            expiration_date: expirationDate
                        }
                    });

                    // Envia email com template
                    await mailProvider.sendMail({
                        to: candidato.email,
                        subject: "⚠️ Seu acesso expira em 7 dias - Sistema AISAM",
                        template: "expiracao-aviso",
                        variables: {
                            nome: candidato.nome,
                            dias_restantes: 7,
                            data_expiracao: expirationDate.toLocaleDateString("pt-BR"),
                            area_candidato_link: `${baseUrl}/candidato`,
                            ano: new Date().getFullYear()
                        }
                    });

                    notificacoesEnviadas++;
                    console.log(`[NOTIFICAÇÃO] D-7 enviada para: ${candidato.email}`);
                }

                // Notificação D-1
                if (diasRestantes === 1) {
                    await notificacaoRepository.create({
                        destinatario_id: candidato.id,
                        tipo: TipoNotificacao.SISTEMA,
                        titulo: "Seu acesso expira amanhã!",
                        mensagem: `Olá ${candidato.nome}, seu acesso à plataforma expirará amanhã. Entre em contato urgentemente para renovar.`,
                        metadata: {
                            tipo: "expiracao_d1",
                            dias_restantes: 1,
                            expiration_date: expirationDate
                        }
                    });

                    // Envia email com template
                    await mailProvider.sendMail({
                        to: candidato.email,
                        subject: "🚨 URGENTE: Seu acesso expira amanhã - Sistema AISAM",
                        template: "expiracao-aviso",
                        variables: {
                            nome: candidato.nome,
                            dias_restantes: 1,
                            data_expiracao: expirationDate.toLocaleDateString("pt-BR"),
                            area_candidato_link: `${baseUrl}/candidato`,
                            ano: new Date().getFullYear()
                        }
                    });

                    notificacoesEnviadas++;
                    console.log(`[NOTIFICAÇÃO] D-1 enviada para: ${candidato.email}`);
                }
            }

            console.log(`[NOTIFICAÇÃO] Rotina concluída. ${notificacoesEnviadas} notificações enviadas.`);
        } catch (error) {
            console.error("[NOTIFICAÇÃO] Erro na rotina de notificações:", error);
        }
    }

    start(): void {
        // Executa diariamente às 9h da manhã
        cron.schedule("0 9 * * *", async () => {
            await this.execute();
        });

        console.log("[NOTIFICAÇÃO] Job de notificações de expiração agendado (diariamente às 9h)");
    }
}

export { NotificacaoExpiracaoJob };
