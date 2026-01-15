# API Documentation

Base URL: `http://localhost:5000/api`

## Table of Contents
- [RFP Endpoints](#rfp-endpoints)
- [Vendor Endpoints](#vendor-endpoints)
- [Proposal Endpoints](#proposal-endpoints)
- [Error Responses](#error-responses)

---

## RFP Endpoints

### Create RFP

Create a new RFP from natural language input.

**Endpoint:** `POST /rfps`

**Request Body:**
```json
{
  "naturalLanguageInput": "I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."
}
```

**Success Response (201):**
```json
{
  "rfp": {
    "id": "uuid",
    "title": "Laptop and Monitor Procurement for New Office",
    "description": "Procurement of laptops and monitors...",
    "budget": 50000,
    "delivery_deadline": "2024-02-15",
    "payment_terms": "Net 30",
    "warranty_period": "1 year",
    "requirements": {
      "items": [
        {
          "name": "Laptops",
          "quantity": 20,
          "specifications": "16GB RAM"
        },
        {
          "name": "Monitors",
          "quantity": 15,
          "specifications": "27-inch"
        }
      ]
    },
    "status": "draft",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  },
  "structured_data": { ... }
}
```

**Error Response (400):**
```json
{
  "error": "Natural language input is required"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to create RFP",
  "details": "OpenAI API error message"
}
```

---

### Get All RFPs

Retrieve all RFPs.

**Endpoint:** `GET /rfps`

**Success Response (200):**
```json
{
  "rfps": [
    {
      "id": "uuid",
      "title": "Laptop Procurement",
      "description": "...",
      "budget": 50000,
      "status": "sent",
      "created_at": "2024-01-15T10:00:00Z",
      ...
    }
  ]
}
```

---

### Get RFP by ID

Retrieve a specific RFP with its vendors and proposals.

**Endpoint:** `GET /rfps/:id`

**URL Parameters:**
- `id` (required): RFP UUID

**Success Response (200):**
```json
{
  "rfp": {
    "id": "uuid",
    "title": "Laptop Procurement",
    ...
  },
  "vendors": [
    {
      "id": "uuid",
      "name": "Tech Solutions Inc",
      "email": "sales@techsolutions.com",
      "sent_at": "2024-01-15T10:30:00Z",
      "email_sent": true
    }
  ],
  "proposals": [
    {
      "id": "uuid",
      "rfp_id": "uuid",
      "vendor_id": "uuid",
      "vendor_name": "Tech Solutions Inc",
      "total_price": 45000,
      "ai_score": 85,
      ...
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "RFP not found"
}
```

---

### Delete RFP

Delete an RFP and all associated data.

**Endpoint:** `DELETE /rfps/:id`

**URL Parameters:**
- `id` (required): RFP UUID

**Success Response (200):**
```json
{
  "message": "RFP deleted successfully",
  "rfp": { ... }
}
```

**Error Response (404):**
```json
{
  "error": "RFP not found"
}
```

---

## Vendor Endpoints

### Create Vendor

Create a new vendor.

**Endpoint:** `POST /vendors`

**Request Body:**
```json
{
  "name": "Tech Solutions Inc",
  "email": "sales@techsolutions.com",
  "phone": "+1-555-0101",
  "contact_person": "John Smith",
  "address": "123 Tech Street, San Francisco, CA 94105"
}
```

**Required Fields:**
- `name`
- `email`

**Success Response (201):**
```json
{
  "vendor": {
    "id": "uuid",
    "name": "Tech Solutions Inc",
    "email": "sales@techsolutions.com",
    "phone": "+1-555-0101",
    "contact_person": "John Smith",
    "address": "123 Tech Street, San Francisco, CA 94105",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "error": "Name and email are required"
}
```

**Error Response (409):**
```json
{
  "error": "A vendor with this email already exists"
}
```

---

### Get All Vendors

Retrieve all vendors.

**Endpoint:** `GET /vendors`

**Success Response (200):**
```json
{
  "vendors": [
    {
      "id": "uuid",
      "name": "Tech Solutions Inc",
      "email": "sales@techsolutions.com",
      ...
    }
  ]
}
```

---

### Get Vendor by ID

Retrieve a specific vendor.

**Endpoint:** `GET /vendors/:id`

**URL Parameters:**
- `id` (required): Vendor UUID

**Success Response (200):**
```json
{
  "vendor": {
    "id": "uuid",
    "name": "Tech Solutions Inc",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "error": "Vendor not found"
}
```

---

### Update Vendor

Update vendor information.

**Endpoint:** `PUT /vendors/:id`

**URL Parameters:**
- `id` (required): Vendor UUID

**Request Body:**
```json
{
  "name": "Tech Solutions Corp",
  "phone": "+1-555-0102"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Success Response (200):**
```json
{
  "vendor": {
    "id": "uuid",
    "name": "Tech Solutions Corp",
    "phone": "+1-555-0102",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "error": "Vendor not found"
}
```

---

### Delete Vendor

Delete a vendor.

**Endpoint:** `DELETE /vendors/:id`

**URL Parameters:**
- `id` (required): Vendor UUID

**Success Response (200):**
```json
{
  "message": "Vendor deleted successfully",
  "vendor": { ... }
}
```

**Error Response (404):**
```json
{
  "error": "Vendor not found"
}
```

---

### Send RFP to Vendors

Send an RFP to selected vendors via email.

**Endpoint:** `POST /rfps/send`

**Request Body:**
```json
{
  "rfpId": "uuid",
  "vendorIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Success Response (200):**
```json
{
  "message": "RFP sent successfully to 3 vendor(s)",
  "rfpId": "uuid",
  "vendorIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Error Response (400):**
```json
{
  "error": "RFP ID and vendor IDs array are required"
}
```

**Error Response (404):**
```json
{
  "error": "RFP not found"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to send RFP",
  "details": "SMTP error message"
}
```

---

## Proposal Endpoints

### Get Proposals for RFP

Retrieve all proposals for a specific RFP.

**Endpoint:** `GET /proposals/rfp/:rfpId`

**URL Parameters:**
- `rfpId` (required): RFP UUID

**Success Response (200):**
```json
{
  "proposals": [
    {
      "id": "uuid",
      "rfp_id": "uuid",
      "vendor_id": "uuid",
      "vendor_name": "Tech Solutions Inc",
      "vendor_email": "sales@techsolutions.com",
      "email_subject": "Re: RFP - Laptop Procurement",
      "email_body": "...",
      "total_price": 45000,
      "delivery_time": "30 days",
      "payment_terms": "Net 30",
      "warranty": "2 years",
      "parsed_data": {
        "items": [
          {
            "name": "Laptops",
            "quantity": 20,
            "unit_price": 2000,
            "total_price": 40000
          }
        ],
        "strengths": ["Competitive pricing", "Fast delivery"],
        "weaknesses": ["Limited warranty"]
      },
      "ai_score": 85,
      "ai_summary": "Strong proposal with competitive pricing...",
      "received_at": "2024-01-16T14:30:00Z",
      ...
    }
  ]
}
```

---

### Get Proposal by ID

Retrieve a specific proposal.

**Endpoint:** `GET /proposals/:id`

**URL Parameters:**
- `id` (required): Proposal UUID

**Success Response (200):**
```json
{
  "proposal": {
    "id": "uuid",
    "vendor_name": "Tech Solutions Inc",
    ...
  }
}
```

**Error Response (404):**
```json
{
  "error": "Proposal not found"
}
```

---

### Compare Proposals

Get AI-powered comparison of all proposals for an RFP.

**Endpoint:** `GET /proposals/compare/:rfpId`

**URL Parameters:**
- `rfpId` (required): RFP UUID

**Success Response (200):**
```json
{
  "proposals": [ ... ],
  "comparison": {
    "best_price": "vendor_uuid_1",
    "best_delivery": "vendor_uuid_2",
    "best_overall": "vendor_uuid_1",
    "summary": "After analyzing all proposals, Tech Solutions Inc offers the best overall value with competitive pricing at $45,000 and a 30-day delivery timeline. While Enterprise Hardware Co has a slightly faster delivery, their pricing is 15% higher. Global Electronics Ltd offers an extended warranty but falls short on delivery time.",
    "details": [
      {
        "vendor_id": "uuid",
        "vendor_name": "Tech Solutions Inc",
        "score": 92,
        "pros": [
          "Most competitive pricing at $45,000",
          "Meets all technical requirements",
          "Excellent delivery timeframe of 30 days",
          "Strong track record"
        ],
        "cons": [
          "Warranty period is standard, not extended",
          "Payment terms are Net 30, not Net 60"
        ]
      },
      {
        "vendor_id": "uuid",
        "vendor_name": "Enterprise Hardware Co",
        "score": 78,
        "pros": [
          "Fastest delivery at 20 days",
          "Extended 3-year warranty",
          "Premium hardware specifications"
        ],
        "cons": [
          "15% more expensive at $51,750",
          "Payment terms are Net 15",
          "Over budget"
        ]
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "error": "RFP not found"
}
```

**Error Response (404):**
```json
{
  "error": "No proposals found for this RFP"
}
```

---

### Check for New Proposals

Manually trigger email checking for new vendor proposals.

**Endpoint:** `POST /proposals/check`

**Request Body:** None

**Success Response (200):**
```json
{
  "message": "Email check completed successfully"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to check for new proposals",
  "details": "IMAP connection error"
}
```

---

## Error Responses

### Standard Error Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message",
  "details": "Optional detailed error information"
}
```

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (e.g., duplicate email)
- **500 Internal Server Error**: Server error

### Example Error Responses

#### Validation Error (400)
```json
{
  "error": "Name and email are required"
}
```

#### Not Found Error (404)
```json
{
  "error": "RFP not found"
}
```

#### Database Error (500)
```json
{
  "error": "Failed to fetch RFPs",
  "details": "Connection to database failed"
}
```

#### AI Processing Error (500)
```json
{
  "error": "Failed to parse RFP with AI",
  "details": "OpenAI API rate limit exceeded"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production use, consider:
- Implementing rate limiting middleware
- Setting up API keys
- Monitoring OpenAI API usage

## Authentication

This API currently does not require authentication. For production:
- Implement JWT-based authentication
- Add API key authentication
- Use OAuth 2.0 for third-party integrations

## CORS

CORS is configured to allow requests from:
- `http://localhost:3000` (development frontend)

Update `FRONTEND_URL` in `.env` for production.

---

**Note:** All timestamps are in ISO 8601 format (UTC).
