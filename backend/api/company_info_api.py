from flask import Blueprint, request, jsonify
from database.db_connection import get_connection
from psycopg2.extras import RealDictCursor

company_api = Blueprint("company_api", __name__)


# CREATE COMPANY
@company_api.route("/company", methods=["POST"])
def create_company():

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO company_info
    (company_name, print_name, company_display_type, address, city,
     state, pincode, mobile_no, email, website, contact_person, gstin)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """

    values = (
        data.get("company_name"),
        data.get("print_name"),
        data.get("company_display_type"),
        data.get("address"),
        data.get("city"),
        data.get("state"),
        data.get("pincode"),
        data.get("mobile_no"),
        data.get("email"),
        data.get("website"),
        data.get("contact_person"),
        data.get("gstin")
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Company created successfully"})


# GET ALL COMPANIES
@company_api.route("/company", methods=["GET"])
def get_companies():

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM company_info"

    cursor.execute(query)
    companies = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(companies)


# GET COMPANY BY ID
@company_api.route("/company/<int:id>", methods=["GET"])
def get_company(id):

    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    query = "SELECT * FROM company_info WHERE id=%s"

    cursor.execute(query, (id,))
    company = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(company)


# UPDATE COMPANY
@company_api.route("/company/<int:id>", methods=["PUT"])
def update_company(id):

    data = request.json
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE company_info
    SET company_name=%s,
        mobile_no=%s,
        email=%s,
        gstin=%s
    WHERE id=%s
    """

    values = (
        data.get("company_name"),
        data.get("mobile_no"),
        data.get("email"),
        data.get("gstin"),
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Company updated successfully"})


# DELETE COMPANY
@company_api.route("/company/<int:id>", methods=["DELETE"])
def delete_company(id):

    conn = get_connection()
    cursor = conn.cursor()

    query = "DELETE FROM company_info WHERE id=%s"

    cursor.execute(query, (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Company deleted successfully"})