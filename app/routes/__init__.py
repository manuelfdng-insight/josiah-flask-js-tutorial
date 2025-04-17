from flask import Blueprint

todo_bp = Blueprint("todo", __name__, url_prefix="/api/todos")

from app.routes import todo_routes
