/* ===== Production bridge (not part of Fariza's preview) =====================
 * Turns the approved Decision Intelligence preview (v65, 19 Nov 2026) into the live app:
 *  - removes the preview bar and the Example-data chips (BS-DI-006 §11 rule)
 *  - requires the Cognito sign-in the dashboard already holds (same pattern as /edna)
 *  - drives the chrome from the person's REAL five-way E-DNA result (BS-AI-003 §2.2)
 *  - replaces the launch view's prototype mentor with the backend: POST /decisions,
 *    PUT /boxes, POST /mentor, POST /check (BS-AI-004 §3; the server builds the context)
 *  - fills Home with the person's real log, credits and reviews due
 * The preview part files above are Fariza's reference and are not edited; everything
 * production-specific lives here. Where BS-AI-003 and the preview differ, BS-AI-003 wins.
 */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- config ---------- */
  var LOCAL = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
  var API = (window.DI_API_BASE || (LOCAL ? 'http://127.0.0.1:8010' : 'https://qpbpbpiegm.us-east-1.awsapprunner.com')) + '/api/di';
  var CLIENT_ID = window.EDNA_COGNITO_CLIENT_ID || '7p2sthlo5p654mi99gcr8rjhtd';

  /* ---------- session (same store the SPA and /edna use) ---------- */
  function b64urlJson(part) {
    try { return JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))); } catch (e) { return null; }
  }
  function cognitoSession() {
    try {
      var pfx = 'CognitoIdentityServiceProvider.' + CLIENT_ID;
      var last = localStorage.getItem(pfx + '.LastAuthUser');
      if (!last) return null;
      var tok = localStorage.getItem(pfx + '.' + last + '.idToken');
      if (!tok) return null;
      var p = b64urlJson(tok.split('.')[1] || '');
      if (!p || !p.sub || (p.exp || 0) * 1000 < Date.now() + 60000) return null;
      return { token: tok, sub: p.sub };
    } catch (e) { return null; }
  }
  var sess = cognitoSession();
  var localUid = LOCAL ? new URLSearchParams(location.search).get('uid') : null; /* local testing only */
  if (!sess && !localUid) { location.replace('/?signin=1'); return; }
  function headers() {
    var h = { 'Content-Type': 'application/json' };
    if (sess) h.Authorization = 'Bearer ' + sess.token;
    else h['x-user-id'] = localUid;
    return h;
  }
  function api(path, opts) {
    opts = opts || {};
    return fetch(API + path, {
      method: opts.method || 'GET',
      headers: headers(),
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    }).then(function (res) {
      return res.json().then(function (j) { j.__status = res.status; return j; });
    });
  }

  /* ---------- strip the preview controls ---------- */
  var st = document.createElement('style');
  st.textContent = '.pv{display:none!important}.chip.ex{display:none!important}.frame{margin-top:24px}' +
    /* production: the phone frame fills a real phone, not the preview's fixed 390px canvas */
    '.frame.phone{width:100%!important;max-width:390px;margin-left:auto;margin-right:auto;border-radius:0}' +
    '@media (max-width: 420px){.frame{margin-top:0}.frame.phone{box-shadow:none}}' +
    '#frameNote{display:none}.notes{display:none!important}' +
    /* the set-your-password banner is the preview's example state (A3); everyone on /app signed in
       with a real password, and the report-gate flow that creates password-less accounts is not built yet */
    '#homeBanners .gban:not(.warn){display:none!important}';
  document.head.appendChild(st);

  /* ---------- platform by viewport (BS-AI-003 §2.4) ---------- */
  function clickBar(sel, val) {
    var b = document.querySelector('[' + sel + '="' + val + '"]');
    if (b) b.click();
  }
  function vwNow() { return document.documentElement.clientWidth || window.innerWidth; }
  function setPlatform() { clickBar('data-plat', vwNow() <= 760 ? 'webphone' : 'desktop'); }
  setPlatform();
  var lastNarrow = vwNow() <= 760;
  window.addEventListener('resize', function () {
    var n = vwNow() <= 760;
    if (n !== lastNarrow) { lastNarrow = n; setPlatform(); }
  });

  /* ---------- the real person drives the chrome ---------- */
  var KEYMAP = {
    architect: 'architect', alchemist: 'alchemist',
    'architect-leaning': 'archlean', 'alchemist-leaning': 'alchlean', mixed: 'mixed',
  };
  var PROFILE = null;

  function money(n) { return n == null ? '' : String(n); }

  function patchCredits() {
    api('/credits').then(function (c) {
      if (c.__status !== 200) return;
      ['credits', 'credits0'].forEach(function (id) {
        var el = $(id); if (!el) return;
        el.innerHTML = '<div class="t13 sec">Your decisions</div><div class="t19 b">' + money(c.balance) +
          ' left</div><div class="t13 sec">1 credit = one decision taken to Check</div>';
      });
    });
  }

  function loopArrow(began, finished) {
    var W = { logic: '<span class="L">Logic</span>', feeling: '<span class="F">Feeling</span>' };
    if (!began) return '';
    if (!finished || began === finished) return W[began] + ' → … → ' + W[began];
    return W[began] + ' → ' + W[finished];
  }
  function statusChip(row) {
    if (row.outcome) return 'Reviewed';
    if (row.decided_text) return 'Decided' + (row.review_date ? ' · review ' + String(row.review_date).slice(0, 10) : '');
    return 'In the Frame';
  }
  function patchLog() {
    api('/log').then(function (l) {
      if (l.__status !== 200) return;
      var rows = l.rows || [];
      var short = rows.slice(0, 3).map(function (r) {
        return '<tr class="' + (r.written_by === 'person' ? 'by-hand' : 'by-mentor') + '"><td>' +
          new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '</td><td>' +
          r.text + '</td><td>' + statusChip(r) + '</td></tr>';
      }).join('');
      if ($('logRows0') && rows.length) $('logRows0').innerHTML = short;
      var full = rows.map(function (r) {
        return '<tr class="' + (r.written_by === 'person' ? 'by-hand' : 'by-mentor') + '"><td>' +
          new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '</td><td>' +
          r.text + '</td><td><span class="lp">' + loopArrow(r.began_loop, r.finished_loop) + '</span></td><td>' +
          statusChip(r) + '</td></tr>';
      }).join('');
      if ($('logRows') && rows.length) $('logRows').innerHTML = full;
    });
    patchNeedsYou();
  }

  /* ---------- Needs you + the bell (BS-AI-009 §5): live rows, cleared by the action ---------- */
  var NYKIND = { N1: 'Invitation', N2: 'Your input', N3: 'Your room', N4: 'Confirm', N6: 'Review · due', N7: 'Review · due' };
  function patchNeedsYou() {
    api('/needs-you').then(function (d) {
      if (d.__status !== 200) return;
      var items = d.items || []; var n = items.length;
      var bell = $('bellN'); if (bell) { bell.textContent = String(n); bell.classList.toggle('zero', n === 0); }
      var needN = $('needN'); if (needN) { needN.textContent = String(n); needN.classList.toggle('hide', n === 0); }
      var box = $('needs0'); if (!box) return;
      if (!n) {
        box.innerHTML = '<div class="empty"><b>Nothing waiting.</b> Rooms that need your input and reviews that are due appear here, and reach you as a notification.</div>';
        return;
      }
      box.innerHTML = items.map(function (r, i) {
        return '<div class="need"><div><span class="t13 k">' + (NYKIND[r.event] || r.event) + '</span><span class="t19">' + r.title +
          '</span><div class="t13 sec">' + (r.line || '') + '</div></div>' +
          '<button class="btn small primary" type="button" data-ny="' + i + '">' + (r.action || 'Open') + '</button></div>';
      }).join('');
      box.onclick = function (e) {
        var b = e.target.closest && e.target.closest('[data-ny]'); if (!b) return;
        var r = items[parseInt(b.dataset.ny, 10)]; if (!r) return;
        if (r.event === 'N1' && r.invite_token) { joinInvite(r.invite_token); return; }
        if (r.room_id) {
          if (window.showScreen) window.showScreen(4);
          setTimeout(function () { openLiveRoom(r.room_id); }, 300);
          return;
        }
        if (r.log_id) { openLogRow(r.log_id); }
      };
    });
  }
  /** Go to the log screen and open the row (for a review that is due). */
  function openLogRow(logId) {
    if (window.showScreen) window.showScreen(3);
    var tries = 0;
    (function look() {
      var v = (LOGCACHE.mine || []).concat(LOGCACHE.room || []).filter(function (x) { return x.raw && x.raw.id === logId; })[0];
      if (v) return openRealRow(v);
      if (tries++ < 10) setTimeout(look, 400);
    })();
  }

  /* ---------- Screen 3 · the Decision log, from the real log ---------- */
  var LOGCACHE = { mine: [], room: [] };
  var REVIEW_ROW = null; /* the row screen 12 reviews */

  function toView(r) {
    var began = r.began_loop ? (r.began_loop === 'logic' ? 'L' : 'F') : null;
    var fin = r.finished_loop ? (r.finished_loop === 'logic' ? 'L' : 'F') : null;
    var st = r.outcome ? 'reviewed'
      : (r.review_date && new Date(r.review_date) <= new Date() && r.decided_text) ? 'review'
        : r.decided_text ? 'decided' : 'open';
    return {
      raw: r, d: new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      t: r.text, ctx: r.context ? r.context[0].toUpperCase() + r.context.slice(1) : '–',
      began: began, fin: fin, urg: !!r.urgent, st: st,
      rev: r.review_date ? new Date(r.review_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : null,
      by: r.written_by === 'person' ? 'hand' : 'mentor',
      rounds: r.rounds || 1, warn: (r.warnings || []).length,
      rests: r.rests_on, dec: r.decided_text,
      read: r.readiness ? { ready: { Ready: 'Ready', one_more_round: 'One more round', not_yet: 'Not yet' }[r.readiness] || r.readiness } : null,
      time: humanInterval(r.time_to_decide),
    };
  }
  /* node-postgres serialises an interval as {days, hours, minutes, seconds} */
  function humanInterval(iv) {
    if (!iv) return '';
    if (typeof iv === 'string') return iv.replace(/:\d\d\.\d+$/, '');
    var parts = [];
    if (iv.days) parts.push(iv.days + (iv.days === 1 ? ' day' : ' days'));
    if (iv.hours) parts.push(iv.hours + (iv.hours === 1 ? ' hour' : ' hours'));
    if (!iv.days && !iv.hours && iv.minutes) parts.push(iv.minutes + ' min');
    if (!parts.length) parts.push('under a minute');
    return parts.join(' ');
  }
  var STCHIP = { open: ['grey', 'In the Frame'], decided: ['type', 'Decided'], review: ['ex', 'Review due'], reviewed: ['type', 'Reviewed'] };
  function lpCell(v) {
    var LW = { L: 'Logic', F: 'Feeling' };
    if (!v.began) return '–';
    if (!v.fin) return '<span class="lp"><span class="' + v.began + '">' + LW[v.began] + '</span> → …</span>';
    var held = v.began === v.fin;
    return '<span class="lp"><span class="' + v.began + '">' + LW[v.began] + '</span> → <span class="' + v.fin + '">' + LW[v.fin] + '</span></span> <span class="mark ' + (held ? 'ok' : 'part') + '">' + (held ? '✓' : '–') + '</span>';
  }
  function logFilters() {
    var f = {};
    document.querySelectorAll('#main3 .fsel').forEach(function (s) { f[s.dataset.f] = s.value; });
    var view = document.querySelector('input[name="lview"]:checked');
    f.view = view ? view.value : 'mine';
    return f;
  }
  function paintLogScreen() {
    var f = logFilters();
    var all = LOGCACHE[f.view === 'room' ? 'room' : 'mine'] || [];
    var rows = all.filter(function (v) {
      if (f.context && v.ctx !== f.context) return false;
      if (f.stress && ((f.stress === 'yes') !== v.urg)) return false;
      if (f.loop) {
        if (f.loop === 'held' && !(v.fin && v.fin === v.began)) return false;
        if (f.loop === 'switched' && !(v.fin && v.fin !== v.began)) return false;
        if ((f.loop === 'L' || f.loop === 'F') && v.began !== f.loop) return false;
      }
      if (f.status && v.st !== f.status) return false;
      return true;
    });
    if (!all.length) {
      $('rows3').innerHTML = '<tr><td colspan="9"><div class="empty"><b>No decisions yet.</b> Make your first one and it appears here: the date, the loop you used, what it rested on and its review date. Or add a decision you already made.</div></td></tr>';
    } else {
      $('rows3').innerHTML = rows.map(function (v, i) {
        return '<tr class="' + (v.by === 'mentor' ? 'by-mentor' : '') + ' rowlive" data-k="' + i + '" tabindex="0" style="cursor:pointer"><td>' + v.d + '</td><td><b>' + v.t + '</b><div class="t13 sec">' + (v.time || '') + '</div></td><td>' + v.ctx + '</td><td>' + lpCell(v) + '</td><td>' + (v.urg ? '<span class="chip ex" style="display:inline-block">Urgent</span>' : '–') + '</td><td><span class="chip ' + STCHIP[v.st][0] + '" style="display:inline-block">' + STCHIP[v.st][1] + '</span></td><td>' + (v.rev || '–') + '</td><td>' + (v.by === 'mentor' ? 'Mentor' : 'By hand') + '</td></tr>';
      }).join('');
      $('rows3').__live = rows;
    }
    if ($('l3count')) $('l3count').textContent = rows.length + ' of ' + all.length + ' decisions';
    var held = all.filter(function (v) { return v.fin && v.fin === v.began; }).length;
    var c = [['Decisions', all.length], ['Decided', all.filter(function (v) { return v.st !== 'open'; }).length],
      ['Still in the Frame', all.filter(function (v) { return v.st === 'open'; }).length],
      ['Where you switched', all.filter(function (v) { return v.fin && v.fin !== v.began; }).length]];
    $('counts3').innerHTML = c.map(function (x) { return '<div class="count"><div class="t13 sec">' + x[0] + '</div><div class="n">' + x[1] + '</div></div>'; }).join('');
  }
  function openRealRow(v) {
    var o = $('open3'); o.classList.remove('hide');
    $('o3meta').textContent = v.d + ' · ' + v.ctx + ' · ' + (v.by === 'mentor' ? 'written by your mentor' : 'written by hand') + (v.time ? ' · ' + v.time : '');
    $('o3h').textContent = v.t;
    $('o3boxes').innerHTML = '<div class="t19 sec">Loading…</div>';
    var LBLS = { logic_first: ['Your facts', 'How it feels', 'What answers it', 'What it rests on', 'Your decision'], feeling_first: ['How it feels', 'The facts', 'What it does to the feeling', 'What it rests on', 'Your decision'] };
    if (v.raw.decision_id) {
      api('/decisions/' + v.raw.decision_id).then(function (res) {
        if (res.__status !== 200) { $('o3boxes').innerHTML = ''; return; }
        var names = { box1: 0, box2: 1, box3: 2, end: 3, box4: 4 };
        var lbl = LBLS[v.raw.order || 'logic_first'];
        $('o3boxes').innerHTML = (res.entries || []).filter(function (e) { return e.box !== 'decision'; }).map(function (e) {
          var W = e.loop === 'logic' ? 'Logic' : e.loop === 'feeling' ? 'Feeling' : 'Your decision';
          var cls = e.loop === 'logic' ? 'logic' : e.loop === 'feeling' ? 'feeling' : 'dec';
          return '<div class="obox ' + cls + '"><div class="t13 sec"><b class="w">' + W + '</b> · ' + (lbl[names[e.box]] || e.box) + (e.round > 1 ? ' · round ' + e.round : '') + '</div><div class="t19">' + e.text + '</div></div>';
        }).join('');
      });
    } else {
      $('o3boxes').innerHTML = '<div class="t19 sec">Added by hand: no boxes. Open it in the Frame to check how it was made.</div>';
    }
    $('o3ready').innerHTML = v.read
      ? '<div class="t19"><b>Rests on:</b> ' + (v.rests || '–') + '</div><div class="t19"><b>Read:</b> <span class="chip ' + (v.read.ready === 'Ready' ? 'type' : 'ex') + '" style="display:inline-block">' + v.read.ready + '</span></div>'
      : '<div class="t19 sec">' + (v.st === 'open' ? 'Not yet checked. Reopen the Frame to finish it.' : 'Added by hand; no readiness read.') + '</div>';
    $('o3log').innerHTML = '<div class="t19">' + v.d + ' · ' + v.t + (v.began ? ' · began ' + (v.began === 'L' ? 'Logic' : 'Feeling') : '') + (v.fin ? ', finished ' + (v.fin === 'L' ? 'Logic' : 'Feeling') : '') + ' · ' + v.rounds + ' round' + (v.rounds > 1 ? 's' : '') + ' · ' + (v.warn ? v.warn + ' warning' : 'no warning') + (v.dec ? ' · decided: ' + v.dec : ' · not yet decided') + (v.rests ? ' · rests on ' + v.rests : '') + (v.rev ? ' · review ' + v.rev : '') + '</div>';
    var oc = v.raw.review_answers || null;
    $('o3review').innerHTML = v.raw.outcome
      ? '<div class="t19"><b>Outcome:</b> ' + v.raw.outcome.replace(/_/g, ' ') + '</div>' + (oc ? ['q1', 'q2', 'q3'].map(function (k) { return oc[k] ? '<div class="t19">' + oc[k] + '</div>' : ''; }).join('') : '')
      : v.st === 'review'
        ? '<div class="t19 b" style="margin-bottom:6px">Review due ' + v.rev + '. Three questions with your mentor:</div><div class="btnrow" style="margin-top:8px"><button class="btn small primary" type="button" id="o3startReview">Review with your mentor</button></div>'
        : '<div class="t19 sec">' + (v.rev ? 'Review on ' + v.rev + '. Your mentor will remind you.' : 'No review date yet.') + '</div>';
    REVIEW_ROW = v;
    var sr = $('o3startReview');
    if (sr) sr.addEventListener('click', function () { if (window.showScreen) window.showScreen(12); });
    o.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function refreshLogScreen() {
    Promise.all([api('/log?view=mine'), api('/log?view=room')]).then(function (res) {
      LOGCACHE.mine = (res[0].rows || []).map(toView);
      LOGCACHE.room = (res[1].rows || []).map(toView);
      paintLogScreen();
    });
  }
  var origOpenScreen3 = window.openScreen3;
  window.openScreen3 = function (key) {
    if (origOpenScreen3) origOpenScreen3(key);
    refreshLogScreen();
  };
  /* my rows: capture phase so the preview's own row handler never fires */
  document.addEventListener('click', function (e) {
    var tr = e.target.closest && e.target.closest('#rows3 tr.rowlive');
    if (!tr) return;
    e.stopPropagation();
    var rows = $('rows3').__live || [];
    if (rows[Number(tr.dataset.k)]) openRealRow(rows[Number(tr.dataset.k)]);
  }, true);
  /* repaint after the preview's filter handlers repaint with example data */
  ['change', 'click'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      if (!e.target.closest) return;
      if (e.target.closest('#main3 .fsel') || e.target.closest('input[name="lview"]') || e.target.closest('#l3clear')) {
        setTimeout(paintLogScreen, 0);
      }
    });
  });

  /* ---------- Screen 12 · the review, against the real backend (free, 3 turns) ---------- */
  var RV = { step: 0, outcome: '', ans: [], busy: false };
  var RVQ = ['What happened? Did the decision hold?', 'What would you change in how you decided it? Not what you decided: how.', 'What do you carry forward to the next decision like this one?'];
  function rvBubble(who, text, mentorSide) {
    return who === 'm'
      ? '<div class="rvm"><img src="assets/ai_' + (mentorSide === 'alch' ? 'alchemist' : 'architect') + '_approved.gif" alt=""><div class="rvb ' + (mentorSide === 'alch' ? 'alch' : 'arch') + '">' + text + '</div></div>'
      : '<div class="rvme"><div class="rvb me">' + text + '</div></div>';
  }
  function rvOutcomeWord() { return { held: 'Held', partly: 'Held in part', changed: 'Changed direction', reopened: 'Reopened' }[RV.outcome] || 'Held'; }
  function rvDraw(extraMentor) {
    var v = REVIEW_ROW; if (!v) return;
    var side = PROFILE && (PROFILE.type_key === 'alchemist' || PROFILE.type_key === 'alchemist-leaning') ? 'alch' : 'arch';
    $('rvTitle').textContent = v.t;
    $('rvLog').textContent = v.d + ' · ' + v.t + ' · ' + v.rounds + ' round' + (v.rounds > 1 ? 's' : '') + (v.rests ? ' · rests on ' + v.rests : '') + ' · review due';
    var h = rvBubble('m', 'On ' + v.d + ' you decided: <b>' + (v.dec || v.t) + '</b>.' + (v.rests ? ' It rested on ' + v.rests + '.' : '') + ' ' + RVQ[0], side);
    for (var i = 0; i < RV.step; i++) {
      h += rvBubble('me', (i === 0 ? rvOutcomeWord() + '. ' : '') + RV.ans[i], side);
      if (RV.mentorReplies && RV.mentorReplies[i]) h += rvBubble('m', RV.mentorReplies[i], side);
      else if (i + 1 < 3) h += rvBubble('m', RVQ[i + 1], side);
    }
    if (extraMentor) h += rvBubble('m', extraMentor, side);
    $('rvChat').innerHTML = h;
    if (RV.step < 3) {
      var chips = RV.step === 0 ? '<div class="rvchips" role="radiogroup">' + [['held', 'Held'], ['partly', 'Held in part'], ['changed', 'Changed direction'], ['reopened', 'Reopened']].map(function (c) {
        return '<button type="button" class="' + (RV.outcome === c[0] ? 'on' : '') + '" data-oc-live="' + c[0] + '">' + c[1] + '</button>';
      }).join('') + '</div>' : '';
      $('rvInput').innerHTML = chips + '<textarea id="rvTaLive" class="rvta" rows="3" placeholder="' + (RV.step === 0 ? 'In a line or two: what happened' : RV.step === 1 ? 'What you would change in how you decided' : 'What you carry forward') + '"></textarea><div class="btnrow"><button class="btn primary small" type="button" id="rvSendLive">Send</button><span class="t13 sec">' + (RV.step + 1) + ' of 3</span></div>';
      $('rvInput').classList.remove('hide'); $('rvDone').classList.add('hide');
      $('rvOut').innerHTML = RV.outcome ? '<span class="chip ' + (RV.outcome === 'held' ? 'type' : 'grey') + '" style="display:inline-block">' + rvOutcomeWord() + '</span>' : '<span class="chip grey" style="display:inline-block">Not yet reviewed</span>';
    } else {
      $('rvInput').classList.add('hide');
      $('rvDone').classList.remove('hide');
      $('rvDone').innerHTML = '<div class="t19 b" style="margin-bottom:6px">Review recorded</div><div class="t13 sec" style="margin-bottom:10px">The log row now carries the outcome and your answers. This review has left Needs you.</div><div class="btnrow"><button class="btn primary small" type="button" data-go="3">Back to my log</button>' + (RV.outcome === 'changed' || RV.outcome === 'reopened' ? '<button class="btn secondary small" type="button" data-go="1">Decide it again in the Frame</button>' : '') + '<button class="btn secondary small" type="button" data-go="1">Home</button></div>';
      $('rvOut').innerHTML = '<span class="chip type" style="display:inline-block">' + rvOutcomeWord() + '</span>';
    }
  }
  var origOpenScreen12 = window.openScreen12;
  window.openScreen12 = function (cur) {
    if (origOpenScreen12) origOpenScreen12(cur);
    if (REVIEW_ROW) { RV = { step: 0, outcome: '', ans: [], mentorReplies: [], busy: false }; rvDraw(); }
  };
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !REVIEW_ROW) return;
    var oc = e.target.closest('#main12 [data-oc-live]');
    if (oc) { e.stopPropagation(); RV.outcome = oc.dataset.ocLive; rvDraw(); return; }
    if (e.target.closest('#rvSendLive')) {
      e.stopPropagation();
      if (RV.busy) return;
      var ta = $('rvTaLive'); var vtext = (ta && ta.value.trim()) || '';
      if (!vtext) return;
      if (RV.step === 0 && !RV.outcome) RV.outcome = 'held';
      RV.ans[RV.step] = vtext;
      var v = REVIEW_ROW;
      var finish = function (closing) {
        RV.step++;
        if (RV.step >= 3) {
          var map = { held: 'held', partly: 'held_in_part', changed: 'changed_direction', reopened: 'reopened' };
          api('/log/' + v.raw.id + '/review', {
            method: 'POST',
            body: { q1: RV.ans[0], q2: RV.ans[1], q3: RV.ans[2], outcome: map[RV.outcome] },
          }).then(function () { rvDraw(closing); refreshLogScreen(); patchLog(); });
        } else { rvDraw(); }
      };
      if (v.raw.decision_id) {
        RV.busy = true;
        api('/decisions/' + v.raw.decision_id + '/mentor', {
          method: 'POST', body: { event: 'review_' + (RV.step + 1), text: vtext },
        }).then(function (res) {
          RV.busy = false;
          if (res.__status === 200 && res.response && RV.step < 2) RV.mentorReplies[RV.step] = res.response.reply;
          finish(res.__status === 200 && res.response && RV.step === 2 ? res.response.reply : null);
        }).catch(function () { RV.busy = false; finish(null); });
      } else { finish(null); }
      return;
    }
  }, true);

  /* ---------- Screens 6 · 7 · 8: My E-DNA, My reports, My workbooks (real data) ---------- */
  var EDNA = null;      /* GET /edna once per load */
  var WBS = null;       /* GET /api/user/workbooks once per load */
  var PARTS = ['Core Type Decision Intelligence Loop Identity', 'Subtype Refinement Identity', 'Alternate Decision Intelligence Loop Awareness', 'Learning Style Preferences', 'Neurodiversity & Accessibility', 'Mindset & Personality', 'Meta-Beliefs & Values'];
  var HEAD = { 6: 'Disposition', 7: 'Beliefs & values' };
  var LV = { 'Very low': 1, Low: 2, Moderate: 3, High: 4, Mastery: 5 };
  function bar5(level, loop) {
    var n = LV[level] || 0; var h = '';
    for (var i = 1; i <= 5; i++) h += '<i class="' + (i <= n ? 'f' : '') + '"></i>';
    return '<span class="bar5 ' + loop + '" aria-label="' + level + '">' + h + '</span>';
  }
  function paintScreen6() {
    var e = EDNA; if (!e || !e.taken) return;
    $('e6h').textContent = e.name;
    $('e6stress').textContent = 'Part 1 stress result: ' + e.stress;
    $('loopFig6').innerHTML = e.first ? window.loopFigure(e.first, e.light)
      : window.loopFigure('logic', true) + '<div style="height:8px"></div>' + window.loopFigure('feeling', true);
    $('e6retakeNote').textContent = e.retake;
    $('e6detail').textContent = e.purchased ? 'Open your Advanced Report' : 'Get your Advanced Report · £99';
    var mixed = e.light;
    var parts = [
      [2, (e.p2.result || '—') + (e.p2.second ? '<div class="t13 sec">close second: ' + e.p2.second + '</div>' : ''), mixed ? 'Mixed results have no subtype until the retake; a likely subtype is shown.' : 'How you execute: the subtype inside your core type.'],
      [3, '<div class="bars">' + e.p3.map(function (x) { var lp = x.loop === 'architect' ? 'logic' : 'feeling'; return '<div class="t13"><span class="w">' + x.k + '</span> ' + bar5(x.level, lp) + ' <b>' + x.level + '</b></div>'; }).join('') + '</div>', mixed ? 'Results are capped at Moderate while your Dominant loop is unconfirmed.' : 'Awareness of your own loop and of others’. Each bar is the loop it measures.'],
      [4, e.p4.map(function (d) { return '<div class="t13"><span class="w">' + d.dom + '</span> <b>' + d.r + '</b></div>'; }).join(''), 'How you take information in and work with it.'],
      [5, e.p5.consent ? '<div class="t19 b type">' + (e.p5.style || '') + '</div><div class="t13">' + e.p5.patterns + (e.p5.strength ? ' · exceptional strength: ' + e.p5.strength : '') + '</div>'
        : '<div class="t19 b type">Permission denied</div><div class="t13">Give consent in Settings to see your comparison. Your adaptation levels are shown in the report either way.</div>', 'THIS IS NOT A DIAGNOSIS. Your results describe how you work best.'],
      [6, e.p6.map(function (d) { return '<div class="t13"><span class="w">' + d.dom + '</span> <b>' + d.result + '</b></div>'; }).join(''), 'Report heading: Disposition.'],
      [7, e.p7.map(function (b) { return '<div class="t13"><span class="w">' + b.belief + '</span> <b>' + b.result + '</b></div>'; }).join(''), 'Report heading: Beliefs & values. Beliefs that act on a decision; the mentor reads them.'],
    ];
    $('parts6').innerHTML = parts.map(function (p) {
      return '<section class="glass panel part" aria-label="Part ' + p[0] + '"><div class="strip" aria-hidden="true"></div><div class="pband"><span class="t13 sec">Part ' + p[0] + '</span><span class="t19 b">' + (HEAD[p[0]] || PARTS[p[0] - 1]) + '</span></div><div class="pbody">' + p[1] + '</div><div class="t13 sec" style="margin-top:8px">' + p[2] + '</div><a href="#" class="t13 b" data-go="7" style="display:inline-block;margin-top:8px">Open in your report ›</a></section>';
    }).join('');
    $('e6hist').innerHTML = e.assessments.map(function (a) {
      return '<tr><td>' + new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '</td><td>' + a.name + '</td><td>Basic' + (a.purchased ? ' · Advanced' : '') + '</td><td><a href="/edna/index.html">Open</a></td></tr>';
    }).join('');
    $('e6meta').textContent = 'Taken ' + new Date(e.assessments[e.assessments.length - 1].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + e.assessments.length + ' assessment' + (e.assessments.length > 1 ? 's' : '');
  }
  function paintScreen7() {
    var e = EDNA; if (!e || !e.taken) return;
    var has = e.purchased;
    $('r7dbtn').innerHTML = has
      ? '<button class="btn primary small" type="button" id="r7open">Open</button>'
      : '<button class="btn primary small" type="button" id="r7buy">Get it · £99</button>';
    $('r7dsub').textContent = has ? 'Seven parts and what to adapt · in your account · Workbook 1 included'
      : 'Seven parts and what to adapt · £99 · includes Workbook 1 and 10 decisions';
    var rows = PARTS.map(function (p, i) { return [i + 1, HEAD[i + 1] ? p + ' (' + HEAD[i + 1] + ')' : p]; }).concat([[8, 'What to adapt, and what the app provides']]);
    $('r7parts').innerHTML = rows.map(function (rw) {
      return '<div class="rrow' + (has ? '' : ' locked') + '"' + (has ? ' data-r7open="1" style="cursor:pointer"' : '') + '><span class="t13 sec" style="width:56px;flex:none">' + (rw[0] < 8 ? 'Part ' + rw[0] : 'Plus') + '</span><span class="t19">' + rw[1] + '</span><span class="t13 b">' + (has ? 'Open ›' : '🔒') + '</span></div>';
    }).join('');
    var open = function () { location.href = '/edna/index.html'; };
    var o = $('r7open'); if (o) o.addEventListener('click', open);
    var b = $('r7buy'); if (b) b.addEventListener('click', function () { location.href = 'https://go.brandscaling.co.uk/checkout-page-quiz-report'; });
    document.querySelectorAll('#r7parts [data-r7open]').forEach(function (rw) { rw.addEventListener('click', open); });
  }
  function paintScreen8() {
    if (!WBS || !WBS.workbooks) return;
    var list = (WBS.workbooks || []).map(function (w) { return { n: w.workbook, title: w.title || w.name, completed: !!w.isCompleted, started: !!w.hasInstance, locked: false }; })
      .concat((WBS.lockedWorkbooks || []).map(function (w) { return { n: w.workbook, title: w.title || w.name, locked: true, reason: w.reason || w.lockedReason || 'Locked' }; }));
    list.sort(function (a, b) { return (a.n || 9) - (b.n || 9); });
    if (!list.length) {
      $('wbCards').innerHTML = '<div class="empty"><b>No workbooks yet.</b> Your workbooks are built from your E-DNA; they unlock with your Advanced Report.</div>';
      return;
    }
    $('wbCards').innerHTML = list.map(function (w) {
      var status = w.locked ? 'Locked' : w.completed ? 'Completed' : w.started ? 'In progress' : 'Not started';
      return '<div class="wbcard' + (w.locked ? ' locked' : '') + '"><div class="t13 sec">Workbook ' + (w.n || '') + '</div><div class="t19 b" style="margin:2px 0 6px">' + w.title + '</div><div class="t13 sec">' + (w.locked ? w.reason : 'In your version') + '</div><div class="lrow" style="margin:12px 0 0"><span class="chip ' + (status === 'In progress' ? 'type' : 'grey') + '" style="display:inline-block">' + status + '</span>' + (w.locked ? '<span class="t13 b">🔒</span>' : '<button class="btn small ' + (status === 'In progress' ? 'primary' : 'secondary') + '" type="button" data-wb-live="1">' + (w.completed ? 'Open' : status === 'In progress' ? 'Continue' : 'Start') + '</button>') + '</div></div>';
    }).join('');
    document.querySelectorAll('#wbCards [data-wb-live]').forEach(function (btn) {
      btn.addEventListener('click', function () { location.href = '/'; }); /* the dashboard's workbooks view renders them */
    });
    $('wbList8').classList.remove('hide'); $('wbView').classList.add('hide');
  }
  function loadEdnaScreens() {
    api('/edna').then(function (e) { if (e.__status === 200) { EDNA = e; } });
    fetch((window.DI_API_BASE || (LOCAL ? 'http://127.0.0.1:8010' : 'https://qpbpbpiegm.us-east-1.awsapprunner.com')) + '/api/user/workbooks', { headers: headers() })
      .then(function (r) { return r.json(); }).then(function (w) { WBS = w; patchWbTile(); }).catch(function () {});
  }
  ['openScreen6', 'openScreen7', 'openScreen8'].forEach(function (fn) {
    var orig = window[fn];
    window[fn] = function (key) {
      if (orig) orig(key);
      if (fn === 'openScreen6') paintScreen6();
      if (fn === 'openScreen7') paintScreen7();
      if (fn === 'openScreen8') paintScreen8();
    };
  });

  /* ---------- Screen 4 · Decision rooms, against the real backend ---------- */
  var LIVEROOM = null; var ROOM_ABORT = null;
  var KNAME = { new: 'New decision', stuck: 'Stuck', clash: 'Resolve a clash' };
  var KINDLINE = {
    new: 'A decision you are making now, with input from the people you invite.',
    stuck: 'A decision you began and cannot get clear on. It is written in the past tense: what you began with, what you checked it against, where it stands now. Give the room what you have; the mentor sorts it into your boxes and you confirm each piece.',
    clash: 'Same facts, different decisions. Start with the decision, then the clash (the two decisions reached), then find where in the sequence it split, and work it through from there.',
  };
  function memberName(m) { return m.first_name || (m.name ? String(m.name).split(/\s+/)[0] : null) || 'Member'; }
  function initialsOf(m) {
    var n = (m.first_name && m.last_name) ? m.first_name[0] + m.last_name[0]
      : m.name ? String(m.name).split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('') : 'M';
    return n.toUpperCase();
  }
  function circleCls(m) { return m.loop === 'logic' ? 'architect' : m.loop === 'feeling' ? 'alchemist' : 'mixed'; }
  function entHTML(e) {
    var who = e.loop === 'logic' ? 'Architect' : e.loop === 'feeling' ? 'Alchemist' : null;
    var lp = e.loop === 'logic' ? 'logic' : e.loop === 'feeling' ? 'feeling' : '';
    var by = (e.first_name || e.author_name || 'Member') + ' · ' + (e.author_role === 'decision_owner' ? 'Decision owner' : 'Collaborator') + (e.mentor_translation ? ' · Mentor' : '');
    return '<div class="ent ' + lp + (e.author_role === 'decision_owner' ? ' owner' : '') + '"><div class="by">' + by +
      (who ? ' · <span class="chip ' + (who === 'Architect' ? 'ind' : 'red') + '" style="padding:1px 8px;display:inline-block">' + who + '</span>' : '') +
      '</div><div class="t19">' + e.text + '</div></div>';
  }
  function rowHTML(loop, label, sub, inner) {
    return '<div class="inp ' + loop + '"><div class="tag"><span class="w">' + label + '</span><span class="n">' + sub + '</span></div><div>' + inner + '</div></div>';
  }
  function roomStatus(r) {
    var map = { open: ['grey', 'In the Frame'], waiting_owner: ['ex', 'Waiting on you'], waiting_room: ['grey', 'Waiting on the room'], ready: ['type', 'Ready'], decided: ['type', 'Decided'], reviewed: ['type', 'Reviewed'], closed: ['grey', 'Closed'] };
    return map[r.status] || ['grey', r.status];
  }
  function paintRoomsList(rooms) {
    if (!rooms.length) {
      $('rooms').innerHTML = '<div class="empty"><b>No rooms yet.</b> Start one when a decision needs someone else’s input. You keep the decision, Box 1 and the final call; they add into the sequence.</div>';
      return;
    }
    $('rooms').innerHTML = rooms.map(function (r) {
      var st = roomStatus(r);
      return '<button class="room" type="button" data-liveroom="' + r.id + '"><div><div class="t19 b">' + r.decision_text + '</div><div class="meta t13 sec"><span class="chip grey" style="padding:1px 8px;display:inline-block">' + KNAME[r.kind] + '</span><span>' + r.people + ' of 6 people</span><span>·</span><span>' + new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '</span></div><div style="margin-top:6px"><span class="chip ' + st[0] + '" style="display:inline-block">' + st[1] + '</span></div></div><span class="go" aria-hidden="true">›</span></button>';
    }).join('');
  }
  function subscribeRoom(id) {
    if (ROOM_ABORT) { ROOM_ABORT.abort(); ROOM_ABORT = null; }
    var ctrl = new AbortController(); ROOM_ABORT = ctrl;
    fetch(API + '/rooms/' + id + '/events', { headers: headers(), signal: ctrl.signal }).then(function (res) {
      var reader = res.body.getReader(); var dec = new TextDecoder();
      function pump() {
        reader.read().then(function (x) {
          if (x.done) return;
          if (dec.decode(x.value).indexOf('data:') >= 0 && LIVEROOM === id) openLiveRoom(id, true);
          pump();
        }).catch(function () {});
      }
      pump();
    }).catch(function () {});
  }
  function openLiveRoom(id, soft) {
    LIVEROOM = id;
    api('/rooms/' + id).then(function (d) {
      if (d.__status !== 200) return;
      paintRoom(d);
      if (!soft) subscribeRoom(id);
      $('roomList').classList.add('hide'); $('roomView').classList.remove('hide');
    });
  }
  function paintRoom(d) {
    var r = d.room; var mine = d.me.role;
    var owner = mine === 'decision_owner';
    var sealed = ['ready', 'decided', 'reviewed', 'closed'].indexOf(r.status) >= 0;
    $('roomTitle').textContent = r.decision_text;
    $('roomCount').textContent = d.members.filter(function (m) { return !m.left_at; }).length + ' of 6 people';
    document.querySelectorAll('input[name="rkind"]').forEach(function (x) {
      x.checked = x.value === r.kind; x.disabled = true;
      x.closest('.mode').classList.toggle('sel', x.value === r.kind);
    });
    $('kindLine').textContent = KINDLINE[r.kind];
    /* the circles */
    var live = d.members.filter(function (m) { return !m.left_at; });
    var left = 6 - live.length;
    $('people').innerHTML = live.map(function (m) {
      var W = { logic: 'Logic', feeling: 'Feeling' };
      var seq = m.loop ? W[m.loop] + ' → ' + W[m.loop === 'logic' ? 'feeling' : 'logic'] + ' → ' + W[m.loop] : 'E-DNA not yet taken';
      return '<div class="pwrap"><button class="pcircle ' + circleCls(m) + (m.role === 'decision_owner' ? ' owner' : '') + '" type="button">' + (m.photo_url ? '<img src="' + m.photo_url + '" alt="">' : initialsOf(m)) + '</button><div class="ptip" role="tooltip"><div class="nm">' + memberName(m) + ' <span class="t13 sec" style="font-weight:500">· ' + (m.role === 'decision_owner' ? 'Decision owner' : m.role === 'read_only' ? 'Read only' : 'Collaborator') + '</span></div><div class="sec" style="margin-top:4px">' + seq + (m.mentor ? ' · AI ' + (m.mentor === 'architect' ? 'Architect' : 'Alchemist') : '') + '</div><div class="sec" style="margin-top:4px">consent given for this decision</div></div></div>';
    }).join('') + (left > 0 && owner && !sealed ? '<div class="pwrap"><button class="pcircle plus" type="button" id="addCircle" aria-label="Invite someone">+</button></div>' : '');
    $('pcap').textContent = live.length + ' of 6 · ' + (left > 0 ? left + ' more place' + (left === 1 ? '' : 's') + '. ' : '') + 'Ring: Decision owner. Colour: the loop they add in.';
    var ac = $('addCircle'); if (ac) ac.addEventListener('click', function () { $('invitePanel').classList.toggle('hide'); });
    wireInvite(r.id);
    /* the Frame with the room in the sequence */
    var W2 = { logic_first: ['logic', 'feeling'], feeling_first: ['feeling', 'logic'] }[r.order];
    var first = W2[0], second = W2[1];
    var cap = function (s) { return s === 'logic' ? 'Logic' : 'Feeling'; };
    var by = function (box) { return d.entries.filter(function (e) { return e.box === box; }); };
    var ownerBox = function (box, label, sub, loop) {
      var got = by(box);
      var body = got.map(entHTML).join('');
      if (box === 'decision' && !got.length) {
        /* the decision named at creation lives on the room row */
        body += '<div class="ent owner"><div class="by">' + (owner ? 'You' : 'Decision owner') + ' · Decision owner</div><div class="t19">' + r.decision_text + '</div></div>';
        if (!(owner && !sealed)) return rowHTML(loop || '', label, sub + ' · Decision owner only', body);
      }
      if (owner && !sealed) body += '<textarea class="t19" data-rbox="' + box + '" data-rloop="' + (loop || '') + '" placeholder="' + (got.length ? 'Replace what you wrote' : 'Write it here') + '"></textarea><div class="btnrow" style="margin-top:6px"><button class="btn small secondary" type="button" data-rsave="' + box + '">Save</button></div>';
      else if (!got.length) body += '<div class="ent ' + (loop || '') + ' owner locked"><div class="by">Decision owner</div><div class="t19 sec">Not yet written.</div></div>';
      return rowHTML(loop || '', label, sub + ' · Decision owner only', body);
    };
    var collabBox = function (box, loopName) {
      var got = by(box);
      var body = got.map(entHTML).join('');
      if (!sealed && mine !== 'read_only') {
        body += '<textarea class="t19" data-rentry="' + box + '" placeholder="Add your input, in your own words"></textarea><div class="btnrow" style="margin-top:6px"><button class="btn small secondary" type="button" data-raddentry="' + box + '">➕ Add input · ' + cap(loopName) + '</button></div>';
      } else if (!got.length) body += '<div class="ent"><div class="t19 sec">Waits for the room.</div></div>';
      return rowHTML(loopName, cap(loopName), 'Box ' + (box === 'box2' ? '2' : '3') + ' · collaborators', body);
    };
    var h = ownerBox('decision', 'The decision', 'Decision owner', '')
      + ownerBox('box1', cap(first), 'Box 1', first)
      + collabBox('box2', second)
      + collabBox('box3', first)
      + ownerBox('end', cap(first), 'End with ' + cap(first), first)
      + ownerBox('box4', 'Your decision', 'Box 4', '');
    /* cross-check from the last Check turn (mine only; the owner's shows to the owner) */
    var check = (d.my_turns || []).filter(function (t) { return t.event === 'check' && t.response && t.response.readiness; })[0];
    if (check) {
      var rd = check.response.readiness;
      h += '<div class="xcheck"><div class="t13 sec b" style="margin-bottom:4px">Cross-check · ' + (check.mentor === 'architect' ? 'AI Architect' : 'AI Alchemist') + '</div>' +
        '<div class="t19"><b>Rests on:</b> ' + rd.rests_on + '</div><div class="t19"><b>Missing:</b> ' + rd.missing + '</div>' +
        '<div class="t19"><b>Read:</b> <span class="chip ' + (String(rd.read).indexOf('Ready') === 0 ? 'type' : 'ex') + '" style="display:inline-block">' + rd.read + '</span></div></div>';
    }
    if (owner && !sealed) {
      h += '<div class="btnrow" style="margin-top:14px"><button class="btn primary small" type="button" id="rcheckBtn">Check my decision</button><button class="btn secondary small" type="button" id="rroundBtn">Ask the room for one more round</button></div>';
    } else if (sealed) {
      h += '<div class="t13 sec" style="margin-top:12px">This room has been checked. The decision is in every member’s log. AI mentor · can be wrong · you decide.</div>';
    }
    $('modeABody').innerHTML = h;
    /* wiring */
    document.querySelectorAll('#modeABody [data-rsave]').forEach(function (b) {
      b.addEventListener('click', function () {
        var box = b.dataset.rsave;
        var ta = document.querySelector('#modeABody [data-rbox="' + box + '"]');
        if (!ta.value.trim()) return;
        api('/rooms/' + r.id + '/boxes/' + box, { method: 'PUT', body: { text: ta.value.trim(), loop: ta.dataset.rloop || null, round: r.round } })
          .then(function (res) { if (res.__status === 200) openLiveRoom(r.id, true); else alert(res.message || ''); });
      });
    });
    document.querySelectorAll('#modeABody [data-raddentry]').forEach(function (b) {
      b.addEventListener('click', function () {
        var box = b.dataset.raddentry;
        var ta = document.querySelector('#modeABody [data-rentry="' + box + '"]');
        if (!ta.value.trim()) return;
        api('/rooms/' + r.id + '/entries', { method: 'POST', body: { box: box, text: ta.value.trim() } })
          .then(function (res) { if (res.__status === 201) openLiveRoom(r.id, true); else alert(res.message || ''); });
      });
    });
    var cb = $('rcheckBtn');
    if (cb) cb.addEventListener('click', function () {
      cb.disabled = true; cb.textContent = 'Reading the room…';
      api('/rooms/' + r.id + '/check', { method: 'POST' }).then(function (res) {
        if (res.__status !== 200) { alert(res.message || ''); cb.disabled = false; cb.textContent = 'Check my decision'; return; }
        openLiveRoom(r.id, true); patchCredits(); patchLog();
      });
    });
    var rb = $('rroundBtn');
    if (rb) rb.addEventListener('click', function () {
      api('/rooms/' + r.id + '/rounds', { method: 'POST' }).then(function () { openLiveRoom(r.id, true); });
    });
  }
  function wireInvite(roomId) {
    var panel = $('invitePanel'); if (!panel || panel.dataset.live === roomId) return;
    panel.dataset.live = roomId;
    var btn = panel.querySelector('button');
    var fresh = btn.cloneNode(true); btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', function () {
      var email = panel.querySelector('input').value.trim() || null;
      var role = /read/i.test(panel.querySelector('select').value) ? 'read_only' : 'collaborator';
      api('/rooms/' + roomId + '/invites', { method: 'POST', body: { email: email, role: role } }).then(function (res) {
        if (res.__status !== 201) { alert(res.message || ''); return; }
        var a = panel.querySelector('a');
        var url = location.origin + '/app/index.html#invite=' + res.invite.token;
        a.textContent = url; a.href = url;
        panel.querySelector('.t13.sec:last-child').insertAdjacentHTML('beforeend', ' <b>· created, copy it now</b>');
      });
    });
  }
  var origOpenScreen4 = window.openScreen4;
  window.openScreen4 = function (key) {
    if (origOpenScreen4) origOpenScreen4(key);
    LIVEROOM = null;
    api('/rooms').then(function (d) { if (d.__status === 200) paintRoomsList(d.rooms || []); });
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-liveroom]');
    if (!b) return;
    e.stopPropagation();
    openLiveRoom(b.dataset.liveroom);
  }, true);
  /* "+ New room": the blank state (BS-AI-003 §7.2), saved against the API */
  (function () {
    var nb = $('newRoom'); if (!nb) return;
    var fresh = nb.cloneNode(true); nb.parentNode.replaceChild(fresh, nb);
    fresh.addEventListener('click', function () {
      if (fresh.dataset.buy) return; /* rooms gated below Entry: the buy path handles it */
      if (window.openRoomNew) window.openRoomNew(); /* the approved blank layout */
      var body = $('modeABody');
      var tas = body.querySelectorAll('textarea');
      var btns = [].slice.call(body.querySelectorAll('.btnrow button'));
      var orderPicked = null;
      var save = function (thenInvite) {
        var text = tas[0] && tas[0].value.trim();
        if (!text) { alert('Name the decision the room is for.'); return; }
        var payload = { decision_text: text, kind: 'new' };
        if (orderPicked) payload.order = orderPicked;
        api('/rooms', { method: 'POST', body: payload }).then(function (res) {
          if (res.__status === 400 && res.error === 'order_required') {
            if (body.querySelector('[data-rorder]')) return;
            body.insertAdjacentHTML('afterbegin',
              '<div class="inp"><div class="tag"><span class="w">Begin with</span><span class="n">Mixed: choose per decision</span></div><div class="btnrow">' +
              '<button class="btn small secondary" type="button" data-rorder="logic_first">Begin with Logic · AI Architect</button>' +
              '<button class="btn small secondary" type="button" data-rorder="feeling_first">Begin with Feeling · AI Alchemist</button></div></div>');
            body.querySelectorAll('[data-rorder]').forEach(function (ob) {
              ob.addEventListener('click', function () {
                orderPicked = ob.dataset.rorder;
                body.querySelectorAll('[data-rorder]').forEach(function (x) { x.classList.toggle('primary', x === ob); });
                save(thenInvite);
              });
            });
            return;
          }
          if (res.__status !== 201) { alert(res.message || ''); return; }
          var roomId = res.room.id;
          var box1 = tas[1] && tas[1].value.trim();
          var after = function () {
            openLiveRoom(roomId);
            if (thenInvite) setTimeout(function () { $('invitePanel').classList.remove('hide'); }, 500);
          };
          if (box1) api('/rooms/' + roomId + '/boxes/box1', { method: 'PUT', body: { text: box1, loop: res.room.order === 'logic_first' ? 'logic' : 'feeling' } }).then(after);
          else after();
        });
      };
      btns.forEach(function (b) {
        var clone = b.cloneNode(true); b.parentNode.replaceChild(clone, b);
        clone.addEventListener('click', function () { save(/invite/i.test(clone.textContent)); });
      });
    });
  })();
  /* production: the preview's order screen (10) never shows; purchases go to the real
     checkout and memberships to the site's membership section */
  var origShowScreen = window.showScreen;
  window.showScreen = function (n, c) {
    if (n === 10) { location.href = 'https://go.brandscaling.co.uk/checkout-page-quiz-report'; return; }
    return origShowScreen(n, c);
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-buy]');
    if (!b) return;
    var what = b.dataset.buy;
    if (what === 'topup') return; /* credit.part opens the top-up sheet; tuGo lands on the guard above */
    e.preventDefault(); e.stopImmediatePropagation();
    location.href = what === 'entry' ? '/home/#membership' : 'https://go.brandscaling.co.uk/checkout-page-quiz-report';
  }, true);

  /* an invite (#invite=token link, or a Needs you row): the consent list, then join and open */
  function joinInvite(token) {
    var ok = confirm('Joining this room shares, for this decision only: your name, your core type or Mixed state, your loop and mentor, your progress, and your entries in Boxes 2 and 3 with the people in the room. Your report, log and other rooms are never shared. Join?');
    if (!ok) { history.replaceState(null, '', location.pathname + location.search); return; }
    api('/invites/' + token + '/accept', { method: 'POST', body: { consent: true } }).then(function (res) {
      history.replaceState(null, '', location.pathname + location.search);
      if (res.__status !== 200 && res.__status !== 201) {
        if (res.joined || res.room_id) { /* already a member */ } else { alert(res.message || 'This invitation has expired.'); return; }
      }
      if (res.needs_edna) alert('Take your free E-DNA first: your loop and mentor come from it. The room is open to you meanwhile.');
      if (window.showScreen) window.showScreen(4);
      setTimeout(function () { if (res.room_id) openLiveRoom(res.room_id); patchNeedsYou(); }, 400);
    });
  }
  (function () {
    var m = location.hash.match(/#invite=([A-Za-z0-9_-]+)/);
    if (m) joinInvite(m[1]);
  })();

  /* ---------- Home · "How you decide" and the workbooks tile, from real data ---------- */
  function patchHowYouDecide() {
    var el = $('howdecide0'); if (!el || !PROFILE) return;
    api('/log/summary').then(function (d) {
      if (d.__status !== 200) return;
      var s = d.summary || {};
      if (!s.decisions) {
        el.innerHTML = '<div class="empty"><b>Empty until your first decision.</b> This shows which loop you used, how often it held, and what your reviews found.</div>';
        return;
      }
      var L = s.began_logic || 0, F = s.began_feeling || 0, total = L + F || 1;
      var mixed = !PROFILE.type_key || PROFILE.type_key === 'mixed' || PROFILE.type_key.indexOf('leaning') >= 0;
      var domIsL = PROFILE.type_key === 'architect' || PROFILE.type_key === 'architect-leaning';
      var med = s.median_seconds ? humanInterval({ days: Math.floor(s.median_seconds / 86400), hours: Math.floor((s.median_seconds % 86400) / 3600), minutes: Math.floor((s.median_seconds % 3600) / 60) }) : '–';
      var fast = s.fastest_seconds != null ? humanInterval({ days: Math.floor(s.fastest_seconds / 86400), hours: Math.floor((s.fastest_seconds % 86400) / 3600), minutes: Math.floor((s.fastest_seconds % 3600) / 60) }) : '–';
      var ctxs = (d.switched_contexts || []).map(function (c) { return c.context; }).join(' · ') || '–';
      el.innerHTML = '<div class="hd"><div class="t13 sec">' + (mixed ? 'Decisions by the order you chose' : 'Decisions made in your Dominant loop against your non-dominant loop') + '</div>' +
        '<div class="bar2" role="img" aria-label="Logic ' + L + ', Feeling ' + F + '"><span class="L" style="width:' + (100 * L / total) + '%"></span><span class="F" style="width:' + (100 * F / total) + '%"></span></div>' +
        '<div class="key"><span><i style="background:var(--indigo)"></i>Logic ' + L + (!mixed && domIsL ? ' · Dominant' : '') + '</span><span><i style="background:var(--red)"></i>Feeling ' + F + (!mixed && !domIsL ? ' · Dominant' : '') + '</span></div>' +
        '<div class="stats"><div class="count"><div class="t13 sec">Held the loop to the end</div><div class="n">' + (s.held || 0) + ' of ' + (s.finished || 0) + '</div></div>' +
        '<div class="count"><div class="t13 sec">Where you switched</div><div class="n">' + (s.switched || 0) + '</div><div class="t13 sec">' + ctxs + '</div></div>' +
        '<div class="count"><div class="t13 sec">Reviews</div><div class="n">' + ((s.reviews_held || 0) + (s.reviews_changed || 0)) + '</div><div class="t13 sec">' + (s.reviews_held || 0) + ' held · ' + (s.reviews_changed || 0) + ' changed direction</div></div>' +
        '<div class="count"><div class="t13 sec">Time to decide</div><div class="n">' + med + '</div><div class="t13 sec">median · fastest ' + fast + '</div></div></div>' +
        '<div class="mline">Nothing here changes your E-DNA result.</div></div>';
    });
  }
  function patchWbTile() {
    var el = $('wbList0'); if (!el || !WBS || !WBS.workbooks) return;
    var st = function (w) { return w.isCompleted ? 'Completed' : w.hasInstance ? 'In progress' : 'Not started'; };
    var list = WBS.workbooks || [];
    if (!list.length) { el.innerHTML = '<div class="empty"><b>Your workbooks unlock with your Advanced Report.</b></div>'; return; }
    el.innerHTML = list.map(function (w) {
      return '<div class="wb"><div><div class="t13 sec">Workbook ' + w.workbook + '</div><div class="t19 m">' + (w.title || w.name) + '</div></div><span class="chip ' + (st(w) === 'In progress' ? 'type' : st(w) === 'Completed' ? 'ex' : 'grey') + '" style="display:inline-block">' + st(w) + '</span></div>';
    }).join('');
  }

  /* ---------- the guest's seven days (BS-AI-008 §5; BS-AI-003 §9.5) ---------- */
  function paintGuestBan() {
    var home = $('main0'); if (!home || !PROFILE) return;
    var old = $('bsGuestBan'); if (old) old.remove();
    var g = PROFILE.guest; if (!g) return;
    var el = document.createElement('div'); el.id = 'bsGuestBan'; el.className = 'gban';
    el.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:12px 14px;margin-bottom:14px;border-radius:12px;background:var(--type-light);border:1px solid var(--type)';
    el.innerHTML = g.ended
      ? '<div><div class="t13 b">Your guest access has ended</div><div class="t13 sec">Your E-DNA result, report, log and rooms stay yours to read. Keep the app with the Advanced Report or a membership.</div></div><div class="btnrow" style="margin:0"><button class="btn small primary" type="button" data-buy="report">See the options</button></div>'
      : '<div><div class="t13 b">Guest access · ' + g.days_left + (g.days_left === 1 ? ' day' : ' days') + ' left</div><div class="t13 sec">' + g.decisions_left + ' of 3 decisions left. Keep the Frame and your mentors with the Advanced Report (£99) or a membership.</div></div><div class="btnrow" style="margin:0"><button class="btn small secondary" type="button" data-buy="report">See the options</button></div>';
    var h = home.querySelector('.hdr');
    if (h) h.insertAdjacentElement('afterend', el); else home.insertBefore(el, home.firstChild);
  }

  /* re-patch after the preview's own openLaunch paints its example data */
  var origOpenLaunch = window.openLaunch;
  window.openLaunch = function (key) {
    if (origOpenLaunch) origOpenLaunch(key);
    patchCredits(); patchLog(); patchHowYouDecide(); patchWbTile(); paintGuestBan();
    if (PROFILE && PROFILE.first_name) {
      ['name', 'name0'].forEach(function (id) { if ($(id)) $(id).textContent = PROFILE.first_name; });
    }
    /* the full Frame read view of the one-step decision (BS-AI-003-R1 item 6) */
    wireFullFrame();
    /* the bell goes to Needs you (BS-AI-009 §5) */
    var bell = $('bell0');
    if (bell && !bell.dataset.bsWired) {
      bell.dataset.bsWired = '1';
      bell.addEventListener('click', function () {
        var p = $('needs0');
        if (p) p.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  };

  /* ---------- the full Frame as a read view of a real decision ----------
   * The preview switches to its designed read view (BS-AI-003-R1 item 6); we run after
   * it, in bubble phase, and fill that view with the real decision: one record, two
   * views (BS-AI-003 §5 rule of 19 Nov). Reached from the one-step frame (expand0,
   * the active decision) and from the log (o3reopen, that row's decision). The one
   * live control here, "Ask the other mentor to read it", goes to the backend like
   * every other mentor call; the prototype's claude.use path never runs in production. */
  var FF_WIRED = false;
  var FF_ID = null;    /* the decision the read view is showing */
  var FF_SIDE = 'arch';
  var FF_BUSY = false;
  function setMentor2(side) {
    FF_SIDE = side;
    if ($('m2img')) {
      $('m2img').src = side === 'arch' ? 'assets/ai_architect_approved.gif' : 'assets/ai_alchemist_approved.gif';
      $('m2img').alt = side === 'arch' ? 'AI Architect' : 'AI Alchemist';
    }
    if ($('m2name')) $('m2name').textContent = side === 'arch' ? 'AI Architect' : 'AI Alchemist';
    if ($('other2')) $('other2').textContent = 'Ask ' + (side === 'arch' ? 'AI Alchemist' : 'AI Architect') + ' to read it';
    var mp = document.querySelector('.mentorpanel'); if (mp) mp.classList.toggle('alch', side === 'alch');
  }
  function say2(role, text) {
    var th = $('thread'); if (!th) return null;
    var d = document.createElement('div'); d.className = 'msg ' + role + ' t19'; d.textContent = text;
    th.appendChild(d); th.scrollTop = th.scrollHeight; return d;
  }
  function fillFullFrame(id) {
    FF_ID = id || null;
    if (!FF_ID) return;
    api('/decisions/' + FF_ID).then(function (res) {
      if (res.__status !== 200) { FF_ID = null; return; }
      var d2 = $('d2'); if (d2) d2.value = res.decision ? res.decision.text : '';
      /* the five read-only boxes after the decision, in Frame order */
      var tas = Array.prototype.filter.call(document.querySelectorAll('textarea'), function (t) {
        return t !== d2 && t.readOnly && t.getBoundingClientRect().height > 0;
      });
      var byBox = { box1: [], box2: [], box3: [], end: [], box4: [] };
      (res.entries || []).forEach(function (en) { if (byBox[en.box]) byBox[en.box].push(en.text); });
      ['box1', 'box2', 'box3', 'end', 'box4'].forEach(function (b, i) {
        if (tas[i]) tas[i].value = byBox[b].join('\n\n');
      });
      /* the preview builds the rows from its own order switch, which defaults to Logic;
         relabel them from the decision's real order (23 Nov) */
      var first = res.decision && res.decision.order === 'feeling_first' ? 'feeling' : 'logic';
      var second = first === 'logic' ? 'feeling' : 'logic';
      var loops = { box1: first, box2: second, box3: first, end: first };
      if ($('f2order')) $('f2order').textContent = first === 'logic'
        ? 'Logic → Feeling → Logic · AI Architect' : 'Feeling → Logic → Feeling · AI Alchemist';
      document.querySelectorAll('#seq2 .srow').forEach(function (row) {
        var ta = row.querySelector('textarea'); if (!ta) return;
        var lp = loops[ta.dataset.box]; if (!lp) return;
        row.classList.remove('logic', 'feeling'); row.classList.add(lp);
        var w = row.querySelector('.tag .w'); if (w) w.textContent = lp === 'logic' ? 'Logic' : 'Feeling';
        if (ta.dataset.box === 'end') { var n = row.querySelector('.tag .n'); if (n) n.textContent = 'End with ' + (lp === 'logic' ? 'Logic' : 'Feeling'); }
      });
      setMentor2(first === 'feeling' ? 'alch' : 'arch');
    });
  }
  function wireFullFrame() {
    var ex = $('expand0'); if (!ex) return;
    ex.style.display = '';
    if (FF_WIRED) return;
    FF_WIRED = true;
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('#expand0')) { if (S.id) fillFullFrame(S.id); else FF_ID = null; return; }
      if (e.target.closest && e.target.closest('#o3reopen')) {
        var v = REVIEW_ROW;
        if (v && v.raw && v.raw.decision_id) fillFullFrame(v.raw.decision_id); else FF_ID = null;
      }
    });
    /* replace the prototype's other-mentor handler with the backend call */
    rebind('other2', function () {
      if (FF_BUSY) return;
      if (!FF_ID) { say2('mentor', 'Nothing to read yet. Make a decision first, then open the full Frame.'); return; }
      var other = FF_SIDE === 'arch' ? 'alchemist' : 'architect';
      say2('user', 'Read the same boxes from your loop.');
      var th = say2('mentor', '');
      if (th) th.innerHTML = window.thinkHTML ? window.thinkHTML('Reading your boxes') : '…';
      FF_BUSY = true;
      api('/decisions/' + FF_ID + '/mentor', { method: 'POST', body: { event: 'other_read', mentor: other } })
        .then(function (res) {
          FF_BUSY = false;
          if (res.__status !== 200) { if (th) th.textContent = res.message || 'Your mentor is not available right now.'; return; }
          setMentor2(other === 'architect' ? 'arch' : 'alch');
          if (th) th.textContent = res.response.reply || '';
          if (res.response.warning && res.response.warning.gap) say2('warn', 'Warning · ' + res.response.warning.box + ': ' + res.response.warning.gap);
        }).catch(function () { FF_BUSY = false; if (th) th.textContent = 'Your mentor is not available right now.'; });
    });
  }

  /* ---------- Screen 9 · Settings: the real minimal panel (production replaces the
     example panels wholesale; membership and payments stay with the checkout for now) */
  var origOpenScreen9 = window.openScreen9;
  window.openScreen9 = function (key) {
    if (origOpenScreen9) origOpenScreen9(key);
    var main = document.querySelector('#main9 .setgrid');
    if (!main || !PROFILE) return;
    main.innerHTML =
      '<section class="glass panel"><div class="strip" aria-hidden="true"></div><h2 class="t19 b" style="margin:0 0 6px">Profile</h2>' +
      '<div class="t13 sec" style="margin-bottom:10px">Your name appears on your room circle and your entries.</div>' +
      '<div class="lrow" style="gap:10px;flex-wrap:wrap"><input class="t19" id="st9first" type="text" placeholder="First name" value="' + (PROFILE.first_name || '') + '" style="max-width:220px">' +
      '<input class="t19" id="st9last" type="text" placeholder="Last name" value="' + (PROFILE.last_name || '') + '" style="max-width:220px">' +
      '<button class="btn small primary" type="button" id="st9save">Save profile</button><span class="t13 sec" id="st9msg"></span></div>' +
      '<div class="t13 sec" style="margin-top:10px">Account email: <b>' + (PROFILE.email || '—') + '</b></div></section>' +
      '<section class="glass panel"><div class="strip" aria-hidden="true"></div><h2 class="t19 b" style="margin:0 0 6px">Membership and credits</h2>' +
      '<div class="t19">Your decisions: <b>' + (PROFILE.credits || 0) + ' left</b></div>' +
      '<div class="t13 sec" style="margin-top:6px">1 credit = one decision taken to Check. Credits come with the E-DNA Advanced Report (£99) and memberships; receipts arrive by email from the checkout.</div>' +
      '<div class="btnrow" style="margin-top:10px"><a class="btn small secondary" href="https://go.brandscaling.co.uk/checkout-page-quiz-report">Top up</a></div></section>' +
      '<section class="glass panel"><div class="strip" aria-hidden="true"></div><h2 class="t19 b" style="margin:0 0 6px">Screen settings</h2>' +
      '<div class="t13 sec">Font, text size, spacing, motion and theme are set on the assessment and report pages and apply there.</div>' +
      '<div class="btnrow" style="margin-top:10px"><a class="btn small secondary" href="/edna/index.html">Open my E-DNA pages</a></div></section>' +
      '<section class="glass panel"><div class="strip" aria-hidden="true"></div><h2 class="t19 b" style="margin:0 0 6px">Account</h2>' +
      '<div class="t13 sec" style="margin-bottom:10px">Signing out keeps everything saved.</div>' +
      '<div class="btnrow"><button class="btn small secondary" type="button" id="st9signout">Sign out</button></div></section>';
    var sv = $('st9save');
    if (sv) sv.addEventListener('click', function () {
      api('/profile', { method: 'PUT', body: { first_name: $('st9first').value.trim(), last_name: $('st9last').value.trim() } })
        .then(function (res) {
          $('st9msg').textContent = res.__status === 200 ? 'Saved.' : (res.message || '');
          if (res.__status === 200) { PROFILE.first_name = $('st9first').value.trim(); if ($('name')) $('name').textContent = PROFILE.first_name; }
        });
    });
    var so = $('st9signout');
    if (so) so.addEventListener('click', function () {
      try {
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf('CognitoIdentityServiceProvider.') === 0) localStorage.removeItem(k); });
      } catch (e) {}
      location.href = '/';
    });
  };

  /* production guard: the review screen only opens on a real row */
  (function () {
    var wrapped = window.openScreen12;
    window.openScreen12 = function (cur) {
      if (!REVIEW_ROW) { if (window.showScreen) window.showScreen(3); return; }
      wrapped(cur);
    };
  })();

  /* ---------- the launch decision flow, against the real backend ---------- */
  var W = { logic: 'Logic', feeling: 'Feeling' };
  var LBL = {
    logic: { box1: 'Your facts', box2: 'How it feels', box3: 'What answers it', end: 'What it rests on', box4: 'Your decision' },
    feeling: { box1: 'How it feels', box2: 'The facts', box3: 'What it does to the feeling', end: 'What it rests on', box4: 'Your decision' },
  };
  var PAST = { box1: 'What you began with', box2: 'What you checked it against', box3: 'What you went back to', end: 'Where it stands now', box4: 'What you are leaning towards' };
  var STEPS = ['box1', 'box2', 'box3', 'end', 'box4'];
  var S = { id: null, first: 'logic', i: 0, entries: {}, rounds: 1, started: false, urgent: false, busy: false };

  function loopOf(step) {
    var second = S.first === 'logic' ? 'feeling' : 'logic';
    return step === 'box2' ? second : step === 'box4' ? 'dec' : S.first;
  }
  function labels(step) { return S.started ? PAST[step] : LBL[S.first][step]; }
  function strip() {
    if (!$('lstrip')) return;
    $('lstrip').innerHTML = STEPS.map(function (stp, i) {
      return '<li class="' + (i === S.i ? 'on' : i < S.i ? 'done' : '') + ' ' + loopOf(stp) + '"><span class="w">' +
        labels(stp) + '</span><span class="n">' + (loopOf(stp) === 'dec' ? '' : W[loopOf(stp)]) + '</span></li>';
    }).join('');
  }
  function showBox() {
    var stp = STEPS[S.i], lp = loopOf(stp);
    $('lbW').textContent = labels(stp); $('lbW').className = 'w ' + lp;
    $('lbN').textContent = (lp === 'dec' ? '' : W[lp] + ' · ') + 'step ' + (S.i + 1) + ' of 5';
    $('lbT').value = S.entries[stp] || '';
    $('lbT').placeholder = stp === 'box4' ? (S.started ? 'What you are leaning towards, if anything' : 'Your decision, written out') : '';
    $('lbRound').classList.toggle('hide', stp !== 'end');
    $('lbSend').textContent = stp === 'box4' ? 'Check my decision' : 'Send';
    $('lbHint').textContent = stp === 'end' ? 'Or go round again: add more ' + W[S.first === 'logic' ? 'feeling' : 'logic'] + ' and ' + W[S.first] + '.' : '';
    strip();
    paintAttach();
  }

  /* ---------- attachments (BS-AI-004 step 5): PDF, Word, text, images · 10 MB · five
     per decision; the facts extract enters the box only when the person confirms it ---------- */
  var ATTACH_OK = 'application/pdf,.pdf,.doc,.docx,.txt,.csv,image/png,image/jpeg';
  function paintAttach() {
    var lb = $('lbox'); if (!lb || !S.id) return;
    var host = $('bsAttach');
    if (!host) {
      host = document.createElement('div'); host.id = 'bsAttach'; host.style.marginTop = '8px';
      host.innerHTML = '<div id="bsAttList"></div>' +
        '<button class="btn small secondary" type="button" id="bsAttBtn">+ Attach document</button>' +
        '<span class="t13 sec" id="bsAttMsg" style="margin-left:8px"></span>' +
        '<input type="file" id="bsAttFile" accept="' + ATTACH_OK + '" style="display:none">';
      lb.appendChild(host);
      $('bsAttBtn').addEventListener('click', function () { $('bsAttFile').click(); });
      $('bsAttFile').addEventListener('change', function () {
        var f = this.files && this.files[0]; this.value = ''; if (!f || !S.id) return;
        if (f.size > 10 * 1024 * 1024) { $('bsAttMsg').textContent = 'Over 10 MB. Make it smaller and try again.'; return; }
        $('bsAttMsg').textContent = 'Reading ' + f.name + '…';
        var rd = new FileReader();
        rd.onload = function () {
          var b64 = String(rd.result).split(',')[1] || '';
          api('/decisions/' + S.id + '/attachments', {
            method: 'POST',
            body: { box: STEPS[S.i], filename: f.name, mime: f.type || 'text/plain', data: b64 },
          }).then(function (res) {
            $('bsAttMsg').textContent = res.__status === 201 ? 'Read. Confirm the extract to put it in the box.' : (res.message || 'That did not work.');
            listAttach();
          });
        };
        rd.readAsDataURL(f);
      });
      $('bsAttList').addEventListener('click', function (e) {
        var c = e.target.closest && e.target.closest('[data-att-confirm]');
        if (c) {
          api('/attachments/' + c.dataset.attConfirm + '/confirm', { method: 'POST' }).then(function () {
            $('bsAttMsg').textContent = 'In the box. Your mentor reads the extract with your own words.';
            listAttach();
          });
          return;
        }
        var x = e.target.closest && e.target.closest('[data-att-del]');
        if (x) api('/attachments/' + x.dataset.attDel, { method: 'DELETE' }).then(listAttach);
      });
    }
    listAttach();
  }
  function listAttach() {
    if (!S.id || !$('bsAttList')) return;
    api('/decisions/' + S.id + '/attachments').then(function (res) {
      if (res.__status !== 200) return;
      var rows = res.attachments || [];
      $('bsAttList').innerHTML = rows.map(function (a) {
        return '<div class="t13" style="padding:8px 10px;margin-bottom:6px;border:1px solid var(--grey-p3);border-radius:10px">' +
          '<b>' + a.filename + '</b> · ' + Math.max(1, Math.round((a.size || 0) / 1024)) + ' KB' +
          (a.confirmed_at ? ' · <span class="chip type" style="display:inline-block">In the box</span>' : '') +
          '<div class="t13 sec" style="margin:4px 0;white-space:pre-wrap">' + (a.extract || '') + '</div>' +
          (a.confirmed_at ? '' : '<div class="btnrow" style="margin:0"><button class="btn small primary" type="button" data-att-confirm="' + a.id + '">Confirm: put this in the box</button>' +
            '<button class="btn small secondary" type="button" data-att-del="' + a.id + '">Remove</button></div>') +
          '</div>';
      }).join('');
    });
  }
  function setMentor(side) {
    $('m0img').src = side === 'arch' ? 'assets/ai_architect_approved.gif' : 'assets/ai_alchemist_approved.gif';
    $('m0img').alt = $('m0name').textContent = side === 'arch' ? 'AI Architect' : 'AI Alchemist';
    $('mbubble').classList.toggle('alch', side === 'alch');
  }
  function say(t) { $('m0text').textContent = t; }
  function thinking(line) { $('m0text').innerHTML = window.thinkHTML ? window.thinkHTML(line) : (line + ' …'); }
  function showReply(r, mentorName) {
    say(r.reply || '');
    if (r.warning && r.warning.gap && (r.reply || '').indexOf(r.warning.gap) === -1) say((r.reply || '') + ' ' + r.warning.gap);
    if (r.readiness) {
      var rd = $('ready0'); rd.classList.remove('hide');
      rd.innerHTML = '<div class="t13 sec b" style="margin-bottom:4px">Readiness read · ' + mentorName + '</div>' +
        '<div class="t19"><b>Rests on:</b> ' + r.readiness.rests_on + '</div>' +
        '<div class="t19"><b>Missing:</b> ' + r.readiness.missing + '</div>' +
        '<div class="t19"><b>Read:</b> <span class="chip ' + (String(r.readiness.read).indexOf('Ready') === 0 ? 'type' : 'ex') + '" style="display:inline-block">' + r.readiness.read + '</span></div>';
    }
  }
  function doneCard(log) {
    var lc = $('log0'); lc.classList.remove('hide');
    lc.innerHTML = '<div class="t13 sec b" style="margin-bottom:4px">Written to your Decision log</div><div class="t19">' +
      (log && log.text ? log.text : '') + '</div>';
    var rv = log && log.review_date ? new Date(log.review_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    var dc = $('doneCard'); dc.classList.remove('hide');
    dc.innerHTML = '<div class="t19 b">Done. This decision is in your log.</div>' +
      '<div class="row"><div><div class="t13 sec">Review date</div><div class="t19">' + rv + ' · we will remind you</div></div>' +
      '<div><div class="t13 sec">Loop used</div><div class="t19">' + (S.first === 'logic' ? 'Logic → Feeling → Logic' : 'Feeling → Logic → Feeling') + (S.rounds > 1 ? ' · ' + S.rounds + ' rounds' : '') + '</div></div></div>' +
      '<div class="btnrow" style="margin:0"><button class="btn secondary small" type="button" data-go="3">Open in your log</button>' +
      '<button class="btn secondary small" type="button" data-go="4">Decide with others</button></div>' +
      '<div class="t13 sec" style="margin-top:8px">AI mentor · can be wrong · you decide.</div>';
    patchCredits(); patchLog();
  }
  function unavailable() {
    $('m0text').innerHTML = window.downHTML ? window.downHTML() :
      'Your mentor is not available right now. Your boxes are saved.';
  }

  function rebind(id, handler) {
    var el = $(id); if (!el) return null;
    var clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
    if (handler) clone.addEventListener('click', handler);
    return clone;
  }

  function begin() {
    var d = $('d0').value.trim(); if (!d || S.busy) return;
    S.started = $('o_started').checked; S.urgent = $('o_urgent').checked;
    S.i = 0; S.entries = {}; S.rounds = 1; S.busy = true;
    var mixed = !PROFILE.type_key || PROFILE.type_key === 'mixed';
    var pick = document.querySelector('#orderpick .order.sel');
    var order = mixed && pick ? (pick.dataset.first === 'feeling' ? 'feeling_first' : 'logic_first') : null;
    api('/decisions', {
      method: 'POST',
      body: { text: d, kind: S.started ? 'started' : 'new', urgent: S.urgent, order: order || undefined },
    }).then(function (res) {
      S.busy = false;
      if (res.__status === 400 && res.error === 'order_required') {
        /* Mixed: the two order cards, markup as the preview draws them (BS-AI-001 §2) */
        var op = $('orderpick');
        op.classList.remove('hide');
        if (!op.querySelector('.order')) {
          op.innerHTML =
            '<label class="order ind" data-first="logic"><input type="radio" name="o0"><span class="t19"><span class="b ind">Begin with Logic</span><br><span class="t13 sec">Logic → Feeling → Logic · AI Architect</span></span></label>' +
            '<label class="order red" data-first="feeling"><input type="radio" name="o0"><span class="t19"><span class="b" style="color:var(--red-d1)">Begin with Feeling</span><br><span class="t13 sec">Feeling → Logic → Feeling · AI Alchemist</span></span></label>';
        }
        /* the picker lives in the step-1 panel, which is still hidden at this point, so a
           person with no confirmed loop saw nothing happen; bring it into the question
           panel beside Start (23 Nov) */
        var sb = $('start0');
        if (sb && sb.closest('.btnrow') && !$('l0').contains(op)) sb.closest('.btnrow').insertAdjacentElement('beforebegin', op);
        if ($('mline0')) $('mline0').textContent = 'Your Dominant loop is not confirmed yet: choose the order for this decision, then press Start.';
        say('Choose the order to begin with: Logic first or Feeling first.');
        return;
      }
      if (res.__status !== 201) { say(res.message || 'Something went wrong on our side.'); return; }
      S.id = res.decision.id;
      S.first = res.decision.order === 'logic_first' ? 'logic' : 'feeling';
      $('ready0').classList.add('hide'); $('log0').classList.add('hide');
      $('done0').classList.add('hide'); $('doneCard').classList.add('hide'); $('lbox').classList.remove('hide');
      $('l0').classList.add('hide'); $('l1').classList.remove('hide'); $('l1dec').textContent = d;
      $('orderpick').classList.add('hide');
      setMentor(S.first === 'logic' ? 'arch' : 'alch'); showBox();
      mentorEvent('start', 'Decision: ' + d);
    });
  }

  function mentorEvent(event, text) {
    S.busy = true; thinking('Reading your boxes');
    api('/decisions/' + S.id + '/mentor', { method: 'POST', body: { event: event, text: text || null } })
      .then(function (res) {
        S.busy = false;
        if (res.__status === 503) return unavailable();
        if (res.__status === 402) { say(res.message); return; }
        if (res.__status !== 200) { say(res.message || 'Something went wrong on our side.'); return; }
        showReply(res.response, res.mentor === 'architect' ? 'AI Architect' : 'AI Alchemist');
      }).catch(function () { S.busy = false; unavailable(); });
  }

  function send() {
    var stp = STEPS[S.i]; var v = $('lbT').value.trim(); if (!v || S.busy) return;
    S.entries[stp] = v;
    S.busy = true;
    api('/decisions/' + S.id + '/boxes/' + stp, {
      method: 'PUT',
      body: { text: v, round: S.rounds, loop: loopOf(stp) === 'dec' ? null : loopOf(stp) },
    }).then(function (res) {
      S.busy = false;
      if (res.__status !== 200) { say(res.message || 'Something went wrong on our side.'); return; }
      if (stp === 'box4') {
        $('done0').classList.remove('hide');
        S.busy = true; thinking('Reading your boxes');
        api('/decisions/' + S.id + '/check', { method: 'POST' }).then(function (c) {
          S.busy = false;
          if (c.__status === 402) { say(c.message); return; }
          if (c.__status === 429) { say(c.message); return; }
          if (c.__status === 503) return unavailable();
          if (c.__status !== 200) { say(c.message || 'Something went wrong on our side.'); return; }
          showReply(c.response, c.mentor === 'architect' ? 'AI Architect' : 'AI Alchemist');
          if (c.log) doneCard(c.log);
        }).catch(function () { S.busy = false; unavailable(); });
        return;
      }
      S.i++; showBox();
      mentorEvent('filled_' + stp, labels(stp) + ': ' + v);
    });
  }

  function boot(attempt) {
    api('/profile').then(function (p) {
      if (p.__status !== 200) {
        /* transient (rate limit, cold start): retry a few times before giving up */
        if ((attempt || 0) < 3) setTimeout(function () { boot((attempt || 0) + 1); }, 4000);
        return;
      }
      PROFILE = p;
      var key = KEYMAP[p.type_key] || 'mixed';
      clickBar('data-type', key);
      clickBar('data-acct', p.first_open ? 'new' : 'est');
      clickBar('data-tier', p.tier || 'free'); /* rooms open from Entry (BS-AI-012 §6.3) */
      if (p.first_name) ['name', 'name0'].forEach(function (id) { if ($(id)) $(id).textContent = p.first_name; });

      /* replace the prototype's handlers with the API-backed flow */
      rebind('start0', begin);
      rebind('lbSend', send);
      $('lbT').addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); });
      rebind('lbRound', function () {
        if (!S.id || S.busy) return;
        api('/decisions/' + S.id + '/rounds', { method: 'POST' }).then(function (res) {
          if (res.__status !== 200) return;
          S.rounds = res.decision.rounds; S.i = 1; showBox();
          mentorEvent('round_again', 'Go round again.');
        });
      });
      rebind('lbSave', function () {
        if (!S.id) return;
        api('/decisions/' + S.id + '/save', { method: 'POST' }).then(function () {
          say('Saved. Your log shows it as In the Frame. Come back when you have the next step.');
          patchLog();
        });
      });
      var r0send = rebind('r0send', function () {
        var v = $('r0').value.trim(); if (!v || !S.id) return; $('r0').value = '';
        mentorEvent('replied', v);
      });
      $('r0').addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (r0send) r0send.click(); }
      });
      rebind('other0', function () {
        if (!S.id || S.busy) return;
        var other = S.first === 'logic' ? 'alchemist' : 'architect';
        setMentor(other === 'architect' ? 'arch' : 'alch');
        S.busy = true; thinking('Reading your boxes');
        api('/decisions/' + S.id + '/mentor', { method: 'POST', body: { event: 'other_read', mentor: other } })
          .then(function (res) {
            S.busy = false;
            if (res.__status !== 200) { say(res.message || ''); return; }
            showReply(res.response, other === 'architect' ? 'AI Architect' : 'AI Alchemist');
          });
      });
      rebind('new0', function () { $('l1').classList.add('hide'); $('l0').classList.remove('hide'); $('d0').value = ''; S.id = null; });
      /* Mixed order cards: picking one re-runs Start */
      var op = $('orderpick');
      if (op) op.addEventListener('click', function (e) {
        var o = e.target.closest('.order'); if (!o) return;
        op.querySelectorAll('.order').forEach(function (x) { x.classList.remove('sel'); });
        o.classList.add('sel');
      });

      patchCredits(); patchLog(); loadEdnaScreens();
    });
  }
  boot();
})();
