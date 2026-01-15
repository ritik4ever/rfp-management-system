# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                    (React + TypeScript)                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/HTTPS
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Server                                │
│               (Node.js + Express + TypeScript)                   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Controllers  │  │   Services    │  │   Routes     │          │
│  │              │  │               │  │              │          │
│  │ - RFP        │─▶│ - AI Service  │  │ - /api/rfps  │          │
│  │ - Vendor     │  │ - Email Svc   │  │ - /api/vend  │          │
│  │ - Proposal   │  │               │  │ - /api/prop  │          │
│  └──────────────┘  └───────┬───────┘  └──────────────┘          │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌───────────┐    ┌──────────┐    ┌──────────────┐
    │ PostgreSQL│    │ OpenAI   │    │ Email Server │
    │ Database  │    │ API      │    │ (SMTP/IMAP)  │
    │           │    │ (GPT-4)  │    │              │
    └───────────┘    └──────────┘    └──────────────┘
```

## Detailed Component Architecture

### Frontend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     React Application                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                      Pages                           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │  │
│  │  │ RFPList  │ │ CreateRFP│ │RFPDetail │            │  │
│  │  └──────────┘ └──────────┘ └──────────┘            │  │
│  │  ┌──────────┐                                       │  │
│  │  │ Vendors  │                                       │  │
│  │  └──────────┘                                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                 │
│                          ▼                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  Components                          │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                  │  │
│  │  │ Layout │ │ Modal  │ │Spinner │                  │  │
│  │  └────────┘ └────────┘ └────────┘                  │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                 │
│                          ▼                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                  Services                            │  │
│  │  ┌────────────────────────────────────────────┐     │  │
│  │  │         API Service (Axios)                │     │  │
│  │  │  - rfpAPI                                  │     │  │
│  │  │  - vendorAPI                               │     │  │
│  │  │  - proposalAPI                             │     │  │
│  │  └────────────────────────────────────────────┘     │  │
│  └─────────────────────────────────────────────────────┘  │
│                          │                                 │
│                          ▼                                 │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              React Router                            │  │
│  │         (Navigation & Routing)                       │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Express Server                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Middleware                            │ │
│  │  - CORS                                                 │ │
│  │  - Body Parser                                          │ │
│  │  - Error Handler                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Routes                               │ │
│  │  /api/rfps        → RFP Controller                      │ │
│  │  /api/vendors     → Vendor Controller                   │ │
│  │  /api/proposals   → Proposal Controller                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 Controllers                             │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │ │
│  │  │RFPController │ │VendorController│ProposalCtrl  │   │ │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘   │ │
│  └─────────┼────────────────┼────────────────┼───────────┘ │
│            │                │                │              │
│            ▼                ▼                ▼              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Services                              │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │            AI Service                             │  │ │
│  │  │  - parseRFPFromNaturalLanguage()                 │  │ │
│  │  │  - parseProposalEmail()                          │  │ │
│  │  │  - compareProposals()                            │  │ │
│  │  │  - scoreProposal()                               │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │            Email Service                          │  │ │
│  │  │  - sendRFPToVendors()                            │  │ │
│  │  │  - checkForNewProposals()                        │  │ │
│  │  │  - processProposalEmail()                        │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                Database Layer                           │ │
│  │  - Connection Pool (pg)                                 │ │
│  │  - Query Functions                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. RFP Creation Flow

```
┌──────┐                                                     ┌──────────┐
│ User │                                                     │ OpenAI   │
└──┬───┘                                                     │ GPT-4    │
   │                                                         └────┬─────┘
   │ 1. Enter natural language                                   │
   │    "I need 10 laptops..."                                   │
   ▼                                                              │
┌─────────────────┐                                              │
│ CreateRFP Page  │                                              │
└────────┬────────┘                                              │
         │ 2. POST /api/rfps                                     │
         │    { naturalLanguageInput: "..." }                    │
         ▼                                                        │
┌─────────────────┐                                              │
│ RFP Controller  │                                              │
└────────┬────────┘                                              │
         │ 3. Call aiService                                     │
         ▼                                                        │
┌─────────────────┐                                              │
│ AI Service      │─────4. OpenAI API Call────────────────────▶ │
│                 │                                              │
│                 │◀────5. Structured JSON──────────────────────┘
└────────┬────────┘       { title, description,
         │                  budget, requirements, ... }
         │ 6. INSERT INTO rfps
         ▼
┌─────────────────┐
│ PostgreSQL      │
└────────┬────────┘
         │ 7. Return RFP
         ▼
┌─────────────────┐
│ Frontend        │
│ Display RFP     │
└─────────────────┘
```

### 2. Send RFP to Vendors Flow

```
┌──────┐                                                  ┌────────────┐
│ User │                                                  │ Email      │
└──┬───┘                                                  │ Server     │
   │                                                      │ (SMTP)     │
   │ 1. Select vendors                                    └──────┬─────┘
   │    Click "Send to Vendors"                                 │
   ▼                                                             │
