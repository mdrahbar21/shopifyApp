// pages/installApp.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const InstallApp = () => {
    const router = useRouter();
    const { shop } = router.query;

    useEffect(() => {
        if (shop) {
            initiateOAuthFlow(shop as string);
        }
    }, [shop]);

    const initiateOAuthFlow = (shop: string) => {
        const clientId = process.env.CLIENT_ID;
        const scopes = 'write_products,read_orders';
        const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`);
        const state = generateState();
        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}&grant_options[]=per-user`;

        window.location.href = authUrl;
    };

    const generateState = () => {
        const randomString = btoa(new Date().toISOString() + Math.random().toString()).substring(0, 12);
        sessionStorage.setItem('oauth_state', randomString);
        return randomString;
    };

    return (
        <div>
            <h1>Initiating Installation...</h1>
            {shop && <p>Redirecting {shop} to authorization screen...</p>}
        </div>
    );
};

export default InstallApp;
