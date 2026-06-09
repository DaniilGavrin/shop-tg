'use client';
import { useEffect, useState } from 'react';

export function DebugOverlay() {
  const [logs, setLogs] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Показываем оверлей если в URL есть ?debug=1 или если накопились ошибки
    const params = new URLSearchParams(window.location.search);
    if (params.has('debug')) setShow(true);

    const addLog = (msg: string) => {
      setLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]);
      setShow(true);
      console.warn('[DebugOverlay]', msg);
    };

    const handleGlobalError = (event: ErrorEvent) => {
      addLog(`JS Error: ${event.message} @ ${event.filename}:${event.lineno}`);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addLog(`Promise Rejection: ${event.reason?.message || event.reason}`);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Проверка загрузки CSS
    const testEl = document.getElementById('css-test-element');
    if (testEl) {
      const style = window.getComputedStyle(testEl);
      if (style.display !== 'none' || style.color !== 'rgb(176, 38, 255)') {
        addLog('❌ CSS/Tailwind не загрузился или перезаписан!');
      } else {
        addLog('✅ CSS загружен корректно');
      }
    }

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] max-w-sm w-full bg-black/95 border border-yellow-500/50 rounded-lg p-3 shadow-2xl">
      <div className="flex justify-between items-center mb-2 border-b border-yellow-500/30 pb-2">
        <span className="font-bold text-yellow-400 text-sm">🐛 Debug Mode</span>
        <button onClick={() => setShow(false)} className="text-yellow-500 hover:text-white text-xs">✕</button>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto text-xs font-mono">
        {logs.map((log, i) => (
          <div key={i} className="text-yellow-200/90 break-words">{log}</div>
        ))}
      </div>
    </div>
    );
}