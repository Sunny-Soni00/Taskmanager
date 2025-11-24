import sqlite3

conn = sqlite3.connect('taskflow.db')
cursor = conn.cursor()

# Check teams table schema
print("=== TEAMS TABLE SCHEMA ===")
cursor.execute("PRAGMA table_info(teams)")
columns = cursor.fetchall()
for col in columns:
    print(f"Column: {col}")

print("\n=== ALL TEAMS ===")
cursor.execute("SELECT id, name, team_code, owner_id, description, created_at FROM teams ORDER BY id")
teams = cursor.fetchall()
for team in teams:
    print(f"Team {team[0]}: name={team[1]}, team_code={team[2]}, owner_id={team[3]} (type: {type(team[3])})")

print("\n=== ALL USERS ===")
cursor.execute("SELECT id, name, code_id FROM users")
users = cursor.fetchall()
for user in users:
    print(f"User ID {user[0]}: {user[1]}, code_id={user[2]}")

conn.close()
