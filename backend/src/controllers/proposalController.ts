import { Request, Response } from 'express';
import { pool } from '../config/database';
import { aiService } from '../services/aiService';
import { emailService } from '../services/emailService';

export class ProposalController {
  /**
   * Get all proposals for an RFP
   */
  async getProposalsByRFP(req: Request, res: Response) {
    try {
      const { rfpId } = req.params;

      const result = await pool.query(
        `SELECT p.*, v.name as vendor_name, v.email as vendor_email,
                v.phone as vendor_phone, v.contact_person as vendor_contact_person
         FROM proposals p
         JOIN vendors v ON p.vendor_id = v.id
         WHERE p.rfp_id = $1
         ORDER BY p.ai_score DESC`,
        [rfpId]
      );

      res.json({
        proposals: result.rows,
      });
    } catch (error: any) {
      console.error('Error fetching proposals:', error);
      res.status(500).json({
        error: 'Failed to fetch proposals',
        details: error.message,
      });
    }
  }

  /**
   * Compare proposals and get AI recommendations
   */
  async compareProposals(req: Request, res: Response) {
    try {
      const { rfpId } = req.params;

      const rfpResult = await pool.query(
        'SELECT * FROM rfps WHERE id = $1',
        [rfpId]
      );

      if (rfpResult.rows.length === 0) {
        return res.status(404).json({ error: 'RFP not found' });
      }

      const rfp = rfpResult.rows[0];

      const proposalsResult = await pool.query(
        `SELECT p.*,
                v.id as "vendor.id",
                v.name as "vendor.name",
                v.email as "vendor.email",
                v.phone as "vendor.phone",
                v.contact_person as "vendor.contact_person"
         FROM proposals p
         JOIN vendors v ON p.vendor_id = v.id
         WHERE p.rfp_id = $1`,
        [rfpId]
      );

      if (proposalsResult.rows.length === 0) {
        return res.status(404).json({
          error: 'No proposals found for this RFP',
        });
      }

      const proposals = proposalsResult.rows.map((row) => ({
        id: row.id,
        rfp_id: row.rfp_id,
        vendor_id: row.vendor_id,
        email_subject: row.email_subject,
        email_body: row.email_body,
        total_price: row.total_price,
        delivery_time: row.delivery_time,
        payment_terms: row.payment_terms,
        warranty: row.warranty,
        parsed_data: row.parsed_data,
        raw_email_data: row.raw_email_data,
        ai_score: row.ai_score,
        ai_summary: row.ai_summary,
        received_at: row.received_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        vendor: {
          id: row['vendor.id'],
          name: row['vendor.name'],
          email: row['vendor.email'],
          phone: row['vendor.phone'],
          contact_person: row['vendor.contact_person'],
        },
      }));

      const comparison = await aiService.compareProposals(proposals, {
        title: rfp.title,
        description: rfp.description,
        budget: rfp.budget,
        requirements: rfp.requirements,
      });

      res.json({
        proposals,
        comparison,
      });
    } catch (error: any) {
      console.error('Error comparing proposals:', error);
      res.status(500).json({
        error: 'Failed to compare proposals',
        details: error.message,
      });
    }
  }

  /**
   * Check for new proposal emails
   */
  async checkNewProposals(req: Request, res: Response) {
    try {
      await emailService.checkForNewProposals();

      res.json({
        message: 'Email check completed successfully',
      });
    } catch (error: any) {
      console.error('Error checking for new proposals:', error);
      res.status(500).json({
        error: 'Failed to check for new proposals',
        details: error.message,
      });
    }
  }

  /**
   * Get single proposal by ID
   */
  async getProposalById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT p.*, v.name as vendor_name, v.email as vendor_email
         FROM proposals p
         JOIN vendors v ON p.vendor_id = v.id
         WHERE p.id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Proposal not found' });
      }

      res.json({
        proposal: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error fetching proposal:', error);
      res.status(500).json({
        error: 'Failed to fetch proposal',
        details: error.message,
      });
    }
  }
}

export const proposalController = new ProposalController();
