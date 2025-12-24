import os

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import csv
import io
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()


supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")

supabase_client: Client = None
if supabase_url and supabase_key:
    supabase_client = create_client(supabase_url, supabase_key)

@app.get("/")
def root():
    return {"status": "ok", "message": "FastAPI Supabase API Server"}

@app.post("/upload/transactions")
async def upload_transactions(file: UploadFile = File(...)):

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        required_columns = ["acc_id", "amount", "purpose"]
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(status_code=400, detail="Missing required columns")

        transactions_data = df.to_dict('records')
        response = (
            supabase_client
            .table("transactions")
            .insert(transactions_data, returning="minimal")
            .execute()
        )

        return JSONResponse(content={
            "message": f"Successfully inserted {len(transactions_data)} transactions",
            "inserted_count": len(transactions_data)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/upload/users")
async def upload_users_csv(file: UploadFile = File(...)):
    """
    Upload a CSV file to insert users data into the users table.
    Expected columns: name
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    try:
        # Read CSV file
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))

        # Validate required columns
        required_columns = ['name']
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400,
                detail=f"CSV must contain columns: {required_columns}"
            )

        # Prepare data for insertion
        users_data = df[required_columns].to_dict('records')

        # Insert into Supabase
        # response = supabase_client.table('users').insert(users_data).execute()
        response = (
            supabase_client
            .table("users")
            .insert(users_data, returning="minimal")
            .execute()
        )

        return JSONResponse(content={
            "message": f"Successfully inserted {len(users_data)} users",
            "inserted_count": len(users_data)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@app.get("/hello")
def hello():
    return {"message": "Hello World"}

transactions = {
    1: {
    "id": 1,
    "account": 1,
    "amount": 100,
    "purpose": "gaurav"
    }
}
@app.get("/transactions")
def get_all_transactions():
    return transactions

@app.get("/transactions/{id}")
def get_transaction(id: int):
    if id not in transactions:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transactions.get(id)