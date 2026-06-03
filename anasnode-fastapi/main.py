from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Optional

app = FastAPI(title="AnasNode AI OS Backend")

# Enable CORS for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkflowInput(BaseModel):
    prompt: str
    workspace: Optional[Any] = None

@app.get("/")
async def root():
    return {"status": "online", "message": "AnasNode FastAPI Backend"}

@app.post("/v1/workflows/{workflow_id}/execute")
async def execute_workflow(workflow_id: str, input_data: WorkflowInput):
    # This is where heavy AI logic would live (LangChain, etc.)
    return {
        "success": True,
        "workflow_id": workflow_id,
        "result": f"Executed {workflow_id} with prompt: {input_data.prompt}"
    }

@app.post("/v1/voice/process")
async def process_voice(file: UploadFile = File(...)):
    # This is where speech-to-text or voice analysis would live
    return {
        "success": True,
        "filename": file.filename,
        "transcription": "Mock transcription from FastAPI"
    }

@app.get("/v1/analytics/{account_id}")
async def get_analytics(account_id: str):
    return {
        "success": True,
        "account_id": account_id,
        "data": {"metrics": "Enterprise-grade analytics from Python"}
    }
