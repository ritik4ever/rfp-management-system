# Run Locally - Step by Step Guide

## Prerequisites Check

You have:
- ✅ Node.js v23.6.1 (Perfect!)

You need to install:
- ⚠️ PostgreSQL (Database)
- ⚠️ OpenAI API Key
- ⚠️ Gmail account with app password

---

## Step 1: Install PostgreSQL

### Windows Installation

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download the Windows installer (version 14 or higher)
   - Run the installer

2. **During Installation**
   - Remember the password you set for the 'postgres' user
   - Default port: 5432 (keep it)
   - Install all components (including pgAdmin)

3. **Verify Installation**
   ```cmd
   psql --version
   ```

4. **Create Database**

   **Option A: Using pgAdmin (GUI)**
   - Open pgAdmin
   - Right-click "Databases"
   - Click "Create" → "Database"
   - Name: `rfp_management`
   - Click "Save"

   **Option B: Using Command Line**
   ```cmd
   # Open Command Prompt as Administrator
   psql -U postgres
   # Enter your postgres password

   # Create database
   CREATE DATABASE rfp_management;

   # Exit
   \q
   ```

---

## Step 2: Get OpenAI API Key

1. **Sign Up / Login**
   - Go to: https://platform.openai.com
   - Sign up or log in

2. **Add Payment Method**
   - Go to: https://platform.openai.com/account/billing
   - Add credit card
   - Recommended: Set a usage limit ($10-20 for testing)

3. **Create API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: "RFP Management System"
   - **IMPORTANT**: Copy the key immediately (starts with `sk-`)
   - Save it somewhere safe

**Cost Estimate**: $2-5 for testing

---

## Step 3: Setup Gmail for Email

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select: Mail → Other (custom name)
   - Enter: "RFP System"
   - Click "Generate"
   - **Copy the 16-character password** (no spaces)
   - This is your `SMTP_PASSWORD` and `IMAP_PASSWORD`

3. **Enable IMAP**
   - Open Gmail
   - Settings → "See all settings"
   - "Forwarding and POP/IMAP" tab
   - Enable IMAP
   - Save Changes

---

## Step 4: Install Backend Dependencies

```bash
cd "c:\Users\ritik\Desktop\New folder (3)\backend"
npm install
```

This installs:
- express, pg, dotenv, cors
- openai, nodemailer, imap, mailparser
- TypeScript and all type definitions

---

## Step 5: Configure Backend Environment

1. **Copy the example file**
   ```bash
   cd "c:\Users\ritik\Desktop\New folder (3)\backend"
   copy .env.example .env
   ```

2. **Edit the .env file**

   Open `backend\.env` in any text editor and fill in:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=rfp_management
   DB_USER=postgres
   DB_PASSWORD=YOUR_POSTGRES_PASSWORD_HERE

   # OpenAI Configuration
   OPENAI_API_KEY=sk-YOUR_OPENAI_API_KEY_HERE

   # Email Configuration (SMTP for sending)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password-here

   # Email Configuration (IMAP for receiving)
   IMAP_HOST=imap.gmail.com
   IMAP_PORT=993
   IMAP_USER=your-email@gmail.com
   IMAP_PASSWORD=your-16-char-app-password-here
   IMAP_TLS=true

   # Application Configuration
   APP_EMAIL=your-email@gmail.com
   FRONTEND_URL=http://localhost:3000
   ```

   **Important**: Replace:
   - `YOUR_POSTGRES_PASSWORD_HERE` - Your PostgreSQL password
   - `sk-YOUR_OPENAI_API_KEY_HERE` - Your OpenAI API key
   - `your-email@gmail.com` - Your Gmail address
   - `your-16-char-app-password-here` - Your Gmail app password

---

## Step 6: Initialize Database

```bash
cd "c:\Users\ritik\Desktop\New folder (3)\backend"
npm run seed
```

This will:
- Create all database tables
- Add 4 sample vendors
- Verify database connection

Expected output:
```
🌱 Starting database seeding...
✅ Database tables initialized successfully
✅ Seeded 4 vendors
🎉 Database seeding completed successfully!
```

---

## Step 7: Install Frontend Dependencies

Open a **NEW terminal window**:

```bash
cd "c:\Users\ritik\Desktop\New folder (3)\frontend"
npm install
```

This installs:
- react, react-dom, react-router-dom
- axios, tailwindcss, vite
- lucide-react, react-hot-toast

---

## Step 8: Configure Frontend Environment

```bash
cd "c:\Users\ritik\Desktop\New folder (3)\frontend"
copy .env.example .env
```

The `.env` file should contain:
```env
VITE_API_URL=http://localhost:5000/api
```

(Usually no changes needed)

---

## Step 9: Start the Backend Server

In your **first terminal**:

```bash
cd "c:\Users\ritik\Desktop\New folder (3)\backend"
npm run dev
```

You should see:
```
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 RFP Management System Backend                ║
║                                                    ║
║   Server running on: http://localhost:5000        ║
║   Environment: development                         ║
║   Database: rfp_management                         ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

**Keep this terminal running!**

---

## Step 10: Start the Frontend Server

In your **second terminal**:

