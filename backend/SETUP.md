# 🚀 Smart Spreadsheet Formatter - Guia de Instalação

Formatador inteligente de planilhas com Machine Learning e Deep Learning.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Clonando o Repositório](#clonando-o-repositório)
3. [Configuração do Backend](#configuração-do-backend)
4. [Configuração do Frontend](#configuração-do-frontend)
5. [Configuração do ML Service](#configuração-do-ml-service)
6. [Executando com Docker](#executando-com-docker)
7. [Variáveis de Ambiente](#variáveis-de-ambiente)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

### Software Necessário

- **Git** - [Download](https://git-scm.com/downloads)
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Python** (v3.11+) - [Download](https://www.python.org/)
- **Docker** (opcional) - [Download](https://www.docker.com/)

### Verificar Instalações
```bash
# Verificar Git
git --version

# Verificar Node.js
node --version
npm --version

# Verificar Python
python3 --version
pip3 --version
```

---

## 📦 Clonando o Repositório

### Método 1: HTTPS (Recomendado para iniciantes)
```bash
# Clonar o repositório
git clone https://github.com/wesleyrobot/smart-spreadsheet-formatter.git

# Entrar no diretório
cd smart-spreadsheet-formatter
```

### Método 2: SSH (Recomendado para desenvolvedores)
```bash
# Configurar SSH no GitHub primeiro
# https://docs.github.com/pt/authentication/connecting-to-github-with-ssh

# Clonar via SSH
git clone git@github.com:wesleyrobot/smart-spreadsheet-formatter.git

# Entrar no diretório
cd smart-spreadsheet-formatter
```

---

## 🐍 Configuração do Backend

### Instalação
```bash
# Navegar para o backend
cd backend

# Criar ambiente virtual (recomendado)
python3 -m venv venv

# Ativar ambiente virtual
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt
```

### Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env
nano .env
```

**Configuração mínima (.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/spreadsheet_db
REDIS_URL=redis://localhost:6379/0
ML_SERVICE_URL=http://localhost:8001
SECRET_KEY=sua-chave-secreta-aqui
```

### Executar Backend
```bash
# Certifique-se de estar na pasta backend
cd backend

# Ativar ambiente virtual (se não estiver ativo)
source venv/bin/activate

# Rodar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend estará disponível em:**
- API: http://localhost:8000
- Documentação: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## ⚛️ Configuração do Frontend

### Instalação
```bash
# Navegar para o frontend
cd frontend

# Instalar dependências
npm install
```

### Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env (opcional)
touch .env
```

**Configuração (.env):**
```env
VITE_API_URL=http://localhost:8000
```

### Executar Frontend
```bash
# Certifique-se de estar na pasta frontend
cd frontend

# Rodar servidor de desenvolvimento
npm run dev
```

**Frontend estará disponível em:**
- http://localhost:5173

### Build para Produção
```bash
# Gerar build otimizado
npm run build

# Testar build localmente
npm run preview
```

---

## 🤖 Configuração do ML Service

### Instalação
```bash
# Navegar para ml-service
cd ml-service

# Instalar dependências
pip3 install -r requirements.txt
```

### Executar ML Service
```bash
# Certifique-se de estar na pasta ml-service
cd ml-service

# Rodar servidor
python3 inference/serve.py
```

**ML Service estará disponível em:**
- http://localhost:8001
- Documentação: http://localhost:8001/docs

---

## 🐳 Executando com Docker

### Pré-requisitos Docker

- Docker instalado e rodando
- Docker Compose instalado

### Iniciar Todos os Serviços
```bash
# Na raiz do projeto
docker-compose up --build
```

### Serviços Disponíveis

| Serviço    | URL                          | Descrição           |
|------------|------------------------------|---------------------|
| Frontend   | http://localhost:5173        | Interface React     |
| Backend    | http://localhost:8000        | API FastAPI         |
| ML Service | http://localhost:8001        | Serviço de ML       |
| PostgreSQL | localhost:5432               | Banco de dados      |
| Redis      | localhost:6379               | Cache/Queue         |

### Comandos Úteis Docker
```bash
# Parar todos os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild específico
docker-compose up --build backend

# Limpar tudo
docker-compose down -v
```

---

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/spreadsheet_db

# Redis
REDIS_URL=redis://localhost:6379/0

# ML Service
ML_SERVICE_URL=http://localhost:8001

# Segurança
SECRET_KEY=sua-chave-secreta-muito-segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Ambiente
ENVIRONMENT=development
DEBUG=True
```

### Frontend (.env)
```env
# API
VITE_API_URL=http://localhost:8000

# Features
VITE_ENABLE_ML=true
VITE_MAX_FILE_SIZE=52428800

# Analytics (opcional)
VITE_GA_ID=sua-google-analytics-id
```

---

## 🛠️ Troubleshooting

### Problema: Porta já em uso
```bash
# Linux/Mac - Encontrar processo usando a porta
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows - Encontrar e matar processo
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Problema: Dependências não instaladas
```bash
# Backend - Reinstalar dependências
cd backend
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall

# Frontend - Limpar e reinstalar
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problema: Erro de permissão (Linux/WSL)
```bash
# Dar permissões
chmod -R 755 ~/smart-spreadsheet-formatter

# Se precisar usar pip globalmente
pip3 install --break-system-packages -r requirements.txt
```

### Problema: Tailwind CSS não funciona
```bash
cd frontend

# Verificar se index.css está importado
grep "index.css" src/main.jsx

# Se não estiver, adicionar
echo "import './index.css'" >> src/main.jsx

# Reinstalar Tailwind
npm install -D tailwindcss@latest postcss autoprefixer
```

### Problema: Handsontable erro de destroy

**Solução:** Já corrigido no código. Se persistir:
```bash
cd frontend
npm install handsontable@latest @handsontable/react@latest
```

### Problema: Docker não inicia
```bash
# Verificar se Docker está rodando
docker ps

# Reiniciar Docker
# Windows: Restart Docker Desktop
# Linux: sudo systemctl restart docker

# Limpar containers e volumes antigos
docker-compose down -v
docker system prune -a
```

### Problema: Erro de I/O no WSL
```bash
# Reiniciar WSL (Windows PowerShell como Admin)
wsl --shutdown
wsl

# Mover projeto para home (evitar System32)
mv /mnt/c/Windows/System32/projeto ~/projeto
```

---

## 📱 Executando em Modo de Desenvolvimento

### Opção 1: Três Terminais Separados

**Terminal 1 - Backend:**
```bash
cd ~/smart-spreadsheet-formatter/backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd ~/smart-spreadsheet-formatter/frontend
npm run dev
```

**Terminal 3 - ML Service:**
```bash
cd ~/smart-spreadsheet-formatter/ml-service
python3 inference/serve.py
```

### Opção 2: Docker Compose (Tudo junto)
```bash
cd ~/smart-spreadsheet-formatter
docker-compose up
```

---

## 🚀 Deploy em Produção

### Frontend - Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend - Railway
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login e deploy
railway login
railway init
railway up
```

### Documentação Completa de Deploy

Consulte [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções detalhadas.

---

## 📚 Recursos Adicionais

- **Documentação da API:** http://localhost:8000/docs
- **GitHub Issues:** https://github.com/wesleyrobot/smart-spreadsheet-formatter/issues
- **Contribuir:** Veja [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 👨‍💻 Autor

**Wesley Robot**
- GitHub: [@wesleyrobot](https://github.com/wesleyrobot)

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](./LICENSE) para mais detalhes.
