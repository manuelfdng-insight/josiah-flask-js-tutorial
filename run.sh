#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Initialize the database
export FLASK_APP=app.py
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Seed the database with sample data (optional)
flask seed-db

# Run the application
flask run --host=0.0.0.0
