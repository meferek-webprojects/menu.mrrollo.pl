const { useState } = React;

function HeroSection() {
  return (
    <section style={{ background: 'var(--mr-green)', padding: '72px 40px 80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 14px', background: 'var(--mr-black)', color: '#fff', borderRadius: 999, fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--mr-green)' }}></span>
            Od 2007 roku · Cała Polska
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 80, lineHeight: 0.95, letterSpacing: '-0.025em', color: 'var(--mr-black)', marginTop: 24 }}>
            Świeżo<br/>
            <span style={{ fontFamily: 'var(--font-accent)', fontWeight: 400, fontSize: 96, display: 'inline-block', transform: 'rotate(-3deg)' }}>naturalnie</span><br/>
            dla Ciebie.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.55, color: 'var(--neutral-700)', marginTop: 24, maxWidth: 460 }}>
            Codziennie przygotowane posiłki dostarczone pod Twoje drzwi. Siedem diet, osiem kalorazy, jedna decyzja mniej każdego dnia.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <Button size="lg" variant="primary">Zamów ten tydzień</Button>
            <Button size="lg" variant="outline">Zobacz menu →</Button>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 36, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--neutral-700)' }}>
            <div><strong style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--mr-black)', display: 'block' }}>19 lat</strong> na rynku</div>
            <div><strong style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--mr-black)', display: 'block' }}>7 diet</strong> dopasowanych do Ciebie</div>
            <div><strong style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--mr-black)', display: 'block' }}>24 h</strong> świeżość</div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ aspectRatio: '1/1', borderRadius: 999, overflow: 'hidden', background: 'var(--mr-black)', boxShadow: '0 28px 80px rgba(35,31,32,0.24)' }}>
            <img src="../../assets/photos/pasta-salmon.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', top: -10, right: -10, width: 150, height: 150, borderRadius: 999, background: 'var(--mr-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(8deg)', boxShadow: '0 12px 30px rgba(239,82,45,0.3)' }}>
            <div style={{ textAlign: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.9 }}>TYLKO</div>
              <div style={{ fontSize: 32, lineHeight: 1 }}>-15%</div>
              <div style={{ fontSize: 11, letterSpacing: '0.1em', opacity: 0.9, marginTop: 2 }}>NA START</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DietsSection({ active, setActive }) {
  const diets = ['Z Mięsem', 'Vege', 'Vege+', 'Wegan', 'Low IG', 'Keto', 'Fit'];
  const copy = {
    'Z Mięsem': 'Zbilansowana dieta z pełnowartościowym mięsem jako głównym źródłem białka.',
    Vege: 'Dieta bezmięsna oparta na warzywach, roślinach strączkowych i nabiale.',
    'Vege+': 'Dieta wegetariańska wzbogacona o ryby i owoce morza.',
    Wegan: 'Dieta w 100% roślinna, bez żadnych produktów odzwierzęcych.',
    'Low IG': 'Oparta na produktach o niskim indeksie glikemicznym. Stabilizuje poziom cukru.',
    Keto: 'Wysokotłuszczowa z minimalną zawartością węglowodanów.',
    Fit: 'O zredukowanej kaloryczności, zbilansowana pod kątem makroskładników.',
  };
  return (
    <section style={{ padding: '80px 40px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--neutral-500)' }}>Siedem diet</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 8, color: 'var(--mr-black)' }}>Wybierz swoją.</h2>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--neutral-600)', maxWidth: 340, textAlign: 'right' }}>
            Każda dieta ma swój kolor, ikonę i charakter. Zmień ją, kiedy chcesz — tydzień po tygodniu.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {diets.map(d => <DietChip key={d} diet={d} active={active === d} onClick={() => setActive(d)} />)}
        </div>
        <div style={{
          background: 'var(--neutral-50)', borderRadius: 28, padding: 36,
          display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32, alignItems: 'center',
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--mr-black)' }}>Dieta {active}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, color: 'var(--neutral-700)', marginTop: 14 }}>{copy[active]}</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              <Button variant="primary">Wybierz {active}</Button>
              <Button variant="ghost">Przykładowe menu</Button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <img src="../../assets/photos/meal-1.jpg" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 20 }} />
            <img src="../../assets/photos/meal-5.jpg" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 20 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection() {
  const meals = [
    { title: 'Tagliatelle z łososiem', subtitle: 'Obiad · poniedziałek', kcal: 580, img: '../../assets/photos/pasta-salmon.jpg', diet: 'Vege+' },
    { title: 'Owsianka z dynią', subtitle: 'Śniadanie · wtorek', kcal: 420, img: '../../assets/photos/oatmeal-pumpkin.jpg', diet: 'Fit' },
    { title: 'Smoothie bowl z jagodami', subtitle: 'Śniadanie · środa', kcal: 380, img: '../../assets/photos/smoothie-bowl.jpg', diet: 'Wegan' },
    { title: 'Kurczak z gnocchi', subtitle: 'Obiad · czwartek', kcal: 640, img: '../../assets/photos/chicken-potato.jpg', diet: 'Z Mięsem' },
    { title: 'Udon w sosie satay', subtitle: 'Obiad · piątek', kcal: 560, img: '../../assets/photos/noodles-asian.jpg', diet: 'Vege' },
    { title: 'Smoothie z malinami', subtitle: 'Przekąska · sobota', kcal: 240, img: '../../assets/photos/smoothie-cup.jpg', diet: 'Low IG' },
  ];
  return (
    <section style={{ padding: '80px 40px', background: 'var(--mr-cream)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--neutral-500)' }}>Menu tygodnia</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 8, color: 'var(--mr-black)' }}>Co jemy w tym tygodniu?</h2>
          </div>
          <Button variant="outline">Cały tydzień →</Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {meals.map(m => <MealCard key={m.title} {...m} />)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', t: 'Wybierz dietę', d: 'Siedem diet dopasowanych do Twoich potrzeb.', c: '#BAD173' },
    { n: '02', t: 'Podaj kaloraż', d: 'Od 1200 do 3000 kcal. Dopasujemy resztę.', c: '#F0ED6E' },
    { n: '03', t: 'Wybierz dni', d: 'Pięć lub siedem dni w tygodniu — Ty decydujesz.', c: '#86D0CC' },
    { n: '04', t: 'Odbierz świeżość', d: 'Dostawa w nocy lub rano. Zawsze świeże.', c: '#DDA79E' },
  ];
  return (
    <section style={{ padding: '80px 40px', background: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--neutral-500)' }}>Jak to działa</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 8, color: 'var(--mr-black)' }}>Cztery kroki, jeden posiłek.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {steps.map(s => (
            <div key={s.n} style={{ background: s.c, borderRadius: 24, padding: 28, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 600, color: 'var(--mr-black)', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.n}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--mr-black)', letterSpacing: '-0.01em' }}>{s.t}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--mr-black)', opacity: 0.75, marginTop: 6, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section style={{ padding: '80px 40px', background: 'var(--mr-black)', color: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-accent)', fontSize: 48, color: 'var(--mr-green)', lineHeight: 1, transform: 'rotate(-2deg)', display: 'inline-block' }}>Zaczynamy?</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 16, lineHeight: 1.05 }}>
          Pierwszy tydzień<br/>z rabatem 15%.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--neutral-300)', marginTop: 20, maxWidth: 540, margin: '20px auto 0' }}>
          Zamów dziś, odbierz w poniedziałek. Bez umów, bez zobowiązań — jeśli nie posmakuje, zwracamy pieniądze.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
          <Button size="lg" variant="secondary">Zamów teraz</Button>
          <Button size="lg" variant="ghost"><span style={{color:'#fff'}}>Porozmawiaj z nami</span></Button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeroSection, DietsSection, MenuSection, HowItWorks, CtaSection });
