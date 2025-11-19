from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
import pandas as pd
from io import BytesIO

router = APIRouter()

@router.post("/upload")
async def upload_spreadsheet(file: UploadFile = File(...)):
    """Upload e processar planilha"""
    try:
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))
        
        return {
            "filename": file.filename,
            "rows": len(df),
            "columns": list(df.columns),
            "data": df.head(100).to_dict('records')
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro: {str(e)}")

@router.post("/transform")
async def transform_data(payload: Dict[str, Any]):
    """Aplicar transformações"""
    try:
        df = pd.DataFrame(payload['data'])
        # TODO: Aplicar transformações
        return {"success": True, "data": df.to_dict('records')}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
