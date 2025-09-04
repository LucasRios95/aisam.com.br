**RF** => Requisitos Funcionais
**RNF** => Requisitos Não Funcionais
**RN** => Regras de Negócio

> Observação: marque cada item com **ok** quando implementado.

# SISTEMA AISAM – RECRUTAMENTO & SELEÇÃO

# CADASTRO DE ASSOCIADO (EMPRESA)
**RF**
- Deve ser possível cadastrar um associado a partir de um pedido “Associe-se” aprovado.
- Deve ser possível listar/editar/desativar associados.
- Deve ser possível convidar e gerenciar recrutadores vinculados ao associado.

**RN**
- Apenas usuários com perfil **Admin AISAM** podem criar/editar/desativar associados.
- O CNPJ do associado deve ser **único** no sistema.
- Um recrutador pertence **exclusivamente** a um associado.
- O associado possui status: **pendente | aprovado | inativo**.

# FLUXO “ASSOCIE-SE”
**RF**
- Deve ser possível submeter um pedido de associação via formulário público. ok
- Deve existir uma fila para **aprovação/recusa** do pedido por Admin AISAM. ok
- Ao aprovar, o sistema deve **criar o associado** e enviar convites para recrutadores.

**RN**
- Apenas pedidos **aprovados** resultam em criação de associado.
- Dados mínimos obrigatórios: razão social, CNPJ, e-mail corporativo, representante.
- Todas as decisões (aprovar/recusar) devem ser registradas em **auditoria**.

# CADASTRO DE RECRUTADOR
**RF**
- Deve ser possível convidar recrutadores por e-mail (aceite via link).
- Deve ser possível listar/editar/remover recrutadores.
- Deve ser possível redefinir senha do recrutador.

**RN**
- O e-mail do recrutador deve ser **único**.
- Recrutadores só acessam **dados do seu associado**.
- (sugerido) Ativar **MFA** para recrutadores com permissão de publicação.

# CADASTRO DE CANDIDATO
**RF**
- Deve ser possível cadastrar candidato com dados pessoais, contato, **área(s) de atuação (tags)** e resumo/experiência.
- Deve ser possível anexar **currículo em PDF** (máx. 10MB) com varredura antivírus.
- Deve ser possível o candidato **editar** seu perfil dentro da janela de acesso.
- Deve ser possível o **autocadastro** de candidatos.

**RN**
- O upload deve aceitar **somente PDF**; tamanho máximo **10MB**.
- (sugerido) Validar CPF (formato) e e-mail.
- (sugerido) permitir múltiplas áreas de atuação e nível/senioridade.

# ACESSO DE ACOMPANHAMENTO DO CANDIDATO (30 DIAS)
**RF**
- Deve ser possível gerar **login** ou **link mágico por e-mail** para o candidato.
- O painel do candidato deve exibir **contagem regressiva** de expiração e status de candidaturas.
- Deve enviar avisos de expiração **D-7** e **D-1**.

**RN**
- O acesso do candidato expira **30 dias** após o **cadastro**.
- Após expirar, bloquear acesso e **anonimizar** PII conforme política.
- Renovação do acesso requer **novo consentimento**.

# GESTÃO DE VAGAS (RECRUTADOR)
**RF**
- Deve ser possível criar/editar/arquivar **vaga** com: título, descrição, senioridade, área(s), regime (presencial/híbrido/remoto), localidade, e-mail de contato.
- Deve ser possível marcar a empresa como **anônima** ou **visível** ao candidato.
- Deve ser possível listar e encerrar vagas.

**RN**
- Em vaga **anônima**, o nome e identificadores do associado **não devem ser exibidos** aos candidatos.
- Alterações de anonimato devem ser registradas em **auditoria**.
- (sugerido) Bloquear PII de empresa em campos de descrição quando anônima (ex.: mascarar domínios/e-mails).

# BUSCA DE CANDIDATOS
**RF**
- Deve ser possível filtrar candidatos por **área(s) de atuação**.
- Deve ser possível listar **todos os candidatos** disponíveis.
- Deve ser possível paginar e ordenar por **data de atualização**.

