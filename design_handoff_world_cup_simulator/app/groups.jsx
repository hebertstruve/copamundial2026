// MatchCard + GroupsView - React components (JSX)

const { useState, useEffect, useMemo, useRef } = React;

// Get team meta by code
function getTeam(code) {
  for (const g of Object.values(window.TEAMS_DATA.groups)) {
    const t = g.find(x => x.code === code);
    if (t) return t;
  }
  return { code, name: code, flag: '⚽', rank: 99 };
}

function MatchCard({ match, onSave, onTeamClick }) {
  const [home, setHome] = useState(match.homeScore != null ? match.homeScore : '');
  const [away, setAway] = useState(match.awayScore != null ? match.awayScore : '');

  useEffect(() => {
    setHome(match.homeScore != null ? match.homeScore : '');
    setAway(match.awayScore != null ? match.awayScore : '');
  }, [match.id, match.homeScore, match.awayScore]);

  const homeTeam = getTeam(match.home);
  const awayTeam = getTeam(match.away);

  function commit() {
    const h = parseInt(home, 10);
    const a = parseInt(away, 10);
    if (!isNaN(h) && !isNaN(a) && h >= 0 && a >= 0) {
      if (h !== match.homeScore || a !== match.awayScore) {
        onSave(match.id, h, a);
      }
    }
  }

  const homeWin = match.played && match.homeScore > match.awayScore;
  const awayWin = match.played && match.awayScore > match.homeScore;

  return (
    <div className="match-card">
      <div className="match-top">
        <span>
          <span className="venue">{match.venue.name}</span>
          <span className="venue-city">{match.venue.city}</span>
        </span>
        <span>{match.date} · {match.time}</span>
      </div>
      <div className="match-body">
        <div className="team-side home" onClick={() => onTeamClick(homeTeam.code)}>
          <span className="team-flag">{homeTeam.flag}</span>
          <div>
            <div className="team-name">{homeTeam.name}</div>
            <span className="team-code">FIFA #{homeTeam.rank}</span>
          </div>
        </div>
        <div className="score-block">
          <input
            className={"score-input " + (homeWin ? 'winner' : '') + (home === '' ? ' empty' : '')}
            type="number"
            min="0"
            max="9"
            value={home}
            onChange={e => setHome(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            placeholder="—"
          />
          <span className="score-sep">:</span>
          <input
            className={"score-input " + (awayWin ? 'winner' : '') + (away === '' ? ' empty' : '')}
            type="number"
            min="0"
            max="9"
            value={away}
            onChange={e => setAway(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
            placeholder="—"
          />
        </div>
        <div className="team-side away" onClick={() => onTeamClick(awayTeam.code)}>
          <span className="team-flag">{awayTeam.flag}</span>
          <div>
            <div className="team-name">{awayTeam.name}</div>
            <span className="team-code">FIFA #{awayTeam.rank}</span>
          </div>
        </div>
      </div>
      <MatchFooter match={match} />
    </div>
  );
}

function MatchFooter({ match }) {
  const t = (k) => window.__t ? window.__t(k) : k;
  if (!match.played) {
    return <div className="match-bottom"><span>{t('toPlay')}</span><span>{t('matchday')} {match.round || ''}</span></div>;
  }
  // Show scorers summary
  const scorers = window.__store.getState().scorers;
  const homeScorers = Object.values(scorers).filter(s => s.team === match.home);
  const awayScorers = Object.values(scorers).filter(s => s.team === match.away);
  return (
    <div className="match-bottom">
      <span>{match.homeScore > 0 && match.played ? '⚽ ' + (homeScorers[0]?.player || '—') : ''}</span>
      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--mute)' }}>{t('final')}</span>
      <span>{match.awayScore > 0 && match.played ? (awayScorers[0]?.player || '—') + ' ⚽' : ''}</span>
    </div>
  );
}

function StandingsPanel({ groupKey, standings, bestThirdCodes }) {
  const t = (k) => window.__t ? window.__t(k) : k;
  return (
    <div className="standings">
      <div className="standings-title">{t('standings')}</div>
      <div className="standings-group">{t('group')} {groupKey}</div>
      <table className="stand-table">
        <thead>
          <tr>
            <th className="team-col">{t('selectionCol')}</th>
            <th>PJ</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>SG</th>
            <th className="pts-col">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const isBestThird = i === 2 && bestThirdCodes && bestThirdCodes.includes(s.code);
            const cls = `pos-${i+1}${isBestThird ? ' best-third' : ''}`;
            return (
              <tr key={s.code} className={cls}>
                <td className="team-col">
                  <span className="rank-n">{i+1}</span>
                  <span style={{ fontSize: 16, marginRight: 6 }}>{s.flag}</span>
                  <span className="tname">{s.code}</span>
                </td>
                <td>{s.pj}</td>
                <td>{s.pg}</td>
                <td>{s.pe}</td>
                <td>{s.pp}</td>
                <td>{s.sg > 0 ? '+' + s.sg : s.sg}</td>
                <td className="pts-col">{s.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="stand-legend">
        <span><i className="dot adv"></i>{t('firstQualified')}</span>
        <span><i className="dot maybe"></i>{t('secondQualified')}</span>
        <span><i className="dot third"></i>{t('bestThird')}</span>
      </div>
    </div>
  );
}

function BestThirdsPanel({ store }) {
  const t = (k) => window.__t ? window.__t(k) : k;
  const thirds = store.getBestThirds();
  const anyPlayed = thirds.some(x => x.pj > 0);
  if (!anyPlayed) return null;
  return (
    <div className="best-thirds-panel">
      <div className="bt-title">{t('bestThirdsTitle')}</div>
      <div className="bt-sub">{t('bestThirdsSub')}</div>
      <table className="bt-table">
        <thead>
          <tr><th>#</th><th>GR</th><th>{t('selectionCol')}</th><th>PJ</th><th>PTS</th><th>SG</th><th>GF</th></tr>
        </thead>
        <tbody>
          {thirds.map((tt, i) => (
            <tr key={tt.code || i} className={i < 8 ? 'qualifies' : 'out'}>
              <td className="rk">{i+1}</td>
              <td className="gr">{tt.group}</td>
              <td className="tm">
                <span style={{ marginRight: 6 }}>{tt.flag}</span>
                <span className="nm">{tt.name}</span>
              </td>
              <td>{tt.pj}</td>
              <td className="pts-col">{tt.pts}</td>
              <td>{tt.sg > 0 ? '+' + tt.sg : tt.sg}</td>
              <td>{tt.gf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupsView({ state, store, activeGroup, setActiveGroup, onTeamClick, onSimGroup, t = (k) => window.__t ? window.__t(k) : k }) {
  const standings = useMemo(() => store.getAllStandings(), [state]);
  const bestThirds = useMemo(() => store.getBestThirds(), [state]);
  const bestThirdCodes = bestThirds.slice(0, 8).map(x => x.code).filter(Boolean);
  const groupMatches = state.groupMatches.filter(m => m.group === activeGroup);
  const teams = window.TEAMS_DATA.groups[activeGroup];
  const allPlayed = groupMatches.every(m => m.played);

  return (
    <div className="groups-layout">
      <div className="group-rail">
        {Object.keys(window.TEAMS_DATA.groups).map(g => {
          const done = state.groupMatches.filter(m => m.group === g).every(m => m.played);
          const playedCount = state.groupMatches.filter(m => m.group === g && m.played).length;
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`group-letter ${activeGroup === g ? 'active' : ''} ${done ? 'complete' : ''}`}
            >
              {g}
              <span className="mini">{playedCount}/6</span>
            </button>
          );
        })}
      </div>

      <div className="group-main">
        <div className="group-header">
          <div>
            <div className="grupo-label">{t('group')}</div>
            <div className="grupo-letter">{activeGroup}</div>
          </div>
          <div className="grupo-teams">
            {teams.map(tm => tm.name).join(' · ')}
          </div>
          <button className="btn primary group-sim-btn" onClick={() => onSimGroup(activeGroup)} disabled={allPlayed}>
            {t('simGroup')}
          </button>
        </div>
        {groupMatches.map(m => (
          <MatchCard
            key={m.id}
            match={m}
            onSave={(id, h, a) => store.setMatchScore(id, h, a)}
            onTeamClick={onTeamClick}
          />
        ))}
      </div>

      <div className="standings-wrap">
        <StandingsPanel groupKey={activeGroup} standings={standings[activeGroup]} bestThirdCodes={bestThirdCodes} />
        <ScorersPanel store={window.__store} limit={5} />
      </div>

      <BestThirdsPanel store={store} />
    </div>
  );
}

function ScorersPanel({ store, limit = 10 }) {
  const scorers = store.getTopScorers(limit);
  const t = (k) => window.__t ? window.__t(k) : k;
  if (!scorers.length) return null;
  return (
    <div className="scorers-panel">
      <div className="scorers-title">{t('goldenBoot')}</div>
      <div className="scorers-big">{t('topScorers')}</div>
      {scorers.map((s, i) => (
        <div className="scorer-row" key={s.player + s.team}>
          <span className="sr">{String(i+1).padStart(2, '0')}</span>
          <span className="sn">{s.player}<span className="team-tag">{s.team}</span></span>
          <span className="sg">{s.goals}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { MatchCard, GroupsView, StandingsPanel, ScorersPanel, BestThirdsPanel, getTeam });
