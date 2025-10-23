# Changelog - Sistema AISAM Backend

## [Implementações Recentes]

### ✅ Sistema de Áreas de Atuação (Tags)

**Arquivos Criados:**
- `src/shared/infra/typeorm/migrations/1759540000000-CreateAreaAtuacao.ts`
- `src/modules/AreaAtuacao/infra/typeorm/entities/AreaAtuacao.ts`
- `src/modules/AreaAtuacao/dtos/ICreateAreaAtuacaoDTO.ts`
- `src/modules/AreaAtuacao/repositories/IAreaAtuacaoRepository.ts`
- `src/modules/AreaAtuacao/infra/typeorm/repositories/AreaAtuacaoRepository.ts`
- `src/modules/AreaAtuacao/useCases/CreateAreaAtuacao/*`
- `src/modules/AreaAtuacao/useCases/ListAreasAtuacao/*`
- `src/shared/infra/http/routes/areasAtuacao.routes.ts`
- `src/shared/infra/typeorm/seed/areasAtuacao.ts`

**Funcionalidades:**
- CRUD completo de áreas de atuação
- Integração com candidatos e vagas (simple-array)
- Busca de candidatos por áreas
- Busca de vagas por áreas
- 15 áreas pré-cadastradas via seed

**Rotas:**
- `GET /areas-atuacao` - Listar áreas (público)
- `POST /areas-atuacao` - Criar área (admin)

**Como usar:**
```bash
npm run seed:areas
```

---

### ✅ Sistema de Vagas Anônimas

**Arquivos Criados/Modificados:**
- `src/modules/Vaga/utils/VagaSerializer.ts`
- `src/modules/Vaga/useCases/ListVagas/ListVagasController.ts`
- `src/modules/Vaga/useCases/FindVagaById/FindVagaByIdController.ts`

**Funcionalidades:**
- Serialização customizada de vagas
- Mascaramento automático de dados sensíveis em vagas anônimas:
  - URLs são substituídas por `[LINK REMOVIDO]`
  - Emails externos são substituídos por `[EMAIL REMOVIDO]`
  - CNPJs são substituídos por `[CNPJ REMOVIDO]`
  - Email de contato genérico: `candidaturas@aisam.com.br`
- Informações do associado ocultadas quando `empresa_anonima = true`
- Informações do recrutador apenas para usuários autenticados

**Comportamento:**
- Usuários não autenticados: dados básicos + mascaramento
- Usuários autenticados: mais detalhes + dados do recrutador

---

### ✅ Sistema de Templates de Email com Handlebars

**Arquivos Criados/Modificados:**
- `src/shared/views/emails/convite-recrutador.hbs`
- `src/shared/views/emails/magic-link-candidato.hbs`
- `src/shared/views/emails/expiracao-aviso.hbs`
- `src/shared/container/providers/MailProvider/implementations/MailTemplateProvider.ts`
- `src/shared/container/providers/MailProvider/implementations/NodemailerMailProvider.ts`
- `src/modules/Notificacao/dtos/ISendMailDTO.ts`

**Templates Disponíveis:**

1. **convite-recrutador.hbs**
   - Usado para enviar convites a novos recrutadores
   - Variáveis: nome, email, perfil, associado_nome, convite_link, expira_em, ano

2. **magic-link-candidato.hbs**
   - Usado para enviar link mágico de acesso aos candidatos
   - Variáveis: nome, magic_link, dias_restantes, data_expiracao, ano

3. **expiracao-aviso.hbs**
   - Usado para avisos D-7 e D-1 de expiração
   - Variáveis: nome, dias_restantes, data_expiracao, area_candidato_link, ano

**Como usar:**
```typescript
await mailProvider.sendMail({
    to: "email@exemplo.com",
    subject: "Assunto do Email",
    template: "convite-recrutador",
    variables: {
        nome: "João Silva",
        email: "joao@email.com",
        // ... outras variáveis
    }
});
```

---

### ✅ Sistema Completo de Convites por Email

**Arquivos Modificados:**
- `src/modules/Recrutador/useCases/EnviarConviteRecrutador/EnviarConviteRecrutadorUseCase.ts`

