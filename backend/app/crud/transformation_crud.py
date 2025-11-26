"""CRUD Transformações"""
from app.supabase_client import get_supabase

supabase = get_supabase()

def save_transformation(project_id: int, command: str, intent: str, success: bool, message: str, execution_time: int):
    response = supabase.table("transformations").insert({
        "project_id": project_id,
        "command": command,
        "intent": intent,
        "success": success,
        "message": message,
        "execution_time_ms": execution_time
    }).execute()
    return response.data[0] if response.data else None

def get_project_history(project_id: int):
    response = supabase.table("transformations")\
        .select("*")\
        .eq("project_id", project_id)\
        .order("created_at", desc=True)\
        .execute()
    return response.data
