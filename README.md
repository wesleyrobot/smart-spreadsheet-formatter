# 🚀 Smart Spreadsheet Formatter

Formatador inteligente de planilhas com ML/DL

## Stack

- **Frontend**: React + Vite + Handsontable + SheetJS
- **Backend**: FastAPI + Pandas + PostgreSQL
- **ML**: PyTorch + Sentence-Transformers + FAISS

## Instalação

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### ML Service
```bash
cd ml-service
pip install -r requirements.txt
python inference/serve.py
```

## Docker
```bash
docker-compose up --build
```

## Roadmap

- [x] Estrutura base
- [ ] Upload/visualização de planilhas
- [ ] Edição com Handsontable
- [ ] Transformações inteligentes
- [ ] ML embeddings e sugestões
- [ ] Predições e enriquecimento

## Autor

**Mr.Robot** - Desenvolvedor
