import React, { useState } from 'react';

interface ScopeOption {
  name: string;
  description: string;
  checked: boolean;
}

const Home: React.FC = () => {
  const [shop, setShop] = useState('');
  const [scopes, setScopes] = useState<ScopeOption[]>([
    { name: 'read_products', description: 'Read Products', checked: false },
    { name: 'write_products', description: 'Write Products', checked: false },
    { name: 'read_orders', description: 'Read Orders', checked: false },
    { name: 'write_orders', description: 'Write Orders', checked: false }
  ]);

  const handleScopeChange = (index: number) => {
    const newScopes = scopes.map((scope, i) => {
      if (i === index) {
        return { ...scope, checked: !scope.checked };
      }
      return scope;
    });
    setScopes(newScopes);
  };

  const generateState = () => {
    const randomString = btoa(new Date().toISOString() + Math.random().toString()).substring(0, 12);
    sessionStorage.setItem('oauth_state', randomString);
    return randomString;
  };

  const handleInstall = () => {
    const appUrl = 'https://shopify-app-pink.vercel.app';
    const clientId = process.env.CLIENT_ID;
    const selectedScopes = scopes.filter(scope => scope.checked).map(scope => scope.name).join(',');
    const redirectUri = encodeURIComponent(`${appUrl}/api/auth/callback`);
    const state = generateState();

    sessionStorage.setItem('oauth_state', state);  
    
    if (shop && selectedScopes) {
      window.location.href = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${selectedScopes}&redirect_uri=${redirectUri}&state=${state}`;
    } else {
      alert('Please enter your shop domain and select at least one permission.');
    }
  };

  return (
    <div>
      <h1>Welcome to My Shopify App</h1>
      <input
        type="text"
        value={shop}
        onChange={e => setShop(e.target.value)}
        placeholder="yourshop.myshopify.com"
      />
      <div>
        {scopes.map((scope, index) => (
          <label key={scope.name}>
            <input
              type="checkbox"
              checked={scope.checked}
              onChange={() => handleScopeChange(index)}
            />
            {scope.description}
          </label>
        ))}
      </div>
      <button onClick={handleInstall}>Install App</button>
    </div>
  );
};

export default Home;
