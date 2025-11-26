"""CRUD IA Learning"""
from app.supabase_client import get_supabase

supabase = get_supabase()

def save_command_usage(command: str, intent: str, success: bool, columns: list):
    existing = supabase.table("ai_commands")\
        .select("*")\
        .eq("command_text", command)\
        .execute()
    
    if existing.data:
        cmd_id = existing.data[0]["id"]
        current_count = existing.data[0]["usage_count"]
        supabase.table("ai_commands").update({
            "usage_count": current_count + 1
        }).eq("id", cmd_id).execute()
    else:
        supabase.table("ai_commands").insert({
            "command_text": command,
            "intent_detected": intent,
            "success": success,
            "columns_available": columns,
            "usage_count": 1
        }).execute()
