#!/bin/bash

echo "🧠 TURBINANDO IA PARA ESPECIALISTA EM PLANILHAS"
echo "================================================"

# ==================== BACKEND: AI ENGINE AVANÇADO ====================

cat > backend/app/ai_engine.py << 'EOF'
"""
Motor de IA Avançado para Processamento de Planilhas
NLP em Português + Aprendizado + Contexto
"""
import re
from typing import List, Dict, Any, Tuple, Optional
import json
from datetime import datetime

class SpreadsheetAI:
    def __init__(self):
        # Base de conhecimento de sinônimos e variações
        self.synonyms = {
            'criar': ['criar', 'adicionar', 'nova', 'novo', 'gerar', 'incluir', 'fazer'],
            'remover': ['remover', 'deletar', 'excluir', 'tirar', 'apagar', 'eliminar'],
            'separar': ['separar', 'dividir', 'quebrar', 'partir', 'split'],
            'limpar': ['limpar', 'formatar', 'padronizar', 'normalizar', 'arrumar'],
            'ordenar': ['ordenar', 'organizar', 'classificar', 'sort', 'sortear'],
            'filtrar': ['filtrar', 'selecionar', 'escolher', 'pegar'],
            'duplicatas': ['duplicatas', 'duplicados', 'repetidos', 'iguais'],
            'vazio': ['vazio', 'vazias', 'nulo', 'null', 'em branco', 'blank'],
            'maiuscula': ['maiúscula', 'maiusculo', 'upper', 'caps', 'caixa alta'],
            'minuscula': ['minúscula', 'minusculo', 'lower', 'caixa baixa'],
        }
        
        # Contexto da conversa
        self.context = {
            'last_columns_created': [],
            'last_operations': [],
            'user_patterns': {}
        }
        
        # Histórico para aprendizado
        self.command_history = []
    
    def normalize_command(self, command: str) -> str:
        """Normaliza comando removendo acentos e caracteres especiais"""
        command = command.lower().strip()
        replacements = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'â': 'a', 'ê': 'e', 'ô': 'o', 'ã': 'a', 'õ': 'o',
            'ç': 'c'
        }
        for old, new in replacements.items():
            command = command.replace(old, new)
        return command
    
    def extract_intent(self, command: str) -> Tuple[str, Dict[str, Any]]:
        """Extrai a intenção e parâmetros do comando"""
        normalized = self.normalize_command(command)
        params = {}
        
        # Detectar CRIAR COLUNA
        if any(syn in normalized for syn in self.synonyms['criar']):
            if 'coluna' in normalized:
                # Extrair nome da coluna
                match = re.search(r'(?:coluna|col)\s+([a-z_]+)', normalized)
                if match:
                    params['column_name'] = match.group(1).upper()
                
                # Extrair valor opcional
                match = re.search(r'(?:com|valor|=)\s+["\']?([^"\']+)["\']?', command)
                if match:
                    params['value'] = match.group(1).strip()
                
                return 'CREATE_COLUMN', params
        
        # Detectar SEPARAR
        if any(syn in normalized for syn in self.synonyms['separar']):
            if 'nome' in normalized:
                return 'SPLIT_NAME', {}
            if 'cnpj' in normalized or 'cpf' in normalized:
                return 'SPLIT_CNPJ', {}
        
        # Detectar LIMPAR
        if any(syn in normalized for syn in self.synonyms['limpar']):
            if 'cnpj' in normalized:
                return 'CLEAN_CNPJ', {}
            if 'email' in normalized:
                return 'CLEAN_EMAIL', {}
            if 'telefone' in normalized or 'fone' in normalized:
                return 'CLEAN_PHONE', {}
        
        # Detectar REMOVER
        if any(syn in normalized for syn in self.synonyms['remover']):
            if any(syn in normalized for syn in self.synonyms['duplicatas']):
                return 'REMOVE_DUPLICATES', {}
            if any(syn in normalized for syn in self.synonyms['vazio']):
                return 'REMOVE_EMPTY', {}
        
        # Detectar ORDENAR
        if any(syn in normalized for syn in self.synonyms['ordenar']):
            # Detectar coluna
            for word in normalized.split():
                if word not in self.synonyms['ordenar'] and len(word) > 2:
                    params['column'] = word
                    break
            
            # Detectar ordem
            if 'z-a' in normalized or 'decrescente' in normalized or 'desc' in normalized:
                params['ascending'] = False
            else:
                params['ascending'] = True
            
            return 'SORT', params
        
        # Detectar MAIÚSCULA
        if any(syn in normalized for syn in self.synonyms['maiuscula']):
            return 'TO_UPPER', {}
        
        # Detectar MINÚSCULA
        if any(syn in normalized for syn in self.synonyms['minuscula']):
            return 'TO_LOWER', {}
        
        # Detectar ADICIONAR DDD
        if 'ddd' in normalized:
            return 'ADD_DDD', {}
        
        # Detectar ADICIONAR DOMÍNIO
        if 'dominio' in normalized or 'domain' in normalized:
            return 'ADD_DOMAIN', {}
        
        return 'UNKNOWN', {}
    
    def suggest_corrections(self, command: str, columns: List[str]) -> List[str]:
        """Sugere correções para comandos não reconhecidos"""
        suggestions = []
        normalized = self.normalize_command(command)
        
        # Sugerir criar coluna se mencionou coluna
        if 'coluna' in normalized and 'criar' not in normalized:
            suggestions.append("Você quis dizer: 'Criar coluna NOME'?")
        
        # Sugerir separar se mencionou nome
        if 'nome' in normalized and 'separar' not in normalized:
            suggestions.append("Você quis separar nomes? Tente: 'Separar nome'")
        
        # Sugerir limpar se mencionou CNPJ
        if 'cnpj' in normalized and 'limpar' not in normalized:
            suggestions.append("Você quer limpar CNPJ? Tente: 'Limpar CNPJ'")
        
        return suggestions
    
    def learn_from_command(self, command: str, intent: str, success: bool):
        """Aprende com comandos executados"""
        self.command_history.append({
            'timestamp': datetime.now().isoformat(),
            'command': command,
            'intent': intent,
            'success': success
        })
        
        # Salvar padrões de sucesso
        if success:
            if intent not in self.context['user_patterns']:
                self.context['user_patterns'][intent] = []
            self.context['user_patterns'][intent].append(command)
    
    def get_smart_suggestions(self, columns: List[str], data_sample: List[Dict]) -> List[str]:
        """Gera sugestões inteligentes baseadas nos dados"""
        suggestions = []
        
        # Detectar se tem nome completo
        for col in columns:
            if 'nome' in col.lower() and data_sample:
                first_value = str(data_sample[0].get(col, ''))
                if ' ' in first_value:
                    suggestions.append(f"💡 Detectei nomes completos em '{col}'. Quer separar? → 'Separar nome'")
        
        # Detectar CNPJ bagunçado
        for col in columns:
            if 'cnpj' in col.lower() and data_sample:
                first_value = str(data_sample[0].get(col, ''))
                if '.' in first_value or '/' in first_value or '-' in first_value:
                    suggestions.append(f"💡 CNPJ em '{col}' tem formatação. Quer limpar? → 'Limpar CNPJ'")
        
        # Detectar telefones com DDD
        for col in columns:
            if 'telefone' in col.lower() and data_sample:
                first_value = str(data_sample[0].get(col, ''))
                if '(' in first_value:
                    suggestions.append(f"💡 Tem telefones em '{col}'. Quer extrair DDD? → 'Adicionar coluna com DDD'")
        
        # Detectar emails
        for col in columns:
            if 'email' in col.lower():
                suggestions.append(f"💡 Tem emails em '{col}'. Quer extrair domínios? → 'Adicionar coluna com domínio'")
        
        return suggestions[:3]  # Máximo 3 sugestões