**Funcionalidades:**
- Geração de token único de convite (32 bytes)
- Expiração do convite em 7 dias
- Envio automático de email com template HTML
- Link de convite: `{FRONTEND_URL}/aceitar-convite/{token}`
- Recrutador criado com status INATIVO até aceitar convite

**Fluxo:**
1. Admin envia convite
2. Sistema cria recrutador inativo
3. Email enviado com link de convite
4. Recrutador acessa link e define senha
5. Status muda para ATIVO

---

### ✅ Sistema de Link Mágico para Candidatos

**Arquivos Modificados:**
- `src/modules/Candidato/useCases/GenerateMagicLink/GenerateMagicLinkUseCase.ts`

**Funcionalidades:**
- Geração de token JWT com expiração de 24h
- Acesso total do candidato válido por 30 dias
- Envio automático de email com link mágico
- Cálculo de dias restantes até expiração
- Link mágico: `{FRONTEND_URL}/candidato/acesso?token={token}`

**Fluxo:**
1. Candidato solicita acesso via email
2. Sistema valida se acesso não expirou
3. Gera token JWT (24h) e calcula dias restantes
4. Envia email com link mágico
5. Candidato acessa área via link

---

### ✅ Jobs de Notificação Atualizados

**Arquivos Modificados:**
- `src/shared/infra/jobs/NotificacaoExpiracaoJob.ts`

**Funcionalidades:**
- Notificação D-7 com email HTML template
- Notificação D-1 com email HTML template
- Execução diária às 9h da manhã
- Criação de notificação interna + envio de email

**Assuntos dos Emails:**
- D-7: "⚠️ Seu acesso expira em 7 dias - Sistema AISAM"
- D-1: "🚨 URGENTE: Seu acesso expira amanhã - Sistema AISAM"

---

## Variáveis de Ambiente Necessárias

```env
# Frontend
FRONTEND_URL=http://localhost:3000

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-app
MAIL_FROM=noreply@aisam.com.br
```

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Migrations
npm run typeorm migration:run
npm run typeorm migration:revert

# Seeds
npm run seed:admin      # Cria admin padrão
npm run seed:areas      # Popula áreas de atuação

# Build
npm run build

# Testes
npm run test
```

---

## Endpoints Novos/Atualizados

### Áreas de Atuação
```
GET    /areas-atuacao          # Listar áreas (público)
POST   /areas-atuacao          # Criar área (admin)
```

### Vagas (com serialização anônima)
```
GET    /vagas                  # Listar com mascaramento automático
GET    /vagas/:id              # Buscar com mascaramento automático
```

### Candidatos
```
POST   /candidatos/magic-link  # Gerar e enviar link mágico
```

### Recrutadores
```
POST   /recrutadores/convite   # Enviar convite com email
```

---

## Próximos Passos Sugeridos

- [ ] Implementar MFA obrigatório para Admin
- [ ] Integração com antivírus para PDFs
- [ ] Sistema de renovação de consentimento LGPD
- [ ] Dashboard de métricas e relatórios
- [ ] Exportação de dados em CSV
- [ ] Busca por palavras-chave no resumo/experiência
- [ ] Sistema ATS completo (etapas, entrevistas)

---

## Padrões de Projeto Utilizados

- **Repository Pattern**: Abstração de acesso a dados
- **Dependency Injection**: TSyringe para IoC
- **Use Case Pattern**: Lógica de negócio isolada
- **DTO Pattern**: Objetos de transferência de dados
- **Factory Pattern**: Template provider para emails
- **Observer Pattern**: Jobs agendados com node-cron
- **Strategy Pattern**: Serialização customizada de vagas

---

## Boas Práticas Implementadas

✅ Princípios SOLID
✅ Clean Architecture
✅ Separation of Concerns
✅ DRY (Don't Repeat Yourself)
✅ Type Safety com TypeScript
✅ Error Handling consistente
✅ Logging estruturado
✅ Mascaramento de dados sensíveis
✅ Templates reutilizáveis
✅ Seeds para dados iniciais

---

**Data da última atualização:** $(date)
**Desenvolvido por:** Claude + Time de Desenvolvimento
