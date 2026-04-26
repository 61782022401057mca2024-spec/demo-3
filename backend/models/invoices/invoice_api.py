import sys
import os
from flask import Flask, request, jsonify
from decimal import Decimal

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(BASE_DIR)

from database.db_connection import get_connection

app = Flask(__name__)


# ---------------------------------
# GET ALL INVOICES
# ---------------------------------
@app.route("/api/invoices", methods=["GET"])
def get_invoices():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM invoices")
    rows = cursor.fetchall()

    # convert decimal
    for row in rows:
        for key, value in row.items():
            if isinstance(value, Decimal):
                row[key] = float(value)

    cursor.close()
    conn.close()

    return jsonify(rows)


# ---------------------------------
# GET ONE INVOICE
# ---------------------------------
@app.route("/api/invoices/<int:id>", methods=["GET"])
def get_invoice(id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM invoices WHERE id=%s", (id,))
    row = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(row)


# ---------------------------------
# CREATE INVOICE
# ---------------------------------
@app.route("/api/invoices", methods=["POST"])
def create_invoice():

    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO invoices
    (invoice_number, invoice_date, invoice_type, party_type, party_id, subtotal, total_amount)
    VALUES (%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(query, (
        data["invoice_number"],
        data["invoice_date"],
        data["invoice_type"],
        data["party_type"],
        data["party_id"],
        data["subtotal"],
        data["total_amount"]
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Invoice created successfully"
    })


# ---------------------------------
# UPDATE INVOICE
# ---------------------------------
@app.route("/api/invoices/<int:id>", methods=["PUT"])
def update_invoice(id):

    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE invoices
    SET invoice_number=%s,
        invoice_date=%s,
        invoice_type=%s,
        party_type=%s,
        party_id=%s,
        subtotal=%s,
        total_amount=%s
    WHERE id=%s
    """

    cursor.execute(query, (
        data["invoice_number"],
        data["invoice_date"],
        data["invoice_type"],
        data["party_type"],
        data["party_id"],
        data["subtotal"],
        data["total_amount"],
        id
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Invoice updated successfully"
    })


# ---------------------------------
# DELETE INVOICE
# ---------------------------------
@app.route("/api/invoices/<int:id>", methods=["DELETE"])
def delete_invoice(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM invoices WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Invoice deleted successfully"
    })

def get_invoice_with_items(invoice_id):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT 
        i.id,
        i.invoice_number,
        i.invoice_date,
        i.invoice_type,
        i.party_type,
        i.party_id,
        i.subtotal,
        i.total_amount,

        ii.id AS item_line_id,
        ii.item_id,
        ii.item_name,
        ii.quantity,
        ii.rate,
        ii.amount,
        ii.tax_pct,
        ii.line_total

    FROM invoices i
    LEFT JOIN invoice_items ii
    ON i.id = ii.invoice_id
    WHERE i.id=%s
    """

    cursor.execute(query, (invoice_id,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows

if __name__ == "__main__":
    app.run(debug=True, port=5000)