**RN**
- Apenas **recrutadores/Admin** podem consultar candidatos.
- O perfil do candidato deve indicar se o **PDF está disponível/expirado**.
- (sugerido) Suportar busca por **palavras-chave** no resumo/experiência (V2).

# CANDIDATURA
**RF**
- Deve ser possível o candidato **candidatar-se** a uma vaga.
- Deve ser possível o recrutador alterar o **status** da candidatura (interessado, em análise, contatado, finalizado).
- Deve ser possível o candidato **cancelar** sua candidatura dentro do período de acesso.

**RN**
- Cada candidatura deve referenciar **vaga** e **candidato** existentes.
- (sugerido) Exigir currículo PDF válido (não expirado) para candidatar-se.
- Atualizações de status devem ser registradas em **auditoria**.

# NOTIFICAÇÕES
**RF**
- Deve enviar e-mails transacionais: confirmação de cadastro, link de acesso, convites, aprovação de associado, alertas de expiração **D-7/D-1**.
- (sugerido) Suporte a templates e variáveis por ambiente.

**RN**
- Em vagas **anônimas**, as notificações ao candidato **não podem** conter nome/contatos da empresa.
- (sugerido) Respeitar **opt-out** de comunicações não essenciais.

# AUTENTICAÇÃO E AUTORIZAÇÃO
**RF**
- Deve suportar login por e-mail/senha e **link mágico** para candidatos.
- Deve suportar **MFA** para Admin (obrigatório) e opcional para recrutadores.
- Deve implementar **RBAC** com papéis: `CANDIDATO`, `RECRUTADOR`, `ADMIN_AISAM`.

**RN**
- Senhas armazenadas com **Argon2** (ou equivalente).
- Bloquear após **N** tentativas falhas; captcha em fluxos públicos.
- Tokens de sessão com expiração adequada; revogação ao sair.

# RETENÇÃO E PURGA (30 DIAS)
**RF**
- Deve existir rotina diária de **purga** que remova fisicamente PDFs com **30 dias** do upload.
- Deve existir rotina de **expiração** do acesso do candidato aos **30 dias** do cadastro.
- Deve existir **dashboard**/log para monitorar purgas e expirados.

**RN**
- PDFs expurgados devem ser **irrecuperáveis** do storage.
- Manter logs mínimos (sem conteúdo do currículo) por **6 meses**.
- Falhas de purga devem disparar **alertas**.

# AUDITORIA & LGPD
**RF**
- Deve registrar eventos de segurança e negócio: login, convites, criação/edição/remoção, mudanças de anonimato, purgas.
- Deve permitir **exportar** relatórios sob demanda para DPO.

**RN**
- Coletar **consentimento** explícito do candidato por 30 dias.
- Implementar direitos do titular: **acesso/retificação/exclusão**.
- (sugerido) Minimizar coleta de dados; mascarar campos sensíveis nos logs.

# RNF GERAIS
**RNF**
- **Segurança**: TLS 1.2+; varredura antivírus no upload; rate limiting; cabeçalhos de segurança.
- **Desempenho**: p95 busca de candidatos ≤ **500ms** até **10k** perfis; upload PDF ≤ **5s** (10MB).
- **Disponibilidade**: alvo **99,5%** mensal.
- **Acessibilidade**: **WCAG 2.1 AA**.
- **Compatibilidade**: principais navegadores (últimos 2 anos).
- **Observabilidade**: logs estruturados, métricas (busca, purga), traces; **alertas** para falhas críticas.

# RELATÓRIOS (opcional / V2)
**RF**
- Deve ser possível exportar CSV com candidatos (somente metadados, sem PII sensível) e vagas.

**RN**
- Exportações devem respeitar RBAC e LGPD (minimização).

# ROADMAP (sugestão)
- **V1 (MVP)**: Cadastro candidato + PDF com expiração 30d, RBAC, vagas com anonimato, busca por área, aprovação de associados, notificações básicas, purga e auditoria.
- **V2**: Busca por palavras-chave, exportações, relatórios, alertas configuráveis, melhorias de segurança (MFA amplo).
- **V3**: Workflow ATS (etapas, entrevistas), avaliações, integrações externas (e-mail/HR).
