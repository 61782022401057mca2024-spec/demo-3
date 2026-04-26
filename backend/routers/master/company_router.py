
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_items():
    return {"message": "List Company Info"}

@router.post("/")
def create_item():
    return {"message": "Create Company Info"}
