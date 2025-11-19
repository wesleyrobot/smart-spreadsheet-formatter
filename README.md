# 🚀 Smart Spreadsheet Formatter

Formatador inteligente de planilhas com Machine Learning e Deep Learning.

![License](https://img.shields.io/github/license/wesleyrobot/smart-spreadsheet-formatter)
![Issues](https://img.shields.io/github/issues/wesleyrobot/smart-spreadsheet-formatter)
![Stars](https://img.shields.io/github/stars/wesleyrobot/smart-spreadsheet-formatter)

## ✨ Features

- 📊 **Editor de Planilhas Interativo** - Handsontable integrado
- 🔄 **Upload/Export** - Suporte para Excel (.xlsx) e CSV
- 🎯 **Seleção de Colunas** - Escolha quais colunas exportar
- 🤖 **ML/DL Insights** - Sugestões inteligentes via Machine Learning
- 🎨 **Interface Moderna** - Design glassmorphism com Tailwind CSS
- ⚡ **Performance** - FastAPI + React + Vite
- 🐳 **Docker Ready** - Deploy fácil com Docker Compose

## 🚀 Quick Start

### Instalação Rápida
```bash
# Clonar repositório
git clone https://github.com/wesleyrobot/smart-spreadsheet-formatter.git
cd smart-spreadsheet-formatter

# Com Docker (Recomendado)
docker-compose up --build

# OU Manual (3 terminais)
# Terminal 1 - Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev

# Terminal 3 - ML Service
cd ml-service && pip install -r requirements.txt && python3 inference/serve.py
```

### Acessar Aplicação

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **ML Service:** http://localhost:8001

## 📚 Documentação Completa

- **[Guia de Instalação](./SETUP.md)** - Instruções detalhadas de setup
- **[Guia de Contribuição](./CONTRIBUTING.md)** - Como contribuir
- **[Documentação da API](http://localhost:8000/docs)** - Swagger/OpenAPI

## 🛠️ Stack Tecnológica

### Frontend
- ⚛️ **React 18** - UI Library
- ⚡ **Vite** - Build Tool
- 🎨 **Tailwind CSS** - Styling
- 📊 **Handsontable** - Spreadsheet Editor
- 📄 **SheetJS** - Excel/CSV Processing

### Backend
- 🐍 **Python 3.11+**
- ⚡ **FastAPI** - Web Framework
- 🐼 **Pandas** - Data Processing
- 📊 **OpenPyXL** - Excel Handling
- 🗄️ **PostgreSQL** - Database
- 🔴 **Redis** - Cache/Queue

### ML Service
- 🤖 **PyTorch** - Deep Learning
- 🧠 **Sentence-Transformers** - Embeddings
- 📊 **Scikit-learn** - ML Algorithms
- 🔢 **NumPy** - Numerical Computing

## 📖 Como Usar

### 1. Upload de Planilha
- Clique em "Upload" ou arraste um arquivo
- Suporta: `.xlsx`, `.xls`, `.csv`

### 2. Editar Dados
- Edite células diretamente no Handsontable
- Use filtros e ordenação

### 3. Selecionar Colunas
- Marque as colunas desejadas
- Visualize estatísticas

### 4. Ver Insights ML
- Receba sugestões inteligentes
- Detecção automática de padrões

### 5. Exportar
- Clique em "Exportar"
- Baixe apenas as colunas selecionadas

## 📊 Estrutura do Projeto
```
smart-spreadsheet-formatter/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # APIs e utilitários
│   │   └── hooks/         # Custom hooks
│   └── package.json
├── backend/               # FastAPI
│   ├── app/
│   │   ├── api/          # Rotas
│   │   ├── services/     # Lógica de negócio
│   │   └── models/       # Modelos
│   └── requirements.txt
├── ml-service/           # Machine Learning
│   ├── inference/        # Serviço de predição
│   ├── training/         # Scripts de treino
│   └── embeddings/       # Geração de embeddings
├── docker-compose.yml
└── README.md
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para detalhes.

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add amazing feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Roadmap

- [x] Upload e visualização de planilhas
- [x] Edição com Handsontable
- [x] Seleção e export de colunas
- [x] Interface moderna com Tailwind
- [ ] ML embeddings funcionais
- [ ] Validações automáticas
- [ ] Transformações de dados
- [ ] Detecção de duplicatas
- [ ] Análise estatística avançada
- [ ] Suporte a mais formatos
- [ ] Histórico de alterações (Undo/Redo)
- [ ] Colaboração em tempo real
- [ ] Deploy automatizado

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Wesley Robot**
- GitHub: [@wesleyrobot](https://github.com/wesleyrobot)

## ⭐ Mostre seu Apoio

Se este projeto foi útil para você, considere dar uma ⭐!
