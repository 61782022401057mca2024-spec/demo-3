import sys
import os
from flask import Flask, request, jsonify, Blueprint
from decimal import Decimal

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

from database.db_connection import get_connection

# ✅ NEW (important for PostgreSQL dictionary cursor)
from psycopg2.extras import RealDictCursor

sales_dc_api = Blueprint("sales_dc_api", __name__)
app = Flask(__name__)


# -----------------------------
# GET ALL RECORDS
# -----------------------------
@sales_dc_api.route("/api/sales-dc", methods=["GET"])
def get_all_sales_dc():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)   # ✅ changed

    cursor.execute("SELECT * FROM dc_items")
    rows = cursor.fetchall()

    for row in rows:
        for k, v in row.items():
            if isinstance(v, Decimal):
                row[k] = float(v)

    cursor.close()
    conn.close()

    return jsonify(rows)


# -----------------------------
# GET ONE RECORD
# -----------------------------
@sales_dc_api.route("/api/sales-dc/<int:id>", methods=["GET"])
def get_sales_dc(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)   # ✅ changed

    cursor.execute("SELECT * FROM dc_items WHERE id=%s", (id,))
    row = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(row)


# -----------------------------
# CREATE RECORD
# -----------------------------
@sales_dc_api.route("/api/sales-dc", methods=["POST"])
def create_sales_dc():

    data = request.json

    item_name = data["item_name"]
    quantity = data["quantity"]
    price = data["price"]

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO dc_items (item_name, quantity, price)
    VALUES (%s, %s, %s)
    """

    cursor.execute(query, (item_name, quantity, price))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Record created successfully"
    })


# -----------------------------
# UPDATE RECORD
# -----------------------------
@sales_dc_api.route("/api/sales-dc/<int:id>", methods=["PUT"])
def update_sales_dc(id):

    data = request.json

    item_name = data["item_name"]
    quantity = data["quantity"]
    price = data["price"]

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE dc_items
    SET item_name=%s, quantity=%s, price=%s
    WHERE id=%s
    """

    cursor.execute(query, (item_name, quantity, price, id))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Record updated successfully"
    })


# -----------------------------
# DELETE RECORD
# -----------------------------
@sales_dc_api.route("/api/sales-dc/<int:id>", methods=["DELETE"])
def delete_sales_dc(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM dc_items WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Record deleted successfully"
    })


if __name__ == "__main__":
    app.run(debug=True)