```bash
cd "c:\Users\ritik\Desktop\New folder (3)\frontend"
npm run dev
```

You should see:
```
  VITE v5.0.7  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Keep this terminal running too!**

---

## Step 11: Open the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the RFP Management System interface! 🎉

---

## Quick Test

### Test 1: Create an RFP

1. Click "Create RFP" button
2. In the text area, paste:
   ```
   I need to procure 10 laptops with 16GB RAM and 5 monitors 27-inch for our office. Budget is $20,000. Need delivery within 30 days. Payment terms Net 30, warranty 1 year.
   ```
3. Click "Create RFP"
4. Wait 5-10 seconds for AI processing
5. ✅ You should see a structured RFP!

### Test 2: View Vendors

1. Click "Vendors" in the navigation
2. ✅ You should see 4 seeded vendors

### Test 3: Send RFP

1. Go back to "RFPs"
2. Click on your created RFP
3. Click "Send to Vendors"
4. Select a vendor (use one of the seeded ones)
5. Click "Send"
6. ✅ Check your email - you should receive the RFP!

### Test 4: Send a Proposal

1. Reply to the RFP email with:
   ```
   Subject: Re: RFP: [Your RFP Title]

   Dear Procurement Team,

   We are pleased to submit our proposal:

   10 Laptops with 16GB RAM: $1,500 each = $15,000
   5 Monitors 27-inch: $400 each = $2,000
   Total: $17,000

   Delivery: 25 days
   Payment Terms: Net 30
   Warranty: 2 years

   Best regards,
   Test Vendor
   ```

2. In the app, go to your RFP
3. Click "Check Emails"
4. Wait 5-10 seconds
5. ✅ Your proposal should appear, automatically parsed!

---

## Troubleshooting

### Problem: Backend won't start

**Error: "Database connection failed"**
```bash
# Check if PostgreSQL is running
# Open Services (Win + R, type "services.msc")
# Find "postgresql-x64-XX" and start it

# OR restart PostgreSQL
pg_ctl restart
```

**Error: "Port 5000 already in use"**
```bash
# Kill the process
npx kill-port 5000
```

### Problem: Frontend won't start

**Error: "Port 3000 already in use"**
```bash
# Kill the process
npx kill-port 3000
```

### Problem: Can't connect to database

1. Check PostgreSQL is running
2. Verify password in `backend\.env`
3. Try connecting manually:
   ```bash
   psql -U postgres -d rfp_management
   ```

### Problem: OpenAI errors

**Error: "Invalid API key"**
- Check `OPENAI_API_KEY` in `backend\.env`
- Ensure no extra spaces or quotes
- Generate a new key if needed

**Error: "Insufficient quota"**
- Add payment method at https://platform.openai.com/account/billing
- Add credits to your account

### Problem: Email not sending

**Error: "Invalid login"**
- Use Gmail app password (not regular password)
- Verify 2FA is enabled
- Generate new app password

**Emails not received**
- Check spam folder
- Verify SMTP credentials in `.env`
- Try sending to a different email

### Problem: Proposals not detected

1. Ensure email subject contains "RFP"
2. Reply to the RFP email (don't create new email)
3. Check backend logs for errors
4. Manually click "Check Emails" button

---

## Daily Usage

### Starting the System

1. **Terminal 1 - Backend:**
   ```bash
   cd "c:\Users\ritik\Desktop\New folder (3)\backend"
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd "c:\Users\ritik\Desktop\New folder (3)\frontend"
   npm run dev
   ```

3. **Browser:**
   ```
   http://localhost:3000
   ```

### Stopping the System

- Press `Ctrl + C` in both terminal windows
- Or just close the terminals

---

## Helpful Commands

### Backend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Initialize/reset database
npm run seed

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Commands
```bash
# Connect to database
psql -U postgres -d rfp_management

# View tables
\dt

# View table structure
\d vendors

# View data
SELECT * FROM vendors;

# Exit
\q
```

---

## Next Steps

Once you have it running:

1. **Explore the Features**
   - Create different types of RFPs
   - Add your own vendors
   - Test the full workflow

2. **Customize**
   - Modify colors in `frontend/tailwind.config.js`
   - Adjust AI prompts in `backend/src/services/aiService.ts`
   - Add your company branding

3. **Deploy**
   - Follow deployment guides when ready
   - Set up production environment variables
   - Configure production database

---

## Getting Help

- **Check Documentation**: All guides are in the root folder
- **Backend Logs**: Check the terminal running backend
- **Frontend Logs**: Press F12 in browser → Console tab
- **Database Issues**: See SETUP_GUIDE.md Troubleshooting

---

## Summary Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `rfp_management` created
- [ ] OpenAI API key obtained
- [ ] Gmail app password generated
- [ ] Backend `.env` configured
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database seeded (`npm run seed`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend server running (Terminal 1)
- [ ] Frontend server running (Terminal 2)
- [ ] Browser opened to http://localhost:3000
- [ ] First RFP created successfully

---

**You're all set! Enjoy your AI-Powered RFP Management System! 🚀**

Need more help? Check the other documentation files:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [QUICKSTART.md](QUICKSTART.md) - Quick reference
- [README.md](README.md) - Complete documentation
