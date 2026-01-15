import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser, ParsedMail } from 'mailparser';
import { pool } from '../config/database';
import { aiService } from './aiService';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  /**
   * Send RFP to vendors via email
   */
  async sendRFPToVendors(rfpId: string, vendorIds: string[]): Promise<void> {
    const rfpResult = await pool.query(
      'SELECT * FROM rfps WHERE id = $1',
      [rfpId]
    );

    if (rfpResult.rows.length === 0) {
      throw new Error('RFP not found');
    }

    const rfp = rfpResult.rows[0];

    const vendorsResult = await pool.query(
      'SELECT * FROM vendors WHERE id = ANY($1::uuid[])',
      [vendorIds]
    );

    const vendors = vendorsResult.rows;

    for (const vendor of vendors) {
      const emailContent = this.generateRFPEmailContent(rfp, vendor);

      try {
        await this.transporter.sendMail({
          from: process.env.APP_EMAIL,
          to: vendor.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });

        await pool.query(
          `INSERT INTO rfp_vendors (rfp_id, vendor_id, sent_at, email_sent)
           VALUES ($1, $2, CURRENT_TIMESTAMP, true)
           ON CONFLICT (rfp_id, vendor_id)
           DO UPDATE SET sent_at = CURRENT_TIMESTAMP, email_sent = true`,
          [rfpId, vendor.id]
        );

        console.log(`✅ RFP sent to ${vendor.email}`);
      } catch (error) {
        console.error(`❌ Failed to send RFP to ${vendor.email}:`, error);
        throw error;
      }
    }

    await pool.query(
      "UPDATE rfps SET status = 'sent' WHERE id = $1",
      [rfpId]
    );
  }

  /**
   * Generate email content for RFP
   */
  private generateRFPEmailContent(rfp: any, vendor: any) {
    const subject = `RFP: ${rfp.title}`;

    const requirements = rfp.requirements?.items || [];
    const itemsList = requirements
      .map(
        (item: any, index: number) =>
          `${index + 1}. ${item.name} (Quantity: ${item.quantity})
   Specifications: ${item.specifications}`
      )
      .join('\n\n');

    const text = `Dear ${vendor.contact_person || vendor.name},

We are pleased to invite you to submit a proposal for the following Request for Proposal (RFP):

Title: ${rfp.title}

Description:
${rfp.description}

Requirements:
${itemsList}

${rfp.budget ? `Budget: $${rfp.budget.toLocaleString()}` : ''}
${rfp.delivery_deadline ? `Delivery Deadline: ${new Date(rfp.delivery_deadline).toLocaleDateString()}` : ''}
${rfp.payment_terms ? `Payment Terms: ${rfp.payment_terms}` : ''}
${rfp.warranty_period ? `Warranty Required: ${rfp.warranty_period}` : ''}

Please reply to this email with your proposal including:
- Detailed pricing breakdown
- Delivery timeframe
- Payment terms
- Warranty information
- Any additional terms and conditions

We look forward to receiving your proposal.

Best regards,
Procurement Team`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; border-radius: 5px; }
    .content { background-color: #f9fafb; padding: 20px; margin-top: 20px; border-radius: 5px; }
    .section { margin: 20px 0; }
    .label { font-weight: bold; color: #4F46E5; }
    .items { background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px; }
    .item { margin: 15px 0; padding: 10px; border-left: 3px solid #4F46E5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Request for Proposal</h1>
    </div>
    <div class="content">
      <p>Dear ${vendor.contact_person || vendor.name},</p>
      <p>We are pleased to invite you to submit a proposal for the following RFP:</p>

      <div class="section">
        <div class="label">Title:</div>
        <div>${rfp.title}</div>
      </div>

      <div class="section">
        <div class="label">Description:</div>
        <div>${rfp.description}</div>
      </div>

      <div class="section">
        <div class="label">Requirements:</div>
        <div class="items">
          ${requirements
            .map(
              (item: any, index: number) => `
            <div class="item">
              <strong>${index + 1}. ${item.name}</strong><br>
              Quantity: ${item.quantity}<br>
              Specifications: ${item.specifications}
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      ${rfp.budget ? `<div class="section"><span class="label">Budget:</span> $${rfp.budget.toLocaleString()}</div>` : ''}
      ${rfp.delivery_deadline ? `<div class="section"><span class="label">Delivery Deadline:</span> ${new Date(rfp.delivery_deadline).toLocaleDateString()}</div>` : ''}
      ${rfp.payment_terms ? `<div class="section"><span class="label">Payment Terms:</span> ${rfp.payment_terms}</div>` : ''}
      ${rfp.warranty_period ? `<div class="section"><span class="label">Warranty Required:</span> ${rfp.warranty_period}</div>` : ''}

      <div class="section">
        <p><strong>Please reply to this email with your proposal including:</strong></p>
        <ul>
          <li>Detailed pricing breakdown</li>
          <li>Delivery timeframe</li>
          <li>Payment terms</li>
          <li>Warranty information</li>
          <li>Any additional terms and conditions</li>
        </ul>
      </div>

      <p>We look forward to receiving your proposal.</p>
      <p>Best regards,<br>Procurement Team</p>
    </div>
  </div>
</body>
</html>`;

    return { subject, text, html };
  }

  /**
   * Check for new proposal emails via IMAP
   */
  async checkForNewProposals(): Promise<void> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: process.env.IMAP_USER!,
        password: process.env.IMAP_PASSWORD!,
        host: process.env.IMAP_HOST!,
        port: parseInt(process.env.IMAP_PORT || '993'),
        tls: process.env.IMAP_TLS === 'true',
        tlsOptions: { rejectUnauthorized: false },
      });

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          imap.search(
            [
              'UNSEEN',
              ['SINCE', sevenDaysAgo],
              ['SUBJECT', 'RFP'],
            ],
            (err, results) => {
              if (err) {
                reject(err);
                return;
              }

              if (!results || results.length === 0) {
                console.log('No new proposal emails found');
                imap.end();
                resolve();
                return;
              }

              const fetch = imap.fetch(results, { bodies: '' });

              fetch.on('message', (msg, seqno) => {
                msg.on('body', (stream, info) => {
                  simpleParser(stream, async (err, parsed) => {
                    if (err) {
                      console.error('Error parsing email:', err);
                      return;
                    }

                    try {
                      await this.processProposalEmail(parsed);
                    } catch (error) {
                      console.error('Error processing proposal email:', error);
                    }
                  });
                });
              });

              fetch.once('end', () => {
                imap.end();
                resolve();
              });
            }
          );
        });
      });

      imap.once('error', (err: Error) => {
        console.error('IMAP error:', err);
        reject(err);
      });

      imap.connect();
    });
  }

  /**
   * Process a single proposal email
   */
  private async processProposalEmail(email: ParsedMail): Promise<void> {
    const emailId = email.messageId;
    const fromEmail = email.from?.value[0]?.address;
    const subject = email.subject || '';
    const body = email.text || email.html || '';

    if (!emailId || !fromEmail) {
      console.log('Invalid email format');
      return;
    }

    const logCheck = await pool.query(
      'SELECT * FROM email_processing_log WHERE email_id = $1',
      [emailId]
    );

    if (logCheck.rows.length > 0) {
      console.log('Email already processed');
      return;
    }

    try {
      const vendorResult = await pool.query(
        'SELECT * FROM vendors WHERE email = $1',
        [fromEmail]
      );

      if (vendorResult.rows.length === 0) {
        console.log(`No vendor found for email: ${fromEmail}`);
        await pool.query(
          'INSERT INTO email_processing_log (email_id, subject, from_email, processed, error) VALUES ($1, $2, $3, false, $4)',
          [emailId, subject, fromEmail, 'Vendor not found']
        );
        return;
      }

      const vendor = vendorResult.rows[0];

      const rfpVendorResult = await pool.query(
        'SELECT rfp_id FROM rfp_vendors WHERE vendor_id = $1 AND email_sent = true ORDER BY sent_at DESC LIMIT 1',
        [vendor.id]
      );

      if (rfpVendorResult.rows.length === 0) {
        console.log(`No RFP sent to vendor: ${vendor.name}`);
        await pool.query(
          'INSERT INTO email_processing_log (email_id, subject, from_email, processed, error) VALUES ($1, $2, $3, false, $4)',
          [emailId, subject, fromEmail, 'No RFP sent to this vendor']
        );
        return;
      }

      const rfpId = rfpVendorResult.rows[0].rfp_id;

      const rfpResult = await pool.query('SELECT * FROM rfps WHERE id = $1', [
        rfpId,
      ]);
      const rfp = rfpResult.rows[0];

      const aiParsedData = await aiService.parseProposalEmail(
        subject,
        body,
        {
          title: rfp.title,
          description: rfp.description,
          requirements: rfp.requirements,
        }
      );

      const score = await aiService.scoreProposal(aiParsedData, rfp);

      await pool.query(
        `INSERT INTO proposals (
          rfp_id, vendor_id, email_subject, email_body,
          total_price, delivery_time, payment_terms, warranty,
          parsed_data, raw_email_data, ai_score, ai_summary
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (rfp_id, vendor_id) DO UPDATE SET
          email_subject = $3,
          email_body = $4,
          total_price = $5,
          delivery_time = $6,
          payment_terms = $7,
          warranty = $8,
          parsed_data = $9,
          raw_email_data = $10,
          ai_score = $11,
          ai_summary = $12,
          updated_at = CURRENT_TIMESTAMP`,
        [
          rfpId,
          vendor.id,
          subject,
          body,
          aiParsedData.total_price,
          aiParsedData.delivery_time,
          aiParsedData.payment_terms,
          aiParsedData.warranty,
          JSON.stringify(aiParsedData.parsed_data),
          JSON.stringify({ from: fromEmail, subject, body }),
          score,
          aiParsedData.ai_summary,
        ]
      );

      await pool.query(
        'INSERT INTO email_processing_log (email_id, subject, from_email, processed) VALUES ($1, $2, $3, true)',
        [emailId, subject, fromEmail]
      );

      console.log(`✅ Processed proposal from ${vendor.name}`);
    } catch (error: any) {
      console.error('Error processing email:', error);
      await pool.query(
        'INSERT INTO email_processing_log (email_id, subject, from_email, processed, error) VALUES ($1, $2, $3, false, $4)',
        [emailId, subject, fromEmail, error.message]
      );
    }
  }
}

export const emailService = new EmailService();
