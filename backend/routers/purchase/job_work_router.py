
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def list_items():
    return {"message": "List Job Work"}

@router.post("/")
def create_item():
    return {"message": "Create Job Work"}
