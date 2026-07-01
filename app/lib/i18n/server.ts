import { dictionaries } from './dictionaries';

export function getTranslation(locale: string) {
  const dict = dictionaries[locale as keyof typeof dictionaries] ?? dictionaries.ru;
  return { t: dict, locale };
}