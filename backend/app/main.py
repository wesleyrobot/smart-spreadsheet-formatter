from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import spreadsheet, ml, health

app = FastAPI(
    title="Smart Spreadsheet Formatter API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(spreadsheet.router, prefix="/api/spreadsheet", tags=["spreadsheet"])
app.include_router(ml.router, prefix="/api/ml", tags=["ml"])

@app.get("/")
async def root():
    return {
        "message": "Smart Spreadsheet Formatter API",
        "version": "0.1.0",
        "docs": "/docs"
    }
