# Migration script to add status and left_at columns to team_members table
import sqlite3
import os

def migrate():
    # Get database path
    db_path = os.path.join(os.path.dirname(__file__), 'taskflow.db')
    
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Add status column if it doesn't exist
        cursor.execute("""
            ALTER TABLE team_members 
            ADD COLUMN status TEXT DEFAULT 'active'
        """)
        print("✓ Added 'status' column to team_members")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("✓ 'status' column already exists")
        else:
            print(f"Error adding status column: {e}")
    
    try:
        # Add left_at column if it doesn't exist
        cursor.execute("""
            ALTER TABLE team_members 
            ADD COLUMN left_at TEXT
        """)
        print("✓ Added 'left_at' column to team_members")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("✓ 'left_at' column already exists")
        else:
            print(f"Error adding left_at column: {e}")
    
    # Update all existing members to have 'active' status
    cursor.execute("""
        UPDATE team_members 
        SET status = 'active' 
        WHERE status IS NULL
    """)
    
    conn.commit()
    print(f"✓ Updated {cursor.rowcount} existing members to 'active' status")
    
    conn.close()
    print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    migrate()
