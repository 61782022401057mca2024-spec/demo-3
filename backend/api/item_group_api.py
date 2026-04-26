from flask import Blueprint, request, jsonify
from database.db_connection import get_connection
from psycopg2.extras import RealDictCursor

item_group_api = Blueprint("item_group_api", __name__)


# CREATE ITEM GROUP
@item_group_api.route("/item-groups", methods=["POST"])
def create_item_group():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO item_groups (group_name, description, is_active)
    VALUES (%s,%s,%s)
    """

    values = (
        data.get("group_name"),
        data.get("description"),
        data.get("is_active", True)
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Item group created successfully"})


# GET ALL ITEM GROUPS
@item_group_api.route("/item-groups", methods=["GET"])
def get_item_groups():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM item_groups")
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET ITEM GROUP BY ID
@item_group_api.route("/item-groups/<int:id>", methods=["GET"])
def get_item_group(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute("SELECT * FROM item_groups WHERE id=%s", (id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE ITEM GROUP
@item_group_api.route("/item-groups/<int:id>", methods=["PUT"])
def update_item_group(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE item_groups
    SET group_name=%s,
        description=%s,
        is_active=%s
    WHERE id=%s
    """

    values = (
        data.get("group_name"),
        data.get("description"),
        data.get("is_active"),
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Item group updated successfully"})


# DELETE ITEM GROUP
@item_group_api.route("/item-groups/<int:id>", methods=["DELETE"])
def delete_item_group(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM item_groups WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Item group deleted successfully"})