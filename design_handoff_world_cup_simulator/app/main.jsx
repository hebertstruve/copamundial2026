// Main app - ties everything together

function App() {
  const [, force] = useState(0);
  const store = window.__store;
  const [activeTab, setActiveTab] = useState('groups');
  const [activeGroup, setActiveGroup] = useState('A');
  const [fx, setFx] = useState(null);
  const [teamModal, setTeamModal] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Settings persisted
  const [theme, setTheme] = useState(localStorage.getItem('wc_theme') || 'panini-classic');
  const [density, setDensity] = useState(localStorage.getItem('wc_density') || 'normal');
  const [ftheme, setFtheme] = useState(localStorage.getItem('wc_ftheme') || 'default');
  const [sound, setSound] = useState(localStorage.getItem('wc_sound') !== 'off');
  const [lang, setLangState] = useState(localStorage.getItem('wc_lang') || 'es');

  const t = (key) => (window.I18N[lang] && window.I18N[lang][key]) || window.I18N.es[key] || key;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('wc_theme', theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.dataset.density = density;
    localStorage.setItem('wc_density', density);
  }, [density]);
  useEffect(() => {
    document.documentElement.dataset.ftheme = ftheme;
    localStorage.setItem('wc_ftheme', ftheme);
  }, [ftheme]);
  useEffect(() => { localStorage.setItem('wc_sound', sound ? 'on' : 'off'); }, [sound]);
  useEffect(() => {
    localStorage.setItem('wc_lang', lang);
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'es';
  }, [lang]);

  useEffect(() => {
    const unsub = store.subscribe(() => force(x => x + 1));
    return unsub;
  }, [store]);

  // Tweaks protocol
  useEffect(() => {
    function handler(e) {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setEditMode(true);
      else if (e.data.type === '__deactivate_edit_mode') setEditMode(false);
    }
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const state = store.getState();
  const totalGoals = store.getTotalGoals();
  const totalPlayed = store.getTotalPlayed();
  const totalMatches = state.groupMatches.length + state.knockoutMatches.length;
  const champion = store.getChampion();

  function playBeep(freq = 440, dur = 80) {
    if (!sound) return;
    try {
      const ctx = window.__audioCtx || (window.__audioCtx = new (window.AudioContext || window.webkitAudioContext)());
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'square';
      gain.gain.value = 0.05;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur / 1000);
      osc.stop(ctx.currentTime + dur / 1000);
    } catch (e) {}
  }

  async function simGroup(groupKey) {
    playBeep(660, 100);
    setFx({ kicker: t('simGroupFx'), big: t('group') + ' ' + groupKey, sub: t('matches6') });
    await new Promise(r => setTimeout(r, 800));
    store.simulateGroup(groupKey);
    setFx(null);
    playBeep(880, 150);
  }

  async function simAll() {
    const phases = [
      { kicker: t('runningGroups'), big: '48 → 32', sub: t('matches72') },
      { kicker: t('knockoutFx'), big: t('r32'), sub: '32 → 16' },
      { kicker: t('knockoutFx'), big: t('r16'), sub: '16 → 8' },
      { kicker: t('knockoutFx'), big: t('qf'), sub: '8 → 4' },
      { kicker: t('knockoutFx'), big: t('sf'), sub: '4 → 2' },
      { kicker: t('liftTrophy'), big: t('bigFinal'), sub: '' }
    ];
    for (const p of phases) {
      playBeep(440 + Math.random() * 400, 80);
      setFx(p);
      await new Promise(r => setTimeout(r, 700));
    }
    store.simulateAll();
    setFx(null);
    setActiveTab('final');
    playBeep(1100, 400);
  }

  function resetAll() {
    if (!confirm(t('confirmReset'))) return;
    store.reset();
    setActiveTab('groups');
    setActiveGroup('A');
    playBeep(220, 150);
  }

  // Expose lang globally so child components can re-render via force
  window.__lang = lang;
  window.__t = t;

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead-left">
          <div><span className="kicker">★</span> {t('edition')}</div>
          <div>{t('date')}</div>
          <div>{t('region')}</div>
        </div>
        <h1 className="title">
          <span className="row1">{t('title1')}</span>
          <span className="row2">{t('title2')}</span>
        </h1>
        <div className="masthead-right">
          <div><span className="kicker">{t('hostCountries')}</span></div>
          <div>{t('teamsLine')}</div>
          <div>{t('matchesLine')}</div>
        </div>
      </header>

      <div className="metabar">
        <div className="cell">
          <span className="label">{t('matchesPlayed')}</span>
          <span className="value">{totalPlayed}<span style={{ color: 'var(--mute)', fontSize: 16 }}>/{totalMatches}</span></span>
        </div>
        <div className="cell">
          <span className="label">{t('totalGoals')}</span>
          <span className="value red">{totalGoals}</span>
        </div>
        <div className="cell">
          <span className="label">{t('topScorer')}</span>
          <span className="value" style={{ fontSize: 16, fontFamily: 'var(--f-display)' }}>
            {store.getTopScorers(1)[0]?.player || '—'}
            {store.getTopScorers(1)[0] && <span style={{ color: 'var(--accent)', marginLeft: 6 }}>{store.getTopScorers(1)[0].goals}</span>}
          </span>
        </div>
        <div className="cell">
          <span className="label">{t('champion')}</span>
          <span className="value">{champion ? getTeam(champion).flag + ' ' + getTeam(champion).code : '—'}</span>
        </div>
        <div className="cell controls">
          <button
            className="btn ghost"
            onClick={() => setLangState(lang === 'es' ? 'pt' : 'es')}
            title={t('language')}
            style={{ fontWeight: 900 }}
          >
            {lang === 'es' ? '🇪🇸 ES' : '🇧🇷 PT'}
          </button>
          <button className="btn-icon btn ghost" onClick={() => {
            const order = ['panini-classic', 'panini-premium', 'light', 'dark'];
            const i = order.indexOf(theme);
            setTheme(order[(i + 1) % order.length]);
          }} title={t('toggleStyle')}>
            {theme === 'panini-classic' ? '📘' : theme === 'panini-premium' ? '✨' : theme === 'dark' ? '☾' : '☀'}
          </button>
          <button className="btn ghost" onClick={() => { store.undo(); playBeep(330); }} title={t('undo')}>↶</button>
          <button className="btn ghost" onClick={() => { store.redo(); playBeep(550); }} title={t('redo')}>↷</button>
          <button className="btn" onClick={resetAll}>{t('reset')}</button>
          <button className="btn primary" onClick={simAll}>{t('simAll')}</button>
        </div>
      </div>

      <nav className="phase-nav">
        <button className={`phase-tab ${activeTab === 'groups' ? 'active' : ''}`} onClick={() => setActiveTab('groups')}>
          <span className="num">{t('phase1Num')}</span>
          {t('phase1')}
        </button>
        <button className={`phase-tab ${activeTab === 'bracket' ? 'active' : ''}`} onClick={() => setActiveTab('bracket')}>
          <span className="num">{t('phase2Num')}</span>
          {t('phase2')}
        </button>
        <button className={`phase-tab ${activeTab === 'final' ? 'active' : ''}`} onClick={() => setActiveTab('final')}>
          <span className="num">{t('phase3Num')}</span>
          {t('phase3')}
        </button>
      </nav>

      {activeTab === 'groups' && (
        <GroupsView
          state={state}
          store={store}
          activeGroup={activeGroup}
          setActiveGroup={setActiveGroup}
          onTeamClick={setTeamModal}
          onSimGroup={simGroup}
          t={t}
        />
      )}
      {activeTab === 'bracket' && <BracketView state={state} store={store} t={t} />}
      {activeTab === 'final' && <FinalView state={state} store={store} t={t} />}

      <TeamModal teamCode={teamModal} state={state} store={store} onClose={() => setTeamModal(null)} t={t} />

      {fx && (
        <div className="fx-overlay show">
          <div className="fx-inner">
            <div className="fx-kicker">{fx.kicker}</div>
            <div className="fx-big">{fx.big}</div>
            <div style={{ fontFamily: 'var(--f-mono)', letterSpacing: '0.2em', color: 'var(--mute)' }}>{fx.sub}</div>
          </div>
        </div>
      )}

      {editMode && (
        <div className="edit-panel show">
          <h4>{t('tweaks')}</h4>
          <div className="edit-row">
            <label>{t('language')}</label>
            <div className="edit-toggle">
              <button className={lang === 'es' ? 'on' : ''} onClick={() => setLangState('es')}>Español</button>
              <button className={lang === 'pt' ? 'on' : ''} onClick={() => setLangState('pt')}>Português</button>
            </div>
          </div>
          <div className="edit-row">
            <label>{t('style')}</label>
            <div className="edit-toggle">
              <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>Editorial</button>
              <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>Dark</button>
              <button className={theme === 'panini-classic' ? 'on' : ''} onClick={() => setTheme('panini-classic')}>Panini</button>
              <button className={theme === 'panini-premium' ? 'on' : ''} onClick={() => setTheme('panini-premium')}>Foil</button>
            </div>
          </div>
          <div className="edit-row">
            <label>{t('density')}</label>
            <div className="edit-toggle">
              <button className={density === 'compact' ? 'on' : ''} onClick={() => setDensity('compact')}>{t('compact')}</button>
              <button className={density === 'normal' ? 'on' : ''} onClick={() => setDensity('normal')}>{t('normal')}</button>
              <button className={density === 'spacious' ? 'on' : ''} onClick={() => setDensity('spacious')}>{t('spacious')}</button>
            </div>
          </div>
          <div className="edit-row">
            <label>{t('typography')}</label>
            <div className="edit-toggle">
              <button className={ftheme === 'default' ? 'on' : ''} onClick={() => setFtheme('default')}>Anton</button>
              <button className={ftheme === 'serif' ? 'on' : ''} onClick={() => setFtheme('serif')}>Serif</button>
              <button className={ftheme === 'grotesk' ? 'on' : ''} onClick={() => setFtheme('grotesk')}>Grotesk</button>
            </div>
          </div>
          <div className="edit-row">
            <label>{t('sound')}</label>
            <div className="edit-toggle">
              <button className={sound ? 'on' : ''} onClick={() => setSound(true)}>{t('on')}</button>
              <button className={!sound ? 'on' : ''} onClick={() => setSound(false)}>{t('off')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

window.__store = window.createStore();
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
