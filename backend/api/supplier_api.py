from flask import Blueprint, request, jsonify
from database.db_connection import get_connection

# ✅ NEW
from psycopg2.extras import RealDictCursor

supplier_api = Blueprint("supplier_api", __name__)


# CREATE SUPPLIER
@supplier_api.route("/suppliers", methods=["POST"])
def create_supplier():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO suppliers (
        supplier_code, supplier_name, print_name, supplier_group,
        supplier_type, territory, industry, status, is_active,
        quality_required, inspection_required,
        address, delivery_address, city, state, pincode, country,
        phone, mobile, email, website, fax,
        gst_type, gstin, gst_state, pan_no, cin_no,
        msme_no, msme_type, tds_applicable,
        currency, payment_terms, credit_limit, credit_days,
        purchase_order_type, min_order_qty, min_order_value, discount,
        delivery_terms, transport_mode, transporter,
        ledger_group, opening_balance, opening_balance_type
    )
    VALUES (
        %s,%s,%s,%s,%s,%s,%s,%s,%s,
        %s,%s,
        %s,%s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,
        %s,%s,%s,%s,%s,
        %s,%s,%s,
        %s,%s,%s,%s,
        %s,%s,%s,%s,
        %s,%s,%s,
        %s,%s,%s
    )
    """

    values = (
        data.get("supplier_code"),
        data.get("supplier_name"),
        data.get("print_name"),
        data.get("supplier_group"),
        data.get("supplier_type"),
        data.get("territory"),
        data.get("industry"),
        data.get("status"),
        data.get("is_active"),
        data.get("quality_required"),
        data.get("inspection_required"),
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
        data.get("currency"),
        data.get("payment_terms"),
        data.get("credit_limit"),
        data.get("credit_days"),
        data.get("purchase_order_type"),
        data.get("min_order_qty"),
        data.get("min_order_value"),
        data.get("discount"),
        data.get("delivery_terms"),
        data.get("transport_mode"),
        data.get("transporter"),
        data.get("ledger_group"),
        data.get("opening_balance"),
        data.get("opening_balance_type")
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Supplier created successfully"})


# GET ALL SUPPLIERS
@supplier_api.route("/suppliers", methods=["GET"])
def get_suppliers():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # ✅ FIXED

    cursor.execute("SELECT * FROM suppliers")
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET SUPPLIER BY ID
@supplier_api.route("/suppliers/<int:id>", methods=["GET"])
def get_supplier(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # ✅ FIXED

    cursor.execute("SELECT * FROM suppliers WHERE id=%s", (id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE SUPPLIER
@supplier_api.route("/suppliers/<int:id>", methods=["PUT"])
def update_supplier(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE suppliers
    SET supplier_name=%s,
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
        data.get("supplier_name"),
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

    return jsonify({"message": "Supplier updated successfully"})


# DELETE SUPPLIER
@supplier_api.route("/suppliers/<int:id>", methods=["DELETE"])
def delete_supplier(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM suppliers WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Supplier deleted successfully"})