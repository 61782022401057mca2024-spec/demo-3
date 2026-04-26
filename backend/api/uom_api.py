from flask import Blueprint, request, jsonify
from database.db_connection import get_connection

# ✅ NEW
from psycopg2.extras import RealDictCursor

uom_api = Blueprint("uom_api", __name__)


# CREATE UOM
@uom_api.route("/uom", methods=["POST"])
def create_uom():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO uom (uom_name, description, is_active)
    VALUES (%s, %s, %s)
    """

    values = (
        data.get("uom_name"),
        data.get("description"),
        data.get("is_active", True)
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "UOM created successfully"})


# GET ALL UOM
@uom_api.route("/uom", methods=["GET"])
def get_uoms():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # ✅ FIXED

    cursor.execute("SELECT * FROM uom")
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET UOM BY ID
@uom_api.route("/uom/<int:id>", methods=["GET"])
def get_uom(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # ✅ FIXED

    cursor.execute("SELECT * FROM uom WHERE id=%s", (id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE UOM
@uom_api.route("/uom/<int:id>", methods=["PUT"])
def update_uom(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE uom
    SET uom_name=%s,
        description=%s,
        is_active=%s
    WHERE id=%s
    """

    values = (
        data.get("uom_name"),
        data.get("description"),
        data.get("is_active"),
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "UOM updated successfully"})


# DELETE UOM
@uom_api.route("/uom/<int:id>", methods=["DELETE"])
def delete_uom(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM uom WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "UOM deleted successfully"})