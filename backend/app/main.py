from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import health, spreadsheet, ml, templates, projects, conversations
from app.api.routes import ai_learning
from app.api.routes import ai_commands_v2

app = FastAPI(title="Smart Spreadsheet API", version="0.5.0 - Supabase")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(ai_learning.router, prefix="/api/ai", tags=["ai-learning"])
app.include_router(spreadsheet.router, prefix="/api/spreadsheet", tags=["spreadsheet"])
app.include_router(ml.router, prefix="/api/ml", tags=["ml"])
app.include_router(ai_commands_v2.router, prefix="/api/ml", tags=["ai"])
app.include_router(templates.router, prefix="/api/transform", tags=["templates"])