┌─────────────────┐                                             │
│ RFPDetail Page  │                                             │
└────────┬────────┘                                             │
         │ 2. POST /api/rfps/send                               │
         │    { rfpId, vendorIds: [...] }                       │
         ▼                                                       │
┌─────────────────┐                                             │
│ Vendor Ctrl     │                                             │
└────────┬────────┘                                             │
         │ 3. Call emailService                                 │
         ▼                                                       │
┌─────────────────┐                                             │
│ Email Service   │                                             │
│                 │─4. For each vendor:                         │
│                 │   - Generate email HTML                     │
│                 │   - Send via SMTP ─────────────────────────▶│
│                 │                                             │
│                 │◀─5. Delivery confirmation──────────────────┘
└────────┬────────┘
         │ 6. UPDATE rfp_vendors
         │    SET sent_at = now(), email_sent = true
         ▼
┌─────────────────┐
│ PostgreSQL      │
└────────┬────────┘
         │ 7. Success response
         ▼
┌─────────────────┐
│ Frontend        │
│ Show success    │
└─────────────────┘
```

### 3. Proposal Processing Flow

```
┌────────┐                                         ┌──────────┐
│ Vendor │                                         │ OpenAI   │
└───┬────┘                                         │ GPT-4    │
    │                                              └────┬─────┘
    │ 1. Reply to RFP email                             │
    │    "20 laptops at $1,800..."                      │
    ▼                                                    │
┌─────────────┐                                         │
│ Email Server│                                         │
│ (IMAP)      │                                         │
└──────┬──────┘                                         │
       │ 2. User clicks "Check Emails"                  │
       │    or automatic polling                        │
       ▼                                                 │
┌────────────────┐                                      │
│ Proposal Ctrl  │                                      │
└────────┬───────┘                                      │
         │ 3. Call emailService                         │
         ▼                                               │
┌────────────────┐                                      │
│ Email Service  │                                      │
│                │─4. Connect IMAP, fetch unseen        │
│                │   emails with "RFP" in subject       │
│                │                                      │
│                │─5. For each email:                   │
│                │   - Parse email                      │
│                │   - Match vendor by email            │
│                │   - Match RFP                        │
│                │   - Call AI Service ─────────────────▶│
│                │                                      │
│                │◀─6. Parsed proposal JSON─────────────┘
│                │   { total_price, delivery_time,
│                │     items: [...], strengths: [...] }
└────────┬───────┘
         │ 7. INSERT INTO proposals
         │    (parsed_data, ai_score, ai_summary, ...)
         ▼
┌────────────────┐
│ PostgreSQL     │
└────────┬───────┘
         │ 8. Return proposals
         ▼
┌────────────────┐
│ Frontend       │
│ Display        │
│ proposals      │
└────────────────┘
```

### 4. Proposal Comparison Flow

```
┌──────┐                                                ┌──────────┐
│ User │                                                │ OpenAI   │
└──┬───┘                                                │ GPT-4    │
   │                                                    └────┬─────┘
   │ 1. View RFP with 2+ proposals                          │
   │    (Comparison auto-loads)                             │
   ▼                                                         │
┌─────────────────┐                                         │
│ RFPDetail Page  │                                         │
└────────┬────────┘                                         │
         │ 2. GET /api/proposals/compare/:rfpId             │
         ▼                                                   │
┌─────────────────┐                                         │
│ Proposal Ctrl   │                                         │
└────────┬────────┘                                         │
         │ 3. Fetch RFP + all proposals                     │
         ▼                                                   │
┌─────────────────┐                                         │
│ PostgreSQL      │                                         │
└────────┬────────┘                                         │
         │ 4. Call aiService.compareProposals()             │
         ▼                                                   │
┌─────────────────┐                                         │
│ AI Service      │─5. Send all proposals + RFP───────────▶ │
│                 │   "Compare these proposals..."          │
│                 │                                         │
│                 │◀─6. AI Analysis────────────────────────┘
│                 │   { best_overall, best_price,
│                 │     best_delivery, summary,
│                 │     details: [{ vendor, score,
│                 │       pros: [...], cons: [...] }] }
└────────┬────────┘
         │ 7. Return comparison
         ▼
┌─────────────────┐
│ Frontend        │
│ Display:        │
│ - Best overall  │
│ - Scores        │
│ - Pros/cons     │
│ - Summary       │
└─────────────────┘
```

## Database Schema

```
┌──────────────────────────┐
│        vendors           │
├──────────────────────────┤
│ id (UUID) PK             │
│ name VARCHAR             │
│ email VARCHAR UNIQUE     │
│ phone VARCHAR            │
│ contact_person VARCHAR   │
│ address TEXT             │
│ created_at TIMESTAMP     │
│ updated_at TIMESTAMP     │
└─────────┬────────────────┘
          │
          │
          │ 1:N
          │
          │
