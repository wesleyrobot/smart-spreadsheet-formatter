# Quick Start

## Executar Localmente

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse: http://localhost:5173

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Acesse: http://localhost:8000/docs

### ML Service
```bash
cd ml-service
pip install -r requirements.txt
python inference/serve.py
```
Acesse: http://localhost:8001/docs

## Docker
```bash
docker-compose up --build
```
