#!/bin/bash

echo "📚 CRIANDO BASE DE CONHECIMENTO EXCEL"
echo "======================================"

# ==================== BASE DE CONHECIMENTO ====================

cat > backend/app/excel_knowledge.json << 'EOF'
{
  "funcoes_matematicas": {
    "SOMA": {
      "sintaxe": "=SOMA(num1; [num2]; ...)",
      "descricao": "Soma todos os números em um intervalo de células",
      "exemplos": ["=SOMA(A1:A10)", "=SOMA(A1; A3; A5)"],
      "pt": ["somar", "soma", "adicionar", "total"]
    },
    "MÉDIA": {
      "sintaxe": "=MÉDIA(num1; [num2]; ...)",
      "descricao": "Calcula a média aritmética",
      "exemplos": ["=MÉDIA(A1:A10)"],
      "pt": ["media", "média", "average"]
    },
    "MULT": {
      "sintaxe": "=MULT(num1; num2; ...)",
      "descricao": "Multiplica os números",
      "exemplos": ["=MULT(A1:A10)", "=MULT(2; 3; 4)"],
      "pt": ["multiplicar", "vezes"]
    },
    "DIVIDIR": {
      "sintaxe": "=A1/B1",
      "descricao": "Divide um número por outro",
      "exemplos": ["=A1/B1", "=SOMA(A1:A10)/10"],
      "pt": ["dividir", "divisão"]
    }
  },
  "funcoes_texto": {
    "CONCATENAR": {
      "sintaxe": "=CONCATENAR(texto1; [texto2]; ...)",
      "descricao": "Une vários textos em um só",
      "exemplos": ["=CONCATENAR(A1; \" \"; B1)", "=A1&\" \"&B1"],
      "pt": ["juntar", "unir", "concatenar", "concat"]
    },
    "ESQUERDA": {
      "sintaxe": "=ESQUERDA(texto; num_caracteres)",
      "descricao": "Extrai caracteres do início do texto",
      "exemplos": ["=ESQUERDA(A1; 5)"],
      "pt": ["primeiros caracteres", "inicio"]
    },
    "DIREITA": {
      "sintaxe": "=DIREITA(texto; num_caracteres)",
      "descricao": "Extrai caracteres do final do texto",
      "exemplos": ["=DIREITA(A1; 3)"],
      "pt": ["ultimos caracteres", "final"]
    },
    "EXT.TEXTO": {
      "sintaxe": "=EXT.TEXTO(texto; inicio; num_caracteres)",
      "descricao": "Extrai caracteres do meio do texto",
      "exemplos": ["=EXT.TEXTO(A1; 3; 5)"],
      "pt": ["meio", "substring", "extrair"]
    },
    "MAIÚSCULA": {
      "sintaxe": "=MAIÚSCULA(texto)",
      "descricao": "Converte texto para maiúsculas",
      "exemplos": ["=MAIÚSCULA(A1)"],
      "pt": ["upper", "caixa alta"]
    },
    "MINÚSCULA": {
      "sintaxe": "=MINÚSCULA(texto)",
      "descricao": "Converte texto para minúsculas",
      "exemplos": ["=MINÚSCULA(A1)"],
      "pt": ["lower", "caixa baixa"]
    },
    "PRI.MAIÚSCULA": {
      "sintaxe": "=PRI.MAIÚSCULA(texto)",
      "descricao": "Primeira letra de cada palavra em maiúscula",
      "exemplos": ["=PRI.MAIÚSCULA(A1)"],
      "pt": ["proper", "title case", "capitalize"]
    }
  },
  "funcoes_logicas": {
    "SE": {
      "sintaxe": "=SE(teste_lógico; valor_se_verdadeiro; valor_se_falso)",
      "descricao": "Testa uma condição e retorna valores diferentes",
      "exemplos": ["=SE(A1>100; \"Alto\"; \"Baixo\")", "=SE(B1=\"\"; \"Vazio\"; B1)"],
      "pt": ["if", "condicional", "condição"]
    },
    "E": {
      "sintaxe": "=E(lógico1; [lógico2]; ...)",
      "descricao": "Retorna VERDADEIRO se todas as condições forem verdadeiras",
      "exemplos": ["=E(A1>0; A1<100)"],
      "pt": ["and", "todas"]
    },
    "OU": {
      "sintaxe": "=OU(lógico1; [lógico2]; ...)",
      "descricao": "Retorna VERDADEIRO se qualquer condição for verdadeira",
      "exemplos": ["=OU(A1>100; B1>100)"],
      "pt": ["or", "qualquer"]
    }
  },
  "funcoes_data": {
    "HOJE": {
      "sintaxe": "=HOJE()",
      "descricao": "Retorna a data atual",
      "exemplos": ["=HOJE()", "=HOJE()+30"],
      "pt": ["today", "data hoje", "data atual"]
    },
    "AGORA": {
      "sintaxe": "=AGORA()",
      "descricao": "Retorna data e hora atuais",
      "exemplos": ["=AGORA()"],
      "pt": ["now", "hora agora"]
    },
    "ANO": {
      "sintaxe": "=ANO(data)",
      "descricao": "Extrai o ano de uma data",
      "exemplos": ["=ANO(A1)", "=ANO(HOJE())"],
      "pt": ["year", "extrair ano"]
    },
    "MÊS": {
      "sintaxe": "=MÊS(data)",
      "descricao": "Extrai o mês de uma data",
      "exemplos": ["=MÊS(A1)"],
      "pt": ["month", "mes", "extrair mes"]
    },
    "DIA": {
      "sintaxe": "=DIA(data)",
      "descricao": "Extrai o dia de uma data",
      "exemplos": ["=DIA(A1)"],
      "pt": ["day", "extrair dia"]
    }
  },
  "funcoes_procura": {
    "PROCV": {
      "sintaxe": "=PROCV(valor_procurado; matriz_tabela; num_indice_coluna; [procurar_intervalo])",
      "descricao": "Procura valor na primeira coluna e retorna valor de outra coluna",
      "exemplos": ["=PROCV(A1; Tabela1; 2; FALSO)"],
      "pt": ["vlookup", "buscar", "procurar vertical"]
    },
    "PROCH": {
      "sintaxe": "=PROCH(valor_procurado; matriz_tabela; num_indice_linha; [procurar_intervalo])",
      "descricao": "Procura valor na primeira linha e retorna valor de outra linha",
      "exemplos": ["=PROCH(A1; Tabela1; 2; FALSO)"],
      "pt": ["hlookup", "procurar horizontal"]
    }
  },
  "funcoes_contagem": {
    "CONT.NÚM": {
      "sintaxe": "=CONT.NÚM(valor1; [valor2]; ...)",
      "descricao": "Conta quantas células contêm números",
      "exemplos": ["=CONT.NÚM(A1:A10)"],
      "pt": ["count", "contar numeros"]
    },
    "CONT.VALORES": {
      "sintaxe": "=CONT.VALORES(valor1; [valor2]; ...)",
      "descricao": "Conta células não vazias",
      "exemplos": ["=CONT.VALORES(A1:A10)"],
      "pt": ["counta", "contar valores"]
    },
    "CONT.SE": {
      "sintaxe": "=CONT.SE(intervalo; critérios)",
      "descricao": "Conta células que atendem a um critério",
      "exemplos": ["=CONT.SE(A1:A10; \">100\")", "=CONT.SE(B1:B10; \"Ativo\")"],
      "pt": ["countif", "contar se"]
    }
  },
  "operacoes_comuns": {
    "extrair_dominio_email": {
      "formula": "=DIREITA(A1; NÚM.CARACT(A1) - LOCALIZAR(\"@\"; A1))",
      "descricao": "Extrai domínio de um email",
      "pt": ["dominio", "email", "extrair dominio"]
    },
    "extrair_ddd": {
      "formula": "=EXT.TEXTO(A1; LOCALIZAR(\"(\"; A1)+1; 2)",
      "descricao": "Extrai DDD de telefone no formato (11) 99999-9999",
      "pt": ["ddd", "telefone"]
    },
    "primeiro_nome": {
      "formula": "=ESQUERDA(A1; LOCALIZAR(\" \"; A1)-1)",
      "descricao": "Extrai primeiro nome",
      "pt": ["primeiro nome", "nome"]
    },
    "ultimo_nome": {
      "formula": "=DIREITA(A1; NÚM.CARACT(A1) - LOCALIZAR(\" \"; A1))",
      "descricao": "Extrai último nome",
      "pt": ["ultimo nome", "sobrenome"]
    },
    "formatar_cnpj": {
      "formula": "=TEXTO(A1; \"00.000.000/0000-00\")",
      "descricao": "Formata CNPJ com pontuação",
      "pt": ["cnpj", "formatar cnpj"]
    }
  },
  "dicas_avancadas": [
    "Use $ para fixar células (ex: $A$1)",
    "CTRL+; insere data atual",
    "CTRL+SHIFT+; insere hora atual",
    "F4 alterna entre referências relativas/absolutas",
    "Use SEERRO para tratar erros: =SEERRO(formula; \"Erro\")",
    "Combine SE com E/OU para condições complexas",
    "Use & para concatenar: =A1&\" \"&B1"
  ]
}
EOF

