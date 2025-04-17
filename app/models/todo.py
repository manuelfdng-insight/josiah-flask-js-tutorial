from app import db
from datetime import datetime, UTC


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(UTC))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    def __init__(self, **kwargs):
        super(Todo, self).__init__(**kwargs)
        if not self.created_at:
            self.created_at = datetime.now(UTC)
        if not self.updated_at:
            self.updated_at = datetime.now(UTC)
        if self.completed is None:
            self.completed = False

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "completed": False if self.completed is None else self.completed,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else datetime.now(UTC).isoformat()
            ),
            "updated_at": (
                self.updated_at.isoformat()
                if self.updated_at
                else datetime.now(UTC).isoformat()
            ),
        }
