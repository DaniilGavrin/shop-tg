const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');

// Create directories
const dirs = [
  'catalog',
  'cart',
  'profile'
];

dirs.forEach(dir => {
  const fullPath = path.join(appDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create page files
const files = {
  'catalog/page.tsx': `'use client';

import { CatalogScreen } from '../components/CatalogScreen';

export default function CatalogPage() {
  return <CatalogScreen />;
}
`,
  'cart/page.tsx': `'use client';

import { CartScreen } from '../components/CartScreen';

export default function CartPage() {
  return <CartScreen />;
}
`,
  'profile/page.tsx': `'use client';

import { useEffect, useState } from 'react';
import { ProfilePanel } from '../components/ProfilePanel';
import { getDisplayTelegramUser } from '../lib/telegram';
import type { TelegramUser } from '../types/telegram';

export default function ProfilePage() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    setUser(getDisplayTelegramUser());
  }, []);

  if (!user) return null;

  return <ProfilePanel user={user} />;
}
`
};

Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(appDir, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Created: ${filePath}`);
});

console.log('\n✓ All routes setup successfully!');
