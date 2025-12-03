from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional
from app.supabase_client import get_supabase
from app.crud import conversation_crud
from supabase import Client
from pydantic import BaseModel

router = APIRouter()

# ==================== MODELS ====================

class ConversationCreate(BaseModel):
    name: str
    user_name: str
    description: Optional[str] = None
    project_id: Optional[int] = None

class ConversationUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class MessageCreate(BaseModel):
    role: str
    content: str
    message_type: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

# ==================== ROTAS ====================

@router.post("/")
async def create_conversation(
    payload: ConversationCreate,
    supabase: Client = Depends(get_supabase)
):
    """Criar nova conversa"""
    try:
        conversation = await conversation_crud.create_conversation(
            supabase,
            name=payload.name,
            user_name=payload.user_name,
            description=payload.description,
            project_id=payload.project_id
        )
        return conversation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_conversations(
    limit: int = 50,
    supabase: Client = Depends(get_supabase)
):
    """Listar todas conversas"""
    try:
        conversations = await conversation_crud.get_all_conversations(
            supabase,
            limit=limit
        )
        return conversations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: int,
    supabase: Client = Depends(get_supabase)
):
    """Buscar conversa específica"""
    try:
        conversation = await conversation_crud.get_conversation(
            supabase,
            conversation_id
        )
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversa não encontrada")
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{conversation_id}")
async def update_conversation(
    conversation_id: int,
    payload: ConversationUpdate,
    supabase: Client = Depends(get_supabase)
):
    """Atualizar conversa"""
    try:
        conversation = await conversation_crud.update_conversation(
            supabase,
            conversation_id,
            name=payload.name,
            description=payload.description
        )
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversa não encontrada")
        return conversation
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    supabase: Client = Depends(get_supabase)
):
    """Deletar conversa"""
    try:
        success = await conversation_crud.delete_conversation(
            supabase,
            conversation_id
        )
        if not success:
            raise HTTPException(status_code=404, detail="Conversa não encontrada")
        return {"message": "Conversa deletada com sucesso"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== MENSAGENS ====================

@router.post("/{conversation_id}/messages")
async def add_message(
    conversation_id: int,
    payload: MessageCreate,
    supabase: Client = Depends(get_supabase)
):
    """Adicionar mensagem à conversa"""
    try:
        message = await conversation_crud.add_message(
            supabase,
            conversation_id,
            role=payload.role,
            content=payload.content,
            message_type=payload.message_type,
            metadata=payload.metadata
        )
        return message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{conversation_id}/messages")
async def get_messages(
    conversation_id: int,
    limit: int = 100,
    supabase: Client = Depends(get_supabase)
):
    """Buscar mensagens de uma conversa"""
    try:
        messages = await conversation_crud.get_conversation_messages(
            supabase,
            conversation_id,
            limit=limit
        )
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{conversation_id}/context")
async def get_conversation_context(
    conversation_id: int,
    limit: int = 10,
    supabase: Client = Depends(get_supabase)
):
    """Buscar contexto recente (últimas N mensagens)"""
    try:
        messages = await conversation_crud.get_recent_messages(
            supabase,
            conversation_id,
            limit=limit
        )
        return messages
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/{query}")
async def search_conversations(
    query: str,
    limit: int = 20,
    supabase: Client = Depends(get_supabase)
):
    """Buscar conversas"""
    try:
        conversations = await conversation_crud.search_conversations(
            supabase,
            query,
            limit=limit
        )
        return conversations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
