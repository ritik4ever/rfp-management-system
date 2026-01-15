import { Request, Response } from 'express';
import { pool } from '../config/database';
import { aiService } from '../services/aiService';
import { CreateRFPRequest } from '../types';

export class RFPController {
  /**
   * Create RFP from natural language
   */
  async createRFP(req: Request, res: Response) {
    try {
      const { naturalLanguageInput }: CreateRFPRequest = req.body;

      if (!naturalLanguageInput || naturalLanguageInput.trim().length === 0) {
        return res.status(400).json({
          error: 'Natural language input is required',
        });
      }

      const structuredData = await aiService.parseRFPFromNaturalLanguage(
        naturalLanguageInput
      );

      const result = await pool.query(
        `INSERT INTO rfps (
          title, description, budget, delivery_deadline,
          payment_terms, warranty_period, requirements, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          structuredData.title,
          structuredData.description,
          structuredData.budget,
          structuredData.delivery_deadline,
          structuredData.payment_terms,
          structuredData.warranty_period,
          JSON.stringify(structuredData.requirements),
          'draft',
        ]
      );

      const rfp = result.rows[0];

      res.status(201).json({
        rfp,
        structured_data: structuredData,
      });
    } catch (error: any) {
      console.error('Error creating RFP:', error);
      res.status(500).json({
        error: 'Failed to create RFP',
        details: error.message,
      });
    }
  }

  /**
   * Get all RFPs
   */
  async getAllRFPs(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM rfps ORDER BY created_at DESC'
      );

      res.json({
        rfps: result.rows,
      });
    } catch (error: any) {
      console.error('Error fetching RFPs:', error);
      res.status(500).json({
        error: 'Failed to fetch RFPs',
        details: error.message,
      });
    }
  }

  /**
   * Get single RFP by ID
   */
  async getRFPById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const rfpResult = await pool.query(
        'SELECT * FROM rfps WHERE id = $1',
        [id]
      );

      if (rfpResult.rows.length === 0) {
        return res.status(404).json({ error: 'RFP not found' });
      }

      const vendorsResult = await pool.query(
        `SELECT v.*, rv.sent_at, rv.email_sent
         FROM vendors v
         JOIN rfp_vendors rv ON v.id = rv.vendor_id
         WHERE rv.rfp_id = $1`,
        [id]
      );

      const proposalsResult = await pool.query(
        `SELECT p.*, v.name as vendor_name, v.email as vendor_email
         FROM proposals p
         JOIN vendors v ON p.vendor_id = v.id
         WHERE p.rfp_id = $1`,
        [id]
      );

      res.json({
        rfp: rfpResult.rows[0],
        vendors: vendorsResult.rows,
        proposals: proposalsResult.rows,
      });
    } catch (error: any) {
      console.error('Error fetching RFP:', error);
      res.status(500).json({
        error: 'Failed to fetch RFP',
        details: error.message,
      });
    }
  }

  /**
   * Delete RFP
   */
  async deleteRFP(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM rfps WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'RFP not found' });
      }

      res.json({
        message: 'RFP deleted successfully',
        rfp: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error deleting RFP:', error);
      res.status(500).json({
        error: 'Failed to delete RFP',
        details: error.message,
      });
    }
  }
}

export const rfpController = new RFPController();
