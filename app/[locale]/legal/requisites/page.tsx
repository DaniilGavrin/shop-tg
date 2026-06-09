'use client';

import { ScreenTitle } from '../../../components/ScreenTitle';

export default function RequisitesPage() {
  return (
    <>
      <ScreenTitle>Реквизиты исполнителя</ScreenTitle>
      
      <div className="mt-6 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-4">Исполнитель</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Наименование:</span>
              <span className="font-medium text-right">ИП Гаврин Даниил Никитич</span>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">ИНН:</span>
              <span className="font-medium">434584462396</span>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">ОГРНИП:</span>
              <span className="font-medium">323430000123456</span>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Режим налогообложения:</span>
              <span className="font-medium">УСН (доходы)</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-4">Контактная информация</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Email:</span>
              <a href="mailto:daniilgavrin@bytewizard.ru" className="font-medium text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition">
                daniilgavrin@bytewizard.ru
              </a>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Telegram:</span>
              <a href="https://t.me/danya_gavrin" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition">
                @danya_gavrin
              </a>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Сайт:</span>
              <a href="https://shop.bytewizard.ru" className="font-medium text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition">
                shop.bytewizard.ru
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-4">Банковские реквизиты</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Банк:</span>
              <span className="font-medium text-right">АО "ТБанк"</span>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Расчётный счёт:</span>
              <span className="font-medium">40802810200008620353</span>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">БИК:</span>
              <span className="font-medium">044525974</span>
            </div>
            
            <div className="flex justify-between border-b border-[rgba(176,38,255,0.15)] pb-2">
              <span className="text-[var(--text-dim)]">Корр. счёт:</span>
              <span className="font-medium">30101810145250000974</span>
            </div>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-[rgba(176,38,255,0.2)] text-center text-xs text-[var(--text-dim)]">
          <p>Информация актуальна на: {new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    </>
  );
}