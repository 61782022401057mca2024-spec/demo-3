# Connect Frontend, Backend, and DB

## 1. Open the project in VS Code

- Open `C:\Users\gugas\OneDrive\Desktop\Connectivity\Zyger\manufacturing-erp`
- Open two terminals in VS Code:
  - Terminal 1 for backend
  - Terminal 2 for frontend

## 2. Set up PostgreSQL

- Create a database named `manufacterp`
- Run the SQL in `backend/sql/create_customers_table.sql`
- Update your database credentials in a new file:

```env
backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=manufacterp
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

## 3. Install backend packages

In Terminal 1:

```powershell
cd backend
python -m pip install -r requirements.txt
```

If `python` does not work, try:

```powershell
py -m pip install -r requirements.txt
```

## 4. Run the backend

In Terminal 1:

```powershell
cd backend
uvicorn main:app --reload --port 8000
```

Test in browser:

- `http://127.0.0.1:8000/`
- `http://127.0.0.1:8000/docs`

## 5. Set up frontend API URL

Create a new file:

```env
.env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## 6. Run the frontend

In Terminal 2:

```powershell
npm install
npm run dev
```

Open:

- `http://localhost:5173`

## 7. Test the connection

- Open `Master -> Customer`
- Fill in at least:
  - `Customer Code`
  - `Customer Name`
- Click `Save Customer`

If everything is working, the form now sends data to:

- `POST http://127.0.0.1:8000/customer/`

## 8. If save fails

- Check backend terminal errors first
- Check DB credentials in `backend/.env`
- Check that the `customers` table exists
- Check that PostgreSQL is running on port `5432`
- Open `http://127.0.0.1:8000/docs` and test the `/customer/` endpoint directly

## Files already connected

- Frontend API helper: `src/lib/api.js`
- Frontend save button: `src/pages/master/CustomerPage.jsx`
- Backend customer API: `backend/routers/master/customer_router.py`
- Backend DB config: `backend/database/db_connection.py`
