# Detailed Setup Guide

This guide provides step-by-step instructions to set up the AI-Powered RFP Management System.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [OpenAI API Setup](#openai-api-setup)
4. [Email Configuration](#email-configuration)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Application](#running-the-application)
8. [Testing the System](#testing-the-system)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   ```bash
   # Check version
   node --version

   # Download from: https://nodejs.org/
   ```

2. **PostgreSQL** (v14 or higher)
   ```bash
   # Check version
   psql --version

   # Download from: https://www.postgresql.org/download/
   ```

3. **Git**
   ```bash
   # Check version
   git --version

   # Download from: https://git-scm.com/downloads
   ```

### Required Accounts

1. **OpenAI Account**
   - Sign up at: https://platform.openai.com
   - Add payment method
   - Generate API key

2. **Email Account** (Gmail recommended)
   - Gmail account with 2FA enabled
   - App password generated

---

## Database Setup

### Option 1: PostgreSQL on Windows

1. **Download PostgreSQL**
   - Go to https://www.postgresql.org/download/windows/
   - Download the installer
   - Run the installer

2. **During Installation**
   - Remember the password you set for the postgres user
   - Default port: 5432
   - Install pgAdmin (recommended)

3. **Create Database**

   Using pgAdmin:
   - Open pgAdmin
   - Right-click on "Databases"
   - Select "Create" → "Database"
   - Name: `rfp_management`
   - Click "Save"

   Using Command Line:
   ```bash
   # Open PostgreSQL shell
   psql -U postgres

   # Create database
   CREATE DATABASE rfp_management;

   # Exit
   \q
   ```

### Option 2: PostgreSQL on macOS

1. **Install via Homebrew**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Create Database**
   ```bash
   createdb rfp_management
   ```

### Option 3: PostgreSQL on Linux

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # Start service
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE rfp_management;
   \q
   ```

### Verify Database Connection

```bash
psql -U postgres -d rfp_management
```

If successful, you'll see:
```
rfp_management=#
```

Type `\q` to exit.

---

## OpenAI API Setup

### Step 1: Create Account

1. Go to https://platform.openai.com
2. Click "Sign Up"
3. Complete registration

### Step 2: Add Payment Method

1. Go to https://platform.openai.com/account/billing
2. Click "Add payment method"
3. Enter credit card details
4. Set usage limits (recommended: $50/month for development)

### Step 3: Generate API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it: "RFP Management System"
4. **IMPORTANT:** Copy the key immediately (you won't see it again)
5. Save it securely

### Expected Costs

For testing/development:
- RFP Creation: ~$0.03 per request (GPT-4 Turbo)
- Proposal Parsing: ~$0.02 per proposal (GPT-4 Turbo)
- Comparison: ~$0.04 per comparison (GPT-4 Turbo)
- Scoring: ~$0.001 per score (GPT-3.5 Turbo)

Typical development usage: $5-10/month

---

## Email Configuration

### Gmail Setup (Recommended)

#### Step 1: Enable 2-Step Verification

1. Go to https://myaccount.google.com/security
2. Under "Signing in to Google", click "2-Step Verification"
3. Follow the setup process

#### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Under "Select app", choose "Mail"
3. Under "Select device", choose "Other (Custom name)"
4. Enter "RFP Management System"
5. Click "Generate"
6. **Copy the 16-character password** (remove spaces)
7. This is your `SMTP_PASSWORD` and `IMAP_PASSWORD`

#### Step 3: Enable IMAP

1. Open Gmail
2. Click Settings (gear icon)
3. Go to "See all settings"
4. Click "Forwarding and POP/IMAP" tab
5. Under "IMAP access", select "Enable IMAP"
6. Click "Save Changes"

### Gmail Configuration Values

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password
IMAP_TLS=true

APP_EMAIL=your-email@gmail.com
```

### Outlook/Office 365 Setup

#### Configuration Values

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password

IMAP_HOST=outlook.office365.com
IMAP_PORT=993
IMAP_USER=your-email@outlook.com
IMAP_PASSWORD=your-password
IMAP_TLS=true

APP_EMAIL=your-email@outlook.com
```

### Yahoo Mail Setup

#### Configuration Values

```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@yahoo.com
SMTP_PASSWORD=your-app-password

IMAP_HOST=imap.mail.yahoo.com
IMAP_PORT=993
IMAP_USER=your-email@yahoo.com
IMAP_PASSWORD=your-app-password
IMAP_TLS=true

APP_EMAIL=your-email@yahoo.com
```

Note: Yahoo also requires app passwords. Generate at: https://login.yahoo.com/account/security

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- express
- pg (PostgreSQL client)
- dotenv
- cors
- openai
- nodemailer
- imap
- mailparser
- TypeScript and type definitions

### Step 3: Create Environment File

```bash
# Copy example file
cp .env.example .env

# Edit the file
# Windows: notepad .env
# macOS/Linux: nano .env
```

### Step 4: Configure Environment Variables

Edit `.env` with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfp_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-openai-key-here

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

### Step 5: Initialize Database and Seed Data

```bash
npm run seed
```

Expected output:
```
🌱 Starting database seeding...
✅ Database tables initialized successfully
✅ Seeded 4 vendors
🎉 Database seeding completed successfully!
```

### Step 6: Verify Setup

```bash
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚀 RFP Management System Backend                ║
║                                                    ║
║   Server running on: http://localhost:5000        ║
║   Environment: development                         ║
║   Database: rfp_management                         ║
║                                                    ║
║   API Documentation: /api                          ║
║   Health Check: /health                            ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

### Step 7: Test Backend

Open http://localhost:5000/health in your browser.

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": 5.123
}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- react & react-dom
- react-router-dom
- axios
- tailwindcss
- vite
- TypeScript
- lucide-react (icons)
- react-hot-toast (notifications)
- date-fns (date formatting)

### Step 3: Create Environment File

```bash
# Copy example file
cp .env.example .env
```

### Step 4: Configure Environment

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.7  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 6: Open Application

Open http://localhost:3000 in your browser.

You should see the RFP Management System interface.

---

## Running the Application

### Development Mode

You need **two terminal windows**:

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Production Mode

#### Build Backend
```bash
cd backend
npm run build
npm start
```

#### Build Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## Testing the System

### Test 1: Create an RFP

1. Go to http://localhost:3000
2. Click "Create RFP"
3. Enter this text:
   ```
   I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty.
   ```
4. Click "Create RFP"
5. Wait for AI processing (~5-10 seconds)
6. Verify the structured RFP is created

### Test 2: Add a Vendor

1. Click "Vendors" in navigation
2. Click "Add Vendor"
3. Fill in:
   - Name: Test Vendor
   - Email: your-test-email@gmail.com (use your own)
   - Phone: +1-555-1234
   - Contact Person: Test Person
4. Click "Create Vendor"

### Test 3: Send RFP to Vendor

1. Go back to RFPs (click "RFPs" in navigation)
2. Click on your created RFP
3. Click "Send to Vendors"
4. Select your test vendor
5. Click "Send to X Vendor(s)"
6. Check your email for the RFP

### Test 4: Send a Proposal (Manual)

1. Reply to the RFP email with:
   ```
   Subject: Re: RFP: [Your RFP Title]

   Dear Procurement Team,

   We are pleased to submit our proposal:

   Laptops (20 units): $1,800 each = $36,000
   Monitors (15 units): $400 each = $6,000
   Total: $42,000

   Delivery: 25 days
   Payment Terms: Net 30
   Warranty: 2 years

   Best regards,
   Test Vendor
   ```

2. Send the email

### Test 5: Check for Proposals

1. In the RFP detail page, click "Check Emails"
2. Wait ~5-10 seconds for processing
3. The proposal should appear
4. Verify AI parsing extracted the data

### Test 6: Compare Proposals

1. Send at least 2 proposals (or create more test vendors)
2. After receiving 2+ proposals, scroll down
3. View the "AI Recommendation" section
4. Verify scores, pros/cons, and recommendations

---

## Troubleshooting

### Database Issues

#### Error: "password authentication failed"

**Solution:**
1. Verify your DB_PASSWORD in `.env`
2. Try connecting manually:
   ```bash
   psql -U postgres -d rfp_management
   ```
3. If failed, reset PostgreSQL password

#### Error: "database does not exist"

**Solution:**
```bash
createdb rfp_management
# or
psql -U postgres
CREATE DATABASE rfp_management;
```

#### Error: "relation does not exist"

**Solution:**
```bash
cd backend
npm run seed
```

### OpenAI Issues

#### Error: "Invalid API key"

**Solution:**
1. Verify your OPENAI_API_KEY in `.env`
2. Check no extra spaces or quotes
3. Generate a new key at https://platform.openai.com/api-keys

#### Error: "Rate limit exceeded"

**Solution:**
1. Wait a few minutes
2. Check usage at https://platform.openai.com/account/usage
3. Increase rate limits or wait for reset

#### Error: "Insufficient quota"

**Solution:**
1. Add payment method at https://platform.openai.com/account/billing
2. Add credits to your account

### Email Issues

#### Error: "Invalid login"

**Gmail Solution:**
1. Verify 2FA is enabled
2. Generate new app password
3. Copy password without spaces
4. Update SMTP_PASSWORD and IMAP_PASSWORD

#### Error: "Connection timeout"

**Solution:**
1. Check firewall settings
2. Verify SMTP/IMAP ports (587/993)
3. Try different network (some block SMTP)

#### Emails not being sent

**Solution:**
1. Check backend logs for errors
2. Verify SMTP credentials
3. Test with a different email provider
4. Check spam folder

#### Proposals not detected

**Solution:**
1. Verify IMAP credentials
2. Check that email subject contains "RFP"
3. Manually trigger with "Check Emails" button
4. Check email_processing_log table:
   ```sql
   SELECT * FROM email_processing_log ORDER BY created_at DESC;
   ```

### Frontend Issues

#### Error: "Failed to fetch"

**Solution:**
1. Verify backend is running (http://localhost:5000/health)
2. Check VITE_API_URL in frontend/.env
3. Check browser console for CORS errors

#### Page not loading

**Solution:**
1. Clear browser cache
2. Check browser console for errors
3. Verify frontend dev server is running
4. Try http://localhost:3000 directly

### Port Already in Use

#### Backend port 5000 in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### Frontend port 3000 in use

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

Or change the port in `frontend/vite.config.ts`:
```typescript
server: {
  port: 3001,  // Change to different port
  ...
}
```

### Build Issues

#### TypeScript errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Module not found

**Solution:**
```bash
npm install
```

---

## Next Steps

After successful setup:

1. **Customize Seeded Data**
   - Edit `backend/src/utils/seed.ts`
   - Add your actual vendors
   - Run `npm run seed` again

2. **Production Deployment**
   - Set up environment variables on your hosting platform
   - Configure production database
   - Enable HTTPS
   - Set NODE_ENV=production

3. **Monitoring**
   - Set up logging (Winston, Pino)
   - Monitor OpenAI API usage
   - Track email delivery rates

4. **Security**
   - Add authentication
   - Implement rate limiting
   - Enable HTTPS only
   - Regular security audits

---

## Getting Help

If you encounter issues not covered here:

1. Check the [README.md](README.md) for more information
2. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
3. Check backend logs in the terminal
4. Check browser console for frontend errors
5. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

**Happy RFP Managing! 🚀**
