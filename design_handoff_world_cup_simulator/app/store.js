// Simulator state store - gerencia toda a simulação
// Estado persistido em localStorage

window.createStore = function() {
  const STORAGE_KEY = 'wc2026_sim_state_v3_draw';

  const defaultState = () => ({
    phase: 'groups', // groups | knockout | final
    groupMatches: JSON.parse(JSON.stringify(window.SCHEDULE.groupMatches)),
    knockoutMatches: JSON.parse(JSON.stringify(window.SCHEDULE.knockoutMatches)),
    scorers: {}, // playerName -> { team, goals }
    history: [], // snapshots
    historyIndex: -1
  });

  let state = null;
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Validate: cached state must reference current TEAMS_DATA codes
        const currentCodes = new Set();
        Object.values(window.TEAMS_DATA.groups).forEach(g => g.forEach(t => currentCodes.add(t.code)));
        const cachedCodes = new Set();
        (parsed.groupMatches || []).forEach(m => { if (m.home) cachedCodes.add(m.home); if (m.away) cachedCodes.add(m.away); });
        let valid = true;
        cachedCodes.forEach(c => { if (!currentCodes.has(c)) valid = false; });
        if (valid && cachedCodes.size > 0) {
          state = parsed;
          return;
        }
        // invalid: purge and rebuild
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
    state = defaultState();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function emit() {
    listeners.forEach(l => l(state));
  }

  load();

  // Compute group standings dynamically
  function computeStandings(groupKey) {
    const teams = window.TEAMS_DATA.groups[groupKey];
    const stats = {};
    teams.forEach(t => {
      stats[t.code] = { code: t.code, name: t.name, flag: t.flag, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, sg: 0, pts: 0 };
    });
    state.groupMatches.filter(m => m.group === groupKey && m.played).forEach(m => {
      const h = stats[m.home], a = stats[m.away];
      h.pj++; a.pj++;
      h.gf += m.homeScore; h.gc += m.awayScore;
      a.gf += m.awayScore; a.gc += m.homeScore;
      if (m.homeScore > m.awayScore) { h.pg++; h.pts += 3; a.pp++; }
      else if (m.homeScore < m.awayScore) { a.pg++; a.pts += 3; h.pp++; }
      else { h.pe++; a.pe++; h.pts++; a.pts++; }
    });
    Object.values(stats).forEach(s => s.sg = s.gf - s.gc);
    return Object.values(stats).sort((x, y) => {
      if (y.pts !== x.pts) return y.pts - x.pts;
      if (y.sg !== x.sg) return y.sg - x.sg;
      if (y.gf !== x.gf) return y.gf - x.gf;
      return x.code.localeCompare(y.code);
    });
  }

  function getAllStandings() {
    const out = {};
    Object.keys(window.TEAMS_DATA.groups).forEach(g => {
      out[g] = computeStandings(g);
    });
    return out;
  }

  // All 12 groups finished?
  function allGroupsComplete() {
    return state.groupMatches.every(m => m.played);
  }

  // Get third-placed teams of every group, sorted. Returns all 12.
  function getBestThirds() {
    const thirds = [];
    Object.keys(window.TEAMS_DATA.groups).forEach(g => {
      const st = computeStandings(g);
      thirds.push({ ...st[2], group: g });
    });
    return thirds.sort((x, y) => {
      if (y.pts !== x.pts) return y.pts - x.pts;
      if (y.sg !== x.sg) return y.sg - x.sg;
      return y.gf - x.gf;
    });
  }

  // Seed the round-of-32 when all groups complete
  function seedKnockout() {
    if (!allGroupsComplete()) return;
    const standings = getAllStandings();
    const firsts = Object.keys(standings).map(g => ({ ...standings[g][0], group: g, pos: 1 }));
    const seconds = Object.keys(standings).map(g => ({ ...standings[g][1], group: g, pos: 2 }));
    const thirds = getBestThirds().map(t => ({ ...t, pos: 3 }));
    // 32 teams: 12 firsts + 12 seconds + 8 best thirds
    // Simple pairing: 1st vs 3rd/2nd crossover
    const qualified = [...firsts, ...seconds, ...thirds];
    // deterministic bracket pairing
    const pairs = [
      // Top half
      [firsts[0], thirds[0]],   // A1 vs best 3rd
      [seconds[1], seconds[5]], // B2 vs F2
      [firsts[2], thirds[1]],
      [seconds[3], seconds[7]],
      [firsts[4], thirds[2]],
      [seconds[5] || seconds[2], seconds[9] || seconds[0]],
      [firsts[6], thirds[3]],
      [seconds[7], seconds[11]],
      // Bottom half
      [firsts[1], thirds[4]],
      [seconds[0], seconds[4]],
      [firsts[3], thirds[5]],
      [seconds[2], seconds[6]],
      [firsts[5], thirds[6]],
      [seconds[4] || seconds[1], seconds[8] || seconds[3]],
      [firsts[7], thirds[7]],
      [seconds[6], seconds[10]]
    ];
    const r32 = state.knockoutMatches.filter(m => m.round === 'R32');
    r32.forEach((m, i) => {
      const p = pairs[i] || [qualified[i*2], qualified[i*2+1]];
      m.home = p[0]?.code || null;
      m.away = p[1]?.code || null;
    });
    state.phase = 'knockout';
  }

  // Advance winners to next round
  function advanceKnockout(fromRound) {
    const order = ['R32', 'R16', 'QF', 'SF'];
    const idx = order.indexOf(fromRound);
    if (idx < 0) return;
    const nextRound = order[idx + 1] || 'F';
    const current = state.knockoutMatches.filter(m => m.round === fromRound);
    const next = state.knockoutMatches.filter(m => m.round === nextRound);
    const losers = []; // for 3rd place

    if (current.some(m => !m.played)) return;

    current.forEach((m, i) => {
      const winner = getWinner(m);
      const loser = winner === m.home ? m.away : m.home;
      if (nextRound !== 'F' || fromRound === 'SF') {
        const dest = next[Math.floor(i / 2)];
        if (dest) {
          if (i % 2 === 0) dest.home = winner;
          else dest.away = winner;
        }
      }
      if (fromRound === 'SF') {
        const thirdMatch = state.knockoutMatches.find(m => m.round === '3P');
        if (thirdMatch) {
          if (i === 0) thirdMatch.home = loser;
          else thirdMatch.away = loser;
        }
      }
    });
  }

  function getWinner(m) {
    if (!m.played) return null;
    if (m.homeScore > m.awayScore) return m.home;
    if (m.awayScore > m.homeScore) return m.away;
    if (m.homePenalties != null && m.awayPenalties != null) {
      return m.homePenalties > m.awayPenalties ? m.home : m.away;
    }
    return null;
  }

  // Random scorers assignment when match is played
  function assignScorers(teamCode, goals) {
    const pool = window.STAR_PLAYERS[teamCode] || [teamCode + ' #9'];
    for (let i = 0; i < goals; i++) {
      const player = pool[Math.floor(Math.random() * pool.length)];
      const key = `${teamCode}|${player}`;
      if (!state.scorers[key]) state.scorers[key] = { player, team: teamCode, goals: 0 };
      state.scorers[key].goals++;
    }
  }

  function removeScorers(teamCode, goals) {
    // Simple removal - pick any entries for this team
    for (let i = 0; i < goals; i++) {
      const keys = Object.keys(state.scorers).filter(k => state.scorers[k].team === teamCode && state.scorers[k].goals > 0);
      if (!keys.length) break;
      const k = keys[Math.floor(Math.random() * keys.length)];
      state.scorers[k].goals--;
      if (state.scorers[k].goals === 0) delete state.scorers[k];
    }
  }

  function snapshot() {
    const snap = JSON.parse(JSON.stringify({
      groupMatches: state.groupMatches,
      knockoutMatches: state.knockoutMatches,
      scorers: state.scorers,
      phase: state.phase
    }));
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(snap);
    state.historyIndex = state.history.length - 1;
    // cap
    if (state.history.length > 50) {
      state.history.shift();
      state.historyIndex--;
    }
  }

  return {
    getState: () => state,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

    computeStandings,
    getAllStandings,
    allGroupsComplete,
    getBestThirds,
    getWinner,

    setMatchScore(matchId, homeScore, awayScore, homePens, awayPens) {
      let m = state.groupMatches.find(x => x.id === matchId) || state.knockoutMatches.find(x => x.id === matchId);
      if (!m) return;
      snapshot();
      // reverse previous scorers
      if (m.played) {
        removeScorers(m.home, m.homeScore);
        removeScorers(m.away, m.awayScore);
      }
      m.homeScore = homeScore;
      m.awayScore = awayScore;
      if (homePens != null) m.homePenalties = homePens;
      if (awayPens != null) m.awayPenalties = awayPens;
      m.played = true;
      assignScorers(m.home, homeScore);
      assignScorers(m.away, awayScore);

      // If group phase complete, seed R32
      if (allGroupsComplete() && state.phase === 'groups') {
        seedKnockout();
      }

      // If knockout round complete, advance
      if (m.phase === 'knockout') {
        const roundMatches = state.knockoutMatches.filter(x => x.round === m.round);
        if (roundMatches.every(x => x.played)) {
          if (m.round !== '3P' && m.round !== 'F') {
            advanceKnockout(m.round);
          }
          if (m.round === 'F') state.phase = 'final';
        }
      }

      save();
      emit();
    },

    simulateGroup(groupKey) {
      snapshot();
      state.groupMatches.filter(m => m.group === groupKey && !m.played).forEach(m => {
        const homeRank = window.TEAMS_DATA.groups[groupKey].find(t => t.code === m.home).rank;
        const awayRank = window.TEAMS_DATA.groups[groupKey].find(t => t.code === m.away).rank;
        const [hs, as] = simulateScore(homeRank, awayRank);
        m.homeScore = hs; m.awayScore = as; m.played = true;
        assignScorers(m.home, hs);
        assignScorers(m.away, as);
      });
      if (allGroupsComplete()) seedKnockout();
      save();
      emit();
    },

    simulateAll() {
      snapshot();
      // simulate all unplayed group matches
      state.groupMatches.filter(m => !m.played).forEach(m => {
        const group = window.TEAMS_DATA.groups[m.group];
        const hRank = group.find(t => t.code === m.home).rank;
        const aRank = group.find(t => t.code === m.away).rank;
        const [hs, as] = simulateScore(hRank, aRank);
        m.homeScore = hs; m.awayScore = as; m.played = true;
        assignScorers(m.home, hs); assignScorers(m.away, as);
      });
      seedKnockout();
      // Simulate knockouts in order
      ['R32', 'R16', 'QF', 'SF', '3P', 'F'].forEach(rnd => {
        if (rnd !== '3P' && rnd !== 'F') {
          // For R32 and later we need to chain via winners, but seedKnockout + advance fills in
        }
        const matches = state.knockoutMatches.filter(m => m.round === rnd);
        matches.forEach(m => {
          if (!m.home || !m.away) return;
          const hRank = getRankByCode(m.home);
          const aRank = getRankByCode(m.away);
          let [hs, as] = simulateScore(hRank, aRank);
          m.homeScore = hs; m.awayScore = as; m.played = true;
          assignScorers(m.home, hs); assignScorers(m.away, as);
          if (hs === as) {
            // penalties
            let hp = Math.floor(Math.random() * 4) + 2;
            let ap = Math.floor(Math.random() * 4) + 2;
            while (hp === ap) ap = Math.floor(Math.random() * 4) + 2;
            m.homePenalties = hp; m.awayPenalties = ap;
          }
        });
        if (rnd !== '3P' && rnd !== 'F') advanceKnockout(rnd);
        // after SF, 3P and F pairs are set by advanceKnockout
      });
      state.phase = 'final';
      save(); emit();
    },

    reset() {
      state = defaultState();
      save();
      emit();
    },

    undo() {
      if (state.historyIndex <= 0) return;
      state.historyIndex--;
      const snap = state.history[state.historyIndex];
      Object.assign(state, JSON.parse(JSON.stringify(snap)));
      save(); emit();
    },

    redo() {
      if (state.historyIndex >= state.history.length - 1) return;
      state.historyIndex++;
      const snap = state.history[state.historyIndex];
      Object.assign(state, JSON.parse(JSON.stringify(snap)));
      save(); emit();
    },

    getTopScorers(limit = 10) {
      return Object.values(state.scorers).sort((a, b) => b.goals - a.goals).slice(0, limit);
    },

    getTotalGoals() {
      const gGoals = state.groupMatches.filter(m => m.played).reduce((s, m) => s + m.homeScore + m.awayScore, 0);
      const kGoals = state.knockoutMatches.filter(m => m.played).reduce((s, m) => s + m.homeScore + m.awayScore, 0);
      return gGoals + kGoals;
    },

    getTotalPlayed() {
      return state.groupMatches.filter(m => m.played).length + state.knockoutMatches.filter(m => m.played).length;
    },

    getChampion() {
      const final = state.knockoutMatches.find(m => m.round === 'F');
      if (!final || !final.played) return null;
      return getWinner(final);
    },

    getPodium() {
      const final = state.knockoutMatches.find(m => m.round === 'F');
      const third = state.knockoutMatches.find(m => m.round === '3P');
      if (!final || !final.played) return null;
      const winner = getWinner(final);
      const runnerUp = winner === final.home ? final.away : final.home;
      const thirdPlace = third && third.played ? getWinner(third) : null;
      return { first: winner, second: runnerUp, third: thirdPlace };
    }
  };

  function getRankByCode(code) {
    for (const g of Object.values(window.TEAMS_DATA.groups)) {
      const t = g.find(x => x.code === code);
      if (t) return t.rank;
    }
    return 50;
  }

  function simulateScore(homeRank, awayRank) {
    // Poisson-ish based on rank diff. Better rank = more expected goals
    const homeStrength = Math.max(0.5, 2.2 - homeRank / 40);
    const awayStrength = Math.max(0.4, 2.0 - awayRank / 40);
    const home = poisson(homeStrength);
    const away = poisson(awayStrength);
    return [Math.min(home, 7), Math.min(away, 7)];
  }

  function poisson(lambda) {
    let L = Math.exp(-lambda), k = 0, p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  }
};
