import json


def test_get_todos(client):
    """Test getting all todos."""
    response = client.get("/api/todos")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "todos" in data
    assert len(data["todos"]) == 2
    # Verify the structure of the returned todos
    assert "id" in data["todos"][0]
    assert "title" in data["todos"][0]
    assert "description" in data["todos"][0]
    assert "completed" in data["todos"][0]


def test_get_todos_with_filter(client):
    """Test getting todos with filter."""
    # Get completed todos
    response = client.get("/api/todos?completed=true")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data["todos"]) == 1
    assert data["todos"][0]["completed"] == True

    # Get active todos
    response = client.get("/api/todos?completed=false")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data["todos"]) == 1
    assert data["todos"][0]["completed"] == False


def test_get_todo(client):
    """Test getting a specific todo."""
    # First get all todos to find an ID
    response = client.get("/api/todos")
    data = json.loads(response.data)
    todo_id = data["todos"][0]["id"]

    # Then get a specific todo
    response = client.get(f"/api/todos/{todo_id}")
    assert response.status_code == 200
    todo = json.loads(response.data)
    assert todo["id"] == todo_id


def test_get_nonexistent_todo(client):
    """Test getting a todo that doesn't exist."""
    response = client.get("/api/todos/999")
    assert response.status_code == 404


def test_create_todo(client):
    """Test creating a new todo."""
    response = client.post(
        "/api/todos",
        data=json.dumps(
            {"title": "New Test Todo", "description": "This is a new test todo"}
        ),
        content_type="application/json",
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["title"] == "New Test Todo"
    assert data["description"] == "This is a new test todo"
    assert data["completed"] == False


def test_create_todo_missing_title(client):
    """Test creating a todo without a title."""
    response = client.post(
        "/api/todos",
        data=json.dumps({"description": "This is a test todo without a title"}),
        content_type="application/json",
    )
    assert response.status_code == 400


def test_update_todo(client):
    """Test updating a todo."""
    # First get all todos to find an ID
    response = client.get("/api/todos")
    data = json.loads(response.data)
    todo_id = data["todos"][0]["id"]

    # Then update a specific todo
    response = client.put(
        f"/api/todos/{todo_id}",
        data=json.dumps(
            {
                "title": "Updated Test Todo",
                "description": "This todo has been updated",
                "completed": True,
            }
        ),
        content_type="application/json",
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["title"] == "Updated Test Todo"
    assert data["description"] == "This todo has been updated"
    assert data["completed"] == True


def test_update_nonexistent_todo(client):
    """Test updating a todo that doesn't exist."""
    response = client.put(
        "/api/todos/999",
        data=json.dumps({"title": "Updated Test Todo"}),
        content_type="application/json",
    )
    assert response.status_code == 404


def test_delete_todo(client):
    """Test deleting a todo."""
    # First get all todos to find an ID
    response = client.get("/api/todos")
    data = json.loads(response.data)
    todo_id = data["todos"][0]["id"]

    # Then delete a specific todo
    response = client.delete(f"/api/todos/{todo_id}")
    assert response.status_code == 200

    # Verify it's gone
    response = client.get(f"/api/todos/{todo_id}")
    assert response.status_code == 404


def test_delete_nonexistent_todo(client):
    """Test deleting a todo that doesn't exist."""
    response = client.delete("/api/todos/999")
    assert response.status_code == 404
