#!/bin/bash

# Script para build de todos os frontends
# Uso: ./scripts/build-all.sh

set -e

echo "🚀 Iniciando build de todos os projetos..."

# Backend
echo ""
echo "📦 Building BACKEND..."
cd backend
npm run build
echo "✅ Backend build concluído!"

# Frontend institucional
echo ""
echo "📦 Building FRONTEND (institucional)..."
cd ../frontend
npm run build
echo "✅ Frontend build concluído!"

# Frontend-app (sistema vagas)
echo ""
echo "📦 Building FRONTEND-APP (sistema vagas)..."
cd ../frontend-app
npm run build
echo "✅ Frontend-app build concluído!"

cd ..
echo ""
echo "🎉 Todos os builds foram concluídos com sucesso!"
echo ""
echo "📂 Arquivos de deploy:"
echo "  - backend/dist/"
echo "  - frontend/dist/"
echo "  - frontend-app/dist/"
