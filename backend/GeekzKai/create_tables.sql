-- Create Users table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "Bio" VARCHAR(200),
    "FollowersCount" INTEGER NOT NULL DEFAULT 0,
    "FollowingCount" INTEGER NOT NULL DEFAULT 0,
    "IsActive" BOOLEAN NOT NULL DEFAULT true,
    "IsAdmin" BOOLEAN NOT NULL DEFAULT false,
    "IsYoutuber" BOOLEAN NOT NULL DEFAULT false,
    "ProfilePictureUrl" TEXT,
    "YouTubeChannelLink" TEXT,
    "AuthProvider" TEXT NOT NULL DEFAULT 'local',
    "EmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "EmailVerificationToken" TEXT,
    "LastLoginAt" TIMESTAMP WITH TIME ZONE
);

-- Create Posts table
CREATE TABLE IF NOT EXISTS "Posts" (
    "Id" SERIAL PRIMARY KEY,
    "Question" TEXT NOT NULL,
    "Description" TEXT,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "UserId" INTEGER NOT NULL,
    FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS "Notifications" (
    "Id" SERIAL PRIMARY KEY,
    "UserId" INTEGER NOT NULL,
    "FromUserId" INTEGER NOT NULL,
    "Type" TEXT NOT NULL,
    "Message" TEXT NOT NULL,
    "IsRead" BOOLEAN NOT NULL DEFAULT false,
    "CreatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE,
    FOREIGN KEY ("FromUserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "IX_Posts_UserId" ON "Posts" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_Notifications_UserId" ON "Notifications" ("UserId");
CREATE INDEX IF NOT EXISTS "IX_Notifications_FromUserId" ON "Notifications" ("FromUserId");