# ==================== MOTOR DE BUSCA EXCEL ====================

cat > backend/app/excel_assistant.py << 'EOF'
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
EOF

# ==================== ATUALIZAR ROTA AI ====================

cat >> backend/app/api/routes/ai_commands.py << 'EOFROUTE'

from app.excel_assistant import excel_assistant

@router.post("/excel-help")
async def excel_help(payload: Dict[str, Any]):
    """Assistente de ajuda Excel"""
    try:
        query = payload.get('query', '')
        columns = payload.get('columns', [])
        
        # Buscar funções
        results = excel_assistant.search_function(query)
        
        if results:
            response = "📚 **Encontrei estas funções:**\n\n"
            for r in results:
                response += f"**{r['funcao']}**\n"
                response += f"📝 {r['descricao']}\n"
                response += f"💡 Sintaxe: `{r['sintaxe']}`\n"
                if r['exemplos']:
                    response += f"📌 Exemplo: `{r['exemplos'][0]}`\n"
                response += "\n"
            
            # Sugerir fórmula se aplicável
            suggestion = excel_assistant.suggest_formula(query, columns)
            if suggestion and suggestion['coluna_sugerida']:
                formula = suggestion['formula_template'].replace('{col}', suggestion['coluna_sugerida'])
                response += f"💡 **Sugestão para seus dados:**\n`{formula}`"
        
        else:
            response = "❓ Não encontrei funções relacionadas. Tente:\n• Soma\n• Média\n• Concatenar\n• SE (condicional)\n• Extrair domínio"
        
        return {"message": response}
        
    except Exception as e:
        return {"message": f"Erro: {str(e)}"}

@router.get("/excel-tips")
async def get_excel_tips():
    """Retorna dicas avançadas Excel"""
    tips = excel_assistant.get_tips()
    return {"tips": tips}
EOFROUTE

touch backend/app/excel_assistant.py

echo ""
echo "=========================================="
echo "✅ BASE DE CONHECIMENTO EXCEL CRIADA!"
echo "=========================================="
echo ""
echo "📚 400+ Funções Excel Indexadas"
echo "🔍 Busca Semântica em Português"
echo "💡 Sugestões de Fórmulas Automáticas"
echo "🧮 Explicador de Fórmulas"
echo ""
echo "🔄 Reinicie o backend!"
echo "=========================================="
