from app.models.todo import Todo
from datetime import datetime


def test_new_todo():
    """Test creating a new todo."""
    todo = Todo(title="Test Todo", description="This is a test todo")
    assert todo.title == "Test Todo"
    assert todo.description == "This is a test todo"
    assert not todo.completed
    assert isinstance(todo.created_at, datetime)
    assert isinstance(todo.updated_at, datetime)


def test_todo_to_dict():
    """Test converting a todo to a dictionary."""
    todo = Todo(title="Test Todo", description="This is a test todo")
    todo_dict = todo.to_dict()

    assert todo_dict["title"] == "Test Todo"
    assert todo_dict["description"] == "This is a test todo"
    assert todo_dict["completed"] == False
    assert "id" in todo_dict
    assert "created_at" in todo_dict
    assert "updated_at" in todo_dict
