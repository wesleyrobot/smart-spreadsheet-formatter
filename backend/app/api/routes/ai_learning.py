from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.supabase_client import get_supabase
from supabase import Client
import re
from difflib import SequenceMatcher

router = APIRouter()

class LearnRequest(BaseModel):
    input_text: str
    user_name: str
    context: Optional[Dict[str, Any]] = None

class FeedbackRequest(BaseModel):
    conversation_id: int
    user_input: str
    ai_response: str
    feedback: str  # 'positive', 'negative', 'neutral'
    correction: Optional[str] = None

# ==================== FUNÇÕES DE APRENDIZADO ====================

def extrair_palavras_chave(texto: str) -> List[str]:
    """Extrai palavras-chave relevantes do texto"""
    # Remover pontuação e converter para minúsculas
    texto_limpo = re.sub(r'[^\w\s]', '', texto.lower())
    
    # Palavras a ignorar (stopwords português)
    stopwords = {
        'a', 'o', 'e', 'é', 'de', 'da', 'do', 'em', 'um', 'uma', 'os', 'as',
        'para', 'com', 'por', 'que', 'não', 'me', 'se', 'na', 'no', 'ao',
        'dos', 'das', 'mas', 'como', 'mais', 'já', 'eu', 'você', 'ele', 'ela'
    }
    
    palavras = [p for p in texto_limpo.split() if p not in stopwords and len(p) > 2]
    return palavras

def calcular_similaridade(texto1: str, texto2: str) -> float:
    """Calcula similaridade entre dois textos (0 a 1)"""
    return SequenceMatcher(None, texto1.lower(), texto2.lower()).ratio()

def detectar_intencao(texto: str, keywords: List[str]) -> str:
    """Detecta a intenção baseado no texto e palavras-chave"""
    texto_lower = texto.lower()
    
    # Mapeamento de intenções
    intencoes = {
        'saudacao': ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'hello'],
        'despedida': ['tchau', 'até', 'adeus', 'bye', 'xau'],
        'agradecimento': ['obrigado', 'obrigada', 'valeu', 'thanks'],
        'como_vai': ['tudo bem', 'como vai', 'como está', 'beleza'],
        'ajuda': ['ajuda', 'help', 'socorro', 'como', 'não sei'],
        'download': ['baixar', 'download', 'salvar', 'exportar'],
        'processar': ['processar', 'formatar', 'limpar', 'organizar'],
        'multione': ['multione', 'google contacts', 'contatos'],
        'comercial': ['comercial', 'empresa', 'negócio'],
        'analise': ['analisar', 'analisar', 'verificar', 'checar', 'dados']
    }
    
    for intencao, palavras in intencoes.items():
        for palavra in palavras:
            if palavra in texto_lower:
                return intencao
    
    return 'geral'

async def buscar_resposta_similar(
    supabase: Client,
    input_text: str,
    threshold: float = 0.7
) -> Optional[Dict[str, Any]]:
    """Busca resposta similar no conhecimento acumulado"""
    try:
        # Buscar todos os padrões aprendidos
        result = supabase.table('ai_learning')\
            .select('*')\
            .order('confidence', desc=True)\
            .limit(50)\
            .execute()
        
        if not result.data:
            return None
        
        # Encontrar a mais similar
        melhor_match = None
        melhor_score = 0
        
        for pattern in result.data:
            score = calcular_similaridade(input_text, pattern['input_text'])
            if score > threshold and score > melhor_score:
                melhor_score = score
                melhor_match = pattern
        
        return melhor_match
    except Exception as e:
        print(f"Erro ao buscar resposta similar: {e}")
        return None

async def aprender_interacao(
    supabase: Client,
    input_text: str,
    response: str,
    intent: str,
    keywords: List[str],
    context: Optional[Dict[str, Any]] = None
):
    """Salva interação no conhecimento"""
    try:
        data = {
            'input_text': input_text,
            'intent': intent,
            'response': response,
            'keywords': keywords,
            'context': context,
            'confidence': 0.7
        }
        
        supabase.table('ai_learning').insert(data).execute()
        
        # Atualizar vocabulário
        for palavra in keywords:
            result = supabase.table('ai_vocabulary')\
                .select('*')\
                .eq('word', palavra)\
                .execute()
            
            if result.data:
                # Incrementar frequência
                supabase.table('ai_vocabulary')\
                    .update({'frequency': result.data[0]['frequency'] + 1})\
                    .eq('word', palavra)\
                    .execute()
            else:
                # Adicionar nova palavra
                supabase.table('ai_vocabulary').insert({
                    'word': palavra,
                    'synonyms': [],
                    'related_intents': [intent],
                    'frequency': 1
                }).execute()
                
    except Exception as e:
        print(f"Erro ao aprender: {e}")

# ==================== ROTAS ====================

