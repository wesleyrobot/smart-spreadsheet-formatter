from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import pandas as pd
import re
from app.ai_engine import ai_engine
from app.excel_assistant import excel_assistant

router = APIRouter()

@router.post("/ai-command")
async def unified_ai_assistant(payload: Dict[str, Any]):
    """
    IA UNIFICADA - Responde perguntas Excel E executa comandos
    """
    try:
        command = payload.get('command', '')
        data = payload.get('data', [])
        columns = payload.get('columns', [])
        
        print(f"🧠 ENTRADA: {command}")
        
        # ==================== DETECTAR TIPO DE PERGUNTA ====================
        
        command_lower = command.lower()
        
        # Detectar se é PERGUNTA sobre Excel (palavras-chave)
        excel_keywords = ['como', 'qual', 'o que é', 'função', 'fórmula', 'formula', 
                         'excel', 'calcular', 'somar', 'média', 'concatenar', 
                         'extrair', 'localizar', 'procv', 'se(', 'help', 'ajuda']
        
        is_question = any(keyword in command_lower for keyword in excel_keywords)
        is_question = is_question or '?' in command
        
        # Se for pergunta sobre Excel
        if is_question and not data:
            print("📚 TIPO: Pergunta sobre Excel")
            
            # Buscar na base de conhecimento
            results = excel_assistant.search_function(command)
            
            if results:
                response = "📚 **Funções Excel encontradas:**\n\n"
                for r in results[:3]:  # Top 3
                    response += f"**{r['funcao']}**\n"
                    response += f"{r['descricao']}\n"
                    response += f"💡 Sintaxe: `{r['sintaxe']}`\n"
                    if r['exemplos']:
                        response += f"📌 Exemplo: `{r['exemplos'][0]}`\n"
                    response += "\n"
                
                # Sugerir uso prático se tiver dados
                if columns:
                    suggestion = excel_assistant.suggest_formula(command, columns)
                    if suggestion and suggestion.get('coluna_sugerida'):
                        formula = suggestion['formula_template'].replace('{col}', suggestion['coluna_sugerida'])
                        response += f"💡 **Para seus dados:**\n`{formula}`"
            else:
                response = "📚 Exemplos de perguntas:\n"
                response += "• Como fazer soma no Excel?\n"
                response += "• Qual função para concatenar textos?\n"
                response += "• Como extrair domínio de email?\n"
                response += "• Fórmula para primeiro nome\n"
                response += "• Como usar a função SE?"
            
            return {"message": response, "data": None, "type": "excel_help"}
        
        # ==================== EXECUTAR COMANDO DE TRANSFORMAÇÃO ====================
        
        if not data:
            return {
                "message": "📊 Por favor, carregue uma planilha primeiro!\n\nOu faça uma pergunta sobre Excel começando com 'Como...?'",
                "data": None,
                "type": "info"
            }
        
        print("⚙️ TIPO: Comando de transformação")
        
        df = pd.DataFrame(data)
        original_cols = list(df.columns)
        
        # Extrair intenção
        intent, params = ai_engine.extract_intent(command)
        print(f"🎯 INTENÇÃO: {intent} | PARAMS: {params}")
        
        message = ""
        success = True
        
        # ==================== EXECUTAR AÇÃO ====================
        
        if intent == 'CREATE_COLUMN':
            col_name = params.get('column_name', 'NOVA_COLUNA')
            value = params.get('value', None)
            df[col_name] = value
            message = f"✅ Coluna '{col_name}' criada{f' com valor \"{value}\"' if value else ' (vazia)'}"
            ai_engine.context['last_columns_created'].append(col_name)
        
        elif intent == 'SPLIT_NAME':
            nome_col = next((col for col in original_cols if 'nome' in col.lower() and 'empresa' not in col.lower()), None)
            if nome_col:
                def split_name(name):
                    if pd.isna(name): return None, None
                    parts = str(name).strip().split()
                    return (parts[0], ' '.join(parts[1:])) if len(parts) > 1 else (parts[0] if parts else None, None)
                
                df['primeiro_nome'] = df[nome_col].apply(lambda x: split_name(x)[0])
                df['ultimo_nome'] = df[nome_col].apply(lambda x: split_name(x)[1])
                message = f"✅ Nomes separados em 'primeiro_nome' e 'ultimo_nome'"
            else:
                message = "❌ Coluna de nome não encontrada"
                success = False
        
        elif intent == 'SPLIT_CNPJ':
            cnpj_col = next((col for col in original_cols if 'cnpj' in col.lower()), None)
            if cnpj_col:
                def extract_parts(cnpj):
                    nums = re.sub(r'[^0-9]', '', str(cnpj) if pd.notna(cnpj) else '')
                    if len(nums) == 14:
                        return nums[:8], nums[8:12], nums[12:14]
                    return nums or None, None, None
                
                df['cnpj_base'] = df[cnpj_col].apply(lambda x: extract_parts(x)[0])
                df['cnpj_filial'] = df[cnpj_col].apply(lambda x: extract_parts(x)[1])
                df['cnpj_dv'] = df[cnpj_col].apply(lambda x: extract_parts(x)[2])
                message = "✅ CNPJ separado em base, filial e DV"
            else:
                message = "❌ Coluna CNPJ não encontrada"
                success = False
        
        elif intent == 'CLEAN_CNPJ':
            cnpj_col = next((col for col in original_cols if 'cnpj' in col.lower()), None)
            if cnpj_col:
                def clean_cnpj(cnpj):
                    if pd.isna(cnpj): return None
                    nums = re.sub(r'[^0-9]', '', str(cnpj))
                    if len(nums) == 14:
                        return f"{nums[:2]}.{nums[2:5]}.{nums[5:8]}/{nums[8:12]}-{nums[12:14]}"
                    return nums or None
                
                df[cnpj_col] = df[cnpj_col].apply(clean_cnpj)
                validos = df[cnpj_col].notna().sum()
                message = f"✅ {validos} CNPJs limpos e formatados"
            else:
                message = "❌ Coluna CNPJ não encontrada"
                success = False
        
        elif intent == 'REMOVE_DUPLICATES':
            antes = len(df)
            df = df.drop_duplicates()
            message = f"✅ {antes - len(df)} duplicatas removidas. Restam {len(df)} linhas"
        
        elif intent == 'REMOVE_EMPTY':
            antes = len(df)
            df = df.dropna(how='all')
            message = f"✅ {antes - len(df)} linhas vazias removidas. Restam {len(df)} linhas"
        
        elif intent == 'SORT':
            col = params.get('column')
            asc = params.get('ascending', True)
            col_to_sort = next((c for c in original_cols if col in c.lower()), None)
            if col_to_sort:
                df = df.sort_values(col_to_sort, ascending=asc)
                message = f"✅ Ordenado por '{col_to_sort}' {'A-Z' if asc else 'Z-A'}"
            else:
                message = f"❌ Coluna '{col}' não encontrada"
                success = False
        
        elif intent == 'TO_UPPER':
            for col in df.columns:
                if df[col].dtype == 'object':
                    df[col] = df[col].str.upper()
            message = "✅ Textos convertidos para MAIÚSCULA"
        
        elif intent == 'TO_LOWER':
            for col in df.columns:
                if df[col].dtype == 'object':
                    df[col] = df[col].str.lower()
            message = "✅ Textos convertidos para minúscula"
        
        elif intent == 'ADD_DDD':
            phone_col = next((col for col in original_cols if any(w in col.lower() for w in ['telefone', 'phone', 'fone'])), None)
            if phone_col:
                def extract_ddd(phone):
                    if pd.isna(phone): return None
                    match = re.search(r'\(?(\d{2})\)?', str(phone))
                    return match.group(1) if match else None
                
                df['DDD'] = df[phone_col].apply(extract_ddd)
                valid = df['DDD'].notna().sum()
                message = f"✅ {valid} DDDs extraídos"
            else:
                message = "❌ Coluna de telefone não encontrada"
                success = False
        
        elif intent == 'ADD_DOMAIN':
            email_col = next((col for col in original_cols if 'email' in col.lower()), None)
            if email_col:
                df['dominio'] = df[email_col].str.split('@').str[1]
                valid = df['dominio'].notna().sum()
                message = f"✅ {valid} domínios extraídos"
            else:
                message = "❌ Coluna de email não encontrada"
                success = False
        
        else:
            # Tentar buscar no Excel primeiro
            results = excel_assistant.search_function(command)
            if results:
                response = "📚 Encontrei estas funções Excel:\n\n"
                for r in results[:2]:
                    response += f"**{r['funcao']}**: {r['descricao']}\n"
                    response += f"💡 `{r['sintaxe']}`\n\n"
                response += "Para executar um comando, use:\n"
                response += "• Criar coluna NOME\n• Separar nome\n• Limpar CNPJ"
                return {"message": response, "data": None, "type": "excel_help"}
            
            suggestions = ai_engine.suggest_corrections(command, original_cols)
            message = "❓ Não entendi. " + (suggestions[0] if suggestions else "Tente: 'Criar coluna STATUS' ou 'Como fazer soma?'")
            success = False
            ai_engine.learn_from_command(command, intent, success)
            return {"message": message, "data": None, "type": "error"}
        
        # Aprender
        ai_engine.learn_from_command(command, intent, success)
        
        # Limpar NaN
        df = df.replace({pd.NA: None, pd.NaT: None})
        df = df.where(pd.notna(df), None)
        
        new_cols = [col for col in df.columns if col not in original_cols]
        if new_cols:
            print(f"🎉 NOVAS COLUNAS: {new_cols}")
        
        print(f"✅ {message}")
        
        return {
            "message": message,
            "data": df.to_dict('records'),
            "type": "transform"
        }
        
    except Exception as e:
        import traceback
        print(f"❌ ERRO: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
