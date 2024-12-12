const nodemailer = require('nodemailer');

// Configuración de transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'SendGrid', // Cambia esto según tu proveedor de correo
  auth: {
    user: 'apikey', // Tu correo
    pass: process.env.SENDGRID_API_KEY, // Contraseña o token de aplicación
  },
});

// Enviar una notificación por correo
exports.sendNotification = async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    // Configuración del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: message,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Notificación enviada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error enviando la notificación', details: error.message });
  }
};
