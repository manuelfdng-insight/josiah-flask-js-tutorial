import pytest
from app import create_app, db
from app.models.todo import Todo


@pytest.fixture
def app():
    """Create and configure a Flask app for testing."""
    app = create_app(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        }
    )

    # Create the database and the tables
    with app.app_context():
        db.create_all()

        # Add some test data
        todo1 = Todo(title="Test Todo 1", description="This is a test todo")
        todo2 = Todo(
            title="Test Todo 2", description="Another test todo", completed=True
        )
        db.session.add_all([todo1, todo2])
        db.session.commit()

    yield app

    # Clean up
    with app.app_context():
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test CLI runner for the app."""
    return app.test_cli_runner()
