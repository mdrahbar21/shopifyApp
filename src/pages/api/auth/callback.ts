import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const tokenStorage: { [key: string]: { accessToken: string, createdAt: Date } } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, state, shop } = req.query as { code: string, state: string, shop: string };

    if (state !== process.env.OAUTH_STATE_SECRET) {
        return res.status(403).json({ error: 'Security check failed' });
    }

    const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
    const accessTokenPayload = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code
    };

    try {
        const response = await axios.post(accessTokenRequestUrl, accessTokenPayload);
        const { access_token } = response.data;

        // Store the access token in in-memory storage
        tokenStorage[shop] = {
            accessToken: access_token,
            createdAt: new Date()
        };

        // Send a success message or redirect
        res.status(200).json({ message: 'App installed successfully!', accessToken: access_token });
        // res.redirect('/success'); // Optionally, redirect to a success page or dashboard
    } catch (error) {
        console.error('Failed to obtain access token:', error);
        return res.status(500).json({ error: 'Failed to get access token' });
    }
}
