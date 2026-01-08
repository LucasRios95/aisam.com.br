import { container } from "tsyringe";
import "./providers/DateProvider";
import "./providers/MailProvider";
import "./providers/StorageProvider";
import "./providers/HashProvider";
import { IPedidoAssociacaoRepository } from "@modules/Associado/repositories/IPedidoAssociacaoRepository";
import { PedidoAssociacaoRepository } from "@modules/Associado/infra/typeorm/repositories/PedidoAssociacaoRepository";
import { IAdminAisamRepository } from "@modules/AdminAisam/repositories/IAdminAisamRepository";
import { AdminAisamRepository } from "@modules/AdminAisam/infra/typeorm/repositories/AdminAisamRepository";
import { AssociadoRepository } from "@modules/Associado/infra/typeorm/repositories/AssociadoRepository";
import { IAssociadoRepository } from "@modules/Associado/repositories/IAssociadoRepository";
import { IRecrutadorRepository } from "@modules/Recrutador/repositories/IRecrutadorRepository";
import { RecrutadorRepository } from "@modules/Recrutador/infra/typeorm/repositories/RecrutadorRepository";
import { ICandidatoRepository } from "@modules/Candidato/repositories/ICandidatoRepository";
import { CandidatoRepository } from "@modules/Candidato/infra/typeorm/repositories/CandidatoRepository";
import { IVagaRepository } from "@modules/Vaga/repositories/IVagaRepository";
import { VagaRepository } from "@modules/Vaga/infra/typeorm/repositories/VagaRepository";
import { ICandidaturaRepository } from "@modules/Candidatura/repositories/ICandidaturaRepository";
import { CandidaturaRepository } from "@modules/Candidatura/infra/typeorm/repositories/CandidaturaRepository";
import { INotificacaoRepository } from "@modules/Notificacao/repositories/INotificacaoRepository";
import { NotificacaoRepository } from "@modules/Notificacao/infra/typeorm/repositories/NotificacaoRepository";
import { IAuditLogRepository } from "@modules/Auditoria/repositories/IAuditLogRepository";
import { AuditLogRepository } from "@modules/Auditoria/infra/typeorm/repositories/AuditLogRepository";
import { IAreaAtuacaoRepository } from "@modules/AreaAtuacao/repositories/IAreaAtuacaoRepository";
import { AreaAtuacaoRepository } from "@modules/AreaAtuacao/infra/typeorm/repositories/AreaAtuacaoRepository";
import { INoticiasRepository } from "@modules/Noticia/repositories/INoticiasRepository";
import { NoticiasRepository } from "@modules/Noticia/infra/typeorm/repositories/NoticiasRepository";

container.registerSingleton<IPedidoAssociacaoRepository>(
    "PedidoAssociacaoRepository",
    PedidoAssociacaoRepository
);

container.registerSingleton<IAdminAisamRepository>(
    "AdminAisamRepository",
    AdminAisamRepository
);

container.registerSingleton<IAssociadoRepository>(
    "AssociadoRepository",
    AssociadoRepository
);

container.registerSingleton<IRecrutadorRepository>(
    "RecrutadorRepository",
    RecrutadorRepository
);

container.registerSingleton<ICandidatoRepository>(
    "CandidatoRepository",
    CandidatoRepository
);

container.registerSingleton<IVagaRepository>(
    "VagaRepository",
    VagaRepository
);

container.registerSingleton<ICandidaturaRepository>(
    "CandidaturaRepository",
    CandidaturaRepository
);

container.registerSingleton<INotificacaoRepository>(
    "NotificacaoRepository",
    NotificacaoRepository
);

container.registerSingleton<IAuditLogRepository>(
    "AuditLogRepository",
    AuditLogRepository
);

container.registerSingleton<IAreaAtuacaoRepository>(
    "AreaAtuacaoRepository",
    AreaAtuacaoRepository
);

container.registerSingleton<INoticiasRepository>(
    "NoticiasRepository",
    NoticiasRepository
);

