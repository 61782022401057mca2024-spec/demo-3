from flask import Blueprint, request, jsonify
from database.db_connection import get_connection
from psycopg2.extras import RealDictCursor

delivery_challan_api = Blueprint("delivery_challan_api", __name__)


# CREATE DELIVERY CHALLAN
@delivery_challan_api.route("/delivery-challans", methods=["POST"])
def create_delivery_challan():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO delivery_challans
    (dc_number, dc_date, dc_type, party_type, party_id,
     reference_no, status, total_amount, remarks)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        data.get("dc_number"),
        data.get("dc_date"),
        data.get("dc_type"),
        data.get("party_type"),
        data.get("party_id"),
        data.get("reference_no"),
        data.get("status"),
        data.get("total_amount"),
        data.get("remarks")
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Delivery Challan created successfully"})


# GET ALL DELIVERY CHALLANS
@delivery_challan_api.route("/delivery-challans", methods=["GET"])
def get_delivery_challans():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM delivery_challans")
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET DELIVERY CHALLAN BY ID
@delivery_challan_api.route("/delivery-challans/<int:id>", methods=["GET"])
def get_delivery_challan(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        "SELECT * FROM delivery_challans WHERE id=%s", (id,)
    )

    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE DELIVERY CHALLAN
@delivery_challan_api.route("/delivery-challans/<int:id>", methods=["PUT"])
def update_delivery_challan(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE delivery_challans
    SET dc_number=%s,
        dc_date=%s,
        dc_type=%s,
        party_type=%s,
        party_id=%s,
        reference_no=%s,
        status=%s,
        total_amount=%s,
        remarks=%s
    WHERE id=%s
    """

    values = (
        data.get("dc_number"),
        data.get("dc_date"),
        data.get("dc_type"),
        data.get("party_type"),
        data.get("party_id"),
        data.get("reference_no"),
        data.get("status"),
        data.get("total_amount"),
        data.get("remarks"),
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Delivery Challan updated successfully"})


# DELETE DELIVERY CHALLAN
@delivery_challan_api.route("/delivery-challans/<int:id>", methods=["DELETE"])
def delete_delivery_challan(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM delivery_challans WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Delivery Challan deleted successfully"})