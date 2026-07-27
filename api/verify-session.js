import Stripe from 'stripe';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

function redactSessionId(sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length <= 8) {
    return sessionId;
  }

  return `${sessionId.slice(0, 4)}...${sessionId.slice(-4)}`;
}

function createDownloadToken(sessionId) {
  const expiresAt = Math.floor(Date.now() / 1000) + 300;
  const payload = Buffer.from(JSON.stringify({ sessionId, exp: expiresAt })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.DOWNLOAD_SIGNING_SECRET)
    .update(payload)
    .digest('base64url');

  return {
    token: `${payload}.${signature}`,
    expiresAt
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID || !process.env.DOWNLOAD_SIGNING_SECRET) {
    return res.status(500).json({ error: 'Missing Stripe configuration.' });
  }

  const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id : '';
  if (!sessionId) {
    return res.status(400).json({ verified: false, message: 'Missing checkout session id.' });
  }

  try {
    console.info('checkout.session.verify.request', { sessionId: redactSessionId(sessionId) });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });

    const matchesExpectedPrice = lineItems.data.some((item) => item.price && item.price.id === process.env.STRIPE_PRICE_ID);
    const isPaid = session.payment_status === 'paid' && session.status === 'complete';
    const verified = Boolean(isPaid && matchesExpectedPrice);
    const tokenBundle = verified ? createDownloadToken(session.id) : null;

    if (!verified) {
      console.warn('checkout.session.verify.unverified', {
        sessionId: redactSessionId(session.id),
        paymentStatus: session.payment_status,
        sessionStatus: session.status,
        matchesExpectedPrice
      });
    }

    return res.status(200).json({
      verified,
      sessionId: session.id,
      paymentStatus: session.payment_status,
      downloadToken: tokenBundle ? tokenBundle.token : null,
      downloadTokenExpiresAt: tokenBundle ? tokenBundle.expiresAt : null,
      message: verified ? 'Payment verified.' : 'Payment is not completed for this checkout session.'
    });
  } catch (error) {
    console.error('checkout.session.verify.failed', {
      sessionId: redactSessionId(sessionId),
      message: error instanceof Error ? error.message : 'Unknown verification error.'
    });

    return res.status(500).json({
      verified: false,
      message: 'Unable to verify payment right now. Please retry in a moment.'
    });
  }
}