┌─────────▼────────────────┐
│     rfp_vendors          │      ┌──────────────────────────┐
├──────────────────────────┤      │         rfps             │
│ id (UUID) PK             │      ├──────────────────────────┤
│ rfp_id (UUID) FK ────────┼─────▶│ id (UUID) PK             │
│ vendor_id (UUID) FK      │      │ title VARCHAR            │
│ sent_at TIMESTAMP        │      │ description TEXT         │
│ email_sent BOOLEAN       │      │ budget DECIMAL           │
│ created_at TIMESTAMP     │      │ delivery_deadline DATE   │
└─────────┬────────────────┘      │ payment_terms VARCHAR    │
          │                       │ warranty_period VARCHAR  │
          │                       │ requirements JSONB       │
          │                       │ status VARCHAR           │
          │                       │ created_at TIMESTAMP     │
          │                       │ updated_at TIMESTAMP     │
          │                       └─────────┬────────────────┘
          │                                 │
          │                                 │
          │                                 │ 1:N
          │                                 │
          │                                 │
          │                       ┌─────────▼────────────────┐
          └───────────────────────┤      proposals           │
                                  ├──────────────────────────┤
                                  │ id (UUID) PK             │
                                  │ rfp_id (UUID) FK         │
                                  │ vendor_id (UUID) FK      │
                                  │ email_subject VARCHAR    │
                                  │ email_body TEXT          │
                                  │ total_price DECIMAL      │
                                  │ delivery_time VARCHAR    │
                                  │ payment_terms VARCHAR    │
                                  │ warranty VARCHAR         │
                                  │ parsed_data JSONB        │
                                  │ raw_email_data JSONB     │
                                  │ ai_score DECIMAL         │
                                  │ ai_summary TEXT          │
                                  │ received_at TIMESTAMP    │
                                  │ created_at TIMESTAMP     │
                                  │ updated_at TIMESTAMP     │
                                  └──────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│  React · TypeScript · Tailwind CSS · React Router       │
│  Vite · Axios · Lucide Icons · React Hot Toast          │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
┌───────────────────────▼─────────────────────────────────┐
│                  Application Layer                       │
│  Node.js · Express · TypeScript                          │
│  Controllers · Services · Routes                         │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼────────┐
│   Data       │ │   AI/ML     │ │   Email      │
│   Layer      │ │   Layer     │ │   Layer      │
│              │ │             │ │              │
│ PostgreSQL   │ │ OpenAI      │ │ Nodemailer   │
│ pg (client)  │ │ GPT-4 Turbo │ │ IMAP         │
│ JSONB        │ │ GPT-3.5     │ │ MailParser   │
└──────────────┘ └─────────────┘ └──────────────┘
```

## Deployment Architecture (Recommended)

```
┌──────────────────────────────────────────────────────────┐
│                      Internet                             │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│                    Load Balancer                          │
│                   (nginx / AWS ALB)                       │
└───────────────────────┬──────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
┌───────────▼──────────┐ ┌──────────▼──────────┐
│   Frontend CDN       │ │   Backend Server    │
│   (Vercel/Netlify)   │ │   (Railway/Heroku)  │
│                      │ │                     │
│  - React Bundle      │ │  - Express API      │
│  - Static Assets     │ │  - Business Logic   │
│  - Auto Scaling      │ │  - Auto Scaling     │
└──────────────────────┘ └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
    ┌───────────▼────────┐ ┌────────▼────────┐ ┌───────▼────────┐
    │   PostgreSQL       │ │   OpenAI API    │ │  Email Server  │
    │   (AWS RDS /       │ │   (Cloud)       │ │  (Gmail /      │
    │    Supabase)       │ │                 │ │   SendGrid)    │
    │                    │ │                 │ │                │
    │  - Automatic       │ │  - Managed      │ │  - SMTP/IMAP   │
    │    Backups         │ │  - Scalable     │ │  - Reliable    │
    │  - Replication     │ │                 │ │                │
    └────────────────────┘ └─────────────────┘ └────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Security Layers                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Network Layer                                        │
│     ✓ HTTPS/TLS                                         │
│     ✓ Firewall Rules                                    │
│     ✓ Rate Limiting                                     │
│                                                          │
│  2. Application Layer                                    │
│     ✓ CORS Configuration                                │
│     ✓ Input Validation                                  │
│     ✓ SQL Injection Prevention (Parameterized Queries)  │
│     ✓ XSS Prevention (React escaping)                   │
│                                                          │
│  3. Authentication Layer (Future)                        │
│     □ JWT Tokens                                        │
│     □ Password Hashing (bcrypt)                         │
│     □ Session Management                                │
│                                                          │
│  4. Data Layer                                           │
│     ✓ Environment Variables                             │
│     ✓ Database Connection Pooling                       │
│     □ Encryption at Rest (Future)                       │
│                                                          │
└─────────────────────────────────────────────────────────┘

Legend: ✓ = Implemented, □ = Recommended for Production
```

---

This architecture is designed for:
- **Scalability**: Easy to scale horizontally
- **Maintainability**: Clear separation of concerns
- **Performance**: Efficient data flow and caching strategies
- **Security**: Multiple layers of protection
- **Flexibility**: Easy to add new features or swap components

For implementation details, see the respective documentation files.
