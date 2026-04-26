from flask import Blueprint, request, jsonify
from database.db_connection import get_connection
from psycopg2.extras import RealDictCursor

item_api = Blueprint("item_api", __name__)


# CREATE ITEM
@item_api.route("/items", methods=["POST"])
def create_item():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    columns = ", ".join(data.keys())
    placeholders = ", ".join(["%s"] * len(data))
    values = tuple(data.values())

    query = f"INSERT INTO items ({columns}) VALUES ({placeholders})"

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Item created successfully"})


# GET ALL ITEMS
@item_api.route("/items", methods=["GET"])
def get_items():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM items"

    cursor.execute(query)
    result = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(result)


# GET ITEM BY ID
@item_api.route("/items/<int:id>", methods=["GET"])
def get_item(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM items WHERE id=%s"

    cursor.execute(query, (id,))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(result)


# UPDATE ITEM
@item_api.route("/items/<int:id>", methods=["PUT"])
def update_item(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    fields = ", ".join([f"{key}=%s" for key in data.keys()])
    values = list(data.values())
    values.append(id)

    query = f"UPDATE items SET {fields} WHERE id=%s"

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Item updated successfully"})


# DELETE ITEM
@item_api.route("/items/<int:id>", methods=["DELETE"])
def delete_item(id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM items WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Item deleted successfully"})