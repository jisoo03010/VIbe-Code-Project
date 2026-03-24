type Page = 'home' | 'today' | 'settings';

interface BottomNavProps {
  current: Page;
  onChange: (page: Page) => void;
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  const items: { page: Page; label: string; icon: string }[] = [
    { page: 'home', label: '홈', icon: '🏠' },
    { page: 'today', label: '오늘', icon: '🫘' },
    { page: 'settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ page, label, icon }) => (
        <button
          key={page}
          className={`bottom-nav__item ${current === page ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onChange(page)}
        >
          <span className="bottom-nav__icon">{icon}</span>
          <span className="bottom-nav__label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
