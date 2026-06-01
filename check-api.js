const ids = [1,2,3,4,5,6,7,8,10,12,14,15,16,17,18,19,20,21,22];
const BASE = 'https://api.shop.bytewizard.ru/catalog';

const checkDelivery = (d) => {
  if (!d) return '❌ отсутствует';
  if (!('base_days' in d)) return '❌ нет base_days';
  if ('days' in d) return '⚠️ осталось старое поле "days"';
  return '✅ unified';
};

const checkPricing = (p) => {
  if (!p) return '❌ отсутствует';
  if (!('base_price' in p)) return '❌ нет base_price';
  if ('base' in p || 'hourly' in p) return '⚠️ остались старые ключи ("base"/"hourly")';
  if (!('currency' in p)) return '❌ нет currency';
  return '✅ unified';
};

const checkConfigSchema = (schema) => {
  if (!schema || typeof schema !== 'object') return '✅ пусто/нет схемы';
  const jsonStr = JSON.stringify(schema);
  if (jsonStr.includes('"modifier"') && !jsonStr.includes('"price_modifier"')) return '❌ остался "modifier"';
  if (jsonStr.includes('"delivery_modifier"')) return '❌ остался "delivery_modifier"';
  return '✅ unified';
};

async function verifyAll() {
  console.log('🔍 Начинаю проверку API...\n');
  const results = [];

  for (const id of ids) {
    try {
      const res = await fetch(`${BASE}/${id}`);
      if (!res.ok) {
        results.push({ id, status: res.status, error: `HTTP ${res.status}` });
        continue;
      }
      const { item } = await res.json();
      const m = item?.metadata || {};

      results.push({
        id,
        name: item.name?.slice(0, 20) || '—',
        delivery: checkDelivery(m.delivery),
        pricing: checkPricing(m.pricing),
        config_schema: checkConfigSchema(m.config_schema),
      });
    } catch (err) {
      results.push({ id, error: err.message });
    }
  }

  // Вывод таблицы
  console.table(results);
  
  const failed = results.filter(r => 
    typeof r.delivery === 'string' && r.delivery.includes('❌') ||
    typeof r.pricing === 'string' && r.pricing.includes('❌') ||
    typeof r.config_schema === 'string' && r.config_schema.includes('❌')
  );

  if (failed.length === 0) {
    console.log('\n🎉 ВСЕ ТОВАРЫ УНИФИЦИРОВАНЫ. Можно обновлять фронтенд.');
  } else {
    console.log(`\n⚠️ Найдено проблем: ${failed.length}`);
    failed.forEach(f => console.log(`  ID ${f.id}: delivery=${f.delivery} | pricing=${f.pricing} | config_schema=${f.config_schema}`));
  }
}

verifyAll();