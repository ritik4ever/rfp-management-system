import { Router } from 'express';
import { rfpController } from '../controllers/rfpController';
import { vendorController } from '../controllers/vendorController';
import { proposalController } from '../controllers/proposalController';

const router = Router();

// RFP Routes
router.post('/rfps', (req, res) => rfpController.createRFP(req, res));
router.get('/rfps', (req, res) => rfpController.getAllRFPs(req, res));
router.get('/rfps/:id', (req, res) => rfpController.getRFPById(req, res));
router.delete('/rfps/:id', (req, res) => rfpController.deleteRFP(req, res));

// Vendor Routes
router.post('/vendors', (req, res) => vendorController.createVendor(req, res));
router.get('/vendors', (req, res) => vendorController.getAllVendors(req, res));
router.get('/vendors/:id', (req, res) => vendorController.getVendorById(req, res));
router.put('/vendors/:id', (req, res) => vendorController.updateVendor(req, res));
router.delete('/vendors/:id', (req, res) => vendorController.deleteVendor(req, res));

// Send RFP to vendors
router.post('/rfps/send', (req, res) => vendorController.sendRFPToVendors(req, res));

// Proposal Routes
router.get('/proposals/rfp/:rfpId', (req, res) => proposalController.getProposalsByRFP(req, res));
router.get('/proposals/:id', (req, res) => proposalController.getProposalById(req, res));
router.get('/proposals/compare/:rfpId', (req, res) => proposalController.compareProposals(req, res));
router.post('/proposals/check', (req, res) => proposalController.checkNewProposals(req, res));

export default router;
