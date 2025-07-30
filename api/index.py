import os
import sys

# Add backend folder to sys.path so FastAPI app can be imported
BACKEND_PATH = os.path.join(os.path.dirname(__file__), "..", "backend")
sys.path.insert(0, os.path.abspath(BACKEND_PATH))

from app.main import app  # noqa
