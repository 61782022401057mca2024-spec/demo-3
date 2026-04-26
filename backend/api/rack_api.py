from flask import Blueprint, request, jsonify
from database.db_connection import get_connection
from psycopg2.extras import RealDictCursor

rack_api = Blueprint("rack_api", __name__)


# CREATE RACK
@rack_api.route("/racks", methods=["POST"])
def create_rack():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO racks (rack_name, location, capacity, is_active)
    VALUES (%s, %s, %s, %s)
    """

    values = (
        data.get("rack_name"),
        data.get("location"),
        data.get("capacity"),
        data.get("is_active", True)
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Rack created successfully"})


# GET ALL RACKS
@rack_api.route("/racks", methods=["GET"])
def get_racks():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM racks")
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET RACK BY ID
@rack_api.route("/racks/<int:id>", methods=["GET"])
def get_rack(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM racks WHERE id=%s", (id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE RACK
@rack_api.route("/racks/<int:id>", methods=["PUT"])
def update_rack(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE racks
    SET rack_name=%s,
        location=%s,
        capacity=%s,
        is_active=%s
    WHERE id=%s
    """

    values = (
        data.get("rack_name"),
        data.get("location"),
        data.get("capacity"),
        data.get("is_active"),
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Rack updated successfully"})


# DELETE RACK
@rack_api.route("/racks/<int:id>", methods=["DELETE"])
def delete_rack(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM racks WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Rack deleted successfully"})