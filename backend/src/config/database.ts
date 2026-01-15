import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        contact_person VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rfps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        budget DECIMAL(15, 2),
        delivery_deadline DATE,
        payment_terms VARCHAR(255),
        warranty_period VARCHAR(255),
        requirements JSONB NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rfp_vendors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
        vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
        sent_at TIMESTAMP,
        email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(rfp_id, vendor_id)
      );

      CREATE TABLE IF NOT EXISTS proposals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
        vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
        email_subject VARCHAR(500),
        email_body TEXT,
        total_price DECIMAL(15, 2),
        delivery_time VARCHAR(255),
        payment_terms VARCHAR(255),
        warranty VARCHAR(255),
        parsed_data JSONB,
        raw_email_data JSONB,
        ai_score DECIMAL(5, 2),
        ai_summary TEXT,
        received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(rfp_id, vendor_id)
      );

      CREATE TABLE IF NOT EXISTS email_processing_log (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email_id VARCHAR(255) UNIQUE,
        subject VARCHAR(500),
        from_email VARCHAR(255),
        processed BOOLEAN DEFAULT FALSE,
        error TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_rfps_status ON rfps(status);
      CREATE INDEX IF NOT EXISTS idx_proposals_rfp_id ON proposals(rfp_id);
      CREATE INDEX IF NOT EXISTS idx_proposals_vendor_id ON proposals(vendor_id);
      CREATE INDEX IF NOT EXISTS idx_email_log_processed ON email_processing_log(processed);
    `);

    await client.query('COMMIT');
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};
