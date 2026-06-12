import { ScreenTitle } from '../../../components/ScreenTitle';

export const revalidate = 259200

export default function RefundPage() {
  return (
    <>
      <ScreenTitle>Возврат и отмена заказа</ScreenTitle>
      
      <div className="mt-6 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">1. Отмена заказа до начала исполнения</h2>
          <p className="mb-2">
            1.1. Заказчик вправе отказаться от заказа в любое время до начала его исполнения, 
            уплатив Исполнителю фактически понесённые расходы (ст. 32 Закона РФ «О защите прав потребителей»).
          </p>
          <p>
            1.2. Для отмены заказа необходимо направить уведомление на email Исполнителя или через 
            личный кабинет на Сайте.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">2. Возврат денежных средств</h2>
          <p className="mb-2">2.1. Возврат денежных средств осуществляется тем же способом, которым производилась оплата:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)] mb-3">
            <li>Банковская карта — возврат на карту (3-10 рабочих дней)</li>
            <li>СБП — возврат через СБП (1-3 рабочих дня)</li>
            <li>Криптовалюта — возврат в той же криптовалюте</li>
            <li>Telegram Stars — возврат звёздами</li>
          </ul>
          <p>2.2. Срок возврата составляет до 10 рабочих дней с момента получения письменного заявления от Заказчика.</p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">3. Отмена заказа в процессе исполнения</h2>
          <p className="mb-2">
            3.1. Если заказ уже находится в работе, Заказчик обязан возместить Исполнителю фактически 
            понесённые расходы, включая:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Оплату труда разработчиков за выполненный объём работ</li>
            <li>Стоимость использованных лицензий и сервисов</li>
            <li>Комиссии платёжных систем</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">4. Возврат при некачественном исполнении</h2>
          <p className="mb-2">
            4.1. Если услуги оказаны с существенными недостатками, Заказчик вправе потребовать:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)] mb-3">
            <li>Безвозмездного устранения недостатков</li>
            <li>Соразмерного уменьшения цены</li>
            <li>Полного возврата денежных средств</li>
          </ul>
          <p>4.2. Претензии по качеству принимаются в течение 14 дней с момента получения результата.</p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">5. Случаи, когда возврат не производится</h2>
          <p className="mb-2">Возврат денежных средств не производится в следующих случаях:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Услуги полностью исполнены и приняты Заказчиком</li>
            <li>Заказчик нарушил условия Оферты (недобросовестные действия, манипуляции с ценой)</li>
            <li>Истёк срок предъявления претензий</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">6. Порядок предъявления претензий</h2>
          <p className="mb-2">
            6.1. Для оформления возврата необходимо направить письменное заявление на email Исполнителя 
            с указанием:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)] mb-3">
            <li>Номера заказа</li>
            <li>Причины возврата</li>
            <li>Реквизитов для возврата денежных средств</li>
          </ul>
          <p>6.2. Исполнитель рассматривает заявление в течение 5 рабочих дней и уведомляет Заказчика о принятом решении.</p>
        </section>

        <div className="mt-8 pt-6 border-t border-[rgba(176,38,255,0.2)] text-center text-xs text-[var(--text-dim)]">
          <p>Дата публикации: {new Date().toLocaleDateString('ru-RU')}</p>
          <p className="mt-2">По вопросам возврата: daniilgavrin@bytewizard.ru</p>
        </div>
      </div>
    </>
  );
}