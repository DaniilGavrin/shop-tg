'use client';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { ScreenTitle } from '../../components/ScreenTitle';
import { useState, useEffect } from 'react';

// ЗАКОММЕНТИРОВАНО: Тип для кэша
// type CachedContacts = {
//   data: typeof CONTACTS;
//   timestamp: number;
// };

export default function ContactPage() {
  const { t } = useTranslation();
  
  // ЗАКОММЕНТИРОВАНО: Стейт для кэшированных контактов
  // const [contacts, setContacts] = useState(CONTACTS);
  
  // ЗАКОММЕНТИРОВАНО: Клиентский кэш на 3 месяца (7776000000 мс)
  // useEffect(() => {
  //   const CACHE_KEY = 'bw_contacts_cache';
  //   const CACHE_DURATION = 7776000000; // 3 месяца в миллисекундах
  //   
  //   try {
  //     const cached = localStorage.getItem(CACHE_KEY);
  //     if (cached) {
  //       const { data, timestamp }: CachedContacts = JSON.parse(cached);
  //       const age = Date.now() - timestamp;
  //       
  //       if (age < CACHE_DURATION) {
  //         console.log('[CONTACTS] Loaded from cache, age:', Math.round(age / 86400000), 'days');
  //         setContacts(data);
  //         return;
  //       }
  //       console.log('[CONTACTS] Cache expired, refreshing...');
  //     }
  //     
  //     // Если кэша нет или устарел, сохраняем текущие данные
  //     // В будущем здесь будет fetch к API
  //     const freshData = CONTACTS; // Потом заменишь на: await fetchContacts()
  //     setContacts(freshData);
  //     
  //     localStorage.setItem(CACHE_KEY, JSON.stringify({
  //       data: freshData,
  //       timestamp: Date.now()
  //     }));
  //     console.log('[CONTACTS] Cached for 3 months');
  //   } catch (e) {
  //     console.error('[CONTACTS] Cache error:', e);
  //   }
  // }, []);
  
  // ЗАКОММЕНТИРОВАНО: Используем кэшированные contacts вместо CONTACTS
  // const displayContacts = contacts;
  

  const displayContacts = [
    { label: t.contact.email_label, value: 'daniilgavrin@bytewizard.ru', href: 'mailto:daniilgavrin@bytewizard.ru' },
    { label: t.contact.telegram_label, value: '@danya_gavrin', href: 'https://t.me/danya_gavrin', external: true },
    { label: t.contact.vk_label, value: 'vk.com/danya_gavrin', href: 'https://vk.com/danya_gavrin', external: true },
    //{ label: t.contact.wechat_label, value: 'your_wechat_id', href: '#' },
    //{ label: t.contact.discord_label, value: 'your_username#0000', href: '#' },
  ];
  
  return (
    <>
      <ScreenTitle>{t.nav.contact}</ScreenTitle>
      {displayContacts.map((contact) => {
        const isExternal = contact.external || contact.href.startsWith('http');
        const isPlaceholder = contact.href === '#';
        const cardStyle = "block mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[var(--border)] hover:shadow-sm";
        
        if (isPlaceholder) {
          return (
            <button
              key={contact.label}
              type="button"
              onClick={() => navigator.clipboard.writeText(contact.value)}
              className={`${cardStyle} w-full text-left`}
            >
              <div className="h-1 bg-[var(--primary)]" />
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{contact.label}</p>
                  <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">{contact.value}</h3>
                </div>
                <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </div>
            </button>
          );
        }
        
        return (
          <a
            key={contact.label}
            href={contact.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer' : undefined}
            className={cardStyle}
          >
            <div className="h-1 bg-[var(--primary)]" />
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{contact.label}</p>
                <h3 className="mt-1 text-base font-semibold text-[var(--foreground)]">{contact.value}</h3>
              </div>
              <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        );
      })}
      <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">{t.contact.hint}</p>
    </>
  );
}