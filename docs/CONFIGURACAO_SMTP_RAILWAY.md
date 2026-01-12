# Configuração SMTP para Railway

## ⚠️ Problema Identificado

O erro `Connection timeout` ao conectar ao servidor SMTP geralmente ocorre por:

1. **Host incorreto**: `smtpi.kinghost.net` (com "i") não é válido
2. **Porta bloqueada**: Railway pode bloquear porta 587
3. **Firewall**: Serviços cloud costumam bloquear SMTP para prevenir spam

## ✅ Configurações Corretas para KingHost

### Opção 1: SMTP com SSL (Porta 465) - RECOMENDADO

```bash
SMTP_HOST=smtp.kinghost.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@aisam.com.br
SMTP_PASS=Ind@2026
SMTP_FROM_EMAIL=noreply@aisam.com.br
SMTP_FROM_NAME=noreply@aisam.com.br
```

### Opção 2: SMTP com TLS (Porta 587)

```bash
SMTP_HOST=smtp.kinghost.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@aisam.com.br
SMTP_PASS=Ind@2026
SMTP_FROM_EMAIL=noreply@aisam.com.br
SMTP_FROM_NAME=noreply@aisam.com.br
```

### Opção 3: Usando domínio próprio

```bash
SMTP_HOST=smtp.aisam.com.br
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@aisam.com.br
SMTP_PASS=Ind@2026
SMTP_FROM_EMAIL=noreply@aisam.com.br
SMTP_FROM_NAME=noreply@aisam.com.br
```

## 🔍 Como Identificar o Host Correto

1. Acesse o painel da KingHost
2. Vá em **E-mail > Contas de Email**
3. Procure por "Configurações de Servidor" ou "SMTP"
4. Use exatamente o host informado (geralmente `smtp.kinghost.net` ou `smtp.seudominio.com.br`)

## 🚀 Como Atualizar no Railway

### Via Interface Web:

1. Acesse seu projeto no Railway
2. Vá em **Variables**
3. **DELETE** as variáveis incorretas:
   - `SMTP_HOST=smtpi.kinghost.net` ❌

4. **ADICIONE/ATUALIZE** com os valores corretos:
   ```
   SMTP_HOST=smtp.kinghost.net
   SMTP_PORT=465
   SMTP_SECURE=true
   ```

5. Clique em **Deploy** ou aguarde o redeploy automático

### Via Railway CLI:

```bash
railway variables set SMTP_HOST=smtp.kinghost.net
railway variables set SMTP_PORT=465
railway variables set SMTP_SECURE=true
```

## 🧪 Como Testar

Após atualizar as variáveis e fazer o deploy:

1. Aguarde o container reiniciar
2. Verifique os logs procurando por:
   ```
   ✅ Servidor SMTP pronto para enviar e-mails
   ```
3. Se aparecer erro, os logs agora mostrarão mais detalhes:
   ```
   🔄 Verificando configuração SMTP...
      Host: smtp.kinghost.net
      Port: 465
      User: noreply@aisam.com.br
      Secure: true
   ```

## 🔧 Alternativas se o Problema Persistir

### 1. Verificar se a KingHost permite SMTP externo

Alguns hosts restringem uso de SMTP fora do servidor deles. Contate o suporte da KingHost para confirmar.

### 2. Usar um serviço SMTP dedicado

Se o Railway continuar bloqueando, considere usar:

- **SendGrid** (100 emails/dia grátis)
  ```bash
  SMTP_HOST=smtp.sendgrid.net
  SMTP_PORT=587
  SMTP_USER=apikey
  SMTP_PASS=SG.seu-api-key-aqui
  ```

- **Mailgun** (100 emails/dia grátis)
  ```bash
  SMTP_HOST=smtp.mailgun.org
  SMTP_PORT=587
  SMTP_USER=postmaster@seu-dominio.mailgun.org
  SMTP_PASS=sua-senha-aqui
  ```

- **AWS SES** (62,000 emails/mês grátis se dentro da AWS)

### 3. Verificar DNS/MX Records

Se usando `smtp.aisam.com.br`, verifique se os registros MX estão corretos:

```bash
nslookup -type=mx aisam.com.br
```

## 📋 Checklist de Diagnóstico

- [ ] Host correto (sem "i" extra em "smtpi")
- [ ] Porta correta (465 ou 587)
- [ ] SMTP_SECURE corresponde à porta (true=465, false=587)
- [ ] Usuário e senha corretos da conta de email
- [ ] Email existe e está ativo no painel KingHost
- [ ] Railway não está bloqueando a porta (testar com 465 e 587)
- [ ] Firewall da KingHost permite conexões externas

## 🔐 Segurança

⚠️ **IMPORTANTE**: Nunca commite as credenciais reais no código! Use variáveis de ambiente.

## 📞 Suporte

Se o problema persistir:
1. Contate o suporte da KingHost para confirmar configurações SMTP
2. Peça para verificarem se há bloqueio de IPs do Railway
3. Solicite logs de tentativas de conexão SMTP
