'use client';

export function BackButton() {
  return (
    <button 
      type="button" 
      onClick={() => window.history.back()} 
      className="absolute left-3 p-2 rounded-xl border border-[var(--border)] text-[var(--primary)] hover:border-[var(--neon-pink)] hover:text-[var(--primary)] active:scale-[0.98] transition" 
      aria-label="Назад"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}