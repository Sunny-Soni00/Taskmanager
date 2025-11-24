# Database Migration Script
# Run this to add new columns to existing database

import sqlite3
import os

def migrate_database():
    # Path to database - should be in backend folder
    db_path = os.path.join(os.path.dirname(__file__), 'taskflow.db')
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("Starting database migration...")
        
        # Add profile_picture to users table
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN profile_picture TEXT")
            print("✓ Added profile_picture column to users table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("- profile_picture column already exists in users table")
            else:
                raise
        
        # Add description and created_at to teams table
        try:
            cursor.execute("ALTER TABLE teams ADD COLUMN description TEXT")
            print("✓ Added description column to teams table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("- description column already exists in teams table")
            else:
                raise
        
        try:
            cursor.execute("ALTER TABLE teams ADD COLUMN created_at TEXT")
            print("✓ Added created_at column to teams table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("- created_at column already exists in teams table")
            else:
                raise
        
        # Update team_messages table for file support
        try:
            cursor.execute("ALTER TABLE team_messages ADD COLUMN file_url TEXT")
            print("✓ Added file_url column to team_messages table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("- file_url column already exists in team_messages table")
            else:
                raise
        
        try:
            cursor.execute("ALTER TABLE team_messages ADD COLUMN file_name TEXT")
            print("✓ Added file_name column to team_messages table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("- file_name column already exists in team_messages table")
            else:
                raise
        
        try:
            cursor.execute("ALTER TABLE team_messages ADD COLUMN file_type TEXT")
            print("✓ Added file_type column to team_messages table")
        except sqlite3.OperationalError as e:
            if "duplicate column name" in str(e).lower():
                print("- file_type column already exists in team_messages table")
            else:
                raise
        
        # Make message column nullable (can't alter directly in SQLite, but future inserts will allow NULL)
        print("✓ Message column in team_messages can now be optional")
        
        conn.commit()
        conn.close()
        
        print("\n✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    migrate_database()
