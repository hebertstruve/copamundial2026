// Bracket - Creative non-tree visualization
// Horizontal column layout but with asymmetric/editorial styling

function BracketMatch({ match, onSave, compact }) {
  const [editing, setEditing] = useState(false);
  const [home, setHome] = useState(match.homeScore ?? '');
  const [away, setAway] = useState(match.awayScore ?? '');
  const [hPen, setHPen] = useState(match.homePenalties ?? '');
  const [aPen, setAPen] = useState(match.awayPenalties ?? '');

  useEffect(() => {
    setHome(match.homeScore ?? '');
    setAway(match.awayScore ?? '');
    setHPen(match.homePenalties ?? '');
    setAPen(match.awayPenalties ?? '');
  }, [match.id, match.homeScore, match.awayScore]);

  const homeTeam = match.home ? getTeam(match.home) : null;
  const awayTeam = match.away ? getTeam(match.away) : null;
  const winner = match.played ? window.__store.getWinner(match) : null;

  function commit() {
    const h = parseInt(home, 10), a = parseInt(away, 10);
    if (isNaN(h) || isNaN(a)) { setEditing(false); return; }
    let hp = null, ap = null;
    if (h === a) {
      hp = parseInt(hPen, 10); ap = parseInt(aPen, 10);
      if (isNaN(hp) || isNaN(ap) || hp === ap) { setEditing(false); return; }
    }
    onSave(match.id, h, a, hp, ap);
    setEditing(false);
  }

  const t = (k) => window.__t ? window.__t(k) : k;
  if (!homeTeam || !awayTeam) {
    return (
      <div className="bracket-match" style={{ opacity: 0.5 }}>
        <div className="bm-team"><span className="nm" style={{ fontSize: 12, color: 'var(--mute)' }}>{t('toBeDefined')}</span></div>
        <div className="bm-divider"></div>
        <div className="bm-team"><span className="nm" style={{ fontSize: 12, color: 'var(--mute)' }}>{t('toBeDefined')}</span></div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="bracket-match open">
        <div className="bm-team">
          <span className="flg">{homeTeam.flag}</span>
          <span className="nm">{homeTeam.code}</span>
          <input className="score-input" style={{ width: 36, height: 30, fontSize: 18 }} value={home} onChange={e => setHome(e.target.value)} autoFocus />
        </div>
        <div className="bm-divider"></div>
        <div className="bm-team">
          <span className="flg">{awayTeam.flag}</span>
          <span className="nm">{awayTeam.code}</span>
          <input className="score-input" style={{ width: 36, height: 30, fontSize: 18 }} value={away} onChange={e => setAway(e.target.value)} />
        </div>
        {home !== '' && away !== '' && parseInt(home) === parseInt(away) && (
          <div className="bm-meta" style={{ marginTop: 6 }}>
            {t('penalties')}:
            <input style={{ width: 28, marginLeft: 4, marginRight: 4, fontSize: 11 }} value={hPen} onChange={e => setHPen(e.target.value)} />
            -
            <input style={{ width: 28, marginLeft: 4, fontSize: 11 }} value={aPen} onChange={e => setAPen(e.target.value)} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          <button className="btn" style={{ fontSize: 9, padding: '4px 8px' }} onClick={commit}>OK</button>
          <button className="btn ghost" style={{ fontSize: 9, padding: '4px 8px' }} onClick={() => setEditing(false)}>X</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bracket-match" onClick={() => setEditing(true)}>
      <div className={`bm-team ${winner === match.home ? 'winner' : (winner ? 'loser' : '')}`}>
        <span className="flg">{homeTeam.flag}</span>
        <span className="nm">{homeTeam.code}</span>
        <span className="sc">{match.played ? match.homeScore : '—'}</span>
      </div>
      <div className="bm-divider"></div>
      <div className={`bm-team ${winner === match.away ? 'winner' : (winner ? 'loser' : '')}`}>
        <span className="flg">{awayTeam.flag}</span>
        <span className="nm">{awayTeam.code}</span>
        <span className="sc">{match.played ? match.awayScore : '—'}</span>
      </div>
      {match.played && match.homeScore === match.awayScore && match.homePenalties != null && (
        <div className="bm-meta">{t('penaltiesShort')}: {match.homePenalties}-{match.awayPenalties}</div>
      )}
      {!match.played && <div className="bm-meta">{t('clickForResult')}</div>}
    </div>
  );
}

function BracketView({ state, store }) {
  const t = (k) => window.__t ? window.__t(k) : k;
  const allGroupsDone = state.groupMatches.every(m => m.played);

  if (!allGroupsDone) {
    return (
      <div className="empty-state">
        <span className="big-num">48→32</span>
        {t('finish48')}
      </div>
    );
  }

  const cols = [
    { key: 'R32', label: t('r32'), sub: t('r32Sub') },
    { key: 'R16', label: t('r16'), sub: t('r16Sub') },
    { key: 'QF', label: t('qf'), sub: t('qfSub') },
    { key: 'SF', label: t('sf'), sub: t('sfSub') },
    { key: '3P', label: t('tp'), sub: t('tpSub') }
  ];

  return (
    <div className="bracket">
      <div className="bracket-title">{t('knockoutTitle')}</div>
      <div className="bracket-sub">{t('knockoutSub')}</div>
      <div className="bracket-grid">
        {cols.map(c => (
          <div className="bracket-col" key={c.key}>
            <div className="bracket-col-head">
              <span className="cn">{c.label}</span>
              {c.sub}
            </div>
            {state.knockoutMatches.filter(m => m.round === c.key).map(m => (
              <BracketMatch
                key={m.id}
                match={m}
                onSave={(id, h, a, hp, ap) => store.setMatchScore(id, h, a, hp, ap)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { BracketView, BracketMatch });
