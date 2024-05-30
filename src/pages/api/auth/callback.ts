// pages/api/auth/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import crypto from 'crypto';
import base64 from 'base-64';

function verifyHmac(query: { [key: string]: string | string[] }, secret: string) {
    const { hmac, ...params } = query;
    const message = Object.keys(params)
        .sort()
        .map(key => {
            const value = params[key];
            return `${key}=${Array.isArray(value) ? value.join('') : value}`;
        })
        .join('&');
    
    const hash = crypto.createHmac('sha256', secret).update(message).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac as string));

}

function isValidShopHostname(shop: string) {
    const pattern = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
    return pattern.test(shop);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, hmac, shop, state, host } = req.query as { code: string, hmac: string, shop: string, state: string, host: string };
    const savedState = req.cookies['oauth_state'];

    if (state !== savedState) {
        return res.status(403).json({ error: 'Invalid state parameter' });
    }

    if (!verifyHmac(req.query as { [key: string]: string | string[] }, process.env.CLIENT_SECRET as string)) {
        return res.status(400).json({ error: 'HMAC validation failed' });
    }

    if (!isValidShopHostname(shop)) {
        return res.status(400).json({ error: 'Invalid shop hostname' });
    }

    const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
    const accessTokenPayload = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code
    };

    try {
        const response = await axios.post(accessTokenRequestUrl, accessTokenPayload);
        const { access_token, scope } = response.data;
        const decodedHost = base64.decode(host.replace(/\s/g, '+'));
        // Directly redirect without checking if embedded
        res.redirect(`/?shop=${shop}&host=${encodeURIComponent(decodedHost)}`);
    } catch (error:any) {
        console.error('Failed to obtain access token:', error);
        return res.status(500).json({ error: 'Failed to get access token', details: error.message });
    }
}
