
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from psycopg2.extras import RealDictCursor

from database.db_connection import get_connection

router = APIRouter()


class TaxInvoicePayload(BaseModel):
    invoiceNumber: str
    invoiceDate: str
    customerId: int
    salesDcId: Optional[int] = None
    itemId: int
    qty: str
    rate: str
    taxPercent: str
    status: Optional[str] = "Draft"
    remarks: Optional[str] = None


def _connection_or_500():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    return connection


@router.get("/")
def list_tax_invoices():
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT
                ti.id,
                ti.invoice_no,
                ti.invoice_date,
                ti.subtotal,
                ti.gst_amount,
                ti.total_amount,
                ti.status,
                c.customer_name,
                tii.item_id,
                i.item_code,
                i.item_name,
                tii.qty,
                tii.rate,
                tii.tax_percent,
                tii.amount
            FROM tax_invoices ti
            JOIN customers c ON c.id = ti.customer_id
            JOIN tax_invoice_items tii ON tii.tax_invoice_id = ti.id
            JOIN items i ON i.id = tii.item_id
            ORDER BY ti.id DESC, tii.id DESC
            """
        )
        return cursor.fetchall()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()


@router.post("/")
def create_tax_invoice(payload: TaxInvoicePayload):
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    data = payload.model_dump()

    qty = Decimal(str(data["qty"]))
    rate = Decimal(str(data["rate"]))
    tax_percent = Decimal(str(data["taxPercent"]))
    subtotal = qty * rate
    gst_amount = (subtotal * tax_percent) / Decimal("100")
    total_amount = subtotal + gst_amount

    try:
        cursor.execute("SELECT id FROM customers WHERE id = %s", (data["customerId"],))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Customer not found")

        cursor.execute("SELECT id FROM items WHERE id = %s", (data["itemId"],))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Item not found")

        if data["salesDcId"]:
            cursor.execute("SELECT id FROM sales_dc WHERE id = %s", (data["salesDcId"],))
            if cursor.fetchone() is None:
                raise HTTPException(status_code=404, detail="Sales DC not found")

        cursor.execute(
            """
            INSERT INTO tax_invoices (
                invoice_no, invoice_date, customer_id, sales_dc_id,
                subtotal, gst_amount, total_amount, status, remarks
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, invoice_no, invoice_date, total_amount, status
            """,
            (
                data["invoiceNumber"],
                data["invoiceDate"],
                data["customerId"],
                data["salesDcId"],
                subtotal,
                gst_amount,
                total_amount,
                data["status"],
                data["remarks"],
            ),
        )
        invoice = cursor.fetchone()

        cursor.execute(
            """
            INSERT INTO tax_invoice_items (
                tax_invoice_id, item_id, qty, rate, tax_percent, amount
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                invoice["id"],
                data["itemId"],
                qty,
                rate,
                tax_percent,
                subtotal,
            ),
        )
        line = cursor.fetchone()
        connection.commit()

        return {
            "message": "Tax invoice created successfully",
            "invoice": invoice,
            "line": {
                "id": line["id"],
                "item_id": data["itemId"],
                "qty": str(qty),
                "rate": str(rate),
                "tax_percent": str(tax_percent),
                "amount": str(subtotal),
            },
            "totals": {
                "subtotal": str(subtotal),
                "gst_amount": str(gst_amount),
                "total_amount": str(total_amount),
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
