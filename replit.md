# FastAPI + Next.js Transactions Dashboard

## Overview
A full-stack application for managing transactions with a Next.js frontend and FastAPI backend, integrated with Supabase for data persistence.

## Project Structure
```
.
├── frontend/                 # Next.js frontend app
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── FileUpload.tsx    # CSV file upload component
│   │   └── TransactionTable.tsx  # Transactions display table
│   └── package.json
├── main.py                  # FastAPI entry point
├── src/
│   └── app.py              # FastAPI application with routes
└── pyproject.toml          # Python dependencies
```

## Environment Variables
The following environment variables are required:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase API key

## Services
- **Frontend**: Next.js on port 5000 (http://0.0.0.0:5000)
- **Backend**: FastAPI on port 8000 (http://localhost:8000)

## API Endpoints
- `GET /` - Health check
- `GET /hello` - Hello World
- `GET /transactions` - Get all transactions
- `GET /transactions/{id}` - Get transaction by ID
- `POST /upload/transactions` - Upload transactions CSV
- `POST /upload/users` - Upload users CSV

## Frontend Features
- CSV file upload for transactions
- Real-time transactions table display
- Styled header (white text on blue background)
- Responsive layout with Tailwind CSS

## Tech Stack
**Frontend**: Next.js 14, TypeScript, Tailwind CSS
**Backend**: FastAPI, Uvicorn, Pandas
**Database**: Supabase
**Python**: 3.11+
