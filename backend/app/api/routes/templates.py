from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import pandas as pd
import re

router = APIRouter()

@router.post("/template")
async def apply_template(payload: Dict[str, Any]):
    try:
        template_id = payload.get('template_id')
        data = payload.get('data', [])
        columns = payload.get('columns', [])
        
        if not data:
            raise HTTPException(status_code=400, detail="Nenhum dado fornecido")
        
        df = pd.DataFrame(data)
        changes = []
        
        if template_id == 'normalize_contacts':
            # Normalizar contatos
            antes = len(df)
            
            # Remover duplicatas
            df = df.drop_duplicates()
            if len(df) < antes:
                changes.append(f"Removidas {antes - len(df)} duplicatas")
            
            # Limpar emails
            for col in df.columns:
                if 'email' in col.lower():
                    df[col] = df[col].str.lower().str.strip()
                    changes.append(f"Emails normalizados em '{col}'")
            
            # Padronizar nomes
            for col in df.columns:
                if 'nome' in col.lower() or 'name' in col.lower():
                    df[col] = df[col].str.title()
                    changes.append(f"Nomes padronizados em '{col}'")
        
        elif template_id == 'commercial_base':
            # Base comercial
            antes = len(df)
            
            # Limpar CNPJ
            for col in df.columns:
                if 'cnpj' in col.lower():
                    df[col] = df[col].str.replace(r'[^0-9]', '', regex=True)
                    changes.append(f"CNPJ limpo em '{col}'")
            
            # Padronizar empresas
            for col in df.columns:
                if 'empresa' in col.lower() or 'company' in col.lower():
                    df[col] = df[col].str.upper().str.strip()
                    changes.append(f"Empresas padronizadas em '{col}'")
            
            # Ordenar
            if 'empresa' in df.columns:
                df = df.sort_values('empresa')
                changes.append("Ordenado por empresa")
            
            # Remover duplicatas
            df = df.drop_duplicates()
            if len(df) < antes:
                changes.append(f"Removidas {antes - len(df)} duplicatas")
        
        elif template_id == 'powerbi_ready':
            # Preparar para Power BI
            antes = len(df)
            
            # Remover linhas vazias
            df = df.dropna(how='all')
            if len(df) < antes:
                changes.append(f"Removidas {antes - len(df)} linhas vazias")
            
            # Remover colunas totalmente vazias
            antes_cols = len(df.columns)
            df = df.dropna(axis=1, how='all')
            if len(df.columns) < antes_cols:
                changes.append(f"Removidas {antes_cols - len(df.columns)} colunas vazias")
            
            changes.append("Dados prontos para Power BI")
        
        elif template_id == 'clean_all':
            # Limpeza completa
            antes = len(df)
            
            # Remover linhas vazias
            df = df.dropna(how='all')
            changes.append(f"Removidas {antes - len(df)} linhas vazias")
            
            # Remover duplicatas
            antes = len(df)
            df = df.drop_duplicates()
            changes.append(f"Removidas {antes - len(df)} duplicatas")
            
            # Remover caracteres especiais
            for col in df.columns:
                if df[col].dtype == 'object':
                    df[col] = df[col].str.replace(r'[^a-zA-Z0-9\s@._-]', '', regex=True)
            changes.append("Caracteres especiais removidos")
        
        else:
            raise HTTPException(status_code=400, detail="Template não encontrado")
        
        # Substituir NaN
        df = df.replace({pd.NA: None, pd.NaT: None})
        df = df.where(pd.notna(df), None)
        
        return {
            "data": df.to_dict('records'),
            "changes": changes
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
