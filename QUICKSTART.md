# Quick Start Guide

Get the RFP Management System running in 10 minutes!

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js v18+ installed ([Download](https://nodejs.org/))
- [ ] PostgreSQL v14+ installed ([Download](https://www.postgresql.org/download/))
- [ ] OpenAI API key ([Get one](https://platform.openai.com/api-keys))
- [ ] Gmail account with app password ([Setup guide](#gmail-setup))

## 5-Step Setup

### Step 1: Database (2 minutes)

```bash
# Create database
createdb rfp_management

# Or using psql:
psql -U postgres
CREATE DATABASE rfp_management;
\q
```

### Step 2: Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env` with your details:
```env
DB_PASSWORD=your_postgres_password
OPENAI_API_KEY=sk-your-openai-key
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-16-char-app-password
APP_EMAIL=your-email@gmail.com
```

Initialize database:
```bash
npm run seed
```

### Step 3: Frontend Setup (2 minutes)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Step 4: Start Servers (1 minute)

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 5: Open Application (30 seconds)

Open http://localhost:3000 in your browser.

You're ready! 🎉

## Gmail Setup

### Generate App Password (2 minutes)

1. **Enable 2FA**: https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Follow setup

2. **Generate App Password**: https://myaccount.google.com/apppasswords
   - Select: Mail → Other (Custom name)
   - Enter: "RFP System"
   - Click "Generate"
   - **Copy the 16-character password** (no spaces)

3. **Enable IMAP**:
   - Open Gmail → Settings → "See all settings"
   - "Forwarding and POP/IMAP" tab
   - Enable IMAP → Save

Use this password for both `SMTP_PASSWORD` and `IMAP_PASSWORD` in your `.env` file.

## Quick Test

### Test 1: Create RFP (1 minute)

1. Click "Create RFP"
2. Paste:
   ```
   I need 10 laptops with 16GB RAM for $20,000. Delivery in 30 days, Net 30 payment, 1 year warranty.
   ```
3. Click "Create RFP"
4. ✓ RFP created!

### Test 2: Add Vendor (30 seconds)

1. Click "Vendors" → "Add Vendor"
2. Fill:
   - Name: Test Co
   - Email: your-email@gmail.com
3. Click "Create Vendor"
4. ✓ Vendor added!

### Test 3: Send RFP (30 seconds)

1. Go to your RFP → "Send to Vendors"
2. Select your vendor → Send
3. ✓ Check your email!

### Test 4: Reply & Parse (2 minutes)

1. Reply to the RFP email:
   ```
   10 Laptops at $1,800 each = $18,000
   Delivery: 25 days
   Payment: Net 30
   Warranty: 2 years
   ```
2. In the app: "Check Emails"
3. ✓ Proposal parsed automatically!

## Common Issues

### "Database connection failed"
→ Check PostgreSQL is running: `pg_ctl status`

### "Invalid API key"
→ Check OPENAI_API_KEY has no spaces/quotes

### "Email authentication failed"
→ Use app password, not regular Gmail password

### "Port already in use"
→ Kill process: `npx kill-port 5000` or `npx kill-port 3000`

## Next Steps

- Read [README.md](README.md) for detailed features
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for troubleshooting

## Full File Structure

```
rfp-management-system/
├── backend/
│   ├── src/
│   │   ├── config/database.ts       ← DB setup
│   │   ├── services/
│   │   │   ├── aiService.ts         ← OpenAI integration
│   │   │   └── emailService.ts      ← Email handling
│   │   ├── controllers/             ← API handlers
│   │   ├── routes/                  ← API routes
│   │   ├── types/                   ← TypeScript types
│   │   └── server.ts                ← Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── RFPList.tsx         ← RFP list view
│   │   │   ├── CreateRFP.tsx       ← Create RFP
│   │   │   ├── RFPDetail.tsx       ← RFP details & comparison
│   │   │   └── Vendors.tsx         ← Vendor management
│   │   ├── components/
│   │   │   └── common/             ← Reusable components
│   │   ├── services/api.ts         ← API client
│   │   ├── types/                  ← TypeScript types
│   │   └── App.tsx                 ← Main app
│   ├── .env.example
│   └── package.json
│
├── README.md                        ← Main documentation
├── QUICKSTART.md                    ← This file
├── SETUP_GUIDE.md                   ← Detailed setup
├── API_DOCUMENTATION.md             ← API docs
└── PROJECT_SUMMARY.md               ← Project overview
```

## Support

Need help?
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) troubleshooting section
- Review backend logs in terminal
- Check browser console (F12)

---

**Ready to streamline your RFP process? Let's go! 🚀**
