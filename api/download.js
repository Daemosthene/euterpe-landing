import Stripe from 'stripe';
import crypto from 'crypto';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

function redactSessionId(sessionId) {
  if (typeof sessionId !== 'string' || sessionId.length <= 8) {
    return sessionId;
  }

  return `${sessionId.slice(0, 4)}...${sessionId.slice(-4)}`;
}

function createR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  });
}

function fileNameFromKey(key) {
  const parts = key.split('/');
  return parts[parts.length - 1] || 'Euterpe.exe';
}

function extractVerifiedSessionId(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const [payload, signature] = token.split('.');
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.DOWNLOAD_SIGNING_SECRET)
    .update(payload)
    .digest('base64url');

  const left = Buffer.from(signature);
  const right = Buffer.from(expectedSignature);
  if (left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
    return null;
  }

  let payloadJson;
  try {
    payloadJson = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (!payloadJson || typeof payloadJson.sessionId !== 'string' || typeof payloadJson.exp !== 'number') {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payloadJson.exp <= now) {
    return null;
  }

  return payloadJson.sessionId;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const requiredEnv = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PRICE_ID',
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET',
    'R2_OBJECT_KEY',
    'DOWNLOAD_SIGNING_SECRET'
  ];

  const missing = requiredEnv.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    return res.status(500).json({ error: `Missing configuration: ${missing.join(', ')}` });
  }

  const token = typeof req.query.token === 'string' ? req.query.token : '';
  const sessionId = extractVerifiedSessionId(token);
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing or invalid download token.' });
  }

  try {
    console.info('download.request', { sessionId: redactSessionId(sessionId) });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 10 });

    const matchesExpectedPrice = lineItems.data.some((item) => item.price && item.price.id === process.env.STRIPE_PRICE_ID);
    const isPaid = session.payment_status === 'paid' && session.status === 'complete';

    if (!isPaid || !matchesExpectedPrice) {
      console.warn('download.denied', {
        sessionId: redactSessionId(session.id),
        paymentStatus: session.payment_status,
        sessionStatus: session.status,
        matchesExpectedPrice
      });

      return res.status(403).json({ error: 'Payment verification failed for this session.' });
    }

    const r2Client = createR2Client();
    const objectKey = process.env.R2_OBJECT_KEY;
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: objectKey,
      ResponseContentType: 'application/octet-stream',
      ResponseContentDisposition: `attachment; filename="${fileNameFromKey(objectKey)}"`
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 120 });

    res.setHeader('Cache-Control', 'no-store');
    console.info('download.redirect', {
      sessionId: redactSessionId(session.id),
      expiresInSeconds: 120
    });
    res.writeHead(302, { Location: signedUrl });
    return res.end();
  } catch (error) {
    console.error('download.failed', {
      sessionId: redactSessionId(sessionId),
      message: error instanceof Error ? error.message : 'Unknown download error.'
    });

    return res.status(500).json({
      error: 'Unable to generate secure download link right now. Please retry in a moment.'
    });
  }
}
