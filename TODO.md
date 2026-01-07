# Fix Namespace Case Mismatch in GeekzKai Project

## Overview
The project has a namespace case mismatch: project name is 'GeekzKai' but namespaces are 'geekzKai'. This causes build errors in Docker. Need to update all namespaces and using statements to 'GeekzKai'.

## Steps
- [ ] Update namespaces in all model files (Models/*.cs)
- [ ] Update namespaces in Data/AppDbContext.cs
- [ ] Update namespaces in Services/*.cs
- [ ] Update namespaces in Hubs/*.cs
- [ ] Update using statements in Controllers/*.cs
- [ ] Update using statements in Program.cs
- [ ] Update migration files (Migrations/*.cs) - Note: Migrations are auto-generated, may need to regenerate after changes
- [ ] Test build to ensure errors are resolved

## Files to Update
### Models
- Comment.cs
- DTOs.cs
- Follow.cs
- LiveStream.cs
- LoginRequest.cs
- Message.cs
- Notification.cs
- Post.cs
- RegisterRequest.cs
- Room.cs
- UpdateProfileRequest.cs
- Upvote.cs
- User.cs

### Data
- AppDbContext.cs

### Services
- EmailService.cs
- NotificationService.cs

### Hubs
- ChatHub.cs

### Controllers
- All controllers using geekzKai.Models, geekzKai.Data, etc.

### Program.cs
- Update using statements and service registrations

### Migrations
- AppDbContextModelSnapshot.cs
- InitialCreate.Designer.cs
