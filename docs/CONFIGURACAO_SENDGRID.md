# Configuração SendGrid - Guia Completo

## 🎯 Por que usar SendGrid?

- ✅ **Funciona no Railway**: Não usa portas SMTP que podem ser bloqueadas
- ✅ **Fácil de configurar**: Apenas uma API Key
- ✅ **Confiável**: Infraestrutura dedicada para envio de emails
- ✅ **Grátis**: 100 emails/dia no plano gratuito
- ✅ **Rastreamento**: Dashboard com estatísticas de envio

## 📝 Passo 1: Criar Conta no SendGrid

1. Acesse: https://signup.sendgrid.com/
2. Preencha o formulário de cadastro
3. Verifique seu email
4. Complete o onboarding (informações sobre sua empresa)

## 🔑 Passo 2: Gerar API Key

1. Faça login no SendGrid
2. Vá em **Settings** → **API Keys**
3. Clique em **Create API Key**
4. Configure:
   - **Nome**: `Railway Production` (ou qualquer nome descritivo)
   - **Permissões**: Escolha **Full Access** ou **Restricted Access** > **Mail Send** (marque Full Access)
5. Clique em **Create & View**
6. **IMPORTANTE**: Copie a API Key (começa com `SG.`) - ela só aparece uma vez!
   - Exemplo: `SG.abc123xyz789...`

## ✉️ Passo 3: Verificar Sender Identity

### Opção A: Single Sender Verification (Mais Rápido)

1. Vá em **Settings** → **Sender Authentication**
2. Clique em **Verify a Single Sender**
3. Preencha:
   - **From Name**: AISAM ou Nome da Empresa
   - **From Email Address**: `noreply@aisam.com.br` ou seu email
   - **Reply To**: Seu email de suporte
   - Preencha os demais campos
4. Clique em **Create**
5. Verifique o email enviado pelo SendGrid
6. Clique no link de confirmação

### Opção B: Domain Authentication (Melhor para produção)

1. Vá em **Settings** → **Sender Authentication**
2. Clique em **Authenticate Your Domain**
3. Siga as instruções para adicionar registros DNS
4. Aguarde a verificação (pode levar até 48h)

## 🚀 Passo 4: Configurar no Railway

### Via Interface Web:

1. Acesse seu projeto no Railway
2. Clique no serviço do backend
3. Vá em **Variables**
4. Adicione as seguintes variáveis:

```bash
MAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.sua-api-key-aqui
MAIL_FROM=noreply@aisam.com.br
```

5. **DELETE** as variáveis antigas do SMTP (opcional):
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`

6. Aguarde o redeploy automático

### Via Railway CLI:

```bash
railway variables set MAIL_PROVIDER=sendgrid
railway variables set SENDGRID_API_KEY=SG.sua-api-key-aqui
railway variables set MAIL_FROM=noreply@aisam.com.br
```

## 🧪 Passo 5: Testar

### Verificar Logs do Railway:

Após o deploy, verifique os logs. Você deve ver:

```
📧 Usando SendGrid como provedor de e-mail
✅ SendGrid configurado com sucesso
   API Key: SG.abc123...
```

### Testar Envio:

Use a rota de teste da sua API (se disponível):

```bash
POST /notificacoes/test
```

Ou teste através da funcionalidade de cadastro/notificações da sua aplicação.

## 📊 Passo 6: Monitorar Envios

1. Acesse o Dashboard do SendGrid
2. Vá em **Activity**
3. Veja estatísticas de:
   - Emails enviados
   - Emails entregues
   - Bounces (emails rejeitados)
   - Opens (emails abertos) - se configurado
   - Clicks (links clicados) - se configurado

## ⚙️ Configuração Local (Desenvolvimento)

Se quiser testar SendGrid localmente, adicione no seu `.env`:

```bash
MAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.sua-api-key-de-teste
MAIL_FROM=noreply@aisam.com.br
```

**Dica**: Crie uma API Key separada para desenvolvimento.

## 🔄 Voltar para SMTP (se necessário)

Se quiser voltar a usar SMTP (KingHost ou outro), basta mudar no Railway:

```bash
MAIL_PROVIDER=smtp
MAIL_HOST=smtp.kinghost.net
MAIL_PORT=465
MAIL_USER=seu-email@seudominio.com.br
MAIL_PASS=sua-senha
MAIL_FROM=seu-email@seudominio.com.br
```

## 🎨 Personalização Avançada

### Usando Templates do SendGrid:

Se quiser usar os templates do SendGrid (com editor visual):

1. Crie templates no painel: **Email API** → **Dynamic Templates**
2. Pegue o Template ID
3. Modifique o código para usar `templateId` ao invés de `html`

### Configurar Tracking:

No painel do SendGrid:
- **Settings** → **Tracking** → Configure Open/Click tracking

## ❓ Troubleshooting

### Erro: "Invalid API Key"
- Verifique se copiou a API Key completa
- Verifique se não tem espaços extras
- Gere uma nova API Key

### Erro: "The from address does not match a verified Sender Identity"
- Complete o Single Sender Verification
- Use o email exato que você verificou no `MAIL_FROM`

### Emails não chegam:
- Verifique a caixa de spam
- Verifique o Activity no dashboard do SendGrid
- Verifique se o domínio está verificado

### Limite de 100 emails/dia atingido:
- Considere upgrade do plano
- Ou use múltiplas contas SendGrid (não recomendado)

## 💰 Planos SendGrid

| Plano | Emails/Mês | Preço |
|-------|------------|-------|
| **Free** | 100/dia (3000/mês) | Grátis |
| **Essentials** | 50,000/mês | $19.95/mês |
| **Pro** | 100,000/mês | $89.95/mês |

## 🔐 Segurança

- ✅ Nunca commite a API Key no código
- ✅ Use variáveis de ambiente
- ✅ Crie API Keys separadas para dev/prod
- ✅ Revogue API Keys antigas quando não usar mais
- ✅ Use Restricted Access com apenas Mail Send permission

## 📚 Recursos Adicionais

- Documentação oficial: https://docs.sendgrid.com/
- Suporte: https://support.sendgrid.com/
- Status: https://status.sendgrid.com/

## ✅ Checklist Final

- [ ] Conta criada no SendGrid
- [ ] Email verificado
- [ ] API Key gerada e copiada
- [ ] Single Sender verificado (ou domínio autenticado)
- [ ] Variáveis configuradas no Railway
- [ ] Deploy realizado
- [ ] Logs verificados (sem erros)
- [ ] Email de teste enviado com sucesso
- [ ] Dashboard do SendGrid mostrando atividade

---

**Pronto!** 🎉 Agora sua aplicação envia emails via SendGrid, sem problemas de bloqueio de portas SMTP no Railway!
