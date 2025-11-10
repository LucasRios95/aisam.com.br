# Guia de Teste - Webhook N8N para Notícias

## Índice
1. [Visão Geral](#visão-geral)
2. [Endpoint do Webhook](#endpoint-do-webhook)
3. [Testando Localmente](#testando-localmente)
4. [Testando em Produção](#testando-em-produção)
5. [Configurando o N8N](#configurando-o-n8n)
6. [Exemplos de Requisições](#exemplos-de-requisições)
7. [Troubleshooting](#troubleshooting)

---

## Visão Geral

O webhook de notícias permite que o N8N (hospedado em `fluxos.mindadapt.com.br`) envie automaticamente notícias para o sistema AISAM. As notícias são criadas e publicadas automaticamente.

**Características:**
- Criação automática de notícias
- Publicação imediata (sem necessidade de aprovação manual)
- Autor padrão: "Automação N8N"
- Fonte marcada como "n8n" no banco de dados
- Sem necessidade de autenticação (webhook público)

---

## Endpoint do Webhook

### Informações do Endpoint

| Propriedade | Valor |
|-------------|-------|
| **Método** | POST |
| **Endpoint Local** | `http://localhost:3333/noticias/webhook/n8n` |
| **Endpoint Produção** | `https://api.aisam.com.br/noticias/webhook/n8n` |
| **Autenticação** | Não requerida |
| **Content-Type** | `application/json` |

### Campos da Requisição

#### Campos Obrigatórios
```json
{
  "titulo": "string (obrigatório)",
  "conteudo": "string (obrigatório)"
}
```

#### Campos Opcionais
```json
{
  "resumo": "string (opcional)",
  "imagem_url": "string (opcional)",
  "autor": "string (opcional, padrão: 'Automação N8N')",
  "fonte_url": "string (opcional)",
  "tags": ["string", "string"] (opcional),
  "data_publicacao": "ISO 8601 string (opcional, padrão: now)"
}
```

### Respostas

#### Sucesso (201 Created)
```json
{
  "id": "uuid",
  "titulo": "Título da Notícia",
  "resumo": "Resumo opcional",
  "conteudo": "Conteúdo completo",
  "autor": "Automação N8N",
  "imagem_url": null,
  "fonte": "n8n",
  "fonte_url": null,
  "tags": [],
  "data_publicacao": "2025-11-02T10:00:00.000Z",
  "publicada": true,
  "created_at": "2025-11-02T10:00:00.000Z",
  "updated_at": "2025-11-02T10:00:00.000Z"
}
```

#### Erro - Campos Faltando (400 Bad Request)
```json
{
  "error": "Campos obrigatórios: titulo, conteudo"
}
```

#### Erro - Servidor (500 Internal Server Error)
```json
{
  "error": "Mensagem de erro detalhada"
}
```

---

## Testando Localmente

### 1. Certifique-se que o Backend está Rodando

```bash
cd backend
npm run dev:common
```

Aguarde a mensagem: `✅ Server is running on port 3333`

### 2. Teste com cURL - Mínimo

```bash
curl -X POST http://localhost:3333/noticias/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Teste de Notícia do N8N",
    "conteudo": "Este é um teste de integração com o webhook do N8N."
  }'
```

### 3. Teste com cURL - Completo

```bash
curl -X POST http://localhost:3333/noticias/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "AISAM Promove Feira de Emprego em São Roque",
    "resumo": "Evento reunirá empresas associadas e candidatos em busca de oportunidades profissionais.",
    "conteudo": "A AISAM (Associação Industrial de São Roque) anuncia a realização da Feira de Emprego 2025, que acontecerá no próximo mês. O evento promete conectar talentos locais com as principais empresas da região.\n\nAs empresas associadas terão estandes para divulgar suas vagas e realizar entrevistas preliminares. Candidatos podem se inscrever através do portal de vagas da AISAM.",
    "imagem_url": "https://aisam.com.br/images/feira-emprego-2025.jpg",
    "autor": "Departamento de Comunicação AISAM",
    "fonte_url": "https://aisam.com.br/eventos/feira-emprego-2025",
    "tags": ["emprego", "feira", "oportunidades", "são roque"],
    "data_publicacao": "2025-11-02T09:00:00-03:00"
  }'
```

### 4. Teste com PowerShell (Windows)

```powershell
$body = @{
    titulo = "Teste de Notícia do N8N"
    conteudo = "Este é um teste de integração com o webhook do N8N."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3333/noticias/webhook/n8n" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 5. Verificar Notícia Criada

Acesse o banco de dados ou use a API:

```bash
# Listar todas as notícias
curl http://localhost:3333/noticias

# Listar apenas as do N8N
curl http://localhost:3333/noticias?fonte=n8n
```

---

## Testando em Produção

### Pré-requisitos
- Backend deployado na VPS
- Nginx configurado
- SSL/TLS ativo (certbot)
- API acessível em `https://api.aisam.com.br`

### Teste com cURL - Produção

```bash
curl -X POST https://api.aisam.com.br/noticias/webhook/n8n \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Notícia de Teste em Produção",
    "conteudo": "Testando webhook em ambiente de produção."
  }'
```

### Verificar em Produção

```bash
# Listar notícias publicadas
curl https://api.aisam.com.br/noticias/publicadas

# Verificar logs do backend (SSH na VPS)
pm2 logs backend
```

---

## Configurando o N8N

### 1. Acesse o N8N
```
https://fluxos.mindadapt.com.br
```

### 2. Criar Novo Workflow

1. Click em **"New Workflow"**
2. Nomeie como **"AISAM - Notícias Automáticas"**

### 3. Configurar Trigger (Gatilho)

Existem várias opções de gatilho. Exemplos:

#### Opção A: Webhook Trigger (Manual)
1. Adicione o node **"Webhook"**
2. Configure:
   - **HTTP Method**: POST
   - **Path**: `aisam-noticias`
   - Teste enviando dados via Postman/cURL

#### Opção B: RSS Feed
1. Adicione o node **"RSS Feed Read"**
2. Configure:
   - **URL**: Feed RSS da fonte de notícias
   - **Poll Times**: Define intervalo (ex: a cada 1 hora)

#### Opção C: Schedule Trigger
1. Adicione o node **"Schedule Trigger"**
2. Configure:
   - **Trigger Interval**: Diariamente, semanalmente, etc.

#### Opção D: Google Sheets
1. Adicione o node **"Google Sheets"**
2. Configure para ler uma planilha com notícias

### 4. Processar Dados (Opcional)

Adicione um node **"Set"** ou **"Function"** para formatar os dados:

```javascript
// Exemplo de formatação no node Function
return items.map(item => ({
  json: {
    titulo: item.json.titulo || item.json.title,
    resumo: item.json.resumo || item.json.summary,
    conteudo: item.json.conteudo || item.json.content,
    imagem_url: item.json.imagem_url || item.json.image,
    tags: item.json.tags || [],
    fonte_url: item.json.fonte_url || item.json.link
  }
}));
```

### 5. Configurar HTTP Request para AISAM

1. Adicione o node **"HTTP Request"**
2. Configure:

| Campo | Valor |
|-------|-------|
| **Method** | POST |
| **URL** | `https://api.aisam.com.br/noticias/webhook/n8n` |
| **Authentication** | None |
| **Body Content Type** | JSON |

3. No campo **"Body"**, selecione **"JSON"** e mapeie os campos:

```json
{
  "titulo": "={{ $json.titulo }}",
  "resumo": "={{ $json.resumo }}",
  "conteudo": "={{ $json.conteudo }}",
  "imagem_url": "={{ $json.imagem_url }}",
  "fonte_url": "={{ $json.fonte_url }}",
  "tags": "={{ $json.tags }}"
}
```

### 6. Adicionar Tratamento de Erros (Opcional)

1. Adicione um node **"IF"** após o HTTP Request
2. Configure:
   - **Condition**: `{{ $json.statusCode }} === 201`
3. Na saída **TRUE**: Adicione node de log/sucesso
4. Na saída **FALSE**: Adicione node de notificação de erro

### 7. Salvar e Ativar

1. Click em **"Save"** (salvar workflow)
2. Toggle o switch para **"Active"** (ativar workflow)

### 8. Testar o Workflow

1. Click em **"Execute Workflow"** (botão de play)
2. Verifique a execução de cada node
3. Confira se a notícia foi criada no sistema AISAM

---

## Exemplos de Requisições

### Exemplo 1: Notícia Simples

```json
{
  "titulo": "AISAM Oferece 50 Novas Vagas de Emprego",
  "conteudo": "As empresas associadas à AISAM estão com 50 vagas abertas para diversas áreas. Acesse o portal e candidate-se!"
}
```

### Exemplo 2: Notícia com Imagem e Tags

```json
{
  "titulo": "Indústria 4.0: AISAM Promove Palestra Gratuita",
  "resumo": "Evento abordará transformação digital nas indústrias de São Roque",
  "conteudo": "A AISAM convida empresários e profissionais para palestra sobre Indústria 4.0, que acontecerá no dia 15/11 às 19h. Inscrições gratuitas pelo site.",
  "imagem_url": "https://aisam.com.br/images/palestra-industria-4.0.jpg",
  "tags": ["indústria 4.0", "tecnologia", "palestra", "transformação digital"],
  "fonte_url": "https://aisam.com.br/eventos/palestra-industria-4"
}
```

### Exemplo 3: Notícia Completa

```json
{
  "titulo": "AISAM Firma Parceria com SENAI para Capacitação Profissional",
  "resumo": "Acordo visa qualificar trabalhadores da região em áreas estratégicas da indústria",
  "conteudo": "A AISAM e o SENAI São Roque firmaram parceria estratégica para oferecer cursos de capacitação profissional aos trabalhadores das empresas associadas.\n\nSerão oferecidos cursos de:\n- Automação Industrial\n- Manutenção Mecânica\n- Gestão da Qualidade\n- Segurança do Trabalho\n\nAs inscrições começam em 10/11 e as vagas são limitadas. Empresas associadas têm desconto de 30%.",
  "imagem_url": "https://aisam.com.br/images/parceria-senai.jpg",
  "autor": "Assessoria de Imprensa AISAM",
  "fonte_url": "https://aisam.com.br/parceria-senai-2025",
  "tags": ["capacitação", "senai", "parceria", "educação profissional", "indústria"],
  "data_publicacao": "2025-11-02T08:00:00-03:00"
}
```

### Exemplo 4: Notícia de RSS Feed

```json
{
  "titulo": "Economia de São Roque Cresce 8% no Primeiro Semestre",
  "resumo": "Dados do IBGE mostram crescimento acima da média estadual",
  "conteudo": "São Roque registrou crescimento econômico de 8% no primeiro semestre de 2025, segundo dados do IBGE. O desempenho está acima da média do estado de São Paulo, que foi de 5,2%.\n\nO setor industrial foi o principal responsável pelo crescimento, puxado pelas empresas associadas à AISAM. O presidente da associação comemorou os números e destacou a importância dos investimentos em tecnologia e qualificação.",
  "imagem_url": "https://g1.globo.com/economia/image-sao-roque.jpg",
  "fonte_url": "https://g1.globo.com/sp/sorocaba-jundiai/noticia/economia-sao-roque-cresce.ghtml",
  "tags": ["economia", "são roque", "crescimento", "ibge"]
}
```

---

## Troubleshooting

### Problema 1: Erro 400 - Campos Obrigatórios

**Erro:**
```json
{
  "error": "Campos obrigatórios: titulo, conteudo"
}
```

**Solução:**
- Verifique se o JSON contém `titulo` e `conteudo`
- Verifique se os campos não estão vazios ou null
- Verifique a ortografia dos campos (são case-sensitive)

### Problema 2: Erro 500 - Internal Server Error

**Possíveis Causas:**
- Banco de dados não está acessível
- Erro na validação dos dados
- Problema na criação da notícia

**Solução:**
```bash
# Verificar logs do backend
cd backend
npm run dev:common

# Ou em produção (VPS)
pm2 logs backend --lines 50
```

### Problema 3: Webhook Não Recebe Dados no N8N

**Solução:**
1. Verifique se o workflow está **ativo** (toggle verde)
2. Verifique se a URL está correta (`https://api.aisam.com.br/noticias/webhook/n8n`)
3. Teste o endpoint manualmente com cURL primeiro
4. Verifique os logs de execução do N8N

### Problema 4: Notícia Criada mas Não Aparece no Site

**Verificações:**
1. Checar se a notícia foi criada:
```bash
curl https://api.aisam.com.br/noticias/publicadas
```

2. Verificar se o frontend está buscando notícias publicadas
3. Limpar cache do navegador
4. Verificar se não há filtros ativos (por tag, autor, etc.)

### Problema 5: CORS Error

**Erro:** `Access-Control-Allow-Origin`

**Solução:**
- Adicione o domínio do N8N (`fluxos.mindadapt.com.br`) às origens permitidas
- Em desenvolvimento, o CORS deve aceitar todas as origens
- Verifique a configuração CORS no backend

### Problema 6: Imagem Não Carrega

**Verificações:**
- URL da imagem é válida e acessível publicamente
- Formato da imagem é suportado (jpg, png, webp)
- Não há bloqueio CORS na origem da imagem
- Campo `imagem_url` está preenchido corretamente

### Problema 7: Tags Não Salvam

**Solução:**
- Tags devem ser enviadas como array de strings: `["tag1", "tag2"]`
- Não envie string única: `"tag1,tag2"` ❌
- Envie array vazio se não houver tags: `[]`

---

## Segurança e Boas Práticas

### Recomendações de Segurança

1. **Adicionar Autenticação (Futuro)**
   - Considere adicionar um token de autenticação no webhook
   - Exemplo: `?token=seu-token-secreto` ou header `X-Webhook-Token`

2. **Validação de Origem**
   - Adicionar IP whitelist para aceitar apenas requisições do N8N
   - Verificar User-Agent ou headers customizados

3. **Rate Limiting**
   - Limitar número de requisições por minuto/hora
   - Prevenir abuse ou ataques

4. **Monitoramento**
   - Configurar logs de todas as requisições ao webhook
   - Alertas para falhas consecutivas

### Exemplo de Implementação de Token (Futuro)

**Backend (noticias.routes.ts):**
```typescript
noticiasRoutes.post(
  "/webhook/n8n",
  (req, res, next) => {
    const token = req.query.token || req.headers['x-webhook-token'];
    if (token !== process.env.N8N_WEBHOOK_TOKEN) {
      return res.status(401).json({ error: "Token inválido" });
    }
    next();
  },
  webhookNoticiaController.handle
);
```

**N8N HTTP Request:**
```
URL: https://api.aisam.com.br/noticias/webhook/n8n?token=SEU_TOKEN_SECRETO
```

**Backend .env:**
```
N8N_WEBHOOK_TOKEN=token-super-secreto-gerado-com-crypto
```

---

## Checklist de Deployment

### Desenvolvimento
- [ ] Backend rodando em `http://localhost:3333`
- [ ] Banco de dados PostgreSQL acessível
- [ ] Teste com cURL local bem-sucedido
- [ ] Verificação no banco de dados ou API

### Produção
- [ ] Backend deployado na VPS
- [ ] Nginx configurado e rodando
- [ ] SSL/TLS ativo (https)
- [ ] DNS apontando para VPS (`api.aisam.com.br`)
- [ ] Firewall (UFW) liberando portas 80 e 443
- [ ] PM2 gerenciando o backend
- [ ] Teste com cURL produção bem-sucedido

### N8N
- [ ] Acesso ao N8N (`fluxos.mindadapt.com.br`)
- [ ] Workflow criado e configurado
- [ ] HTTP Request apontando para endpoint correto
- [ ] Mapeamento de campos correto
- [ ] Workflow ativado
- [ ] Teste de execução manual bem-sucedido
- [ ] Agendamento ou trigger configurado

---

## Recursos Adicionais

### Documentação de Referência
- [N8N Documentation](https://docs.n8n.io/)
- [N8N HTTP Request Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [N8N Webhook Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)

### Ferramentas de Teste
- [Postman](https://www.postman.com/) - Cliente HTTP para testes
- [Insomnia](https://insomnia.rest/) - Alternativa ao Postman
- [curl](https://curl.se/) - Linha de comando
- [HTTPie](https://httpie.io/) - CLI amigável para HTTP

### Monitoramento
- Logs do Backend: `pm2 logs backend`
- Logs do N8N: Painel de execuções do workflow
- Banco de dados: Consultar tabela `noticias.noticias` onde `fonte = 'n8n'`

---

## Contato e Suporte

Em caso de problemas ou dúvidas:

1. Verifique os logs do backend: `pm2 logs backend`
2. Verifique os logs de execução do N8N
3. Consulte este guia de troubleshooting
4. Revise a documentação do N8N

---

**Última atualização:** 02/11/2025
**Versão do Documento:** 1.0
**Autor:** Sistema AISAM
