# Complete .env File Setup Guide

## 📝 Current Status

Your `.env` file has:
- ✅ Database password: `saurabh9140`
- ✅ OpenAI API key: Added
- ⚠️ Email settings: **Need to add your Gmail info**

---

## 🔧 What You Need to Do

You need to replace **5 placeholders** in your `.env` file:

### Current Placeholders (Lines 19, 20, 25, 26, 30):
```
SMTP_USER=your-email@gmail.com          ← Replace this
SMTP_PASSWORD=your-app-password         ← Replace this
IMAP_USER=your-email@gmail.com          ← Replace this
IMAP_PASSWORD=your-app-password         ← Replace this
APP_EMAIL=your-email@gmail.com          ← Replace this
```

### Replace With:
```
SMTP_USER=YOUR_ACTUAL_EMAIL@gmail.com
SMTP_PASSWORD=YOUR_16_CHAR_APP_PASSWORD
IMAP_USER=YOUR_ACTUAL_EMAIL@gmail.com
IMAP_PASSWORD=YOUR_16_CHAR_APP_PASSWORD
APP_EMAIL=YOUR_ACTUAL_EMAIL@gmail.com
```

---

## 📧 How to Get Gmail App Password

### Step 1: Enable 2-Factor Authentication

1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the prompts to enable it
4. ✅ 2FA is now enabled

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. You'll see "App passwords" screen
3. In the "Select app" dropdown: Choose **"Mail"**
4. In the "Select device" dropdown: Choose **"Other (Custom name)"**
5. Type: **"RFP System"**
6. Click **"Generate"**

### Step 3: Copy the Password

You'll see a 16-character password like:
```
abcd efgh ijkl mnop
```

**IMPORTANT**:
- Copy this password
- Remove all spaces: `abcdefghijklmnop`
- This is what you'll use in your `.env` file

### Step 4: Enable IMAP

1. Open Gmail
2. Click Settings (⚙️ icon)
3. Click "See all settings"
4. Go to "Forwarding and POP/IMAP" tab
5. Under "IMAP access", select **"Enable IMAP"**
6. Click "Save Changes" at the bottom

✅ Gmail is now ready!

---

## ✏️ Example of Completed .env

Here's an example with **fake credentials** (don't use these):

```env
# Email Configuration (SMTP for sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=john.doe@gmail.com                    ← Your Gmail
SMTP_PASSWORD=abcdefghijklmnop                   ← Your app password (no spaces)

# Email Configuration (IMAP for receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=john.doe@gmail.com                    ← Same Gmail
IMAP_PASSWORD=abcdefghijklmnop                   ← Same app password
IMAP_TLS=true

# Application Configuration
APP_EMAIL=john.doe@gmail.com                    ← Same Gmail
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Quick Copy Template

Copy this template and fill in your details:

```env
# Email Configuration (SMTP for sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=_________________@gmail.com
SMTP_PASSWORD=____________________

# Email Configuration (IMAP for receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=_________________@gmail.com
IMAP_PASSWORD=____________________
IMAP_TLS=true

# Application Configuration
APP_EMAIL=_________________@gmail.com
FRONTEND_URL=http://localhost:3000
```

**Fill in the blanks with:**
1. Your Gmail address (3 times)
2. Your 16-character app password (2 times)

---

## ✅ Verification Checklist

After updating your `.env` file, verify:

- [ ] All `your-email@gmail.com` replaced with your actual email
- [ ] All `your-app-password` replaced with your 16-char app password
- [ ] App password has **NO SPACES** (should be 16 characters in one word)
- [ ] You used the **app password**, not your regular Gmail password
- [ ] IMAP is enabled in Gmail settings
- [ ] The email address is the same in all 3 places (SMTP_USER, IMAP_USER, APP_EMAIL)
- [ ] The app password is the same in both places (SMTP_PASSWORD, IMAP_PASSWORD)

---

## 🔍 Final .env File Should Look Like:

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
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# Email Configuration (SMTP for sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.actual.email@gmail.com          ← Your real email
SMTP_PASSWORD=abcdefghijklmnop                  ← Your real app password

# Email Configuration (IMAP for receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your.actual.email@gmail.com          ← Same email
IMAP_PASSWORD=abcdefghijklmnop                  ← Same app password
IMAP_TLS=true

# Application Configuration
APP_EMAIL=your.actual.email@gmail.com          ← Same email
FRONTEND_URL=http://localhost:3000
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T:
```env
SMTP_PASSWORD=abcd efgh ijkl mnop    # Spaces - WRONG!
SMTP_PASSWORD="abcdefghijklmnop"     # Quotes - WRONG!
SMTP_PASSWORD=your-regular-password  # Regular password - WRONG!
```

### ✅ DO:
```env
SMTP_PASSWORD=abcdefghijklmnop       # Correct format
```

---

## 🚀 After Completing .env

Once you've filled in all the email details:

1. **Save the file** (Ctrl+S)
2. **Close the file**
3. **Continue with the setup**:
   ```bash
   cd "c:\Users\ritik\Desktop\New folder (3)\backend"
   npm run seed
   ```

---

## 🆘 Need Help?

### "I can't find App passwords in my Google account"
- Make sure 2-Factor Authentication is enabled first
- Use this direct link: https://myaccount.google.com/apppasswords
- If still not available, your account might need additional verification

### "Should I use the same email for all 3 places?"
- Yes! Use the **same Gmail address** for:
  - `SMTP_USER`
  - `IMAP_USER`
  - `APP_EMAIL`

### "Should I use the same password for SMTP and IMAP?"
- Yes! Use the **same app password** for:
  - `SMTP_PASSWORD`
  - `IMAP_PASSWORD`

### "Can I use a different email provider?"
- Yes, but Gmail is recommended for easiest setup
- For Outlook/Yahoo, see SETUP_GUIDE.md

---

## 📸 Visual Reference

```
Your Gmail Settings:
┌────────────────────────────────────┐
│ Email: john.doe@gmail.com          │  ← Use this for SMTP_USER,
│ App Password: abcdefghijklmnop     │     IMAP_USER, APP_EMAIL
└────────────────────────────────────┘
                                         ← Use this for SMTP_PASSWORD,
                                            IMAP_PASSWORD
```

---

**Once your .env is complete, you're ready to run the backend!** 🎉

Next step: [RUN_LOCALLY.md](RUN_LOCALLY.md) - Step 6 onwards
