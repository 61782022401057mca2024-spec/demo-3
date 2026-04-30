from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor

from database.db_connection import get_connection

router = APIRouter()


class ItemPayload(BaseModel):
    itemType: Optional[str] = "Purchase Item"
    itemCode: str
    itemName: str
    printName: Optional[str] = None
    itemGroup: Optional[str] = None
    stockUOM: Optional[str] = None
    hsnCode: Optional[str] = None
    rack: Optional[str] = None
    bin: Optional[str] = None
    location: Optional[str] = None
    minStock: Optional[str] = None
    maxStock: Optional[str] = None
    reorderLevel: Optional[str] = None
    purchaseRate: Optional[str] = None
    sellingRate: Optional[str] = None
    gstPercent: Optional[str] = None
    status: Optional[str] = "Active"


def _connection_or_500():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    return connection


def _ensure_item_type_column(cursor):
    cursor.execute(
        """
        ALTER TABLE items
        ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) DEFAULT 'Purchase Item'
        """
    )


@router.get("/")
def list_items(item_type: Optional[str] = None):
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        _ensure_item_type_column(cursor)
        cursor.execute(
            """
            SELECT
                id,
                item_type,
                item_code,
                item_name,
                print_name,
                item_group,
                uom,
                hsn_code,
                rack,
                bin,
                min_stock,
                max_stock,
                reorder_level,
                purchase_rate,
                sales_rate,
                gst_percent,
                status,
                created_at
            FROM items
            WHERE (%s IS NULL OR item_type = %s)
            ORDER BY id DESC
            """,
            (item_type, item_type),
        )
        return cursor.fetchall()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()


@router.post("/")
def create_item(payload: ItemPayload):
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    data = payload.model_dump()

    try:
        _ensure_item_type_column(cursor)
        cursor.execute(
            """
            INSERT INTO items (
                item_type, item_code, item_name, print_name, item_group, uom, hsn_code,
                rack, bin, min_stock, max_stock, reorder_level,
                purchase_rate, sales_rate, gst_percent, status
            )
            VALUES (
                %s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,
                %s,%s,%s,%s
            )
            RETURNING id, item_type, item_code, item_name
            """,
            (
                data["itemType"] or "Purchase Item",
                data["itemCode"],
                data["itemName"],
                data["printName"],
                data["itemGroup"],
                data["stockUOM"],
                data["hsnCode"],
                data["rack"],
                data["bin"],
                data["minStock"] or None,
                data["maxStock"] or None,
                data["reorderLevel"] or None,
                data["purchaseRate"] or None,
                data["sellingRate"] or None,
                data["gstPercent"] or None,
                data["status"],
            ),
        )
        created = cursor.fetchone()
        connection.commit()
        return {"message": "Item created successfully", "item": created}
    except Exception as exc:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()
