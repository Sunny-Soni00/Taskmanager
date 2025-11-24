import sqlite3

conn = sqlite3.connect('taskflow.db')
cursor = conn.cursor()

print("=== USERS ===")
for row in cursor.execute('SELECT id, email FROM users'):
    print(f"User {row[0]}: {row[1]}")

print("\n=== TEAMS ===")
for row in cursor.execute('SELECT id, name, owner_id FROM teams'):
    print(f"Team {row[0]}: {row[1]} (owner: {row[2]})")

print("\n=== TEAM MEMBERS ===")
for row in cursor.execute('SELECT team_id, user_id, role, status FROM team_members'):
    print(f"Team {row[0]} - User {row[1]}: {row[2]} ({row[3]})")

conn.close()
