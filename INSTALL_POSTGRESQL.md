# Install PostgreSQL on Windows

## Current Status
✅ Backend code is ready
✅ Dependencies installed
✅ .env file configured
❌ PostgreSQL not installed yet

---

## Quick Install Guide

### Step 1: Download PostgreSQL

1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Choose the latest version (16.x or 15.x)
4. Download the Windows x86-64 installer

### Step 2: Run the Installer

1. Double-click the downloaded file
2. Click "Next" through the welcome screen
3. **Installation Directory**: Keep default (C:\Program Files\PostgreSQL\16)
4. **Select Components**: Keep all checked (PostgreSQL Server, pgAdmin 4, Stack Builder, Command Line Tools)
5. **Data Directory**: Keep default
6. **Password**:
   - Enter: `saurabh9140` (same as in your .env file)
   - **Remember this password!**
7. **Port**: Keep `5432`
8. **Locale**: Keep default
9. Click "Next" then "Install"
10. Wait for installation to complete (5-10 minutes)
11. Uncheck "Launch Stack Builder"
12. Click "Finish"

### Step 3: Verify Installation

Open a **NEW** terminal/command prompt and run:

```bash
psql --version
```

You should see something like:
```
psql (PostgreSQL) 16.x
```

If you get "command not found", you need to add PostgreSQL to your PATH (see below).

### Step 4: Create Database

**Option A: Using pgAdmin (GUI - Easiest)**

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. It will ask for a master password - create one
3. In the left sidebar, expand "Servers"
4. Right-click "PostgreSQL 16" → "Connect"
5. Enter password: `saurabh9140`
6. Right-click "Databases" → "Create" → "Database"
7. Database name: `rfp_management`
8. Click "Save"
9. ✅ Database created!

**Option B: Using Command Line**

Open Command Prompt or PowerShell:

```cmd
# Connect to PostgreSQL
psql -U postgres

# Enter password: saurabh9140

# Create database
CREATE DATABASE rfp_management;

# Verify
\l

# Exit
\q
```

---

## Add PostgreSQL to PATH (If Needed)

If `psql --version` doesn't work, add PostgreSQL to your PATH:

### Windows 11/10:

1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find and select "Path"
5. Click "Edit"
6. Click "New"
7. Add: `C:\Program Files\PostgreSQL\16\bin`
8. Click "OK" on all windows
9. **Close and reopen** your terminal
10. Try `psql --version` again

---

## After PostgreSQL is Installed

Once PostgreSQL is installed and the database is created:

```bash
# Go to backend folder
cd "c:\Users\ritik\Desktop\New folder (3)\backend"

# Run the seed script
npm run seed
```

You should see:
```
🌱 Starting database seeding...
✅ Database tables initialized successfully
✅ Seeded 4 vendors
🎉 Database seeding completed successfully!
```

---

## Troubleshooting

### "psql: command not found" after installation

- PostgreSQL might not be in your PATH
- Follow the "Add PostgreSQL to PATH" section above
- Or use pgAdmin GUI instead

### "password authentication failed"

- Make sure you're using password: `saurabh9140`
- This should match `DB_PASSWORD` in your `.env` file

### "port 5432 is already in use"

- Another application is using port 5432
- Either:
  - Stop that application
  - Or change PostgreSQL port during installation

### Can't connect to PostgreSQL

```bash
# Check if PostgreSQL is running (Windows)
# Open Services (Win + R, type "services.msc")
# Find "postgresql-x64-16" or similar
# Right-click → Start
```

---

## Quick Alternative: Docker (Advanced)

If you prefer Docker:

```bash
# Pull PostgreSQL image
docker pull postgres:16

# Run PostgreSQL container
docker run --name rfp-postgres -e POSTGRES_PASSWORD=saurabh9140 -p 5432:5432 -d postgres:16

# Create database
docker exec -it rfp-postgres psql -U postgres -c "CREATE DATABASE rfp_management;"
```

---

## Next Steps

After PostgreSQL is installed and database is created:

1. ✅ Run: `npm run seed` (in backend folder)
2. ✅ Run: `npm run dev` (start backend)
3. ✅ Run: `npm run dev` (start frontend in new terminal)
4. ✅ Open: http://localhost:3000

---

## Need Help?

If you're stuck:

1. Make sure PostgreSQL installed successfully
2. Check Windows Services to see if PostgreSQL is running
3. Try using pgAdmin GUI instead of command line
4. Verify password matches your .env file

---

**Download Link**: https://www.postgresql.org/download/windows/

**Installation Video**: Search YouTube for "Install PostgreSQL on Windows 11"
