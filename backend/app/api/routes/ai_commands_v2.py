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
        
        # ==================== MODO MULTIONE (GOOGLE CONTACTS) ====================
        if 'multione' in command_lower:
            print("🎯 MODO MULTIONE ATIVADO")
            
            if not data:
                return {"message": "Carregue uma planilha primeiro!", "data": None}
            
            df = pd.DataFrame(data)
            
            print(f"📊 Colunas disponíveis: {list(df.columns)}")
            
            # Identificar colunas específicas do Google Contacts
            nome_col = None
            telefone_col = None
            
            # Procurar exatamente por "First Name" ou similar
            for col in df.columns:
                col_str = str(col).strip()
                if col_str == 'First Name' or 'First Name' in col_str:
                    nome_col = col
                    print(f"✅ Nome encontrado: {col}")
                elif 'Phone 1 - Value' in col_str or col_str == 'Phone 1 - Value':
                    telefone_col = col
                    print(f"✅ Telefone encontrado: {col}")
            
            # Fallback: procurar por padrões
            if not nome_col:
                for col in df.columns:
                    if 'name' in str(col).lower() and 'last' not in str(col).lower():
                        nome_col = col
                        break
            
            if not telefone_col:
                for col in df.columns:
                    if 'phone' in str(col).lower() or 'value' in str(col).lower():
                        if 'label' not in str(col).lower():
                            telefone_col = col
                            break
            
            if not nome_col or not telefone_col:
                return {
                    "message": f"❌ Não encontrei colunas de Nome e Telefone!\n\nColunas disponíveis:\n{', '.join(map(str, df.columns[:10]))}",
                    "data": None
                }
            
            print(f"📋 Usando: Nome='{nome_col}', Telefone='{telefone_col}'")
            
            # PASSO 1: Criar DataFrame limpo
            df_limpo = pd.DataFrame()
            df_limpo['Nome'] = df[nome_col].astype(str)
            df_limpo['Telefone'] = df[telefone_col].astype(str)
            
            # PASSO 2: LIMPEZA AVANÇADA DE NOMES
            def limpar_nome(nome):
                if pd.isna(nome) or str(nome).lower() in ['none', 'nan', '']:
                    return 'Contato'
                
                nome = str(nome)
                
                # Remover termos indesejados
                termos_remover = ['Mycontacts', 'myContacts', 'None', 'nan', '*', ':::']
                for termo in termos_remover:
                    nome = nome.replace(termo, '')
                
                # Remover emojis e caracteres especiais (mantém letras, espaços e acentos)
                # Remove: ✨, ~, _, números no início
                nome = re.sub(r'^[0-9\W_]+', '', nome)  # Remove números/símbolos no início
                nome = re.sub(r'[^\w\s\-áéíóúâêôãõàèìòùçÁÉÍÓÚÂÊÔÃÕÀÈÌÒÙÇ]', '', nome)  # Remove emojis
                
                # Remover números isolados ou códigos
                nome = re.sub(r'\b\d+\.?\d*\b', '', nome)  # Remove números isolados
                nome = re.sub(r'\d{4,}', '', nome)  # Remove sequências de 4+ dígitos
                
                # Limpar espaços múltiplos
                nome = re.sub(r'\s+', ' ', nome)
                nome = nome.strip()
                
                # Se ficou vazio ou muito curto
                if len(nome) < 2:
                    return 'Contato'
                
                # Se é só número
                if nome.isdigit():
                    return 'Contato'
                
                # Capitalizar corretamente
                nome = nome.title()
                
                return nome
            
            df_limpo['Nome'] = df_limpo['Nome'].apply(limpar_nome)
            
            # PASSO 3: Limpar e processar telefones
            def processar_telefone(telefone):
                if pd.isna(telefone) or str(telefone).lower() in ['none', 'nan', '']:
                    return None
                
                # Limpar - apenas números
                nums = re.sub(r'[^0-9]', '', str(telefone))
                
                if not nums or len(nums) < 8:
                    return None
                
                # Se já tem 55, não adicionar
                if nums.startswith('55'):
                    if len(nums) >= 12 and len(nums) <= 13:
                        return nums
                    if len(nums) > 13:
                        # Pegar primeiro número válido
                        nums = nums[:13]
                        return nums
                    return None
                else:
                    # Adicionar 55
                    nums = '55' + nums
                    if len(nums) >= 12 and len(nums) <= 13:
                        return nums
                    return None
            
            df_limpo['Telefone'] = df_limpo['Telefone'].apply(processar_telefone)
            
            # PASSO 4: Filtrar por tamanho (12-13 dígitos)
            df_limpo = df_limpo[df_limpo['Telefone'].notna()]
            df_limpo = df_limpo[df_limpo['Telefone'].str.len().between(12, 13)]
            
            # PASSO 5: Remover linhas sem telefone (nome pode ser "Contato")
            df_limpo = df_limpo[df_limpo['Telefone'].notna() & (df_limpo['Telefone'] != '')]
            
            # PASSO 6: Remover duplicatas de telefone
            df_limpo = df_limpo.drop_duplicates(subset=['Telefone'], keep='first')
            
            # PASSO 7: Contar quantos "Contato" temos
            contatos_genericos = (df_limpo['Nome'] == 'Contato').sum()
            
            df_limpo = df_limpo.reset_index(drop=True)
            
            total_contatos = len(df_limpo)
            
            df_limpo = df_limpo.replace({pd.NA: None, pd.NaT: None})
            df_limpo = df_limpo.where(pd.notna(df_limpo), None)
            
            message = f"""✅ **MODO MULTIONE APLICADO!**

📊 **Google Contacts processado:**
- {total_contatos} contatos válidos
- {contatos_genericos} sem nome (marcados como "Contato")
- Nomes limpos (sem emojis, números, caracteres especiais)
- Código 55 adicionado nos telefones
- Validados (12-13 dígitos)

📥 **Baixar:**
- "baixar csv" - Arquivo único
- "baixar dividido em 49" - Múltiplos arquivos"""
            
            return {
                "message": message,
                "data": df_limpo.to_dict('records'),
                "type": "transform"
            }
        
        # ==================== MODO COMERCIAL ====================
        if 'comercial' in command_lower:
            print("🏢 MODO COMERCIAL ATIVADO")
            
            if not data:
                return {"message": "Carregue uma planilha primeiro!", "data": None}
            
            df = pd.DataFrame(data)
            formatted_df = pd.DataFrame()
            
            for col in df.columns:
                col_lower = col.lower()
                
                if 'empresa' in col_lower or 'company' in col_lower:
                    formatted_df['EMPRESA'] = df[col].str.strip().str.upper()
                elif 'nome' in col_lower and 'empresa' not in col_lower:
                    formatted_df['NOME_CONTATO'] = df[col].str.strip().str.title()
                elif 'email' in col_lower or 'mail' in col_lower:
                    formatted_df['EMAIL'] = df[col].str.strip().str.lower()
                elif 'telefone' in col_lower or 'phone' in col_lower:
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
            
            if 'EMPRESA' not in formatted_df.columns and len(df.columns) > 0:
                formatted_df['EMPRESA'] = df[df.columns[0]].str.strip().str.upper()
            
            if 'EMAIL' in formatted_df.columns:
                formatted_df['DOMINIO'] = formatted_df['EMAIL'].str.split('@').str[1]
            
            if 'TELEFONE' in formatted_df.columns:
                formatted_df['DDD'] = formatted_df['TELEFONE'].str[:2]
            
            formatted_df['STATUS'] = 'ATIVO'
            formatted_df['DATA_CADASTRO'] = datetime.now().strftime('%Y-%m-%d')
            
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
- {len(result_data)} contatos
- {removidas} duplicatas removidas

💡 "baixar em 8 partes" para dividir"""
            
            return {
                "message": message,
                "data": result_data,
                "type": "transform"
            }
        
        if not data:
            return {"message": "📊 Carregue uma planilha!", "data": None}
        
        return {"message": "❓ Tente: 'multione', 'comercial', 'baixar'", "data": None}
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
