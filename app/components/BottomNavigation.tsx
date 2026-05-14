import type { ReactNode } from 'react';
import type { AppTab } from '../types/telegram';
import styles from './BottomNavigation.module.css';

type BottomNavigationProps = {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
};

const items: Array<{
  id: AppTab;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: 'home',
    label: 'Главная',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Профиль',
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Zm-7.2 7.3c.7-3.8 3.5-5.7 7.2-5.7s6.5 1.9 7.2 5.7c.1.8-.5 1.5-1.3 1.5H6.1c-.8 0-1.4-.7-1.3-1.5Z" />
      </svg>
    ),
  },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav
      className={`${styles.navigation} ${styles[activeTab]}`}
      aria-label="Главное меню"
    >
      <div className={styles.highlight} aria-hidden="true" />

      <div className={styles.inner}>
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
