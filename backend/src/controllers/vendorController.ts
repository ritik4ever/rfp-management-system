import { Request, Response } from 'express';
import { pool } from '../config/database';
import { emailService } from '../services/emailService';

export class VendorController {
  /**
   * Create a new vendor
   */
  async createVendor(req: Request, res: Response) {
    try {
      const { name, email, phone, contact_person, address } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          error: 'Name and email are required',
        });
      }

      const result = await pool.query(
        `INSERT INTO vendors (name, email, phone, contact_person, address)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, email, phone, contact_person, address]
      );

      res.status(201).json({
        vendor: result.rows[0],
      });
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(409).json({
          error: 'A vendor with this email already exists',
        });
      }

      console.error('Error creating vendor:', error);
      res.status(500).json({
        error: 'Failed to create vendor',
        details: error.message,
      });
    }
  }

  /**
   * Get all vendors
   */
  async getAllVendors(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM vendors ORDER BY name ASC'
      );

      res.json({
        vendors: result.rows,
      });
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({
        error: 'Failed to fetch vendors',
        details: error.message,
      });
    }
  }

  /**
   * Get single vendor by ID
   */
  async getVendorById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'SELECT * FROM vendors WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      res.json({
        vendor: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error fetching vendor:', error);
      res.status(500).json({
        error: 'Failed to fetch vendor',
        details: error.message,
      });
    }
  }

  /**
   * Update vendor
   */
  async updateVendor(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, contact_person, address } = req.body;

      const result = await pool.query(
        `UPDATE vendors
         SET name = COALESCE($1, name),
             email = COALESCE($2, email),
             phone = COALESCE($3, phone),
             contact_person = COALESCE($4, contact_person),
             address = COALESCE($5, address),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [name, email, phone, contact_person, address, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      res.json({
        vendor: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error updating vendor:', error);
      res.status(500).json({
        error: 'Failed to update vendor',
        details: error.message,
      });
    }
  }

  /**
   * Delete vendor
   */
  async deleteVendor(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await pool.query(
        'DELETE FROM vendors WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Vendor not found' });
      }

      res.json({
        message: 'Vendor deleted successfully',
        vendor: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error deleting vendor:', error);
      res.status(500).json({
        error: 'Failed to delete vendor',
        details: error.message,
      });
    }
  }

  /**
   * Send RFP to selected vendors
   */
  async sendRFPToVendors(req: Request, res: Response) {
    try {
      const { rfpId, vendorIds } = req.body;

      if (!rfpId || !vendorIds || !Array.isArray(vendorIds) || vendorIds.length === 0) {
        return res.status(400).json({
          error: 'RFP ID and vendor IDs array are required',
        });
      }

      await emailService.sendRFPToVendors(rfpId, vendorIds);

      res.json({
        message: `RFP sent successfully to ${vendorIds.length} vendor(s)`,
        rfpId,
        vendorIds,
      });
    } catch (error: any) {
      console.error('Error sending RFP:', error);
      res.status(500).json({
        error: 'Failed to send RFP',
        details: error.message,
      });
    }
  }
}

export const vendorController = new VendorController();
