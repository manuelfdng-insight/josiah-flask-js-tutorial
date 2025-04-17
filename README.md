# Flask Todo Application

A simple Todo application with a Flask backend API and vanilla JavaScript frontend.

## Features

- Create, read, update, and delete Todo items
- Mark Todo items as complete
- Filter Todo items by status (All, Active, Completed)
- Clean, modern interface with Bootstrap 5
- SQLite database with Flask-SQLAlchemy
- Full test suite with pytest

## Project Structure

```
todo_app/
├── app/                      # Flask application
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── templates/            # HTML templates
│   ├── static/               # Static files
│   │   ├── css/              # CSS files
│   │   ├── js/               # JavaScript files
│   │   └── img/              # Image files
│   └── __init__.py           # Flask app initialization
├── tests/                    # Test files
├── migrations/               # Database migrations
├── app.py                    # Application entry point
├── config.py                 # Configuration
├── requirements.txt          # Python dependencies
├── run.sh                    # Startup script
└── README.md                 # Project documentation
```

## Setup

1. Run the setup script to create the project structure and install dependencies:
   ```
   chmod +x setup.sh
   ./setup.sh
   ```

2. Navigate to the project directory:
   ```
   cd todo_app
   ```

3. Run the application:
   ```
   ./run.sh
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Running Tests

```
pytest
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos?completed=true|false` - Filter todos by completion status
- `GET /api/todos/<id>` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/<id>` - Update a todo
- `DELETE /api/todos/<id>` - Delete a todo

## Frontend Structure

- `app.js` - Main application script
- `api.js` - API service for interacting with the backend
- `todoManager.js` - Todo management functionality

## License

MIT
