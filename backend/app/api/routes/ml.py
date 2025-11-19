from fastapi import APIRouter, HTTPException
from typing import Dict, Any

router = APIRouter()

@router.post("/suggestions")
async def get_suggestions(payload: Dict[str, Any]):
    """Obter sugestões de ML"""
    try:
        # TODO: Integrar com ML service
        suggestions = [
            {
                "title": "Coluna 'Email' detectada",
                "description": "Validar formato de emails"
            },
            {
                "title": "Valores faltantes",
                "description": "15% dos dados possuem valores nulos"
            }
        ]
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
