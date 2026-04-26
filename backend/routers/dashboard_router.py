from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor

from database.db_connection import get_connection

router = APIRouter()


def _connection_or_500():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
    return connection


@router.get("/summary")
def get_dashboard_summary():
    connection = _connection_or_500()
    cursor = connection.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute(
            """
            SELECT
                (SELECT COUNT(*) FROM items) AS total_items,
                (SELECT COUNT(*) FROM purchase_inward) AS total_purchases,
                (SELECT COUNT(*) FROM items) AS total_manufacturing_orders,
                (SELECT COUNT(*) FROM customers) AS total_customers,
                (SELECT COUNT(*) FROM suppliers) AS total_suppliers
            """
        )
        return cursor.fetchone()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        cursor.close()
        connection.close()