# Instância global
ai_engine = SpreadsheetAI()
EOF

# ==================== BACKEND: ROTA ATUALIZADA ====================

cat > backend/app/api/routes/ai_commands.py << 'EOF'
from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import pandas as pd
import re
from app.ai_engine import ai_engine

router = APIRouter()

@router.post("/ai-command")
async def process_ai_command(payload: Dict[str, Any]):
    try:
        command = payload.get('command', '')
        data = payload.get('data', [])
        columns = payload.get('columns', [])
        
        if not data:
            return {"message": "Nenhum dado para processar", "data": None}
        
        df = pd.DataFrame(data)
        original_cols = list(df.columns)
        
        print(f"🧠 COMANDO: {command}")
        print(f"📊 DADOS: {len(df)} linhas, {len(df.columns)} colunas")
        
        # Extrair intenção usando IA
        intent, params = ai_engine.extract_intent(command)
        print(f"🎯 INTENÇÃO DETECTADA: {intent}")
        print(f"📋 PARÂMETROS: {params}")
        
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
                message = f"✅ Nomes separados em 'primeiro_nome' e 'ultimo_nome' de '{nome_col}'"
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
                message = f"✅ {validos} CNPJs limpos e formatados em '{cnpj_col}'"
            else:
                message = "❌ Coluna CNPJ não encontrada"
                success = False
        
        elif intent == 'REMOVE_DUPLICATES':
            antes = len(df)
            df = df.drop_duplicates()
            message = f"✅ {antes - len(df)} linhas duplicadas removidas. Restam {len(df)} linhas"
        
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
            phone_col = next((col for col in original_cols if any(word in col.lower() for word in ['telefone', 'phone', 'fone'])), None)
            if phone_col:
                def extract_ddd(phone):
                    if pd.isna(phone): return None
                    match = re.search(r'\(?(\d{2})\)?', str(phone))
                    return match.group(1) if match else None
                
                df['DDD'] = df[phone_col].apply(extract_ddd)
                valid = df['DDD'].notna().sum()
                message = f"✅ {valid} DDDs extraídos de '{phone_col}'"
            else:
                message = "❌ Coluna de telefone não encontrada"
                success = False
        
        elif intent == 'ADD_DOMAIN':
            email_col = next((col for col in original_cols if 'email' in col.lower()), None)
            if email_col:
                df['dominio'] = df[email_col].str.split('@').str[1]
                valid = df['dominio'].notna().sum()
                message = f"✅ {valid} domínios extraídos de '{email_col}'"
            else:
                message = "❌ Coluna de email não encontrada"
                success = False
        
        else:
            # Comando não reconhecido - sugerir correções
            suggestions = ai_engine.suggest_corrections(command, original_cols)
            if suggestions:
                message = "❓ Não entendi. " + " | ".join(suggestions)
            else:
                message = "❓ Comando não reconhecido. Use comandos como:\n• Criar coluna NOME\n• Separar nome\n• Limpar CNPJ\n• Adicionar DDD"
            success = False
            
            # Aprender com erro
            ai_engine.learn_from_command(command, intent, success)
            return {"message": message, "data": None}
        
        # Aprender com sucesso
        ai_engine.learn_from_command(command, intent, success)
        ai_engine.context['last_operations'].append(intent)
        
        # Limpar NaN
        df = df.replace({pd.NA: None, pd.NaT: None})
        df = df.where(pd.notna(df), None)
        
        new_cols = [col for col in df.columns if col not in original_cols]
        if new_cols:
            print(f"🎉 NOVAS COLUNAS: {new_cols}")
        
        print(f"✅ SUCESSO: {message}")
        
        return {
            "message": message,
            "data": df.to_dict('records')
        }
        
    except Exception as e:
        import traceback
        print(f"❌ ERRO: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggestions")
async def get_smart_suggestions(payload: Dict[str, Any]):
    """Endpoint para sugestões inteligentes"""
    try:
        data = payload.get('data', [])
        columns = payload.get('columns', [])
        
        if not data or not columns:
            return {"suggestions": []}
        
        suggestions = ai_engine.get_smart_suggestions(columns, data[:5])
        
        return {"suggestions": suggestions}
        
    except Exception as e:
        return {"suggestions": []}
EOF

touch backend/app/ai_engine.py

echo ""
echo "=========================================="
echo "✅ IA TURBINADA IMPLEMENTADA!"
echo "=========================================="
echo ""
echo "🧠 NLP Avançado em Português"
echo "🎯 Detecção Inteligente de Intenções"
echo "💡 Sugestões Automáticas"
echo "📚 Sistema de Aprendizado"
echo ""
echo "🔄 Reinicie o backend!"
echo "=========================================="
