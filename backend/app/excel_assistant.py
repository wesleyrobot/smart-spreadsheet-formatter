"""
Assistente Excel com Base de Conhecimento
"""
import json
import re
from typing import List, Dict, Tuple, Optional
from pathlib import Path

class ExcelAssistant:
    def __init__(self):
        # Carregar base de conhecimento
        knowledge_path = Path(__file__).parent / 'excel_knowledge.json'
        with open(knowledge_path, 'r', encoding='utf-8') as f:
            self.knowledge = json.load(f)
        
        # Criar índice invertido para busca rápida
        self.index = self._build_index()
    
    def _build_index(self) -> Dict[str, List[Tuple[str, str]]]:
        """Constrói índice invertido para busca"""
        index = {}
        
        for categoria, funcoes in self.knowledge.items():
            if categoria == 'dicas_avancadas':
                continue
            
            for func_name, func_data in funcoes.items():
                # Indexar por nome da função
                if func_name not in index:
                    index[func_name.lower()] = []
                index[func_name.lower()].append((categoria, func_name))
                
                # Indexar por palavras-chave em português
                if 'pt' in func_data:
                    for palavra in func_data['pt']:
                        if palavra not in index:
                            index[palavra.lower()] = []
                        index[palavra.lower()].append((categoria, func_name))
        
        return index
    
    def search_function(self, query: str) -> List[Dict]:
        """Busca funções baseado em query em português"""
        query_lower = query.lower()
        results = []
        
        # Remover acentos para busca mais flexível
        query_normalized = self._normalize(query_lower)
        
        for keyword, functions in self.index.items():
            keyword_norm = self._normalize(keyword)
            if keyword_norm in query_normalized or query_normalized in keyword_norm:
                for categoria, func_name in functions:
                    func_data = self.knowledge[categoria][func_name]
                    results.append({
                        'funcao': func_name,
                        'categoria': categoria,
                        'sintaxe': func_data.get('sintaxe', ''),
                        'descricao': func_data.get('descricao', ''),
                        'exemplos': func_data.get('exemplos', []),
                        'formula': func_data.get('formula', '')
                    })
        
        # Remover duplicatas
        seen = set()
        unique_results = []
        for r in results:
            key = r['funcao']
            if key not in seen:
                seen.add(key)
                unique_results.append(r)
        
        return unique_results[:5]  # Top 5 resultados
    
    def _normalize(self, text: str) -> str:
        """Remove acentos e normaliza texto"""
        replacements = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'â': 'a', 'ê': 'e', 'ô': 'o', 'ã': 'a', 'õ': 'o',
            'ç': 'c', 'ü': 'u'
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        return text
    
    def suggest_formula(self, intent: str, columns: List[str]) -> Optional[Dict]:
        """Sugere fórmula baseado na intenção"""
        intent_lower = intent.lower()
        
        # Detectar intenção e sugerir fórmula
        if 'dominio' in intent_lower or 'email' in intent_lower:
            return {
                'descricao': 'Extrair domínio do email',
                'formula_template': '=DIREITA({col}; NÚM.CARACT({col}) - LOCALIZAR("@"; {col}))',
                'coluna_sugerida': next((c for c in columns if 'email' in c.lower()), None)
            }
        
        elif 'ddd' in intent_lower:
            return {
                'descricao': 'Extrair DDD do telefone',
                'formula_template': '=EXT.TEXTO({col}; LOCALIZAR("("; {col})+1; 2)',
                'coluna_sugerida': next((c for c in columns if 'telefone' in c.lower()), None)
            }
        
        elif 'primeiro nome' in intent_lower:
            return {
                'descricao': 'Extrair primeiro nome',
                'formula_template': '=ESQUERDA({col}; LOCALIZAR(" "; {col})-1)',
                'coluna_sugerida': next((c for c in columns if 'nome' in c.lower()), None)
            }
        
        return None
    
    def explain_formula(self, formula: str) -> str:
        """Explica uma fórmula Excel"""
        explanation = []
        formula_upper = formula.upper()
        
        # Detectar funções na fórmula
        for categoria, funcoes in self.knowledge.items():
            if categoria == 'dicas_avancadas':
                continue
            for func_name, func_data in funcoes.items():
                if func_name in formula_upper:
                    explanation.append(f"• {func_name}: {func_data.get('descricao', '')}")
        
        if explanation:
            return "Essa fórmula usa:\n" + "\n".join(explanation)
        else:
            return "Não consegui identificar as funções nesta fórmula."
    
    def get_tips(self) -> List[str]:
        """Retorna dicas avançadas"""
        return self.knowledge.get('dicas_avancadas', [])

# Instância global
excel_assistant = ExcelAssistant()
