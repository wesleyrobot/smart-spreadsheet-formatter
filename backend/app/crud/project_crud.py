"""CRUD Projetos"""
from app.supabase_client import get_supabase

supabase = get_supabase()

def create_project(name: str, data: list, columns: list, file_name: str):
    response = supabase.table("projects").insert({
        "name": name,
        "original_data": data,
        "current_data": data,
        "columns": columns,
        "file_name": file_name,
        "row_count": len(data),
        "column_count": len(columns)
    }).execute()
    return response.data[0] if response.data else None

def get_all_projects(skip: int = 0, limit: int = 100):
    response = supabase.table("projects")\
        .select("*")\
        .order("created_at", desc=True)\
        .range(skip, skip + limit - 1)\
        .execute()
    return response.data

def get_project(project_id: int):
    response = supabase.table("projects").select("*").eq("id", project_id).execute()
    return response.data[0] if response.data else None

def delete_project(project_id: int):
    supabase.table("projects").delete().eq("id", project_id).execute()
    return True
