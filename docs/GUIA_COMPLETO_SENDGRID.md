# Guia Completo: Implementação SendGrid

**Autor**: Documentação Técnica - AISAM
**Data**: Janeiro 2026
**Versão**: 1.0

---

## Índice

1. [Visão Geral](#visao-geral)
2. [Conceitos Fundamentais](#conceitos-fundamentais)
3. [Arquitetura da Solução](#arquitetura)
4. [Configuração Inicial](#configuracao-inicial)
5. [Implementação Passo a Passo](#implementacao)
6. [Código Completo](#codigo-completo)
7. [Configuração de Ambientes](#ambientes)
8. [Uso na Aplicação](#uso)
9. [Boas Práticas](#boas-praticas)
10. [Troubleshooting](#troubleshooting)
11. [Referências](#referencias)

---

## 1. Visão Geral {#visao-geral}

### O que é SendGrid?

SendGrid é uma plataforma de email transacional que permite enviar emails através de API HTTP/HTTPS ao invés do protocolo SMTP tradicional.

### Por que usar SendGrid?

#### Problema: SMTP em Ambientes Cloud

Servidores SMTP tradicionais usam portas específicas:
- Porta 25 (SMTP)
- Porta 587 (SMTP com TLS)
- Porta 465 (SMTP com SSL)

**Problema**: Essas portas são frequentemente bloqueadas em ambientes cloud (Railway, Heroku, Vercel) para prevenir spam e abuso.

#### Solução: SendGrid API

```
┌──────────────────────────────────────────────────────────────┐
│                     Comparação                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  SMTP Tradicional (Porta 587/465/25)                        │
│  ↓                                                           │
│  ❌ Bloqueado no Railway/Heroku/Vercel                      │
│                                                               │
│  SendGrid API (HTTPS - Porta 443)                           │
│  ↓                                                           │
│  ✅ Permitido em qualquer ambiente cloud                    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Benefícios do SendGrid

| Recurso | Descrição |
|---------|-----------|
| **Confiabilidade** | 99.99% uptime garantido |
| **Escalabilidade** | Milhões de emails por dia |
| **Deliverability** | Alta taxa de entrega (inbox) |
| **Analytics** | Dashboard com métricas detalhadas |
| **Gratuito** | 100 emails/dia no plano free |
| **Fácil Setup** | Apenas uma API Key necessária |

---

## 2. Conceitos Fundamentais {#conceitos-fundamentais}

### 2.1 Padrões de Projeto Utilizados

#### Dependency Injection (DI)

Injeção de dependências permite desacoplar código e facilitar testes.

**Sem DI (Acoplado)**:
```typescript
class MeuUseCase {
    async execute() {
        // ❌ Dependência hardcoded
        const mailer = new SendGridMailProvider();
        await mailer.sendMail({...});
    }
}
```

**Com DI (Desacoplado)**:
```typescript
class MeuUseCase {
    constructor(
        @inject("MailProvider")
        private mailProvider: IMailProvider  // ✅ Interface
    ) {}

    async execute() {
        await this.mailProvider.sendMail({...});
    }
}
```

**Vantagens**:
- ✅ Fácil trocar implementação (SendGrid ↔ SMTP)
- ✅ Fácil testar (mock da interface)
- ✅ Código desacoplado e flexível

#### Strategy Pattern

Define uma família de algoritmos intercambiáveis.

```typescript
// Interface (contrato)
interface IMailProvider {
    sendMail(data: ISendMailDTO): Promise<void>;
}

// Estratégias diferentes
class SendGridMailProvider implements IMailProvider {
    async sendMail(data: ISendMailDTO) {
        // Implementação via SendGrid API
    }
}

class NodemailerMailProvider implements IMailProvider {
    async sendMail(data: ISendMailDTO) {
        // Implementação via SMTP
    }
}

// Cliente usa interface, não sabe qual estratégia
const provider: IMailProvider = container.resolve("MailProvider");
await provider.sendMail({...});
```

### 2.2 Variáveis de Ambiente

Variáveis de ambiente permitem:

1. **Segurança**: Sem hardcode de credenciais
2. **Flexibilidade**: Configuração por ambiente (dev/prod)
3. **Portabilidade**: Mesmo código em diferentes plataformas

```typescript
// ❌ Hardcoded (inseguro)
const apiKey = "SG.abc123xyz789...";

// ✅ Variável de ambiente (seguro)
const apiKey = process.env.SENDGRID_API_KEY;
```

---

## 3. Arquitetura da Solução {#arquitetura}

### 3.1 Estrutura de Diretórios

```
backend/
├── src/
│   ├── modules/
│   │   ├── Candidato/
│   │   │   └── useCases/
│   │   │       └── GenerateMagicLink/
│   │   │           └── GenerateMagicLinkUseCase.ts  ← Usa MailProvider
│   │   └── Notificacao/
│   │       └── dtos/
│   │           └── ISendMailDTO.ts  ← DTO de email
│   └── shared/
│       └── container/
│           └── providers/
│               └── MailProvider/
│                   ├── IMailProvider.ts              ← Interface
│                   ├── index.ts                      ← Container DI
│                   └── implementations/
│                       ├── NodemailerMailProvider.ts ← SMTP
│                       ├── SendGridMailProvider.ts   ← SendGrid ⭐
│                       └── MailTemplateProvider.ts   ← Templates
```

### 3.2 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                     Fluxo de Envio                          │
└─────────────────────────────────────────────────────────────┘

    UseCase/Service
         │
         │ @inject("MailProvider")
         ↓
    IMailProvider (Interface)
         │
         │ (Container resolve em runtime)
         ↓
    ┌────────────────────────┐
    │  SendGridMailProvider  │  ← Escolhido via MAIL_PROVIDER=sendgrid
    └────────────────────────┘
         │
         │ sendgrid.send()
         ↓
    SendGrid API (HTTPS)
         │
         ↓
    Email entregue ✉️
```

---

## 4. Configuração Inicial {#configuracao-inicial}

### 4.1 Criar Conta no SendGrid

1. Acesse: https://signup.sendgrid.com/
2. Preencha o formulário de cadastro
3. Verifique seu email
4. Complete o questionário de onboarding:
   - Tipo de empresa
   - Volume de emails esperado
   - Propósito dos emails

### 4.2 Gerar API Key

**Passo a passo**:

```
SendGrid Dashboard
  └── Settings
      └── API Keys
          └── Create API Key
              ├── API Key Name: "Production" ou "Development"
              ├── API Key Permissions:
              │   └── [X] Full Access
              │       ou
              │   └── [X] Restricted Access
              │       └── [X] Mail Send (Full Access)
              └── Create & View
```

**Resultado**: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

⚠️ **IMPORTANTE**: A API Key só aparece **uma vez**. Copie e salve imediatamente em local seguro!

### 4.3 Verificar Sender Identity

SendGrid exige que você verifique quem está enviando os emails.

#### Opção A: Single Sender Verification (Mais Rápido)

Recomendado para começar rapidamente.

**Passo a passo**:

```
Settings
  └── Sender Authentication
      └── Verify a Single Sender
          ├── From Name: AISAM (ou nome da empresa)
          ├── From Email Address: noreply@aisam.com.br
          ├── Reply To: suporte@aisam.com.br
          ├── Company Address: Endereço completo
          ├── City: Cidade
          ├── State: Estado
          ├── Zip Code: CEP
          └── Country: Brasil
```

1. Clique em **Create**
2. Verifique o email enviado pelo SendGrid
3. Clique no link de confirmação
4. ✅ Pronto! Pode usar esse email como remetente

#### Opção B: Domain Authentication (Produção)

Recomendado para produção com volume maior.

**Passo a passo**:

```
Settings
  └── Sender Authentication
      └── Authenticate Your Domain
          ├── Select DNS Host: Outros (KingHost, GoDaddy, etc)
          └── Domain You Send From: aisam.com.br
```

1. SendGrid gera registros DNS (TXT, CNAME)
2. Adicione esses registros no painel do seu provedor (KingHost)
3. Aguarde propagação DNS (até 48h)
4. SendGrid verifica automaticamente
5. ✅ Todos os emails @aisam.com.br podem ser usados

**Exemplo de registros DNS**:
```
Tipo: CNAME
Host: em1234.aisam.com.br
Valor: u1234567.wl123.sendgrid.net

Tipo: CNAME
Host: s1._domainkey.aisam.com.br
Valor: s1.domainkey.u1234567.wl123.sendgrid.net

Tipo: CNAME
Host: s2._domainkey.aisam.com.br
Valor: s2.domainkey.u1234567.wl123.sendgrid.net
```

---

## 5. Implementação Passo a Passo {#implementacao}

### Passo 1: Instalar Dependência

```bash
# NPM
npm install @sendgrid/mail

# Yarn
yarn add @sendgrid/mail
```

**Versão instalada**: `^7.7.0` (ou mais recente)

### Passo 2: Criar a Interface

**Arquivo**: `src/shared/container/providers/MailProvider/IMailProvider.ts`

```typescript
export interface ISendMailDTO {
    to: string;
    subject: string;
    body?: string;
    template?: string;
    variables?: Record<string, any>;
    from?: string;
}

export interface IMailProvider {
    sendMail(data: ISendMailDTO): Promise<void>;
}
```

**Explicação**:
- `ISendMailDTO`: Define estrutura de dados para enviar email
- `IMailProvider`: Define contrato que todos os providers devem seguir
- `body?`: HTML do email (opcional se usar template)
- `template?`: Nome do template (usado com MailTemplateProvider)
- `variables?`: Variáveis dinâmicas para o template

### Passo 3: Implementar SendGridMailProvider

**Arquivo**: `src/shared/container/providers/MailProvider/implementations/SendGridMailProvider.ts`

```typescript
import sendgrid from "@sendgrid/mail";
import { IMailProvider } from "../IMailProvider";
import { ISendMailDTO } from "@modules/Notificacao/dtos/ISendMailDTO";
import { MailTemplateProvider } from "./MailTemplateProvider";

class SendGridMailProvider implements IMailProvider {
    private templateProvider: MailTemplateProvider;

    constructor() {
        // 1. Lê a API Key das variáveis de ambiente
        const apiKey = process.env.SENDGRID_API_KEY;

        // 2. Validação
        if (!apiKey) {
            console.error('❌ SENDGRID_API_KEY não configurado!');
            console.error('⚠️  O envio de e-mails não funcionará!');
            console.error('💡 Configure SENDGRID_API_KEY nas variáveis de ambiente');
        } else {
            // 3. Configura o SDK
            sendgrid.setApiKey(apiKey);
            console.log('✅ SendGrid configurado com sucesso');
            console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
        }

        // 4. Inicializa o provider de templates
        this.templateProvider = new MailTemplateProvider();
    }

    async sendMail({ to, subject, body, template, variables, from }: ISendMailDTO): Promise<void> {
        let htmlContent = body;

        // 5. Se especificou template, renderiza
        if (template && variables) {
            htmlContent = this.templateProvider.parse({ template, variables });
        }

        // 6. Define remetente
        const fromEmail = from || process.env.MAIL_FROM || "noreply@aisam.com.br";

        try {
            // 7. Envia via SendGrid API
            await sendgrid.send({
                from: fromEmail,
                to,
                subject,
                html: htmlContent,
            });

            console.log(`📧 Email enviado via SendGrid para: ${to}`);
        } catch (error: any) {
            console.error('❌ Erro ao enviar email via SendGrid:', error);

            // 8. Log detalhado para debug
            if (error.response) {
                console.error('Response body:', error.response.body);
            }

            throw error;
        }
    }
}

export { SendGridMailProvider };
```

**Principais pontos**:
1. **Linha 8-19**: Configura API Key do SendGrid
2. **Linha 25-28**: Renderiza template se necessário
3. **Linha 31**: Fallback de remetente
4. **Linha 34-39**: Chama API do SendGrid
5. **Linha 44-46**: Log de erros detalhado

### Passo 4: Configurar Container DI

**Arquivo**: `src/shared/container/providers/MailProvider/index.ts`

```typescript
import { container } from "tsyringe";
import { IMailProvider } from "./IMailProvider";
import { NodemailerMailProvider } from "./implementations/NodemailerMailProvider";
import { SendGridMailProvider } from "./implementations/SendGridMailProvider";

// Lê variável de ambiente para decidir qual provider usar
const mailProvider = process.env.MAIL_PROVIDER || "smtp";

if (mailProvider === "sendgrid") {
    console.log("📧 Usando SendGrid como provedor de e-mail");
    container.registerSingleton<IMailProvider>(
        "MailProvider",
        SendGridMailProvider
    );
} else {
    console.log("📧 Usando SMTP (Nodemailer) como provedor de e-mail");
    container.registerSingleton<IMailProvider>(
        "MailProvider",
        NodemailerMailProvider
    );
}
```

**Como funciona**:
- Lê `MAIL_PROVIDER` do ambiente
- Se `"sendgrid"` → Registra `SendGridMailProvider`
- Caso contrário → Registra `NodemailerMailProvider` (SMTP)
- `registerSingleton`: Cria apenas uma instância (padrão Singleton)

---

## 6. Código Completo {#codigo-completo}

### SendGridMailProvider.ts (Versão Completa)

```typescript
import sendgrid from "@sendgrid/mail";
import { IMailProvider } from "../IMailProvider";
import { ISendMailDTO } from "@modules/Notificacao/dtos/ISendMailDTO";
import { MailTemplateProvider } from "./MailTemplateProvider";

class SendGridMailProvider implements IMailProvider {
    private templateProvider: MailTemplateProvider;

    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY;

        if (!apiKey) {
            console.error('❌ SENDGRID_API_KEY não configurado!');
            console.error('⚠️  O envio de e-mails não funcionará!');
            console.error('💡 Configure SENDGRID_API_KEY nas variáveis de ambiente');
        } else {
            sendgrid.setApiKey(apiKey);
            console.log('✅ SendGrid configurado com sucesso');
            console.log(`   API Key: ${apiKey.substring(0, 10)}...`);
        }

        this.templateProvider = new MailTemplateProvider();
    }

    async sendMail({ to, subject, body, template, variables, from }: ISendMailDTO): Promise<void> {
        let htmlContent = body;

        if (template && variables) {
            htmlContent = this.templateProvider.parse({ template, variables });
        }

        const fromEmail = from || process.env.MAIL_FROM || "noreply@aisam.com.br";

        try {
            await sendgrid.send({
                from: fromEmail,
                to,
                subject,
                html: htmlContent,
            });

            console.log(`📧 Email enviado via SendGrid para: ${to}`);
        } catch (error: any) {
            console.error('❌ Erro ao enviar email via SendGrid:', error);

            if (error.response) {
                console.error('Response body:', error.response.body);
            }

            throw error;
        }
    }
}

export { SendGridMailProvider };
```

---

## 7. Configuração de Ambientes {#ambientes}

### 7.1 Desenvolvimento Local

**Arquivo**: `.env`

```bash
# Provedor de email
MAIL_PROVIDER=sendgrid

# SendGrid
SENDGRID_API_KEY=SG.sua-chave-de-desenvolvimento
MAIL_FROM=dev@aisam.com.br

# Ou use SMTP local para testes (MailHog/Mailtrap)
# MAIL_PROVIDER=smtp
# MAIL_HOST=localhost
# MAIL_PORT=1025
```

**Dica**: Crie uma API Key separada para desenvolvimento.

### 7.2 Produção (Railway)

**Via Interface Web**:

1. Acesse Railway Dashboard
2. Selecione seu projeto
3. Clique no serviço do backend
4. Vá na aba **Variables**
5. Adicione as variáveis:

```bash
MAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.sua-chave-de-producao
MAIL_FROM=noreply@aisam.com.br
FRONTEND_INSTITUCIONAL_URL=https://aisam.com.br
```

**Via Railway CLI**:

```bash
# Instale o CLI
npm install -g @railway/cli

# Login
railway login

# Configure variáveis
railway variables set MAIL_PROVIDER=sendgrid
railway variables set SENDGRID_API_KEY=SG.xxxxx
railway variables set MAIL_FROM=noreply@aisam.com.br
railway variables set FRONTEND_INSTITUCIONAL_URL=https://aisam.com.br
```

### 7.3 Outras Plataformas

#### Heroku

```bash
heroku config:set MAIL_PROVIDER=sendgrid
heroku config:set SENDGRID_API_KEY=SG.xxxxx
heroku config:set MAIL_FROM=noreply@aisam.com.br
```

#### Vercel

```bash
vercel env add MAIL_PROVIDER production
# Digite: sendgrid

vercel env add SENDGRID_API_KEY production
# Digite: SG.xxxxx

vercel env add MAIL_FROM production
# Digite: noreply@aisam.com.br
```

#### Docker

**Arquivo**: `docker-compose.yml`

```yaml
services:
  backend:
    environment:
      - MAIL_PROVIDER=sendgrid
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - MAIL_FROM=noreply@aisam.com.br
```

**Arquivo**: `.env` (não commitar)

```bash
SENDGRID_API_KEY=SG.xxxxx
```

---

## 8. Uso na Aplicação {#uso}

### 8.1 Uso Básico em UseCase

```typescript
import { inject, injectable } from "tsyringe";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

@injectable()
class EnviarBoasVindasUseCase {
    constructor(
        @inject("MailProvider")
        private mailProvider: IMailProvider
    ) {}

    async execute(email: string, nome: string) {
        await this.mailProvider.sendMail({
            to: email,
            subject: "Bem-vindo ao Sistema AISAM!",
            body: `
                <h1>Olá ${nome}!</h1>
                <p>Bem-vindo ao nosso sistema.</p>
                <p>Estamos felizes em tê-lo conosco.</p>
            `
        });
    }
}
```

### 8.2 Uso com Templates

```typescript
await this.mailProvider.sendMail({
    to: candidato.email,
    subject: "Seu Link de Acesso - Sistema AISAM",
    template: "magic-link-candidato",
    variables: {
        nome: candidato.nome,
        magic_link: magicLink,
        dias_restantes: diasRestantes,
        data_expiracao: expiresAt.toLocaleDateString("pt-BR"),
        ano: new Date().getFullYear()
    }
});
```

### 8.3 Uso Direto (sem DI)

```typescript
import { SendGridMailProvider } from "@shared/container/providers/MailProvider/implementations/SendGridMailProvider";

const mailProvider = new SendGridMailProvider();

await mailProvider.sendMail({
    to: "destinatario@example.com",
    subject: "Teste",
    body: "<p>Email de teste</p>"
});
```

---

## 9. Boas Práticas {#boas-praticas}

### 9.1 Segurança

#### ❌ Nunca faça isso:

```typescript
// Credenciais hardcoded
const apiKey = "SG.abc123xyz789...";
sendgrid.setApiKey(apiKey);
```

#### ✅ Sempre faça isso:

```typescript
// Variáveis de ambiente
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is required');
}
sendgrid.setApiKey(apiKey);
```

### 9.2 Validação de API Key

```typescript
const apiKey = process.env.SENDGRID_API_KEY;

// Valida formato
if (!apiKey || !apiKey.startsWith('SG.')) {
    throw new Error('Invalid SendGrid API Key format');
}

// Valida tamanho (SendGrid keys têm ~69 caracteres)
if (apiKey.length < 60) {
    throw new Error('SendGrid API Key seems incomplete');
}

sendgrid.setApiKey(apiKey);
```

### 9.3 Tratamento de Erros

```typescript
try {
    await sendgrid.send(mailOptions);
    console.log(`✅ Email sent to ${mailOptions.to}`);
} catch (error: any) {
    // Log estruturado
    console.error({
        message: 'Failed to send email',
        to: mailOptions.to,
        subject: mailOptions.subject,
        error: error.message,
        code: error.code,
        statusCode: error.response?.statusCode,
        body: error.response?.body
    });

    // Não expõe detalhes internos ao usuário
    throw new AppError('Failed to send email. Please try again later.', 500);
}
```

### 9.4 Rate Limiting

SendGrid tem limites de requisições:

- **Free**: 100 emails/dia
- **Essentials**: 50,000 emails/mês
- **Pro**: 100,000 emails/mês

**Implementação de rate limit**:

```typescript
import rateLimit from 'express-rate-limit';

const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 emails por IP
    message: 'Muitos emails enviados. Tente novamente em 15 minutos.'
});

// Aplicar na rota
app.post('/api/send-email', emailLimiter, emailController);
```

### 9.5 Múltiplos Ambientes

```typescript
// config/mail.ts
const mailConfig = {
    provider: process.env.MAIL_PROVIDER || 'smtp',
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
    },
    smtp: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT) || 587,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    from: {
        email: process.env.MAIL_FROM || 'noreply@aisam.com.br',
        name: process.env.MAIL_FROM_NAME || 'AISAM'
    }
};

export default mailConfig;
```

### 9.6 Testes

#### Mock do MailProvider

```typescript
// __tests__/mocks/MockMailProvider.ts
import { IMailProvider, ISendMailDTO } from "@shared/container/providers/MailProvider/IMailProvider";

class MockMailProvider implements IMailProvider {
    public emails: ISendMailDTO[] = [];

    async sendMail(data: ISendMailDTO): Promise<void> {
        this.emails.push(data);
    }

    clear() {
        this.emails = [];
    }
}

export { MockMailProvider };
```

#### Teste de UseCase

```typescript
// __tests__/useCases/EnviarBoasVindasUseCase.spec.ts
import { MockMailProvider } from '../mocks/MockMailProvider';
import { EnviarBoasVindasUseCase } from '@modules/Usuario/useCases/EnviarBoasVindasUseCase';

describe('EnviarBoasVindasUseCase', () => {
    let mockMailProvider: MockMailProvider;
    let enviarBoasVindasUseCase: EnviarBoasVindasUseCase;

    beforeEach(() => {
        mockMailProvider = new MockMailProvider();
        enviarBoasVindasUseCase = new EnviarBoasVindasUseCase(mockMailProvider);
    });

    it('deve enviar email de boas-vindas', async () => {
        await enviarBoasVindasUseCase.execute('user@example.com', 'João');

        expect(mockMailProvider.emails).toHaveLength(1);
        expect(mockMailProvider.emails[0].to).toBe('user@example.com');
        expect(mockMailProvider.emails[0].subject).toContain('Bem-vindo');
    });
});
```

---

## 10. Troubleshooting {#troubleshooting}

### Problema 1: "The from address does not match a verified Sender Identity"

**Sintoma**: Email não é enviado, erro 403.

**Causa**: O email em `from` não foi verificado no SendGrid.

**Solução**:
1. Acesse **Settings** → **Sender Authentication**
2. Verifique o email exato usado em `MAIL_FROM`
3. Se não estiver verificado, clique em **Verify a Single Sender**
4. Siga o processo de verificação
5. Use o email verificado exatamente como aparece no painel

**Exemplo**:
```bash
# ❌ Não verificado
MAIL_FROM=noreply@aisam.com.br

# Verifique no painel SendGrid
# Após verificar:

# ✅ Verificado
MAIL_FROM=noreply@aisam.com.br
```

### Problema 2: "Invalid API Key"

**Sintoma**: Erro ao inicializar, "Unauthorized" (401).

**Causa**: API Key incorreta, incompleta ou revogada.

**Solução**:
1. Verifique se `SENDGRID_API_KEY` está configurada:
   ```bash
   echo $SENDGRID_API_KEY
   ```
2. Verifique se começa com `SG.`:
   ```bash
   # Deve começar com SG.
   SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Se não funcionar, gere nova API Key:
   - Dashboard → Settings → API Keys
   - Create API Key
   - Copie a nova chave
   - Atualize `SENDGRID_API_KEY`

### Problema 3: Emails não chegam (não há erro)

**Sintoma**: `sendMail()` executa sem erro, mas email não chega.

**Diagnóstico**:

1. **Verifique o dashboard do SendGrid**:
   - Activity → Ver últimas 7 dias
   - Procure pelo email enviado
   - Veja status: Delivered, Bounced, Dropped, etc.

2. **Verifique spam**:
   - Emails podem estar na pasta de spam
   - Adicione remetente aos contatos

3. **Verifique limite do plano**:
   - Free: 100 emails/dia
   - Se atingiu limite, emails são rejeitados

4. **Habilite logs detalhados**:
   ```typescript
   try {
       const response = await sendgrid.send(mailOptions);
       console.log('SendGrid response:', response);
   } catch (error) {
       console.error('Full error:', JSON.stringify(error, null, 2));
   }
   ```

### Problema 4: "Connection timeout" ou "ECONNREFUSED"

**Sintoma**: Erro de conexão, timeout.

**Causa**: Firewall bloqueando porta 443 (HTTPS).

**Solução**:
1. Verifique firewall local
2. Verifique proxy corporativo
3. Teste conectividade:
   ```bash
   curl -I https://api.sendgrid.com
   ```
4. Se em produção (Railway/Heroku), abra ticket com suporte

### Problema 5: Variável de ambiente não carrega

**Sintoma**: `process.env.SENDGRID_API_KEY` retorna `undefined`.

**Causa**: Arquivo `.env` não carregado ou variável não configurada.

**Solução**:

1. **Desenvolvimento local**:
   ```typescript
   // No início do arquivo (server.ts ou app.ts)
   import 'dotenv/config';

   // Ou
   import dotenv from 'dotenv';
   dotenv.config();
   ```

2. **Produção (Railway/Heroku)**:
   - Verifique se variável está configurada no painel
   - Liste variáveis:
     ```bash
     railway variables
     # ou
     heroku config
     ```

3. **Docker**:
   - Verifique `docker-compose.yml`
   - Verifique arquivo `.env`
   - Rebuild container:
     ```bash
     docker-compose down
     docker-compose up --build
     ```

### Checklist de Diagnóstico

```markdown
- [ ] API Key configurada (`SENDGRID_API_KEY`)
- [ ] API Key começa com `SG.`
- [ ] Sender Identity verificado
- [ ] Email `from` corresponde ao verificado
- [ ] Variável de ambiente carregada (`dotenv`)
- [ ] Limite de emails não atingido
- [ ] Dashboard SendGrid mostra atividade
- [ ] Email não está no spam
- [ ] Conectividade HTTPS (porta 443) OK
```

---

## 11. Referências {#referencias}

### Documentação Oficial

- **SendGrid Docs**: https://docs.sendgrid.com/
- **Node.js SDK**: https://github.com/sendgrid/sendgrid-nodejs
- **API Reference**: https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api
- **Dynamic Templates**: https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates

### Ferramentas Úteis

- **MailHog** (SMTP de teste local): https://github.com/mailhog/MailHog
- **Mailtrap** (SMTP de teste online): https://mailtrap.io/
- **SendGrid Status**: https://status.sendgrid.com/

### Planos SendGrid

| Plano | Emails/Mês | Preço (USD) | Recursos |
|-------|------------|-------------|----------|
| **Free** | 100/dia (3,000/mês) | Grátis | - Email API<br>- Analytics básico<br>- Single Sender<br>- Suporte comunidade |
| **Essentials** | 50,000/mês | $19.95/mês | - Tudo do Free<br>- Domain Authentication<br>- Email validation<br>- Suporte email |
| **Pro** | 100,000/mês | $89.95/mês | - Tudo do Essentials<br>- Subuser Management<br>- Dedicated IP<br>- Suporte 24/7 |

**Link**: https://sendgrid.com/pricing/

### Padrões de Projeto

- **Dependency Injection**: https://martinfowler.com/articles/injection.html
- **Strategy Pattern**: https://refactoring.guru/design-patterns/strategy
- **Singleton Pattern**: https://refactoring.guru/design-patterns/singleton

### Bibliotecas Relacionadas

```json
{
  "dependencies": {
    "@sendgrid/mail": "^7.7.0",
    "tsyringe": "^4.8.0",
    "dotenv": "^16.0.3",
    "handlebars": "^4.7.8"
  }
}
```

---

## Apêndices

### A. Exemplo de Template Handlebars

**Arquivo**: `src/shared/container/providers/MailProvider/templates/magic-link-candidato.hbs`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Seu Link de Acesso</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button {
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Olá {{nome}}!</h1>

        <p>Aqui está seu link de acesso ao sistema:</p>

        <p>
            <a href="{{magic_link}}" class="button">
                Acessar Sistema
            </a>
        </p>

        <p>Ou copie e cole este link no navegador:</p>
        <p><code>{{magic_link}}</code></p>

        <p>
            <strong>Atenção:</strong> Este link é válido por <strong>24 horas</strong>.
        </p>

        <p>
            Seu acesso expira em <strong>{{dias_restantes}} dias</strong>
            ({{data_expiracao}}).
        </p>

        <hr>

        <p style="color: #666; font-size: 12px;">
            © {{ano}} AISAM. Todos os direitos reservados.
        </p>
    </div>
</body>
</html>
```

### B. Checklist de Implementação

```markdown
### Implementação SendGrid - Checklist

#### Configuração Inicial
- [ ] Criar conta no SendGrid
- [ ] Gerar API Key (Full Access ou Mail Send)
- [ ] Salvar API Key em local seguro
- [ ] Verificar Single Sender ou autenticar domínio

#### Código
- [ ] Instalar `@sendgrid/mail`
- [ ] Criar interface `IMailProvider`
- [ ] Criar DTO `ISendMailDTO`
- [ ] Implementar `SendGridMailProvider`
- [ ] Configurar container DI
- [ ] Adicionar logs de debug

#### Configuração
- [ ] Adicionar `MAIL_PROVIDER=sendgrid` no `.env`
- [ ] Adicionar `SENDGRID_API_KEY` no `.env`
- [ ] Adicionar `MAIL_FROM` no `.env`
- [ ] Adicionar variáveis no Railway/Heroku
- [ ] Adicionar `.env` no `.gitignore`

#### Testes
- [ ] Testar envio local (dev)
- [ ] Testar envio produção
- [ ] Verificar logs do SendGrid
- [ ] Verificar email chegou (inbox/spam)
- [ ] Testar templates
- [ ] Testar fallback de remetente

#### Produção
- [ ] Deploy com novas variáveis
- [ ] Verificar logs da aplicação
- [ ] Monitorar dashboard SendGrid
- [ ] Configurar alertas (opcional)
- [ ] Documentar para equipe
```

### C. Exemplo de Configuração Completa

**.env**
```bash
# ===================================
# CONFIGURAÇÕES DE E-MAIL
# ===================================
MAIL_PROVIDER=sendgrid

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAIL_FROM=noreply@aisam.com.br
MAIL_FROM_NAME=AISAM

# URLs do Frontend (para magic links)
FRONTEND_INSTITUCIONAL_URL=https://aisam.com.br
FRONTEND_URL=https://vagas.aisam.com.br
```

---

**Fim do Documento**

---

**Informações de Contato**

- **Projeto**: AISAM - Sistema de Vagas
- **Repositório**: https://github.com/LucasRios95/aisam.com.br
- **Documentação**: `/docs`
- **Suporte**: Entre em contato com a equipe de desenvolvimento

---

**Histórico de Versões**

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | Janeiro 2026 | Equipe Dev | Versão inicial do guia |

---

**Licença**: Documento interno - AISAM
