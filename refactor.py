import os
import re

# Все замены: (regex, replacement)
REPLACEMENTS = [
    # Хардкодненные тёмные градиенты -> var(--card)
    (r'bg-\[linear-gradient\(145deg,rgba\(24,9,45,0\.\d+\),rgba\(7,3,16,0\.\d+\)\)\]', 'bg-[var(--card)]'),
    (r'bg-\[linear-gradient\(145deg,rgba\(9,24,45,0\.\d+\),rgba\(3,7,16,0\.\d+\)\)\]', 'bg-[var(--card)]'),
    
    # Неоновые бордеры -> var(--border)
    (r'border-\[rgba\(176,38,255,0\.\d+\)\]', 'border-[var(--border)]'),
    (r'border-\[rgba\(0,240,255,0\.\d+\)\]', 'border-[var(--border)]'),
    
    # Неоновые тени -> shadow-sm
    (r'shadow-\[0_0_\d+px_rgba\(176,38,255,[^\]]+\)\]', 'shadow-sm'),
    (r'shadow-\[0_0_\d+px_rgba\(0,240,255,[^\]]+\)\]', 'shadow-sm'),
    (r'shadow-\[0_-4px_32px_rgba\(0,0,0,[^\]]+\)\]', 'shadow-md'),
    (r'shadow-\[var\(--glow-purple\)\]', 'shadow-sm'),
    (r'shadow-\[0_0_20px_rgba\(255,0,127,0\.\d+\)\]', 'shadow-sm'),
    
    # Градиентные полоски -> var(--primary)
    (r'bg-\[linear-gradient\(90deg,var\(--neon-purple\),var\(--neon-blue\),var\(--neon-pink\)\)\]', 'bg-[var(--primary)]'),
    (r'bg-\[linear-gradient\(135deg,var\(--neon-purple\),var\(--neon-pink\)\)\]', 'bg-[var(--primary)]'),
    (r'bg-\[linear-gradient\(135deg,var\(--neon-pink\),#ff4d4d\)\]', 'bg-[var(--destructive)]'),
    
    # Текстовые переменные
    (r'text-\[var\(--text-main\)\]', 'text-[var(--foreground)]'),
    (r'text-\[var\(--text-dim\)\]', 'text-[var(--muted-foreground)]'),
    (r'text-\[var\(--neon-purple\)\]', 'text-[var(--primary)]'),
    (r'text-\[var\(--neon-pink\)\]', 'text-[var(--primary)]'),
    (r'text-\[var\(--neon-blue\)\]', 'text-[var(--primary)]'),
    
    # Фоновые переменные
    (r'bg-\[var\(--bg-surface\)\]', 'bg-[var(--secondary)]'),
    (r'bg-\[var\(--bg-surface-glass\)\]', 'bg-[var(--card)]'),
    (r'bg-\[var\(--bg-deep\)\]', 'bg-[var(--background)]'),
    
    # Полупрозрачные неоновые фоны -> var(--muted)
    (r'bg-\[rgba\(176,38,255,[^\]]+\)\]', 'bg-[var(--muted)]'),
    (r'bg-\[rgba\(0,240,255,[^\]]+\)\]', 'bg-[var(--muted)]'),
    (r'bg-\[rgba\(0,0,0,0\.\d+\)\]', 'bg-[var(--secondary)]'),
    
    # Hover/focus состояния
    (r'hover:border-\[rgba\(0,240,255,[^\]]+\)\]', 'hover:border-[var(--primary)]'),
    (r'hover:border-\[rgba\(176,38,255,[^\]]+\)\]', 'hover:border-[var(--primary)]'),
    (r'hover:text-\[var\(--neon-pink\)\]', 'hover:text-[var(--primary)]'),
    (r'hover:text-\[var\(--neon-blue\)\]', 'hover:text-[var(--primary)]'),
    (r'focus:border-\[var\(--neon-purple\)\]', 'focus:border-[var(--primary)]'),
    (r'focus:border-\[var\(--neon-blue\)\]', 'focus:border-[var(--primary)]'),
    
    # rounded-3xl -> rounded-xl (упрощаем)
    (r'rounded-3xl', 'rounded-xl'),
    
    # avatar-neon -> убираем неоновое свечение
    (r'avatar-neon', 'rounded-full border-2 border-[var(--primary)] p-0.5'),
]

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"❌ Ошибка чтения {filepath}: {e}")
        return False
    
    original = content
    for pattern, replacement in REPLACEMENTS:
        content = re.sub(pattern, replacement, content)
    
    if content != original:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"❌ Ошибка записи {filepath}: {e}")
            return False
    return False

def main():
    # Ищем все .tsx и .ts файлы в папке app
    app_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app')
    
    if not os.path.exists(app_dir):
        print(f"❌ Папка {app_dir} не найдена!")
        return
    
    updated_count = 0
    total_count = 0
    
    for root, dirs, files in os.walk(app_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')) and not file.endswith('.d.ts'):
                total_count += 1
                filepath = os.path.join(root, file)
                if process_file(filepath):
                    updated_count += 1
                    print(f"✅ {os.path.relpath(filepath, app_dir)}")
    
    print(f"\n🎉 Готово! Обновлено {updated_count} из {total_count} файлов.")

if __name__ == '__main__':
    main()