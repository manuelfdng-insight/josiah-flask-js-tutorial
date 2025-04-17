from flask import request, abort
from app.routes import todo_bp
from app.models.todo import Todo
from app import db


# Get all todos
@todo_bp.route("", methods=["GET"])
def get_todos():
    # Allow filtering by completed status if provided in query parameters
    completed_filter = request.args.get("completed")

    if completed_filter is not None:
        completed_bool = completed_filter.lower() == "true"
        todos = Todo.query.filter_by(completed=completed_bool).all()
    else:
        todos = Todo.query.all()

    return {"todos": [todo.to_dict() for todo in todos]}


# Get a specific todo
@todo_bp.route("/<int:id>", methods=["GET"])
def get_todo(id):
    try:
        todo = db.session.get(Todo, id)
        if todo is None:
            abort(404, description=f"Todo with id {id} not found")
        return todo.to_dict()
    except Exception as e:
        abort(404, description=f"Todo with id {id} not found")


# Create a new todo
@todo_bp.route("", methods=["POST"])
def create_todo():
    data = request.json

    if not data or "title" not in data:
        abort(400, description="Title is required")

    new_todo = Todo(title=data["title"], description=data.get("description", ""))

    db.session.add(new_todo)
    db.session.commit()

    return new_todo.to_dict(), 201


# Update a todo
@todo_bp.route("/<int:id>", methods=["PUT"])
def update_todo(id):
    try:
        todo = db.session.get(Todo, id)
        if todo is None:
            abort(404, description=f"Todo with id {id} not found")

        data = request.json

        if "title" in data:
            todo.title = data["title"]
        if "description" in data:
            todo.description = data["description"]
        if "completed" in data:
            todo.completed = data["completed"]

        db.session.commit()

        return todo.to_dict()
    except Exception as e:
        abort(404, description=f"Todo with id {id} not found")


# Delete a todo
@todo_bp.route("/<int:id>", methods=["DELETE"])
def delete_todo(id):
    try:
        todo = db.session.get(Todo, id)
        if todo is None:
            abort(404, description=f"Todo with id {id} not found")

        db.session.delete(todo)
        db.session.commit()

        return {"message": f"Todo {id} deleted"}
    except Exception as e:
        abort(404, description=f"Todo with id {id} not found")
