const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.stripePayment = async (req, res) => {
  const { amount, currency } = req.body;

  // Validar los parámetros de entrada
  if (!amount || !currency) {
    return res.status(400).json({ error: 'Amount and currency are required' });
  }

  try {
    // Crear un PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // El monto en la moneda mínima (centavos para USD, por ejemplo)
      currency, // Ejemplo: 'usd', 'eur'
    });

    // Enviar el client_secret para completar el pago en el frontend
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
