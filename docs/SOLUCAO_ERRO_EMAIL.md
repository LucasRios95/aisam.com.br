# Solução para Erro de Autenticação SMTP

## Erro Atual
```
Invalid login: 535 5.7.8 Error: authentication failed: (reason unavailable)
```

Este erro indica que o servidor SMTP está rejeitando as credenciais fornecidas.

---

## ✅ Soluções Possíveis

### 1. **Verificar Credenciais de E-mail**

As credenciais no arquivo `.env` estão corretas?

```env
MAIL_HOST=smtp.aisam.com.br
MAIL_PORT=465
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=Ind@2025
MAIL_FROM=vagas@aisam.com.br
```

**Checklist:**
- [ ] O usuário `vagas@aisam.com.br` existe no painel do KingHost?
- [ ] A senha `Ind@2025` está correta?
- [ ] A conta de e-mail está ativa (não suspensa)?

---

### 2. **Testar Porta SMTP Diferente**

O KingHost geralmente usa:
- **Porta 587** com STARTTLS (recomendado)
- **Porta 465** com SSL

**Teste com porta 587:**

```env
MAIL_HOST=smtp.aisam.com.br
MAIL_PORT=587
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=Ind@2025
MAIL_FROM=vagas@aisam.com.br
```

---

### 3. **Usar Servidor SMTP da KingHost**

Algumas contas KingHost exigem o uso do servidor SMTP genérico:

```env
MAIL_HOST=smtp.kinghost.net
MAIL_PORT=587
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=Ind@2025
MAIL_FROM=vagas@aisam.com.br
```

**OU**

```env
MAIL_HOST=mail.aisam.com.br
MAIL_PORT=587
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=Ind@2025
MAIL_FROM=vagas@aisam.com.br
```

---

### 4. **Verificar Autenticação no Painel KingHost**

No painel da KingHost:

1. Acesse **E-mails > Contas de E-mail**
2. Verifique se a conta `vagas@aisam.com.br` existe
3. Se necessário, **redefina a senha** da conta
4. Verifique se há **restrições de autenticação SMTP**

---

### 5. **Testar com Gmail (Temporário)**

Para confirmar que o código está funcionando, teste com Gmail:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app  # Não é a senha normal!
MAIL_FROM=seu-email@gmail.com
```

**IMPORTANTE para Gmail:**
1. Habilite **Verificação em 2 etapas** na conta Google
2. Crie uma **Senha de App** em: https://myaccount.google.com/apppasswords
3. Use a senha de app (16 caracteres) no MAIL_PASS

---

### 6. **Verificar Configurações de Firewall**

Se estiver testando localmente:

- Seu provedor de internet pode estar bloqueando portas SMTP
- Teste com VPN ou em outro ambiente
- Verifique se o firewall do Windows permite conexões SMTP

---

### 7. **Logs de Diagnóstico**

Com as melhorias que fiz, ao reiniciar o backend você verá:

```
✅ Servidor SMTP pronto para enviar e-mails
```

**OU em caso de erro:**

```
❌ Erro na configuração SMTP: [detalhes do erro]
```

Isso ajuda a identificar o problema antes mesmo de tentar enviar e-mails.

---

## 🔧 Como Testar

### 1. Parar o Backend
```bash
# Pare o processo rodando em background
# (Pressione Ctrl+C no terminal onde está rodando)
```

### 2. Atualizar o `.env`

Edite o arquivo `backend/.env` com as novas configurações:

```env
# Teste 1: Porta 587
MAIL_PORT=587

# Teste 2: SMTP KingHost genérico
MAIL_HOST=smtp.kinghost.net

# Teste 3: SMTP alternativo
MAIL_HOST=mail.aisam.com.br
```

### 3. Reiniciar o Backend

```bash
cd backend
npm run dev
```

Observe os logs no startup para ver se a conexão SMTP foi estabelecida.

### 4. Testar Envio de E-mail

Tente enviar o link de acesso novamente ao candidato.

---

## 📋 Configurações Recomendadas para KingHost

Com base nas melhores práticas, recomendo:

```env
# Configuração 1 (Mais Comum)
MAIL_HOST=smtp.kinghost.net
MAIL_PORT=587
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=Ind@2025
MAIL_FROM=vagas@aisam.com.br
```

**OU**

```env
# Configuração 2 (Alternativa)
MAIL_HOST=mail.aisam.com.br
MAIL_PORT=587
MAIL_USER=vagas@aisam.com.br
MAIL_PASS=Ind@2025
MAIL_FROM=vagas@aisam.com.br
```

---

## 🆘 Se Nada Funcionar

### Entre em contato com o Suporte KingHost

Pergunte:
1. **Qual é o servidor SMTP correto** para minha conta?
2. **Qual porta** devo usar (587 ou 465)?
3. Há **restrições de autenticação SMTP** na minha conta?
4. A conta de e-mail `vagas@aisam.com.br` está **ativa e sem bloqueios**?

### Informações para o Suporte

- Domínio: `aisam.com.br`
- Conta de e-mail: `vagas@aisam.com.br`
- Erro: `535 5.7.8 Error: authentication failed`
- Portas testadas: 465, 587

---

## ✅ Checklist de Verificação

- [ ] Credenciais corretas no `.env`
- [ ] Conta de e-mail ativa no painel
- [ ] Senha sem caracteres especiais problemáticos
- [ ] Testado com porta 587
- [ ] Testado com porta 465
- [ ] Testado com `smtp.kinghost.net`
- [ ] Testado com `mail.aisam.com.br`
- [ ] Backend reiniciado após mudanças
- [ ] Logs verificados no startup
- [ ] Firewall/antivírus não bloqueando

---

## 🔍 Debug Avançado

Se quiser ver exatamente o que está acontecendo na comunicação SMTP:

1. O backend agora tem logs de debug habilitados em desenvolvimento
2. Você verá toda a comunicação SMTP no console
3. Isso ajuda a identificar em qual etapa a autenticação está falando

---

**Última atualização:** 02/11/2025
**Status:** Aguardando teste das configurações