@router.post("/learn")
async def aprender(
    payload: LearnRequest,
    supabase: Client = Depends(get_supabase)
):
    """IA aprende e gera resposta inteligente"""
    try:
        input_text = payload.input_text
        user_name = payload.user_name
        
        # Extrair palavras-chave
        keywords = extrair_palavras_chave(input_text)
        
        # Detectar intenção
        intent = detectar_intencao(input_text, keywords)
        
        # Buscar resposta similar no conhecimento
        conhecimento = await buscar_resposta_similar(supabase, input_text)
        
        if conhecimento and conhecimento['confidence'] > 0.6:
            # Usar resposta aprendida
            response = conhecimento['response'].replace('[USER]', user_name)
            
            # Incrementar contador de sucesso
            supabase.table('ai_learning')\
                .update({'success_count': conhecimento['success_count'] + 1})\
                .eq('id', conhecimento['id'])\
                .execute()
            
            return {
                "response": response,
                "intent": intent,
                "confidence": conhecimento['confidence'],
                "learned": True
            }
        
        # Gerar resposta baseada na intenção
        respostas_por_intencao = {
            'saudacao': [
                f"Olá {user_name}! Como posso ajudar você hoje?",
                f"Oi {user_name}! Pronto para trabalhar com suas planilhas?",
                f"Bem-vindo {user_name}! O que você precisa?"
            ],
            'despedida': [
                f"Até logo {user_name}! Volte sempre.",
                f"Tchau {user_name}! Sua conversa foi salva.",
                f"Até mais {user_name}!"
            ],
            'agradecimento': [
                f"Por nada {user_name}! Sempre que precisar.",
                f"Disponha! Fico feliz em ajudar.",
                f"De nada! Estou aqui para isso."
            ],
            'como_vai': [
                f"Estou ótimo {user_name}! Pronto para processar dados. E você?",
                f"Tudo certo! Como posso ajudar?",
                f"Muito bem! O que você precisa hoje?"
            ],
            'ajuda': [
                f"Claro {user_name}! Posso ajudar com:\n• multione - Google Contacts\n• comercial - dados comerciais\n• baixar - downloads\n\nO que você precisa?",
                f"Estou aqui! Carregue uma planilha ou use os comandos rápidos.",
                f"Sem problemas! Me diga o que você quer fazer."
            ],
            'download': [
                f"Para baixar, você pode usar:\n• 'baixar' - Excel\n• 'baixar csv' - CSV\n• 'baixar zip' - Compactado",
                f"Pronto para download! Qual formato você prefere?",
                f"Posso preparar o download para você. Qual formato?"
            ],
            'geral': [
                f"Entendo {user_name}. Pode me dar mais detalhes sobre o que você precisa?",
                f"Interessante! Como posso ajudar com isso?",
                f"Estou processando... Pode explicar melhor?"
            ]
        }
        
        import random
        response = random.choice(respostas_por_intencao.get(intent, respostas_por_intencao['geral']))
        
        # Aprender esta interação
        await aprender_interacao(supabase, input_text, response, intent, keywords, payload.context)
        
        return {
            "response": response,
            "intent": intent,
            "confidence": 0.5,
            "learned": False
        }
        
    except Exception as e:
        return {
            "response": f"Desculpe {payload.user_name}, tive um problema. Pode tentar novamente?",
            "intent": "error",
            "confidence": 0,
            "error": str(e)
        }

@router.post("/feedback")
async def registrar_feedback(
    payload: FeedbackRequest,
    supabase: Client = Depends(get_supabase)
):
    """Registra feedback do usuário para melhorar"""
    try:
        # Salvar feedback
        supabase.table('ai_feedback').insert({
            'conversation_id': payload.conversation_id,
            'user_input': payload.user_input,
            'ai_response': payload.ai_response,
            'feedback': payload.feedback,
            'correction': payload.correction
        }).execute()
        
        # Se feedback negativo, reduzir confiança da resposta
        if payload.feedback == 'negative':
            keywords = extrair_palavras_chave(payload.user_input)
            intent = detectar_intencao(payload.user_input, keywords)
            
            # Buscar padrão correspondente
            result = supabase.table('ai_learning')\
                .select('*')\
                .eq('input_text', payload.user_input)\
                .execute()
            
            if result.data:
                pattern = result.data[0]
                nova_confidence = max(0.1, pattern['confidence'] - 0.1)
                
                supabase.table('ai_learning')\
                    .update({
                        'confidence': nova_confidence,
                        'fail_count': pattern['fail_count'] + 1
                    })\
                    .eq('id', pattern['id'])\
                    .execute()
        
        # Se feedback positivo, aumentar confiança
        elif payload.feedback == 'positive':
            result = supabase.table('ai_learning')\
                .select('*')\
                .eq('input_text', payload.user_input)\
                .execute()
            
            if result.data:
                pattern = result.data[0]
                nova_confidence = min(1.0, pattern['confidence'] + 0.1)
                
                supabase.table('ai_learning')\
                    .update({
                        'confidence': nova_confidence,
                        'success_count': pattern['success_count'] + 1
                    })\
                    .eq('id', pattern['id'])\
                    .execute()
        
        return {"message": "Feedback registrado com sucesso"}
        
    except Exception as e:
        return {"error": str(e)}

@router.get("/statistics")
async def estatisticas_aprendizado(
    supabase: Client = Depends(get_supabase)
):
    """Retorna estatísticas do aprendizado"""
    try:
        # Total de padrões aprendidos
        patterns = supabase.table('ai_learning').select('*').execute()
        
        # Vocabulário
        vocab = supabase.table('ai_vocabulary')\
            .select('*')\
            .order('frequency', desc=True)\
            .limit(10)\
            .execute()
        
        # Feedback
        feedback = supabase.table('ai_feedback').select('*').execute()
        
        return {
            "total_patterns": len(patterns.data) if patterns.data else 0,
            "vocabulary_size": len(vocab.data) if vocab.data else 0,
            "top_words": vocab.data if vocab.data else [],
            "total_feedback": len(feedback.data) if feedback.data else 0
        }
        
    except Exception as e:
        return {"error": str(e)}
