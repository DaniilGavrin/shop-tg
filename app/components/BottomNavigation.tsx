import type { ReactNode } from 'react';
import type { AppTab } from '../types/telegram';
import styles from './BottomNavigation.module.css';

import { useTranslation } from '../lib/i18n/useTranslation';

type BottomNavigationProps = {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

type NavItem = {
  id: AppTab;
  label: string;
  icon: ReactNode;
};

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { t } = useTranslation();

  const items: NavItem[] = [
    {
      id: 'home',
      label: t.nav.home,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
        </svg>
      ),
    },
    {
      id: 'catalog',
      label: t.nav.catalog,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4.8 4h5.4c.4 0 .8.4.8.8v5.4c0 .4-.4.8-.8.8H4.8a.8.8 0 0 1-.8-.8V4.8c0-.4.4-.8.8-.8Zm9 0h5.4c.4 0 .8.4.8.8v5.4c0 .4-.4.8-.8.8h-5.4a.8.8 0 0 1-.8-.8V4.8c0-.4.4-.8.8-.8Zm-9 9h5.4c.4 0 .8.4.8.8v5.4c0 .4-.4.8-.8.8H4.8a.8.8 0 0 1-.8-.8v-5.4c0-.4.4-.8.8-.8Zm9 0h5.4c.4 0 .8.4.8.8v5.4c0 .4-.4.8-.8.8h-5.4a.8.8 0 0 1-.8-.8v-5.4c0-.4.4-.8.8-.8Z" />
        </svg>
      ),
    },
    {
      id: 'cart',
      label: t.nav.cart,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M6.3 5.2 7 8h12.1c.7 0 1.2.7 1 1.4l-1.5 5.2a2 2 0 0 1-1.9 1.4H9.4a2 2 0 0 1-2-1.5L5.5 6.8H3.8a1.1 1.1 0 1 1 0-2.2h1.4c.5 0 1 .2 1.1.6ZM9.5 21a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm7 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: t.nav.profile,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Zm-7.2 7.3c.7-3.8 3.5-5.7 7.2-5.7s6.5 1.9 7.2 5.7c.1.8-.5 1.5-1.3 1.5H6.1c-.8 0-1.4-.7-1.3-1.5Z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className={`${styles.navigation} ${styles[activeTab]}`}
      aria-label="Главное меню"
    >
      <div className={styles.inner}>
        <div className={styles.highlight} aria-hidden="true" />

        {items.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}