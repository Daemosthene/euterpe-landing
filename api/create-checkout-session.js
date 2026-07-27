import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

function isValidEmailAddress(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID || !process.env.SITE_URL) {
    return res.status(500).json({ error: 'Missing Stripe or site configuration.' });
  }

  const body = parseBody(req.body);
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const country = typeof body.country === 'string' ? body.country : 'Unknown';

  if (!email || !isValidEmailAddress(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }

  try {
    const cleanSiteUrl = process.env.SITE_URL.replace(/\/$/, '');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded_page',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      customer_email: email,
      return_url: `${cleanSiteUrl}/#checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        country
      }
    });

    return res.status(200).json({
      clientSecret: session.client_secret,
      sessionId: session.id
    });
  } catch (error) {
    console.error('checkout.session.create.failed', {
      message: error instanceof Error ? error.message : 'Unknown checkout session error.'
    });

    return res.status(500).json({
      error: 'Unable to start checkout right now. Please try again in a moment.'
    });
  }
}
