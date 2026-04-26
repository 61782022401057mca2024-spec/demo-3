from flask import Blueprint, request, jsonify
from database.db_connection import get_connection
from psycopg2.extras import RealDictCursor

customer_api = Blueprint("customer_api", __name__)


# CREATE CUSTOMER
@customer_api.route("/customers", methods=["POST"])
def create_customer():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO customers (
        customer_code, customer_name, print_name, customer_group,
        customer_type, territory, industry, status, pricing_group,
        tax_invoice, einvoice, ewaybill, is_active,
        address, delivery_address, city, state, pincode, country,
        phone, mobile, email, website, fax,
        gst_type, gstin, gst_state, pan_no, cin_no,
        msme_no, msme_type, tds_applicable, tcs_applicable,
        currency, payment_terms, credit_limit, credit_days, discount,
        ledger_group, opening_balance, opening_balance_type,
        transport_mode, transporter, delivery_terms, lead_days
    )
    VALUES (
        %s,%s,%s,%s,%s,%s,%s,%s,%s,
        %s,%s,%s,%s,
        %s,%s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,
        %s,%s,%s,%s,
        %s,%s,%s,%s,%s,
        %s,%s,%s,
        %s,%s,%s,%s
    )
    """

    values = (
        data.get("customer_code"),
        data.get("customer_name"),
        data.get("print_name"),
        data.get("customer_group"),
        data.get("customer_type"),
        data.get("territory"),
        data.get("industry"),
        data.get("status"),
        data.get("pricing_group"),
        data.get("tax_invoice"),
        data.get("einvoice"),
        data.get("ewaybill"),
        data.get("is_active", True),
        data.get("address"),
        data.get("delivery_address"),
        data.get("city"),
        data.get("state"),
        data.get("pincode"),
        data.get("country"),
        data.get("phone"),
        data.get("mobile"),
        data.get("email"),
        data.get("website"),
        data.get("fax"),
        data.get("gst_type"),
        data.get("gstin"),
        data.get("gst_state"),
        data.get("pan_no"),
        data.get("cin_no"),
        data.get("msme_no"),
        data.get("msme_type"),
        data.get("tds_applicable"),
        data.get("tcs_applicable"),
        data.get("currency"),
        data.get("payment_terms"),
        data.get("credit_limit"),
        data.get("credit_days"),
        data.get("discount"),
        data.get("ledger_group"),
        data.get("opening_balance"),
        data.get("opening_balance_type"),
        data.get("transport_mode"),
        data.get("transporter"),
        data.get("delivery_terms"),
        data.get("lead_days")
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Customer created successfully"})


# GET ALL CUSTOMERS
@customer_api.route("/customers", methods=["GET"])
def get_customers():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM customers")
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET CUSTOMER BY ID
@customer_api.route("/customers/<int:id>", methods=["GET"])
def get_customer(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM customers WHERE id=%s", (id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE CUSTOMER
@customer_api.route("/customers/<int:id>", methods=["PUT"])
def update_customer(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE customers
    SET customer_name=%s,
        mobile=%s,
        email=%s,
        city=%s,
        state=%s,
        gstin=%s,
        credit_limit=%s,
        credit_days=%s
    WHERE id=%s
    """

    values = (
        data.get("customer_name"),
        data.get("mobile"),
        data.get("email"),
        data.get("city"),
        data.get("state"),
        data.get("gstin"),
        data.get("credit_limit"),
        data.get("credit_days"),
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Customer updated successfully"})


# DELETE CUSTOMER
@customer_api.route("/customers/<int:id>", methods=["DELETE"])
def delete_customer(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM customers WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Customer deleted successfully"})