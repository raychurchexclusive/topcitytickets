// /api/auth/google/callback.js (for Vercel Serverless Function)

import fetch from 'node-fetch';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing authorization code.');
  }

  const client_id = '381909501018-oj0l40g2b2muv8edgb4vlf3g49v9r1e0.apps.googleusercontent.com';
  const client_secret = process.env.GOOGLE_CLIENT_SECRET; // Store this in Vercel env vars
  const redirect_uri = 'https://topcitytickets.vercel.app/api/auth/google/callback';

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    const id_token = tokenData.id_token;

    if (!id_token) {
      return res.status(401).send('Token exchange failed.');
    }

    // Decode ID token (base64, no signature verification)
    const base64Payload = id_token.split('.')[1];
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
    const email = payload.email;

    // Set session cookie
    res.setHeader('Set-Cookie', serialize('cookie_sesh', '1', {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'Lax',
    }));

    // Redirect based on email
    const sellerEmails = ['seller1@example.com', 'seller2@example.com'];
    if (sellerEmails.includes(email)) {
      res.redirect('/seller.html');
    } else {
      res.redirect('/events.html');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Authentication failed.');
  }
}