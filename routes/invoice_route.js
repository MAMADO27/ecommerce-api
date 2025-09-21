const express = require('express');
const router = express.Router();
const { get_invoice } = require('../services/invoice_services');

// GET /api/invoices/:orderId
router.get('/:orderId', get_invoice);

module.exports = router;