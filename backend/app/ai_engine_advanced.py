"""
Motor de IA AVANÇADO - Comandos Expandidos + Contexto Inteligente
"""
import re
from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime
import json

class AdvancedAI:
    def __init__(self):
        # Base de comandos expandida
        self.command_patterns = {
            # VALIDAÇÃO
            'validar_email': [
                r'valid[ao]r?\s+email',
                r'email.*v[aá]lid[oa]',
                r'check.*email',
                r'verificar.*email'
            ],
            'validar_cnpj': [
                r'valid[ao]r?\s+cnpj',
                r'cnpj.*v[aá]lid[oa]',
                r'check.*cnpj'
            ],
            'validar_telefone': [
                r'valid[ao]r?\s+telefone',
                r'telefone.*v[aá]lid[oa]',
                r'check.*telefone'
            ],
            
            # ANÁLISE
            'contar_vazios': [
                r'quant[oa]s?\s+vazi[oa]s?',
                r'contar.*vazi[oa]s?',
                r'count.*empty'
            ],
            'estatisticas': [
                r'estat[ií]sticas?',
                r'resumo\s+dos?\s+dados?',
                r'an[aá]lise.*dados?',
                r'stats'
            ],
            'detectar_duplicatas': [
                r'detect[ao]r?\s+duplicat[ao]s?',
                r'quais?\s+s[ãa]o.*duplicat[ao]s?',
                r'mostrar.*duplicat[ao]s?'
            ],
            
            # TRANSFORMAÇÃO AVANÇADA
            'preencher_vazios': [
                r'preencher.*vazi[oa]s?',
                r'substituir.*vazio',
                r'fill.*empty',
                r'completar.*vazio'
            ],
            'normalizar_texto': [
                r'normalizar.*texto',
                r'padronizar.*texto',
                r'limpar.*texto',
                r'normalize.*text'
            ],
            'remover_espacos': [
                r'remover.*espa[çc]os?',
                r'tirar.*espa[çc]os?',
                r'trim'
            ],
            'capitalizar': [
                r'capitalizar',
                r'primeira.*mai[uú]scula',
                r'title\s+case',
                r'proper'
            ],
            
            # DATAS
            'adicionar_data_hoje': [
                r'adicionar.*data.*hoje',
                r'coluna.*data.*atual',
                r'criar.*coluna.*hoje'
            ],
            'extrair_ano': [
                r'extrair.*ano',
                r'separar.*ano',
                r'get.*year'
            ],
            'extrair_mes': [
                r'extrair.*m[eê]s',
                r'separar.*m[eê]s',
                r'get.*month'
            ],
            'calcular_idade': [
                r'calcular.*idade',
                r'idade.*data',
                r'quantos.*anos'
            ],
            
            # CÁLCULOS
            'somar_coluna': [
                r'soma.*coluna',
                r'somar.*valores',
                r'total.*coluna',
                r'sum.*column'
            ],
            'media_coluna': [
                r'm[ée]dia.*coluna',
                r'average.*column',
                r'calcular.*m[ée]dia'
            ],
            'contar_valores': [
                r'contar.*valores',
                r'quantos.*valores',
                r'count.*values'
            ],
            
            # FILTROS
            'filtrar_por_valor': [
                r'filtrar.*(?:por|onde|com)?\s*(\w+)',
                r'mostrar.*(?:apenas|somente|s[oó])?\s*(\w+)',
                r'selecionar.*(\w+)'
            ],
            'remover_linhas_condicao': [
                r'remover.*(?:onde|com|linhas)?\s*(\w+)',
                r'deletar.*(?:onde|quando)?\s*(\w+)',
                r'excluir.*(\w+)'
            ],
            
            # FÓRMULAS EXCEL
            'aplicar_formula': [
                r'aplicar.*f[oó]rmula',
                r'criar.*f[oó]rmula',
                r'calcular.*usando'
            ],
            
            # MÚLTIPLAS COLUNAS
            'combinar_colunas': [
                r'combinar.*colunas?',
                r'juntar.*colunas?',
                r'unir.*colunas?',
                r'concat.*columns?'
            ],
            'duplicar_coluna': [
                r'duplicar.*coluna',
                r'copiar.*coluna',
                r'clonar.*coluna'
            ],
            'renomear_coluna': [
                r'renomear.*coluna',
                r'mudar.*nome.*coluna',
                r'rename.*column'
            ],
            
            # FORMATAÇÃO
            'formatar_moeda': [
                r'formatar.*(?:como\s+)?(?:moeda|dinheiro|real|r\$)',
                r'moeda',
                r'currency'
            ],
            'formatar_percentual': [
                r'formatar.*(?:como\s+)?percent',
                r'transformar.*percent',
                r'em\s+percent'
            ],
            'adicionar_prefixo': [
                r'adicionar.*prefixo',
                r'colocar.*antes',
                r'prefix'
            ],
            'adicionar_sufixo': [
                r'adicionar.*sufixo',
                r'colocar.*depois',
                r'suffix'
            ]
        }
        
        # Contexto da conversa
        self.context = {
            'last_command': None,
            'last_columns_modified': [],
            'last_intent': None,
            'conversation_history': [],
            'data_insights': {}
        }
    
    def detect_intent_advanced(self, command: str, columns: List[str], data_sample: List[Dict]) -> Tuple[str, Dict]:
        """Detecta intenção com contexto avançado"""
        cmd_lower = self.normalize(command)
        params = {}
        
        # Analisar dados para contexto
        self._analyze_data_context(columns, data_sample)
        
        # Tentar cada padrão
        for intent, patterns in self.command_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, cmd_lower)
                if match:
                    # Extrair parâmetros do match
                    if match.groups():
                        params['extracted'] = match.groups()
                    
                    # Detectar coluna mencionada
                    for col in columns:
                        if col.lower() in cmd_lower:
                            params['target_column'] = col
                            break
                    
                    # Adicionar ao contexto
                    self.context['last_intent'] = intent
                    self.context['conversation_history'].append({
                        'command': command,
                        'intent': intent,
                        'timestamp': datetime.now().isoformat()
                    })
                    
                    return intent, params
        
        # Se não encontrou, tentar sugerir
        suggestions = self._suggest_based_on_context(cmd_lower, columns)
        if suggestions:
            params['suggestions'] = suggestions
        
        return 'UNKNOWN', params
    
    def _analyze_data_context(self, columns: List[str], data_sample: List[Dict]):
        """Analisa dados para criar contexto inteligente"""
        if not data_sample:
            return
        
        insights = {}
        
        for col in columns:
            col_data = [row.get(col) for row in data_sample if row.get(col)]
            
            if col_data:
                # Detectar tipo predominante
                if all(isinstance(v, (int, float)) for v in col_data[:5] if v):
                    insights[col] = 'numeric'
                elif any('@' in str(v) for v in col_data[:5] if v):
                    insights[col] = 'email'
                elif any(str(v).replace('-','').replace('/','').replace('.','').isdigit() for v in col_data[:5] if v):
                    insights[col] = 'identifier'
                else:
                    insights[col] = 'text'
        
        self.context['data_insights'] = insights
    
    def _suggest_based_on_context(self, command: str, columns: List[str]) -> List[str]:
        """Sugere ações baseado no contexto"""
        suggestions = []
        
        # Se mencionou coluna específica
        for col in columns:
            if col.lower() in command:
                col_type = self.context['data_insights'].get(col, 'unknown')
                
                if col_type == 'email':
                    suggestions.append(f"Validar emails na coluna {col}?")
                    suggestions.append(f"Extrair domínio de {col}?")
                elif col_type == 'numeric':
                    suggestions.append(f"Calcular média de {col}?")
                    suggestions.append(f"Somar valores de {col}?")
                elif col_type == 'identifier':
                    suggestions.append(f"Validar formato de {col}?")
                    suggestions.append(f"Limpar {col}?")
        
        return suggestions[:3]
    
    def normalize(self, text: str) -> str:
        """Normaliza texto"""
        replacements = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'â': 'a', 'ê': 'e', 'ô': 'o', 'ã': 'a', 'õ': 'o',
            'ç': 'c'
        }
        text = text.lower()
        for old, new in replacements.items():
            text = text.replace(old, new)
        return text
    
    def get_smart_suggestions(self, columns: List[str], data_sample: List[Dict]) -> List[str]:
        """Gera sugestões inteligentes baseadas nos dados"""
        self._analyze_data_context(columns, data_sample)
        
        suggestions = []
        insights = self.context['data_insights']
        
        for col, col_type in insights.items():
            if col_type == 'email' and len(suggestions) < 5:
                suggestions.append(f"💡 Validar emails em '{col}'")
                suggestions.append(f"💡 Extrair domínio de '{col}'")
            
            if col_type == 'numeric' and len(suggestions) < 5:
                suggestions.append(f"💡 Calcular estatísticas de '{col}'")
            
            if 'nome' in col.lower() and len(suggestions) < 5:
                suggestions.append(f"💡 Separar '{col}' em partes")
            
            if 'cnpj' in col.lower() and len(suggestions) < 5:
                suggestions.append(f"💡 Validar e formatar '{col}'")
        
        return suggestions[:5]

# Instância global
advanced_ai = AdvancedAI()
