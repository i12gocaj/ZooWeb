const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payments');

// Ruta para manejar pagos con Stripe
router.post('/stripe', paymentController.stripePayment);

module.exports = router;
