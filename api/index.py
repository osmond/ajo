import os
import sys

# Add the backend package to sys.path so we can import the FastAPI app
BACKEND_PATH = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, os.path.abspath(BACKEND_PATH))

from app.main import app  # noqa: E402
