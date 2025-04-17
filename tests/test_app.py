def test_ping(client):
    """Test the ping endpoint."""
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json["message"] == "pong"


def test_index(client):
    """Test the index page."""
    response = client.get("/")
    assert response.status_code == 200
    assert b"<!DOCTYPE html>" in response.data
    assert b"Todo Application" in response.data
