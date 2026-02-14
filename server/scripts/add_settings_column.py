import sqlite3
import json

# Connect to the database
conn = sqlite3.connect('d:/Projects/Agri-Lo/server/agrilo.db')
cursor = conn.cursor()

try:
    # Add the settings column
    # JSON type in SQLite is just TEXT
    cursor.execute("ALTER TABLE users ADD COLUMN settings JSON DEFAULT '{}'")
    conn.commit()
    print("Successfully added 'settings' column to 'users' table.")
except sqlite3.OperationalError as e:
    print(f"Error: {e}")
    print("Column might already exist.")
finally:
    conn.close()
