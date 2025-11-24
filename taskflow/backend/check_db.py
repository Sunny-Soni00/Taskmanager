import sqlite3

conn = sqlite3.connect('taskflow.db')
cursor = conn.cursor()

print("=== team_messages columns ===")
cursor.execute('PRAGMA table_info(team_messages)')
for row in cursor.fetchall():
    print(row)

print("\n=== teams columns ===")
cursor.execute('PRAGMA table_info(teams)')
for row in cursor.fetchall():
    print(row)

print("\n=== team_members columns ===")
cursor.execute('PRAGMA table_info(team_members)')
for row in cursor.fetchall():
    print(row)

print("\n=== users columns ===")
cursor.execute('PRAGMA table_info(users)')
for row in cursor.fetchall():
    print(row)

conn.close()
