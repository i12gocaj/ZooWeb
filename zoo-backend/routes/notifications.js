const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notifications');

// Ruta para enviar una notificación
router.post('/send', notificationController.sendNotification);

module.exports = router;
