
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_items():
    return {"message": "List Rejection Report"}

@router.post("/")
def create_item():
    return {"message": "Create Rejection Report"}
