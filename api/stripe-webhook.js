import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const seenEvents = new Set();

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing Stripe webhook configuration.' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header.' });
  }

  try {
    const rawBody = await readRawBody(req);
    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (seenEvents.has(event.id)) {
      return res.status(200).json({ received: true, duplicate: true });
    }

    seenEvents.add(event.id);
    if (seenEvents.size > 2000) {
      seenEvents.clear();
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('checkout.session.completed', {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_email
      });
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Webhook verification failed.'
    });
  }
}
