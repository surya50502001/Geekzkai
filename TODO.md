# EF Core Relationship Fix

## Issue
- EF Core warning: "The foreign key property 'Upvote.UserId1' was created in shadow state"
- Application crashing on startup due to database connection failure

## Root Cause
- Upvote-User relationship configuration was incomplete
- Production database connection string is invalid/missing

## Solution Applied
- [x] Fixed Upvote-User relationship in AppDbContext.cs
- [x] Updated Program.cs to always use PostgreSQL
- [x] Created FixUpvoteUserRelationship migration
- [x] Temporarily disabled auto-migration to prevent crashes

## Next Steps
1. **Update Render environment variables** with correct PostgreSQL connection string:
   ```
   ConnectionStrings__DefaultConnection=postgresql://username:password@hostname:port/database
   ```
2. **Deploy the updated code** to Render
3. **Re-enable auto-migration** in Program.cs
4. **Run migration** to apply the relationship fix

## Files Modified
- backend/GeekzKai/Data/AppDbContext.cs (relationship fix)
- backend/GeekzKai/Program.cs (PostgreSQL config + temp migration disable)
- backend/GeekzKai/.env (PostgreSQL connection string format)
