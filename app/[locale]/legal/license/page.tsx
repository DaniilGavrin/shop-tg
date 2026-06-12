import { ScreenTitle } from '../../../components/ScreenTitle';

export const revalidate = 259200

export default function LicensePage() {
  return (
    <>
      <ScreenTitle>Лицензионное соглашение</ScreenTitle>
      
      <div className="mt-6 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">1. Общие положения</h2>
          <p className="mb-2">
            Настоящее Лицензионное соглашение (далее — «Соглашение») регулирует отношения между 
            ИП Гаврин Даниил Никитич (далее — «Лицензиар») и пользователем (далее — «Лицензиат») 
            по поводу использования программного обеспечения, создаваемого в рамках оказания услуг.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">2. Предмет соглашения</h2>
          <p className="mb-2">
            Лицензиар предоставляет Лицензиату неисключительную лицензию на использование программного 
            обеспечения, разработанного в рамках исполнения заказа, на условиях простой (неисключительной) 
            лицензии.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">3. Права Лицензиата</h2>
          <p className="mb-2">Лицензиат вправе:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Использовать программное обеспечение в своей деятельности</li>
            <li>Воспроизводить программное обеспечение для собственных нужд</li>
            <li>Модифицировать программное обеспечение для адаптации под свои потребности</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">4. Ограничения</h2>
          <p className="mb-2">Лицензиату запрещается:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Передавать права на программное обеспечение третьим лицам без письменного согласия Лицензиара</li>
            <li>Использовать программное обеспечение для создания конкурирующих продуктов</li>
            <li>Удалять или изменять информацию об авторских правах</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">5. Интеллектуальная собственность</h2>
          <p>
            Исключительные права на исходный код, алгоритмы и документацию, разработанные в рамках 
            исполнения заказа, принадлежат Лицензиару до момента полной оплаты услуг. После полной 
            оплаты исключительные права переходят к Лицензиату в объёме, согласованном сторонами.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-[rgba(176,38,255,0.2)] text-center text-xs text-[var(--text-dim)]">
          <p>Дата публикации: {new Date().toLocaleDateString('ru-RU')}</p>
          <p className="mt-2">ИП Гаврин Даниил Никитич</p>
        </div>
      </div>
    </>
  );
}