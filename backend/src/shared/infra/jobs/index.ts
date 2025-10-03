import { PurgeCurriculosJob } from "./PurgeCurriculosJob";
import { ExpireAcessoCandidatosJob } from "./ExpireAcessoCandidatosJob";
import { NotificacaoExpiracaoJob } from "./NotificacaoExpiracaoJob";

export function startJobs(): void {
    const purgeCurriculosJob = new PurgeCurriculosJob();
    purgeCurriculosJob.start();

    const expireAcessoCandidatosJob = new ExpireAcessoCandidatosJob();
    expireAcessoCandidatosJob.start();

    const notificacaoExpiracaoJob = new NotificacaoExpiracaoJob();
    notificacaoExpiracaoJob.start();

    console.log("✓ Todos os jobs foram iniciados com sucesso");
}
