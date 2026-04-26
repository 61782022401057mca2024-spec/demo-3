
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_items():
    return {"message": "List Labour Invoice"}

@router.post("/")
def create_item():
    return {"message": "Create Labour Invoice"}
