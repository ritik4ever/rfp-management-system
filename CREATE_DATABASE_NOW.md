# Create Database - Quick Guide

## ✅ Good News!
PostgreSQL is already installed on your system (version 17)!

You just need to create the database. Here are 3 easy methods:

---

## 🚀 Method 1: Double-Click Batch File (EASIEST)

1. Find the file: `create-database.bat` (in the project root folder)
2. **Double-click** it
3. Enter password when prompted: `saurabh9140`
4. Press Enter
5. ✅ Done!

---

## 🖥️ Method 2: Using pgAdmin (GUI - EASIEST FOR BEGINNERS)

1. **Open pgAdmin 4**
   - Press Windows key
   - Type: "pgAdmin"
   - Open it

2. **Connect to PostgreSQL**
   - You'll see "PostgreSQL 17" in the left sidebar
   - Click it
   - Enter password: `saurabh9140`

3. **Create Database**
   - Right-click on "Databases"
   - Select "Create" → "Database..."
   - Database name: `rfp_management`
   - Click "Save"

4. **Verify**
   - You should see `rfp_management` in the Databases list
   - ✅ Done!

---

## 💻 Method 3: Command Line

**Option A: Using Windows Command Prompt**

1. Open Command Prompt (not WSL)
2. Run this command:
   ```cmd
   "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
   ```
3. Enter password: `saurabh9140`
4. In the PostgreSQL prompt, type:
   ```sql
   CREATE DATABASE rfp_management;
   ```
5. Press Enter
6. Type `\q` to exit
7. ✅ Done!

**Option B: Using PowerShell**

1. Open PowerShell
2. Run:
   ```powershell
   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE rfp_management;"
   ```
3. Enter password: `saurabh9140`
4. ✅ Done!

---

## ✅ After Creating the Database

Once the database is created, go back to your terminal and run:

```bash
cd backend
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

## 🔧 Troubleshooting

### "password authentication failed"
- Make sure you're using: `saurabh9140`
- This must match `DB_PASSWORD` in your `.env` file

### "could not connect to server"
PostgreSQL service might not be running.

**Fix:**
1. Press `Win + R`
2. Type: `services.msc`
3. Press Enter
4. Find "postgresql-x64-17" in the list
5. Right-click → Start
6. Try again

### "database already exists"
Good! That means it's already created. Just run:
```bash
npm run seed
```

---

## 📝 Quick Checklist

After you create the database:

- [ ] Database `rfp_management` created
- [ ] Run: `npm run seed` (should succeed)
- [ ] Run: `npm run dev` (in backend folder)
- [ ] Open new terminal
- [ ] Run: `npm run dev` (in frontend folder)
- [ ] Open browser: http://localhost:3000

---

## 🎯 Recommended Method

**I recommend Method 2 (pgAdmin GUI)** because:
- ✅ Visual interface
- ✅ Easy to see what you're doing
- ✅ No command line needed
- ✅ Can verify database was created

---

**Choose whichever method you're comfortable with and let's get this database created!** 🚀
