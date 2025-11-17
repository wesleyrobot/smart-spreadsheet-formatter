from fastapi import FastAPI

app = FastAPI(title="ML Service", version="0.1.0")

@app.get("/")
async def root():
    return {"service": "ml-service", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
