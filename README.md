# AI-Powered RFP Management System

A modern, full-stack web application that streamlines the Request for Proposal (RFP) procurement process using AI. Built with React, TypeScript, Node.js, Express, PostgreSQL, and OpenAI's GPT-4.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-5.3.3-blue)

## 🌟 Features

### 1. **AI-Powered RFP Creation**
- Create RFPs using natural language input
- Automatically extract and structure procurement requirements
- AI generates comprehensive RFP documents with:
  - Title and description
  - Budget and timelines
  - Payment terms and warranty requirements
  - Detailed item specifications

### 2. **Vendor Management**
- Maintain vendor master data (name, email, contact person, address)
- Easy vendor CRUD operations
- Select and manage vendors for each RFP

### 3. **Automated Email Distribution**
- Send professionally formatted RFPs to selected vendors via email
- Beautiful HTML email templates
- Track email sending status

### 4. **Intelligent Proposal Processing**
- Automatic email monitoring via IMAP
- AI-powered parsing of vendor responses
- Extracts key information:
  - Pricing details
  - Delivery timeframes
  - Payment terms and warranty
  - Item-level breakdown
  - Strengths and weaknesses

### 5. **AI-Assisted Proposal Comparison**
- Automated vendor comparison and scoring
- AI recommendations for:
  - Best overall vendor
  - Best price
  - Best delivery time
- Detailed pros/cons analysis for each vendor
- Visual comparison dashboard

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library
- **date-fns** - Date formatting

#### Backend
- **Node.js & Express** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **OpenAI GPT-4** - AI processing
- **Nodemailer** - SMTP email sending
- **IMAP** - Email receiving
- **MailParser** - Email parsing

### Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (AI, Email)
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── common/    # Common UI components
│   │   │   ├── rfp/       # RFP-specific components
│   │   │   └── vendor/    # Vendor components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 14.0
- **OpenAI API Key** (Get one at https://platform.openai.com)
- **Email Account** (Gmail recommended) with:
  - SMTP access enabled
  - IMAP access enabled
  - App password generated (for Gmail: https://support.google.com/accounts/answer/185833)

### Installation

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd rfp-management-system
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rfp_management
DB_USER=postgres
DB_PASSWORD=your_password

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration (SMTP for sending)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Email Configuration (IMAP for receiving)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your-email@gmail.com
IMAP_PASSWORD=your-app-password
IMAP_TLS=true

# Application Configuration
APP_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:3000
```

#### 3. Database Setup

Create a PostgreSQL database:

```bash
createdb rfp_management
```

Or using psql:

```sql
CREATE DATABASE rfp_management;
```

Initialize database tables and seed data:

```bash
npm run seed
```

This will:
- Create all required tables
- Seed 4 sample vendors

#### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

Server will start on http://localhost:5000

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will start on http://localhost:3000

### Email Configuration Notes

#### For Gmail:
1. Enable 2-Step Verification
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password
   - Use this password in your `.env` file

3. Enable IMAP:
   - Go to Gmail Settings
   - Forwarding and POP/IMAP tab
   - Enable IMAP access

#### For Other Email Providers:
- Ensure SMTP and IMAP are enabled
- Check provider documentation for host/port configuration
- Some providers may require additional authentication

## 📚 API Documentation

### RFP Endpoints

#### Create RFP
```http
POST /api/rfps
Content-Type: application/json

{
  "naturalLanguageInput": "I need to procure 20 laptops with 16GB RAM..."
}

Response:
{
  "rfp": { ... },
  "structured_data": { ... }
}
```

#### Get All RFPs
```http
GET /api/rfps

Response:
{
  "rfps": [ ... ]
}
```

#### Get RFP by ID
```http
GET /api/rfps/:id

Response:
{
  "rfp": { ... },
  "vendors": [ ... ],
  "proposals": [ ... ]
}
```

#### Delete RFP
```http
DELETE /api/rfps/:id

Response:
{
  "message": "RFP deleted successfully"
}
```

### Vendor Endpoints

#### Create Vendor
```http
POST /api/vendors
Content-Type: application/json

{
  "name": "Tech Solutions Inc",
  "email": "sales@techsolutions.com",
  "phone": "+1-555-0101",
  "contact_person": "John Smith",
  "address": "123 Tech Street, San Francisco, CA"
}
```

#### Get All Vendors
```http
GET /api/vendors
```

#### Update Vendor
```http
PUT /api/vendors/:id
```

#### Delete Vendor
```http
DELETE /api/vendors/:id
```

#### Send RFP to Vendors
```http
POST /api/rfps/send
Content-Type: application/json

{
  "rfpId": "uuid",
  "vendorIds": ["uuid1", "uuid2"]
}
```

### Proposal Endpoints

#### Get Proposals for RFP
```http
GET /api/proposals/rfp/:rfpId

Response:
{
  "proposals": [ ... ]
}
```

#### Compare Proposals
```http
GET /api/proposals/compare/:rfpId

Response:
{
  "proposals": [ ... ],
  "comparison": {
    "best_price": "vendor_id",
    "best_delivery": "vendor_id",
    "best_overall": "vendor_id",
    "summary": "AI-generated summary",
    "details": [ ... ]
  }
}
```

#### Check for New Proposals
```http
POST /api/proposals/check

Response:
{
  "message": "Email check completed successfully"
}
```

## 🤖 AI Integration

### How AI is Used

#### 1. RFP Creation (GPT-4 Turbo)
- **Prompt Engineering**: Structured prompt with clear JSON schema
- **Input**: Natural language procurement description
- **Output**: Structured RFP with title, description, budget, requirements, etc.
- **Temperature**: 0.3 (for consistency)
- **Format**: JSON mode for reliable parsing

#### 2. Proposal Parsing (GPT-4 Turbo)
- **Input**: Email subject + body + original RFP context
- **Output**: Structured proposal data including:
  - Pricing breakdown
  - Delivery timeframes
  - Terms and conditions
  - Strengths and weaknesses
- **Context-Aware**: Uses original RFP requirements for accurate extraction

#### 3. Proposal Comparison (GPT-4 Turbo)
- **Input**: All proposals + RFP requirements
- **Output**: Comprehensive analysis with:
  - Overall vendor recommendation
  - Best price/delivery/value analysis
  - Individual vendor scores (0-100)
  - Pros and cons for each vendor
- **Temperature**: 0.4 (for balanced recommendations)

#### 4. Proposal Scoring (GPT-3.5 Turbo)
- **Fast Scoring**: Quick 0-100 score for each proposal
- **Criteria**: Price, delivery, warranty, completeness
- **Used For**: Initial sorting and quick assessment

### AI Prompt Examples

Example RFP parsing prompt structure:
```
You are an AI assistant that helps parse procurement requests into structured RFP data.

Given: "I need to procure laptops and monitors for our new office. Budget is $50,000 total..."

Extract:
1. title
2. description
3. budget
4. delivery_deadline (calculate from "within X days")
5. payment_terms
6. warranty_period
7. requirements: { items: [...] }

Return JSON only.
```

## 🎨 UI/UX Design Decisions

### Design Philosophy
- **Clean & Professional**: Enterprise-ready interface
- **AI-First**: Emphasize AI capabilities with visual indicators
- **Task-Oriented**: Clear workflows for each user action
- **Responsive**: Mobile-friendly design

### Color Scheme
- **Primary**: Indigo (Professional, trustworthy)
- **Success**: Green (Positive actions, recommendations)
- **Warning**: Yellow (Attention needed)
- **Error**: Red (Errors, deletions)

### Key UX Features
- **Loading States**: Clear feedback during AI processing
- **Toast Notifications**: Non-intrusive success/error messages
- **Modal Dialogs**: Focus on important actions
- **Empty States**: Helpful guidance when no data exists
- **Badges**: Visual status indicators (draft, sent, closed)

## 🔄 Workflow Example

### Complete RFP Workflow

1. **Create RFP**
   - User describes needs in natural language
   - AI generates structured RFP
   - Review and confirm

2. **Select Vendors**
   - Browse vendor list
   - Select relevant vendors
   - Send RFP via email

3. **Vendors Respond**
   - Vendors reply to email with proposals
   - System checks IMAP inbox
   - AI automatically parses responses

4. **Compare & Decide**
   - View all proposals side-by-side
   - Review AI comparison and recommendations
   - See best price, delivery, and overall choice
   - Make informed decision

## 📊 Database Schema

```sql
-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  contact_person VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- RFPs table
CREATE TABLE rfps (
  id UUID PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(15,2),
  delivery_deadline DATE,
  payment_terms VARCHAR(255),
  warranty_period VARCHAR(255),
  requirements JSONB NOT NULL,
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- RFP-Vendor relationship
CREATE TABLE rfp_vendors (
  id UUID PRIMARY KEY,
  rfp_id UUID REFERENCES rfps(id),
  vendor_id UUID REFERENCES vendors(id),
  sent_at TIMESTAMP,
  email_sent BOOLEAN,
  created_at TIMESTAMP
);

-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY,
  rfp_id UUID REFERENCES rfps(id),
  vendor_id UUID REFERENCES vendors(id),
  email_subject VARCHAR(500),
  email_body TEXT,
  total_price DECIMAL(15,2),
  delivery_time VARCHAR(255),
  payment_terms VARCHAR(255),
  warranty VARCHAR(255),
  parsed_data JSONB,
  raw_email_data JSONB,
  ai_score DECIMAL(5,2),
  ai_summary TEXT,
  received_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Email processing log
CREATE TABLE email_processing_log (
  id UUID PRIMARY KEY,
  email_id VARCHAR(255) UNIQUE,
  subject VARCHAR(500),
  from_email VARCHAR(255),
  processed BOOLEAN,
  error TEXT,
  created_at TIMESTAMP
);
```

## 🔒 Security Considerations

### Current Implementation
- Environment variables for sensitive data
- CORS configuration
- Input validation
- SQL injection protection (parameterized queries)

### Production Recommendations
- Add user authentication (JWT, OAuth)
- Implement rate limiting
- Add API key rotation
- Enable HTTPS only
- Add request logging and monitoring
- Implement data encryption at rest
- Add CSRF protection
- Regular security audits

## 🚧 Known Limitations

1. **Single User**: No authentication or multi-tenancy
2. **Email Polling**: Manual trigger required (not real-time webhooks)
3. **AI Costs**: OpenAI API calls can be expensive at scale
4. **Email Reliability**: Depends on IMAP connection stability
5. **File Attachments**: Currently only processes email text
6. **RFP Editing**: No edit functionality after creation

## 🔮 Future Enhancements

### Phase 1: Core Improvements
- [ ] User authentication and authorization
- [ ] Real-time email notifications (webhooks)
- [ ] Support for email attachments (PDF parsing)
- [ ] RFP editing and versioning
- [ ] Advanced search and filtering
- [ ] Export proposals to PDF/Excel

### Phase 2: Advanced Features
- [ ] Multi-tenant support
- [ ] Collaborative workflows (approvals, comments)
- [ ] Automated vendor ranking based on historical performance
- [ ] Contract generation from accepted proposals
- [ ] Integration with accounting systems
- [ ] Mobile app

### Phase 3: AI Enhancements
- [ ] Custom AI models fine-tuned on procurement data
- [ ] Predictive pricing analysis
- [ ] Risk assessment for vendors
- [ ] Automated negotiation suggestions
- [ ] Smart vendor matching for RFPs

## 🧪 Testing

### Manual Testing Checklist

#### RFP Creation
- [ ] Create RFP with natural language input
- [ ] Verify AI correctly extracts all fields
- [ ] Test with various input formats
- [ ] Verify structured data display

#### Vendor Management
- [ ] Add new vendor
- [ ] Edit vendor details
- [ ] Delete vendor
- [ ] Verify email validation

#### Email Sending
- [ ] Send RFP to single vendor
- [ ] Send RFP to multiple vendors
- [ ] Verify email delivery
- [ ] Check email formatting

#### Proposal Processing
- [ ] Send test proposal email
- [ ] Trigger email check
- [ ] Verify AI parsing accuracy
- [ ] Check proposal display

#### Comparison
- [ ] Generate comparison with 2+ proposals
- [ ] Verify AI recommendations
- [ ] Check scoring accuracy
- [ ] Review pros/cons analysis

### Future Testing
- Unit tests for services
- Integration tests for API
- E2E tests with Playwright
- Load testing for AI endpoints

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- React team for the amazing framework
- Tailwind CSS for utility-first styling
- All open-source contributors

## 📧 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@example.com

---

**Built with ❤️ using React, TypeScript, Node.js, PostgreSQL, and OpenAI GPT-4**
