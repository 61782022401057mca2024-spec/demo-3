from database.db_connection import get_connection

print("Testing PostgreSQL database connection...")

conn = get_connection()

if conn:
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")  # simple test query
        print("Connection Successful ✅")
    except Exception as e:
        print("Connected, but query failed:", e)
    finally:
        cursor.close()
        conn.close()
else:
    print("Connection Failed ❌")