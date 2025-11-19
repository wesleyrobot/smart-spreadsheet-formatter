from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List

class ColumnEmbedder:
    def __init__(self, model_name='paraphrase-multilingual-mpnet-base-v2'):
        try:
            self.model = SentenceTransformer(model_name)
        except:
            print("Modelo não carregado. Instale: pip install sentence-transformers")
            self.model = None
    
    def embed(self, texts: List[str]) -> np.ndarray:
        if not self.model:
            return np.random.rand(len(texts), 768)
        return self.model.encode(texts)
    
    def similarity(self, text1: str, text2: str) -> float:
        emb1 = self.embed([text1])[0]
        emb2 = self.embed([text2])[0]
        return float(np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2)))
