from flask import Blueprint, request, jsonify
from database.db_connection import get_connection
from psycopg2.extras import RealDictCursor

bin_api = Blueprint("bin_api", __name__)


# CREATE BIN
@bin_api.route("/bins", methods=["POST"])
def create_bin():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO bins (bin_name, rack_id, capacity, is_active)
    VALUES (%s, %s, %s, %s)
    """

    values = (
        data.get("bin_name"),
        data.get("rack_id"),
        data.get("capacity"),
        data.get("is_active", True)
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Bin created successfully"})


# GET ALL BINS
@bin_api.route("/bins", methods=["GET"])
def get_bins():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = """
    SELECT b.*, r.rack_name
    FROM bins b
    LEFT JOIN racks r ON b.rack_id = r.id
    """

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET BIN BY ID
@bin_api.route("/bins/<int:id>", methods=["GET"])
def get_bin(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM bins WHERE id=%s"

    cursor.execute(query, (id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE BIN
@bin_api.route("/bins/<int:id>", methods=["PUT"])
def update_bin(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE bins
    SET bin_name=%s,
        rack_id=%s,
        capacity=%s,
        is_active=%s
    WHERE id=%s
    """

    values = (
        data.get("bin_name"),
        data.get("rack_id"),
        data.get("capacity"),
        data.get("is_active"),
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Bin updated successfully"})


# DELETE BIN
@bin_api.route("/bins/<int:id>", methods=["DELETE"])
def delete_bin(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM bins WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Bin deleted successfully"})