
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor

from database.db_connection import get_connection

router = APIRouter()


class SalesDCPayload(BaseModel):
    dcNumber: str
    dcDate: str
    customerId: int
    referenceNumber: Optional[str] = None
    remarks: Optional[str] = None
    itemId: int
    qty: str


def _connection_or_500():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    return connection


@router.get("/")
def list_sales_dc():
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT
                sd.id,
                sd.dc_no,
                sd.dc_date,
                sd.status,
                sd.remarks,
                c.id AS customer_id,
                c.customer_name,
                sdi.item_id,
                i.item_code,
                i.item_name,
                i.uom,
                i.sales_rate,
                sdi.qty,
                sdi.returned_qty,
                sdi.pending_qty,
                (COALESCE(i.sales_rate, 0) * COALESCE(sdi.qty, 0)) AS amount
            FROM sales_dc sd
            JOIN sales_dc_items sdi ON sdi.sales_dc_id = sd.id
            JOIN customers c ON c.id = sd.customer_id
            JOIN items i ON i.id = sdi.item_id
            ORDER BY sd.id DESC, sdi.id DESC
            """
        )
        return cursor.fetchall()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()


@router.post("/")
def create_sales_dc(payload: SalesDCPayload):
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    data = payload.model_dump()
    qty = Decimal(str(data["qty"]))

    try:
        cursor.execute("SELECT id FROM customers WHERE id = %s", (data["customerId"],))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Customer not found")

        cursor.execute(
            "SELECT id, item_code, item_name, sales_rate FROM items WHERE id = %s",
            (data["itemId"],),
        )
        item = cursor.fetchone()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")

        cursor.execute(
            """
            SELECT balance_qty
            FROM stock_ledger
            WHERE item_id = %s
            ORDER BY id DESC
            LIMIT 1
            """,
            (data["itemId"],),
        )
        last_entry = cursor.fetchone()
        available_stock = Decimal(str(last_entry["balance_qty"])) if last_entry else Decimal("0")
        if available_stock < qty:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock. Available stock is {available_stock}",
            )

        cursor.execute(
            """
            INSERT INTO sales_dc (
                dc_no, dc_date, customer_id, remarks, status
            )
            VALUES (%s, %s, %s, %s, 'Open')
            RETURNING id, dc_no, dc_date, status
            """,
            (
                data["dcNumber"],
                data["dcDate"],
                data["customerId"],
                data["remarks"] or data["referenceNumber"],
            ),
        )
        sales_dc = cursor.fetchone()

        cursor.execute(
            """
            INSERT INTO sales_dc_items (
                sales_dc_id, item_id, qty, returned_qty, pending_qty
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
            """,
            (sales_dc["id"], data["itemId"], qty, Decimal("0"), qty),
        )
        line = cursor.fetchone()

        new_balance = available_stock - qty
        cursor.execute(
            """
            INSERT INTO stock_ledger (
                item_id, ref_type, ref_id, inward_qty, outward_qty, balance_qty, remarks
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                data["itemId"],
                "SALES_DC",
                sales_dc["id"],
                Decimal("0"),
                qty,
                new_balance,
                data["remarks"] or f"Sales DC {data['dcNumber']}",
            ),
        )

        connection.commit()
        return {
            "message": "Sales DC created successfully",
            "salesDc": sales_dc,
            "line": {
                "id": line["id"],
                "item_id": item["id"],
                "item_code": item["item_code"],
                "item_name": item["item_name"],
                "qty": str(qty),
                "rate": str(item["sales_rate"] or 0),
            },
            "stock": {
                "previous_balance": str(available_stock),
                "new_balance": str(new_balance),
            },
        }
    except HTTPException:
        connection.rollback()
        raise
    except Exception as exc:
        connection.rollback()
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()
