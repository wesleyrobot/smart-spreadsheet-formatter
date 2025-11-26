"""Rotas de Projetos"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.crud import project_crud
from pydantic import BaseModel

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    data: List[dict]
    columns: List[str]
    file_name: str

@router.post("/")
async def create_project(project: ProjectCreate):
    return project_crud.create_project(project.name, project.data, project.columns, project.file_name)

@router.get("/")
async def list_projects(skip: int = 0, limit: int = 100):
    return project_crud.get_all_projects(skip, limit)

@router.get("/{project_id}")
async def get_project(project_id: int):
    project = project_crud.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return project

@router.delete("/{project_id}")
async def delete_project(project_id: int):
    project_crud.delete_project(project_id)
    return {"message": "Projeto deletado"}
