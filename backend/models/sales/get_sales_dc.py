import sys
import os
import json
from decimal import Decimal

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from database.db_connection import get_connection


def get_sales_dc():

    conn = get_connection()

    if conn is None:
        return {
            "status": "error",
            "message": "Database connection failed",
            "data": []
        }

    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM dc_items"
    cursor.execute(query)

    rows = cursor.fetchall()

    # Convert Decimal to float
    for row in rows:
        for key, value in row.items():
            if isinstance(value, Decimal):
                row[key] = float(value)

    cursor.close()
    conn.close()

    return {
        "status": "success",
        "count": len(rows),
        "data": rows
    }


if __name__ == "__main__":
    response = get_sales_dc()
    print(json.dumps(response, indent=4))