// Final view - Champion reveal + podium + confetti

function FinalView({ state, store }) {
  const t = (k) => window.__t ? window.__t(k) : k;
  const podium = store.getPodium();
  const final = state.knockoutMatches.find(m => m.round === 'F');

  if (!podium) {
    return (
      <div className="empty-state">
        <span className="big-num">{t('liftCup')}</span>
        {t('completeFinal')}
        {final && final.home && (
          <div style={{ marginTop: 30 }}>
            <BracketMatch match={final} onSave={(id, h, a, hp, ap) => store.setMatchScore(id, h, a, hp, ap)} />
          </div>
        )}
      </div>
    );
  }

  const winner = getTeam(podium.first);
  const second = getTeam(podium.second);
  const third = podium.third ? getTeam(podium.third) : null;

  return (
    <div className="final-view">
      <Confetti />
      <div className="overtitle">{t('champSubtitle')}</div>
      <div className="champion-flag">{winner.flag}</div>
      <div className="champion-name">{winner.name}</div>
      <div style={{ fontFamily: 'var(--f-headline)', fontStyle: 'italic', fontSize: 20, color: 'var(--mute)' }}>
        {t('wonVerb')} {final.homeScore}-{final.awayScore} {final.homePenalties != null ? `(${final.homePenalties}-${final.awayPenalties} pen)` : ''} {t('over')} {second.name}
      </div>

      <div className="podium">
        <div className="pod second">
          <div className="pos">2º</div>
          <div className="flag">{second.flag}</div>
          <div className="name">{second.name}</div>
        </div>
        <div className="pod first">
          <div className="pos">1º</div>
          <div className="flag">{winner.flag}</div>
          <div className="name">{winner.name}</div>
        </div>
        {third && (
          <div className="pod third">
            <div className="pos">3º</div>
            <div className="flag">{third.flag}</div>
            <div className="name">{third.name}</div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 60, display: 'flex', justifyContent: 'center', gap: 30, flexWrap: 'wrap' }}>
        <StatBlock label={t('statTotalGoals')} value={store.getTotalGoals()} />
        <StatBlock label={t('statMatches')} value={store.getTotalPlayed()} />
        <StatBlock label={t('statTopScorer')} value={store.getTopScorers(1)[0]?.player || '—'} big={false} />
        <StatBlock label={t('statTopGoals')} value={store.getTopScorers(1)[0]?.goals || 0} />
      </div>
    </div>
  );
}

function StatBlock({ label, value, big = true }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--f-display)', fontSize: big ? 56 : 28, fontWeight: 900, color: 'var(--accent)', lineHeight: 0.9 }}>{value}</div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 3,
    color: ['var(--accent)', 'var(--gold)', 'var(--ink)'][i % 3]
  })), []);
  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: p.left + '%',
            background: p.color,
            animationDelay: p.delay + 's',
            animationDuration: p.duration + 's'
          }}
        />
      ))}
    </>
  );
}

function TeamModal({ teamCode, state, store, onClose }) {
  const t = (k) => window.__t ? window.__t(k) : k;
  if (!teamCode) return null;
  const tm = getTeam(teamCode);
  // compute stats across all matches
  let pj = 0, pg = 0, pe = 0, pp = 0, gf = 0, gc = 0;
  const allMatches = [...state.groupMatches, ...state.knockoutMatches].filter(m => m.played);
  allMatches.forEach(m => {
    if (m.home === teamCode) {
      pj++; gf += m.homeScore; gc += m.awayScore;
      if (m.homeScore > m.awayScore) pg++;
      else if (m.homeScore < m.awayScore) pp++;
      else pe++;
    } else if (m.away === teamCode) {
      pj++; gf += m.awayScore; gc += m.homeScore;
      if (m.awayScore > m.homeScore) pg++;
      else if (m.awayScore < m.homeScore) pp++;
      else pe++;
    }
  });
  const teamScorers = Object.values(state.scorers || {}).filter(s => s.team === teamCode).sort((a,b) => b.goals - a.goals);

  return (
    <div className="team-modal show" onClick={onClose}>
      <div className="team-modal-inner" onClick={e => e.stopPropagation()}>
        <button className="team-modal-close" onClick={onClose}>×</button>
        <div className="tm-flag">{tm.flag}</div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--mute)' }}>
          {t('selection')} · FIFA #{tm.rank}
        </div>
        <div className="tm-name">{tm.name}</div>
        <div className="tm-stats">
          <div className="tm-stat"><span className="v">{pj}</span><span className="lbl">{t('games')}</span></div>
          <div className="tm-stat"><span className="v red">{pg}</span><span className="lbl">{t('wins')}</span></div>
          <div className="tm-stat"><span className="v">{pe}</span><span className="lbl">{t('draws')}</span></div>
          <div className="tm-stat"><span className="v">{pp}</span><span className="lbl">{t('losses')}</span></div>
          <div className="tm-stat"><span className="v red">{gf}</span><span className="lbl">{t('goalsFor')}</span></div>
          <div className="tm-stat"><span className="v">{gc}</span><span className="lbl">{t('goalsAgainst')}</span></div>
          <div className="tm-stat"><span className="v">{gf - gc > 0 ? '+' + (gf - gc) : (gf - gc)}</span><span className="lbl">{t('diff')}</span></div>
          <div className="tm-stat"><span className="v">{pj ? (pg * 3 + pe) : 0}</span><span className="lbl">{t('totalPts')}</span></div>
        </div>
        {teamScorers.length > 0 && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed var(--rule)' }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--mute)', marginBottom: 6 }}>{t('scorers')}</div>
            {teamScorers.slice(0, 5).map(s => (
              <div key={s.player} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontFamily: 'var(--f-display)', fontSize: 16, fontWeight: 900 }}>
                <span>{s.player}</span>
                <span style={{ color: 'var(--accent)' }}>{s.goals}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { FinalView, TeamModal, Confetti });
