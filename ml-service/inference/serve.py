from fastapi import FastAPI
from typing import List
import sys
sys.path.append('..')
from embeddings.column_embedder import ColumnEmbedder

app = FastAPI(title="ML Service", version="0.1.0")
embedder = ColumnEmbedder()

@app.get("/")
async def root():
    return {"service": "ml-service", "status": "running"}

@app.post("/embed")
async def generate_embeddings(texts: List[str]):
    embeddings = embedder.embed(texts)
    return {"embeddings": embeddings.tolist()}

@app.post("/similarity")
async def calculate_similarity(text1: str, text2: str):
    score = embedder.similarity(text1, text2)
    return {"similarity": score}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
