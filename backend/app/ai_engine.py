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
