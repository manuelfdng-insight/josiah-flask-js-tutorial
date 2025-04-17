from app import create_app, db
from app.models.todo import Todo
from flask import render_template

app = create_app()


# Register the index route explicitly in app.py
@app.route("/")
def index():
    return render_template("index.html")


@app.cli.command("init-db")
def init_db_command():
    """Clear existing data and create new tables."""
    with app.app_context():
        db.create_all()
        print("Initialized the database.")


@app.cli.command("seed-db")
def seed_db_command():
    """Seed the database with sample data."""
    with app.app_context():
        sample_todos = [
            Todo(title="Complete project", description="Finish the todo app project"),
            Todo(title="Learn Flask", description="Study Flask framework in depth"),
            Todo(
                title="Build portfolio",
                description="Add completed projects to portfolio",
            ),
            Todo(
                title="Exercise", description="Go for a 30-minute run", completed=True
            ),
        ]

        for todo in sample_todos:
            db.session.add(todo)

        db.session.commit()
        print("Database seeded with sample data.")


if __name__ == "__main__":
    app.run(debug=True)
