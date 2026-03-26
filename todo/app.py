from flask import Flask, request, jsonify
import psycopg2
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

# Initialize DB
def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()

# Get all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, text, completed FROM tasks")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify([
        {"id": r[0], "text": r[1], "completed": r[2]} for r in rows
    ])

# Add task
@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO tasks (text) VALUES (%s) RETURNING id",
        (data["text"],)
    )
    task_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"id": task_id})

# Update task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE tasks SET completed=%s WHERE id=%s",
        (data["completed"], task_id)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "updated"})

# Delete task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM tasks WHERE id=%s", (task_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "deleted"})

if __name__ == "__main__":
    app.run(debug=True)
