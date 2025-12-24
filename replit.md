# FastAPI Supabase API Server

## Overview
A FastAPI backend application that provides REST API endpoints for managing transactions and users data, with Supabase as the database backend.

## Project Structure
```
.
├── main.py              # Application entry point
├── src/
│   └── app.py           # FastAPI application with all routes
├── pyproject.toml       # Python project dependencies
└── README.md            # Project documentation
```

## Environment Variables
The following environment variables are required for full functionality:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase API key

## API Endpoints
- `GET /` - Health check endpoint
- `GET /hello` - Hello World endpoint
- `GET /transactions` - Get all transactions (mock data)
- `GET /transactions/{id}` - Get transaction by ID (mock data)
- `POST /upload/transactions` - Upload transactions via CSV file (requires Supabase)
- `POST /upload/users` - Upload users via CSV file (requires Supabase)

## Development
- Server runs on port 5000
- Uses uvicorn with auto-reload enabled
- Python 3.11+ required

## Dependencies
Managed via `pyproject.toml` using uv package manager. Key dependencies:
- FastAPI
- Uvicorn
- Pandas
- Supabase Python client
- python-dotenv
