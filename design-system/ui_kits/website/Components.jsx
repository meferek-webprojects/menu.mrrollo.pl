// Reusable Mr. Rollo UI components (JSX global namespace)
const { useState } = React;

function Logo({ size = 48, variant = 'green' }) {
  const src = variant === 'black'
    ? '../../assets/logos/mr-rollo-black.png'
    : '../../assets/logos/mr-rollo-green.png';
  return <img src={src} width={size} height={size} alt="Mr. Rollo" style={{display:'block'}} />;
}

function Button({ children, variant = 'primary', size = 'md', onClick, icon }) {
  const pad = size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 26px' : '12px 22px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;
  const palettes = {
    primary:   { bg: 'var(--mr-black)',  fg: '#fff' },
    secondary: { bg: 'var(--mr-green)',  fg: 'var(--mr-black)' },
    accent:    { bg: 'var(--mr-orange)', fg: '#fff' },
    outline:   { bg: 'transparent',      fg: 'var(--mr-black)', border: '2px solid var(--mr-black)' },
    ghost:     { bg: 'transparent',      fg: 'var(--mr-black)' },
  };
  const p = palettes[variant];
  return (
    <button onClick={onClick} style={{
      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: fs,
      padding: pad, borderRadius: 999, border: p.border || 0,
      background: p.bg, color: p.fg, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      transition: 'transform 120ms, box-shadow 120ms',
    }}>
      {icon} {children}
    </button>
  );
}

function DietChip({ diet, active, onClick }) {
  const colors = {
    'Z Mięsem': '#DDA79E', Vege: '#BAD173', 'Vege+': '#71B783',
    Wegan: '#93D0B4', 'Low IG': '#F3ABCD', Keto: '#86D0CC', Fit: '#F0ED6E',
  };
  const icons = {
    'Z Mięsem': 'chicken-leg', Vege: 'vege', 'Vege+': 'fish',
    Wegan: 'strawberry', 'Low IG': 'low-ig', Keto: 'keto', Fit: 'strawberry',
  };
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '8px 14px 8px 8px', borderRadius: 999, border: 0, cursor: 'pointer',
      background: active ? colors[diet] : '#fff',
      color: 'var(--mr-black)',
      boxShadow: active ? '0 0 0 2px var(--mr-black) inset' : '0 0 0 1.5px var(--neutral-200) inset',
      fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
      transition: 'background 160ms',
    }}>
      <span style={{
        width: 28, height: 28, borderRadius: 999, background: colors[diet],
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src={`../../assets/icons/${icons[diet]}.svg`} width="18" height="18" alt="" />
      </span>
      {diet}
    </button>
  );
}

function MealCard({ title, subtitle, kcal, img, diet }) {
  const colors = {
    'Z Mięsem': '#DDA79E', Vege: '#BAD173', 'Vege+': '#71B783',
    Wegan: '#93D0B4', 'Low IG': '#F3ABCD', Keto: '#86D0CC', Fit: '#F0ED6E',
  };
  const [fav, setFav] = useState(false);
  return (
    <div style={{
      borderRadius: 20, background: '#fff', overflow: 'hidden',
      boxShadow: '0 6px 18px rgba(35,31,32,0.08)',
    }}>
      <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{
          position: 'absolute', top: 12, left: 12, padding: '5px 10px',
          borderRadius: 999, background: colors[diet], color: 'var(--mr-black)',
          fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600,
        }}>{diet}</span>
        <button onClick={() => setFav(!fav)} style={{
          position: 'absolute', top: 10, right: 10, width: 34, height: 34,
          borderRadius: 999, background: 'rgba(255,255,255,0.92)', border: 0, cursor: 'pointer',
          fontSize: 16, color: fav ? 'var(--mr-orange)' : 'var(--neutral-500)',
        }}>{fav ? '♥' : '♡'}</button>
      </div>
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--mr-black)' }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--neutral-500)', marginTop: 2 }}>{subtitle}</div>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600 }}>{kcal} kcal</span>
          <Button variant="outline" size="sm">Szczegóły</Button>
        </div>
      </div>
    </div>
  );
}

function Header({ active = 'Menu', onNav = () => {}, onCart = () => {}, cartCount = 0 }) {
  const items = ['Menu', 'Diety', 'Jak to działa', 'Blog', 'Kontakt'];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 40px', background: '#fff', borderBottom: '1px solid var(--neutral-100)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Logo size={52} />
        <div style={{ fontFamily: 'var(--font-accent)', fontSize: 22, color: 'var(--mr-orange)', transform: 'rotate(-4deg)' }}>od 2007</div>
      </div>
      <nav style={{ display: 'flex', gap: 6 }}>
        {items.map(i => (
          <button key={i} onClick={() => onNav(i)} style={{
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500,
            padding: '10px 16px', borderRadius: 999, border: 0, cursor: 'pointer',
            background: active === i ? 'var(--mr-black)' : 'transparent',
            color: active === i ? '#fff' : 'var(--mr-black)',
          }}>{i}</button>
        ))}
      </nav>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Button variant="ghost" size="sm">Zaloguj</Button>
        <Button variant="primary" size="sm" onClick={onCart}>
          Koszyk{cartCount > 0 ? ` · ${cartCount}` : ''}
        </Button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--mr-black)', color: '#fff', padding: '48px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
        <div>
          <Logo size={56} />
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: 36, color: 'var(--mr-green)', marginTop: 16, lineHeight: 1 }}>
            Naturalnie dla Ciebie.
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--neutral-300)', marginTop: 24, maxWidth: 320 }}>
            Świeże posiłki prosto z naszej kuchni do Twoich drzwi. W całej Polsce, od 2007 roku.
          </div>
        </div>
        {[
          { h: 'Diety', l: ['Z Mięsem', 'Vege', 'Vege+', 'Wegan', 'Keto', 'Fit', 'Low IG'] },
          { h: 'Pomoc', l: ['Jak zamówić', 'Dostawa', 'Zwroty', 'FAQ'] },
          { h: 'Firma', l: ['O nas', 'Kariera', 'Prasa', 'Regulamin'] },
        ].map(col => (
          <div key={col.h}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mr-green)', marginBottom: 14 }}>{col.h}</div>
            {col.l.map(x => (
              <div key={x} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--neutral-200)', padding: '4px 0' }}>{x}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid var(--neutral-700)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--neutral-400)' }}>
        <div>© 2026 Mr. Rollo · Catering dietetyczny</div>
        <div>Polska · ogólnopolska dostawa</div>
      </div>
    </footer>
  );
}

Object.assign(window, { Logo, Button, DietChip, MealCard, Header, Footer });
