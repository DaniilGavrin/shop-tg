'use client';

import { ScreenTitle } from '../../../components/ScreenTitle';

export default function PrivacyPolicyPage() {
  return (
    <>
      <ScreenTitle>Политика обработки персональных данных</ScreenTitle>
      
      <div className="mt-6 space-y-6 text-sm text-[var(--text-main)] leading-relaxed">
        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">1. Общие положения</h2>
          <p className="mb-2">
            Настоящая Политика конфиденциальности персональных данных (далее – Политика) действует в отношении всей информации, 
            которую ИП Гаврин Даниил Никитич (далее – Оператор) может получить о Пользователе во время использования сайта 
            shop.bytewizard.ru.
          </p>
          <p>
            Использование сайта означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями 
            обработки его персональной информации.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">2. Персональные данные, собираемые сайтом</h2>
          <p className="mb-2">Оператор может собирать следующие персональные данные:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Имя и фамилия</li>
            <li>Адрес электронной почты</li>
            <li>Номер телефона</li>
            <li>Telegram ID и username</li>
            <li>IP-адрес и данные о браузере</li>
            <li>Информация о заказах и платежах</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">3. Цели обработки персональных данных</h2>
          <p className="mb-2">Персональные данные обрабатываются в следующих целях:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Идентификация Пользователя для оформления заказов</li>
            <li>Предоставление доступа к персонализированным ресурсам сайта</li>
            <li>Установление обратной связи для направления уведомлений и запросов</li>
            <li>Обработка платежей и выставление счетов</li>
            <li>Подтверждение достоверности предоставленных данных</li>
            <li>Уведомление о статусе заказов</li>
            <li>Предоставление технической поддержки</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">4. Способы и сроки обработки персональных данных</h2>
          <p className="mb-2">
            Обработка персональных данных осуществляется без ограничения срока, любым законным способом, в том числе в 
            информационных системах персональных данных с использованием средств автоматизации или без использования таких средств.
          </p>
          <p>
            Персональные данные хранятся на серверах, и защищены с использованием 
            современных методов шифрования.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">5. Передача персональных данных третьим лицам</h2>
          <p className="mb-2">
            Оператор не передает персональные данные третьим лицам, за исключением случаев:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Пользователь выразил согласие на такие действия</li>
            <li>Передача необходима для исполнения договора с Пользователем (например, платежным системам)</li>
            <li>Передача предусмотрена законодательством Российской Федерации</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">6. Права Пользователя</h2>
          <p className="mb-2">Пользователь имеет право:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 text-[var(--text-dim)]">
            <li>Получать информацию об обработке своих персональных данных</li>
            <li>Требовать уточнения, блокирования или уничтожения своих персональных данных</li>
            <li>Отозвать согласие на обработку персональных данных</li>
            <li>Обжаловать действия Оператора в Роскомнадзор или в суд</li>
          </ul>
          <p className="mt-3">
            Для реализации своих прав Пользователь может направить запрос на email: 
            <a href="mailto:daniilgavrin@bytewizard.ru" className="text-[var(--neon-purple)] hover:text-[var(--neon-pink)] ml-1">
              daniilgavrin@bytewizard.ru
            </a>
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">7. Защита персональных данных</h2>
          <p>
            Оператор принимает необходимые организационные и технические меры для защиты персональной информации от 
            неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения.
          </p>
        </section>

        <section className="rounded-2xl border border-[rgba(176,38,255,0.26)] bg-[var(--bg-surface-glass)] p-5">
          <h2 className="text-lg font-bold text-[var(--neon-purple)] mb-3">8. Изменение Политики конфиденциальности</h2>
          <p>
            Оператор имеет право вносить изменения в настоящую Политику конфиденциальности. Новая редакция Политики вступает 
            в силу с момента ее размещения на сайте, если иное не предусмотрено новой редакцией Политики.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-[rgba(176,38,255,0.2)] text-center text-xs text-[var(--text-dim)]">
          <p>Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}</p>
          <p className="mt-2">ИП Гаврин Даниил Никитич</p>
        </div>
      </div>
    </>
  );
}