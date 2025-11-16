const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;
const BACKEND_PORT = process.env.BACKEND_PORT || 3333;

// Configurar CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// Proxy para a API (apenas para desenvolvimento local em produção)
// Em produção real na Kinghost + Railway, os frontends chamarão a API diretamente
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${BACKEND_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api do path
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({
      error: 'Erro ao conectar com o backend',
      message: err.message,
    });
  },
}));

// Servir Frontend Admin/Recrutador em /vagas
app.use('/vagas', express.static(path.join(__dirname, '..', 'frontend-app', 'dist'), {
  setHeaders: (res, filePath) => {
    // Cache para assets
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|webp|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// SPA routing para frontend-app
app.get('/vagas/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend-app', 'dist', 'index.html'));
});

// Servir Frontend Institucional na raiz
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist'), {
  setHeaders: (res, filePath) => {
    // Cache para assets
    if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|webp|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// SPA routing para frontend institucional
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'production' ? 'Ocorreu um erro' : err.message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🚀 AISAM - Sistema de Gestão de Vagas e Notícias 🚀      ║
║                                                               ║
║  Servidor Frontend em execução!                              ║
║                                                               ║
║  📍 URL Principal: http://localhost:${PORT}                      ║
║  📍 Painel Admin:  http://localhost:${PORT}/vagas                ║
║  📍 API Proxy:     http://localhost:${PORT}/api                  ║
║                                                               ║
║  Backend esperado em: http://localhost:${BACKEND_PORT}              ║
║                                                               ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});
