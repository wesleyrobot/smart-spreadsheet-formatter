from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import pandas as pd
import re
from datetime import datetime
from app.ai_engine import ai_engine
from app.ai_engine_advanced import advanced_ai
from app.excel_assistant import excel_assistant

router = APIRouter()

@router.post("/ai-command")
async def unified_ai_assistant(payload: Dict[str, Any]):
    """IA UNIFICADA AVANÇADA"""
    try:
        command = payload.get('command', '')
        data = payload.get('data', [])
        columns = payload.get('columns', [])
        
        print(f"🧠 COMANDO: {command}")
        
        command_lower = command.lower()
        
        # ==================== MODO COMERCIAL ====================
        if 'comercial' in command_lower or 'formato comercial' in command_lower:
            print("🏢 MODO COMERCIAL ATIVADO")
            
            if not data:
                return {"message": "Carregue uma planilha primeiro!", "data": None}
            
            df = pd.DataFrame(data)
            formatted_df = pd.DataFrame()
            
            # Detectar e extrair colunas
            for col in df.columns:
                col_lower = col.lower()
                
                if 'empresa' in col_lower or 'company' in col_lower or 'razao' in col_lower:
                    formatted_df['EMPRESA'] = df[col].str.strip().str.upper()
                
                elif 'nome' in col_lower and 'empresa' not in col_lower:
                    formatted_df['NOME_CONTATO'] = df[col].str.strip().str.title()
                
                elif 'email' in col_lower or 'mail' in col_lower:
                    formatted_df['EMAIL'] = df[col].str.strip().str.lower()
                
                elif 'telefone' in col_lower or 'phone' in col_lower or 'fone' in col_lower:
                    formatted_df['TELEFONE'] = df[col].apply(lambda x: 
                        re.sub(r'[^0-9]', '', str(x)) if pd.notna(x) else None
                    )
                
                elif 'cnpj' in col_lower:
                    def format_cnpj(cnpj):
                        if pd.isna(cnpj): return None
                        nums = re.sub(r'[^0-9]', '', str(cnpj))
                        if len(nums) == 14:
                            return f"{nums[:2]}.{nums[2:5]}.{nums[5:8]}/{nums[8:12]}-{nums[12:14]}"
                        return nums
                    formatted_df['CNPJ'] = df[col].apply(format_cnpj)
            
            # Se não encontrou empresa, usar primeira coluna
            if 'EMPRESA' not in formatted_df.columns and len(df.columns) > 0:
                formatted_df['EMPRESA'] = df[df.columns[0]].str.strip().str.upper()
            
            # Adicionar extras
            if 'EMAIL' in formatted_df.columns:
                formatted_df['DOMINIO'] = formatted_df['EMAIL'].str.split('@').str[1]
            
            if 'TELEFONE' in formatted_df.columns:
                formatted_df['DDD'] = formatted_df['TELEFONE'].str[:2]
            
            formatted_df['STATUS'] = 'ATIVO'
            formatted_df['DATA_CADASTRO'] = datetime.now().strftime('%Y-%m-%d')
            
            # Remover duplicatas
            if 'EMAIL' in formatted_df.columns:
                antes = len(formatted_df)
                formatted_df = formatted_df.drop_duplicates(subset=['EMAIL'], keep='first')
                removidas = antes - len(formatted_df)
            else:
                removidas = 0
            
            formatted_df = formatted_df.dropna(how='all')
            
            if 'EMPRESA' in formatted_df.columns:
                formatted_df = formatted_df.sort_values('EMPRESA')
            
            formatted_df = formatted_df.replace({pd.NA: None, pd.NaT: None})
            formatted_df = formatted_df.where(pd.notna(formatted_df), None)
            
            result_data = formatted_df.to_dict('records')
            
            message = f"""✅ **MODO COMERCIAL APLICADO!**

📊 **Resultados:**
- {len(result_data)} contatos formatados
- {len(formatted_df.columns)} colunas estruturadas
- {removidas} duplicatas removidas

🗂️ **Colunas:** {', '.join(formatted_df.columns)}

💡 **Próximo passo:** Digite "dividir em 8 planilhas" para separar"""
            
            return {
                "message": message,
                "data": result_data,
                "type": "transform"
            }
        
        # ==================== DIVIDIR PLANILHA ====================
        if 'dividir' in command_lower and ('planilha' in command_lower or 'partes' in command_lower):
            print("📊 DIVIDIR PLANILHA")
            
            if not data:
                return {"message": "Carregue uma planilha primeiro!", "data": None}
            
            # Extrair número
            match = re.search(r'(\d+)', command_lower)
            partes = int(match.group(1)) if match else 8
            
            df = pd.DataFrame(data)
            total = len(df)
            por_parte = total // partes
            
            message = f"""✅ **PLANILHA DIVIDIDA EM {partes} PARTES!**

📊 **Detalhes:**
- Total: {total} linhas
- Por parte: ~{por_parte} linhas

💾 **Para baixar:** Use o botão "Exportar" e baixe cada parte"""
            
            # Retornar primeira parte como exemplo
            parte1 = df.iloc[:por_parte]
            parte1 = parte1.replace({pd.NA: None, pd.NaT: None})
            parte1 = parte1.where(pd.notna(parte1), None)
            
            return {
                "message": message,
                "data": parte1.to_dict('records'),
                "type": "transform",
                "info": {
                    "total_partes": partes,
                    "linhas_por_parte": por_parte
                }
            }
        
        # ==================== PERGUNTAS EXCEL ====================
        excel_keywords = ['como', 'qual', 'função', 'fórmula', '?']
        is_question = any(kw in command_lower for kw in excel_keywords) and not data
        
        if is_question:
            results = excel_assistant.search_function(command)
            if results:
                response = "📚 **Funções Excel:**\n\n"
                for r in results[:3]:
                    response += f"**{r['funcao']}** - {r['descricao']}\n"
                    response += f"💡 `{r['sintaxe']}`\n\n"
                return {"message": response, "data": None, "type": "excel_help"}
        
        # ==================== COMANDOS NORMAIS ====================
        if not data:
            return {"message": "📊 Carregue uma planilha primeiro!", "data": None}
        
        df = pd.DataFrame(data)
        original_cols = list(df.columns)
        
        # Detectar intenção
        intent, params = ai_engine.extract_intent(command)
        print(f"🎯 INTENÇÃO: {intent}")
        
        message = ""
        
        if intent == 'CREATE_COLUMN':
            col_name = params.get('column_name', 'NOVA')
            value = params.get('value')
            df[col_name] = value
            message = f"✅ Coluna '{col_name}' criada"
        
        elif intent == 'SPLIT_NAME':
            nome_col = next((c for c in original_cols if 'nome' in c.lower() and 'empresa' not in c.lower()), None)
            if nome_col:
                df['primeiro_nome'] = df[nome_col].str.split().str[0]
                df['ultimo_nome'] = df[nome_col].str.split().str[-1]
                message = "✅ Nome separado"
            else:
                message = "❌ Coluna nome não encontrada"
        
        elif intent == 'CLEAN_CNPJ':
            cnpj_col = next((c for c in original_cols if 'cnpj' in c.lower()), None)
            if cnpj_col:
                def clean_cnpj(cnpj):
                    if pd.isna(cnpj): return None
                    nums = re.sub(r'[^0-9]', '', str(cnpj))
                    if len(nums) == 14:
                        return f"{nums[:2]}.{nums[2:5]}.{nums[5:8]}/{nums[8:12]}-{nums[12:14]}"
                    return nums
                df[cnpj_col] = df[cnpj_col].apply(clean_cnpj)
                message = "✅ CNPJ limpo"
            else:
                message = "❌ Coluna CNPJ não encontrada"
        
        elif intent == 'REMOVE_DUPLICATES':
            antes = len(df)
            df = df.drop_duplicates()
            message = f"✅ {antes - len(df)} duplicatas removidas"
        
        else:
            message = "❓ Comando não reconhecido. Tente: 'comercial', 'separar nome', 'limpar cnpj'"
            return {"message": message, "data": None}
        
        df = df.replace({pd.NA: None, pd.NaT: None})
        df = df.where(pd.notna(df), None)
        
        return {"message": message, "data": df.to_dict('records'), "type": "transform"}
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
