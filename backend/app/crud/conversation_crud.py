from supabase import Client
from typing import List, Dict, Any, Optional
from datetime import datetime

# ==================== CONVERSAS ====================

async def create_conversation(
    supabase: Client,
    name: str,
    user_name: str,
    description: Optional[str] = None,
    user_id: str = 'anonymous',
    project_id: Optional[int] = None
) -> Dict[str, Any]:
    """Criar nova conversa"""
    data = {
        'name': name,
        'user_name': user_name,
        'description': description,
        'user_id': user_id,
        'project_id': project_id
    }
    
    result = supabase.table('conversations').insert(data).execute()
    return result.data[0] if result.data else None

async def get_all_conversations(
    supabase: Client,
    user_id: str = 'anonymous',
    limit: int = 50
) -> List[Dict[str, Any]]:
    """Listar todas conversas"""
    result = supabase.table('conversations')\
        .select('*')\
        .eq('user_id', user_id)\
        .order('updated_at', desc=True)\
        .limit(limit)\
        .execute()
    
    return result.data if result.data else []

async def get_conversation(
    supabase: Client,
    conversation_id: int
) -> Optional[Dict[str, Any]]:
    """Buscar conversa específica"""
    result = supabase.table('conversations')\
        .select('*')\
        .eq('id', conversation_id)\
        .single()\
        .execute()
    
    return result.data if result.data else None

async def update_conversation(
    supabase: Client,
    conversation_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """Atualizar conversa"""
    data = {}
    if name:
        data['name'] = name
    if description:
        data['description'] = description
    
    if not data:
        return None
    
    result = supabase.table('conversations')\
        .update(data)\
        .eq('id', conversation_id)\
        .execute()
    
    return result.data[0] if result.data else None

async def delete_conversation(
    supabase: Client,
    conversation_id: int
) -> bool:
    """Deletar conversa"""
    result = supabase.table('conversations')\
        .delete()\
        .eq('id', conversation_id)\
        .execute()
    
    return len(result.data) > 0 if result.data else False

# ==================== MENSAGENS ====================

async def add_message(
    supabase: Client,
    conversation_id: int,
    role: str,
    content: str,
    message_type: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Adicionar mensagem à conversa"""
    data = {
        'conversation_id': conversation_id,
        'role': role,
        'content': content,
        'message_type': message_type,
        'metadata': metadata
    }
    
    result = supabase.table('conversation_messages').insert(data).execute()
    return result.data[0] if result.data else None

async def get_conversation_messages(
    supabase: Client,
    conversation_id: int,
    limit: int = 100
) -> List[Dict[str, Any]]:
    """Buscar todas mensagens de uma conversa"""
    result = supabase.table('conversation_messages')\
        .select('*')\
        .eq('conversation_id', conversation_id)\
        .order('created_at', desc=False)\
        .limit(limit)\
        .execute()
    
    return result.data if result.data else []

async def get_recent_messages(
    supabase: Client,
    conversation_id: int,
    limit: int = 10
) -> List[Dict[str, Any]]:
    """Buscar últimas N mensagens para contexto"""
    result = supabase.table('conversation_messages')\
        .select('*')\
        .eq('conversation_id', conversation_id)\
        .order('created_at', desc=True)\
        .limit(limit)\
        .execute()
    
    return list(reversed(result.data)) if result.data else []

async def delete_message(
    supabase: Client,
    message_id: int
) -> bool:
    """Deletar mensagem específica"""
    result = supabase.table('conversation_messages')\
        .delete()\
        .eq('id', message_id)\
        .execute()
    
    return len(result.data) > 0 if result.data else False

async def search_conversations(
    supabase: Client,
    query: str,
    user_id: str = 'anonymous',
    limit: int = 20
) -> List[Dict[str, Any]]:
    """Buscar conversas por nome ou usuário"""
    result = supabase.table('conversations')\
        .select('*')\
        .eq('user_id', user_id)\
        .or_(f'name.ilike.%{query}%,user_name.ilike.%{query}%')\
        .limit(limit)\
        .execute()
    
    return result.data if result.data else []
