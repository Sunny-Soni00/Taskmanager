import asyncio
import sys
sys.path.insert(0, '.')

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.services.team_service import TeamService
from app.services.user_service import UserService

async def test_teams():
    engine = create_async_engine("sqlite+aiosqlite:///taskflow.db", echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Get users
        user_svc = UserService(session)
        user1 = await user_svc.get_by_email("sun@test.com")
        user2 = await user_svc.get_by_email("sunny@test.com")
        
        print(f"User 1: {user1.email} (ID: {user1.id})")
        print(f"User 2: {user2.email} (ID: {user2.id})")
        
        # Create team as user 1
        team_svc = TeamService(session)
        new_team = await team_svc.create_team("TEST_TEAM_USER1", owner_id=user1.id)
        print(f"\n✓ Created team '{new_team.name}' by User 1 (owner_id: {new_team.owner_id})")
        
        # Check what teams each user sees
        user1_teams = await team_svc.list_teams_for_user(user1.id)
        user2_teams = await team_svc.list_teams_for_user(user2.id)
        
        print(f"\n=== TEAMS VISIBLE TO USER 1 ===")
        for team in user1_teams:
            print(f"  - {team['name']} (ID: {team['id']})")
        
        print(f"\n=== TEAMS VISIBLE TO USER 2 ===")
        for team in user2_teams:
            print(f"  - {team['name']} (ID: {team['id']})")
        
        # Check if user 2 can see the new team
        new_team_visible_to_user2 = any(t['id'] == new_team.id for t in user2_teams)
        
        if new_team_visible_to_user2:
            print(f"\n❌ BUG FOUND: User 2 can see User 1's team!")
        else:
            print(f"\n✅ CORRECT: User 2 cannot see User 1's team")

asyncio.run(test_teams())
