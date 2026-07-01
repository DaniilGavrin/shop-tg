import { ScreenTitle } from '../../../components/ScreenTitle';

export const revalidate = 15552000;

export default function RequisitesPage() {
  return (
    <>
      <ScreenTitle>Реквизиты исполнителя</ScreenTitle>
      
      <div className="mt-6 space-y-6 text-sm text-[var(--foreground)] leading-relaxed">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Исполнитель</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Наименование:</span>
              <span className="font-medium text-right">ИП Гаврин Даниил Никитич</span>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">ИНН:</span>
              <span className="font-medium">434584462396</span>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">ОГРНИП:</span>
              <span className="font-medium">325430000043774</span>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Режим налогообложения:</span>
              <span className="font-medium">УСН (доходы)</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Контактная информация</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Email:</span>
              <a href="mailto:daniilgavrin@bytewizard.ru" className="font-medium text-[var(--primary)] hover:text-[var(--primary)] transition">
                daniilgavrin@bytewizard.ru
              </a>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Telegram:</span>
              <a href="https://t.me/danya_gavrin" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--primary)] hover:text-[var(--primary)] transition">
                @danya_gavrin
              </a>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Сайт:</span>
              <a href="https://shop.bytewizard.ru" className="font-medium text-[var(--primary)] hover:text-[var(--primary)] transition">
                shop.bytewizard.ru
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <h2 className="text-lg font-bold text-[var(--primary)] mb-4">Банковские реквизиты</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Банк:</span>
              <span className="font-medium text-right">АО "ТБанк"</span>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Расчётный счёт:</span>
              <span className="font-medium">40802810200008620353</span>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">БИК:</span>
              <span className="font-medium">044525974</span>
            </div>
            
            <div className="flex justify-between border-b border-[var(--border)] pb-2">
              <span className="text-[var(--muted-foreground)]">Корр. счёт:</span>
              <span className="font-medium">30101810145250000974</span>
            </div>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--muted-foreground)]">
          <p>Информация актуальна на: {new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    </>
  );
}