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
  /* ---------- one dashboard (Fariza, #edna-app huddle 24 Nov): these screens are drawn
     INSIDE the website dashboard, under Decision Intelligence (?embed=1&screen=make|log|
     rooms|reports|workbooks|edna). /app on its own redirects into the dashboard, except
     the email/invite deep links (#invite= #room= #review=), which still run here. ---------- */
  var QS = new URLSearchParams(location.search);
  var EMBED = QS.get('embed') === '1' && window.top !== window.self;
  function topGo(u) { try { (EMBED ? window.top : window).location.href = u; } catch (e) { location.href = u; } }
  /* the reports open in the dashboard's own report view when embedded ('basic' or 'detailed') */
  function openReport(which, part) {
    /* which: basic | detailed | plan; part 1-7 opens the Advanced Report at that part (24 Nov) */
    var hash = which === 'plan' ? '#plan' : which === 'detailed' ? (part ? '#detailed-' + part : '#detailed') : '';
    if (EMBED) { try { parent.postMessage({ bsGo: 'profile', report: which || 'basic', hash: hash }, location.origin); return; } catch (e) { /* fall through */ } }
    location.href = '/edna/index.html' + hash;
  }
  var sess = cognitoSession();
  var localUid = LOCAL ? QS.get('uid') : null; /* local testing only */
  if (!sess && !localUid) {
    /* an invite link opened while signed out: keep the invitation through sign-in; the
       dashboard opens Decision rooms afterwards and the join runs there */
    var pendInv = location.hash.match(/[#&]invite=([A-Za-z0-9_-]+)/);
    if (pendInv) { try { localStorage.setItem('bs_pending_invite', pendInv[1]); } catch (e) { /* storage blocked */ } }
    topGo('/?signin=1'); return;
  }
  if (!EMBED && !LOCAL) {
    var roomLink = location.hash.match(/[#&]room=([\w-]+)/);
    if (roomLink) { location.replace('/?di=rooms&room=' + roomLink[1]); return; }
    if (!/[#&](invite|review)=/.test(location.hash)) { location.replace('/?di=make'); return; }
  }
  if (EMBED) {
    document.documentElement.classList.add('bs-embed');
    var est = document.createElement('style');
    est.textContent = 'html.bs-embed,html.bs-embed body{background:#fff}' +
      '.bs-embed .frame{width:100%!important;max-width:none!important;margin:0!important;border-radius:0!important;box-shadow:none!important;min-height:0!important}' +
      '.bs-embed .app{display:block!important}' +
      '.bs-embed .side,.bs-embed .topbar,.bs-embed .tabbar,.bs-embed .navbar,.bs-embed .home-ind{display:none!important}' +
      /* Make a decision: the one-step column was sized for the app's own 1280px frame; inside
         the dashboard it spans the page like the other DI screens, aligned with the header and
         footer (Munawar, 24 Nov: a part-width card read as cut off) */
      '.bs-embed .lcol{max-width:none!important}';
    document.head.appendChild(est);
    /* links that leave the app (the E-DNA, checkout, membership) open in the whole window */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var h = a.getAttribute('href') || '';
      if (h.charAt(0) === '#' || /^javascript:/i.test(h) || a.target) return;
      a.target = '_top';
    }, true);
  }
  function headers() {
    var h = { 'Content-Type': 'application/json' };
    if (sess) h.Authorization = 'Bearer ' + sess.token;
    else h['x-user-id'] = localUid;
    return h;
  }
  /* Stale-while-revalidate for the screens' own reads (Munawar, 25 Nov): switching tabs wiped
     each list to "Loading…" and refilled it half a second later, a visible flash on every
     return. A read the member has already loaded now paints at once from the last answer
     (in the same task, before the browser draws) and is refreshed in the background; the
     callback runs again only if the answer changed. Any write empties the store, so the
     member never sees their own data from before an action they just took. */
  var READS = {};
  var SWR = /^\/(log|log\/summary|needs-you|rooms|credits|edna|notification-prefs|devices|purchases)(\?[\w=&-]*)?$/;
  function api(path, opts) {
    opts = opts || {};
    var method = opts.method || 'GET';
    if (method !== 'GET' && !opts.keep) READS = {}; /* keep: a write that changes nothing shown */
    var live = fetch(API + path, {
      method: method,
      headers: headers(),
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    }).then(function (res) {
      return res.json().then(function (j) { j.__status = res.status; return j; });
    });
    if (method !== 'GET' || opts.fresh || !SWR.test(path)) return live;
    live = live.then(function (j) { if (j.__status === 200) READS[path] = { j: j, s: JSON.stringify(j) }; return j; });
    var hit = READS[path];
    if (!hit) return live;
    return {
      then: function (cb, eb) {
        var first;
        try { first = cb ? cb(hit.j) : hit.j; } catch (e) { if (eb) eb(e); }
        live.then(function (j) { if (cb && j.__status === 200 && JSON.stringify(j) !== hit.s) cb(j); }, function () { /* offline: keep what is shown */ });
        return Promise.resolve(first);
      },
    };
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
    '#homeBanners .gban:not(.warn){display:none!important}' +
    /* real states (One more round, Not yet, Review due, Waiting on you) used the preview's amber
       .chip.ex, which production hides as the Example-data chip — so they rendered blank (24 Nov) */
    '.chip.exv{background:var(--amber-p3);color:var(--amber-d2)}' +
    /* the one-step box reuses .lbox (the loop figure's box, white text); Logic and Feeling have
       their own label colours, 'Your decision' (.w.dec) had none and showed white (24 Nov) */
    '.w.dec{color:var(--black)}' +
    /* Home's workbook rows: the status chip keeps one line and one column, whatever the
       title's length (Munawar, 25 Nov: "In progress" broke over two lines on Workbook 2) */
    '#wbList0 .wb>.chip{white-space:nowrap;flex:none}' +
    /* iPhone Safari zooms the whole page in when a field under 16px is tapped, and stays
       zoomed (Mashab, 25 Nov: mobile first, iPhone first). The Frame boxes, replies and room
       questions were 15px; on touch screens every field is at least 16px. */
    '@media (hover:none) and (pointer:coarse){input:not([type=range]):not([type=checkbox]):not([type=radio]),textarea,select{font-size:16px!important}}' +
    /* the workbook player (24 Nov): one column, so the exercises get the full width, and a
       wide table scrolls inside its own box instead of being cut off at the panel edge */
    '#wbView .grid-7-5{grid-template-columns:minmax(0,1fr)!important}' +
    '#wbView .grid-7-5>*{min-width:0}' +
    '#wbView .panel{overflow:visible;min-width:0}' +
    '.bs-wbt{overflow-x:auto;margin:10px 0;-webkit-overflow-scrolling:touch}' +
    '.bs-wbt table{width:100%;min-width:560px;table-layout:auto;margin:0}' +
    '.bs-wbt td,.bs-wbt th{vertical-align:top;white-space:normal}' +
    '.bs-wbt td input{min-width:150px;box-sizing:border-box}' +
    '#wbSections input[type="text"],#wbSections textarea{box-sizing:border-box;max-width:100%}';
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
    /* on failure, never leave the preview's example numbers or an out-of-credits claim
       on screen (Fariza saw "used your 3 decisions" offline, 24 Nov): say we could not load */
    function paint(html) {
      ['credits', 'credits0'].forEach(function (id) { var el = $(id); if (el) el.innerHTML = html; });
    }
    api('/credits').then(function (c) {
      if (c.__status !== 200) {
        paint('<div class="t13 sec">Your decisions</div><div class="t19 b">—</div><div class="t13 sec">Could not load right now. Check your connection and reload.</div>');
        return;
      }
      paint('<div class="t13 sec">Your decisions</div><div class="t19 b">' + money(c.balance) +
        ' left</div><div class="t13 sec">1 credit = one decision taken to Check</div>');
    }).catch(function () {
      paint('<div class="t13 sec">Your decisions</div><div class="t19 b">—</div><div class="t13 sec">Could not load right now. Check your connection and reload.</div>');
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
      var none = '<tr><td colspan="4" class="t13 sec">No decisions yet. Your first one appears here.</td></tr>';
      var short = rows.slice(0, 3).map(function (r) {
        return '<tr class="' + (r.written_by === 'person' ? 'by-hand' : 'by-mentor') + '"><td>' +
          new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '</td><td>' +
          r.text + '</td><td>' + statusChip(r) + '</td></tr>';
      }).join('');
      if ($('logRows0')) $('logRows0').innerHTML = rows.length ? short : none;
      var full = rows.map(function (r) {
        return '<tr class="' + (r.written_by === 'person' ? 'by-hand' : 'by-mentor') + '"><td>' +
          new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + '</td><td>' +
          r.text + '</td><td><span class="lp">' + loopArrow(r.began_loop, r.finished_loop) + '</span></td><td>' +
          statusChip(r) + '</td></tr>';
      }).join('');
      if ($('logRows')) $('logRows').innerHTML = rows.length ? full : none;
    });
    patchNeedsYou();
  }

  /* The preview paints its example data every time a screen opens (Sample Name, the
     Manchester room, the £750 day-rate rows); the real data then replaces it when the
     API answers, so for a moment members saw content that was not theirs and read it
     as someone else's (Munawar, 24 Nov). Each screen wrapper now clears the examples
     to a quiet loading state in the same paint, before anything asynchronous. */
  function clearHomeExamples() {
    ['name', 'name0'].forEach(function (id) {
      var el = $(id); if (el) el.textContent = PROFILE && PROFILE.first_name ? PROFILE.first_name : '';
    });
    if (!PROFILE) {
      document.querySelectorAll('#main0 .chip.type, #main1 .chip.type').forEach(function (c) { c.textContent = '…'; });
    }
    var hold = '<div class="empty t13 sec">Loading…</div>';
    if ($('needs0')) $('needs0').innerHTML = hold;
    if ($('howdecide0')) $('howdecide0').innerHTML = hold;
    if ($('logRows0')) $('logRows0').innerHTML = '<tr><td colspan="3" class="t13 sec">Loading…</td></tr>';
    var bell = $('bellN'); if (bell) { bell.textContent = '0'; bell.classList.add('zero'); }
    ['credits', 'credits0'].forEach(function (id) {
      var el = $(id);
      if (el) el.innerHTML = '<div class="t13 sec">Your decisions</div><div class="t19 b">…</div><div class="t13 sec">1 credit = one decision taken to Check</div>';
    });
  }

  /* ---------- Needs you + the bell (BS-AI-009 §5): live rows, cleared by the action ---------- */
  var NYKIND = { N1: 'Invitation', N2: 'Your input', N3: 'Your room', N4: 'Confirm', N6: 'Review · due', N7: 'Review · due' };
  function patchNeedsYou() {
    api('/needs-you').then(function (d) {
      if (d.__status !== 200) return;
      var items = d.items || []; var n = items.length;
      var bell = $('bellN'); if (bell) { bell.textContent = String(n); bell.classList.toggle('zero', n === 0); }
      var needN = $('needN'); if (needN) { needN.textContent = String(n); needN.classList.toggle('hide', n === 0); }
      /* the rooms badges ship as preview examples ("1"); show the real rooms-waiting count */
      var roomsN = items.filter(function (r) { return r.room_id; }).length;
      ['roomsBadge', 'roomsBadgeT'].forEach(function (id) {
        var b = $(id); if (b) { b.textContent = String(roomsN); b.classList.toggle('zero', roomsN === 0); }
      });
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
  var STCHIP = { open: ['grey', 'In the Frame'], decided: ['type', 'Decided'], review: ['exv', 'Review due'], reviewed: ['type', 'Reviewed'] };
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
    } else if (v.raw.room_id) {
      /* a room decision: its boxes and everyone's entries live in the room (24 Nov) */
      $('o3boxes').innerHTML = '<div class="t19 sec">Made in a Decision Room: the boxes and everyone’s entries are in the room.</div>';
    } else {
      $('o3boxes').innerHTML = '<div class="t19 sec">Added by hand: no boxes.</div>';
    }
    var ro = $('o3reopen');
    if (ro) {
      ro.classList.toggle('hide', !v.raw.decision_id && !v.raw.room_id);
      ro.textContent = v.raw.room_id ? 'Open the room' : 'Reopen in the Frame';
    }
    $('o3ready').innerHTML = v.read
      ? '<div class="t19"><b>Rests on:</b> ' + (v.rests || '–') + '</div><div class="t19"><b>Read:</b> <span class="chip ' + (v.read.ready === 'Ready' ? 'type' : 'exv') + '" style="display:inline-block">' + v.read.ready + '</span></div>'
      : '<div class="t19 sec">' + (v.st === 'open' ? 'Not yet checked. Reopen the Frame to finish it.' : v.raw.room_id ? 'No readiness read yet.' : 'Added by hand; no readiness read.') + '</div>';
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
  /* "Reopen in the Frame" on a decision row (24 Nov): carry on in the one-step Frame where the
     decision stopped — its boxes loaded, at the first empty box. A decided row is reopened first
     (POST /reopen; a re-check is not charged again, BS-AI-007 §3). Before, it opened the full
     Frame read view, which the dashboard then bounced to an empty Make a decision page. */
  function resumeDecision(id, wasDecided) {
    var load = function () {
      api('/decisions/' + id).then(function (res) {
        if (res.__status !== 200 || !res.decision) { bsNotice('Could not open it', res.message || 'Try again.'); return; }
        var dd = res.decision;
        S.id = dd.id; S.first = dd.order === 'logic_first' ? 'logic' : 'feeling';
        S.started = dd.kind === 'started'; S.urgent = !!dd.urgent; S.rounds = dd.rounds || 1; S.busy = false;
        S.entries = {};
        (res.entries || []).slice().sort(function (a, b) { return (a.round || 1) - (b.round || 1); })
          .forEach(function (en) { if (STEPS.indexOf(en.box) >= 0) S.entries[en.box] = en.text; });
        var next = STEPS.filter(function (b) { return !S.entries[b]; })[0];
        S.i = next ? STEPS.indexOf(next) : STEPS.length - 1;
        if (window.showScreen) window.showScreen(5, 'resume');
        setTimeout(function () {
          ['ready0', 'log0', 'done0', 'doneCard'].forEach(function (x) { if ($(x)) $(x).classList.add('hide'); });
          $('lbox').classList.remove('hide'); $('l0').classList.add('hide'); $('l1').classList.remove('hide');
          $('l1dec').textContent = dd.text;
          if ($('orderpick')) $('orderpick').classList.add('hide');
          setMentor(S.first === 'logic' ? 'arch' : 'alch'); showBox();
          mentorEvent('reopened', 'Reopened from the Decision log');
        }, 80);
      });
    };
    if (wasDecided) api('/decisions/' + id + '/reopen', { method: 'POST' }).then(load); else load();
  }
  window.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#o3reopen'); if (!b) return;
    var v = REVIEW_ROW; if (!v || !v.raw || !v.raw.decision_id || v.raw.room_id) return;
    e.preventDefault(); e.stopImmediatePropagation();
    resumeDecision(v.raw.decision_id, !!v.raw.decided_text);
  }, true);
  /* "Open the room" on a room row: to the room itself, not the preview's empty full Frame */
  window.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#o3reopen'); if (!b) return;
    var v = REVIEW_ROW; if (!v || !v.raw || !v.raw.room_id) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (window.showScreen) window.showScreen(4);
    setTimeout(function () { openLiveRoom(v.raw.room_id); }, 300);
  }, true);
  function refreshLogScreen() {
    /* two reads that may each answer twice (stored, then fresh): paint once both are in */
    var got = {};
    var both = function () {
      if (!got.mine || !got.room) return;
      LOGCACHE.mine = (got.mine.rows || []).map(toView);
      LOGCACHE.room = (got.room.rows || []).map(toView);
      paintLogScreen();
    };
    api('/log?view=mine').then(function (r) { got.mine = r; both(); });
    api('/log?view=room').then(function (r) { got.room = r; both(); });
  }
  var origOpenScreen3 = window.openScreen3;
  window.openScreen3 = function (key) {
    if (origOpenScreen3) origOpenScreen3(key);
    /* wipe the preview's example rows, counts and opened example row before the fetch */
    if ($('rows3')) $('rows3').innerHTML = '<tr><td colspan="9" class="t13 sec">Loading…</td></tr>';
    if ($('counts3')) $('counts3').innerHTML = '';
    var o3 = $('open3'); if (o3) o3.classList.add('hide');
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
  function escT(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function takePanel(sub) {
    return '<section class="glass panel"><div class="strip" aria-hidden="true"></div>' +
      '<h2 class="t19 b" style="margin:0 0 6px">Your E-DNA has not been taken yet</h2>' +
      '<div class="t13 sec" style="margin-bottom:12px">' + sub + '</div>' +
      '<a class="btn primary small" href="/edna/index.html" style="display:inline-flex">Take your E-DNA · about 25 minutes</a></section>';
  }
  /* the preview paints example results into screens 6–8; blank them the moment a screen
     opens, so nobody ever reads someone else's sample data (Mashab saw it — 24 Nov) */
  function clearEdnaScreens() {
    document.querySelectorAll('#main6 .chip.ex, #main7 .chip.ex, #main8 .chip.ex').forEach(function (c) { c.classList.add('hide'); });
    if ($('parts6')) $('parts6').innerHTML = '<div class="empty t13 sec">Loading…</div>';
    if ($('e6hist')) $('e6hist').innerHTML = '';
    if ($('e6h')) $('e6h').textContent = '…';
    if ($('e6stress')) $('e6stress').textContent = '';
    if ($('loopFig6')) $('loopFig6').innerHTML = '';
    if ($('e6meta')) $('e6meta').textContent = '';
    if ($('e6retakeNote')) $('e6retakeNote').textContent = '';
    if ($('r7parts')) $('r7parts').innerHTML = '<div class="empty t13 sec">Loading…</div>';
    if ($('r7b') && $('r7b').nextElementSibling) $('r7b').nextElementSibling.textContent = 'Seven parts, your results in words · free with the assessment';
    if ($('r7earlier')) $('r7earlier').textContent = '';
    if ($('wbCards')) $('wbCards').innerHTML = '<div class="empty t13 sec">Loading…</div>';
  }
  /* the Consent and history line shipped with the preview's sample date (3 November 2026) */
  function consentLine(text) {
    var h = $('e6c'); var row = h && h.closest('.lrow');
    var el = row && [].slice.call(row.querySelectorAll('.t13.sec')).filter(function (x) { return /consent|Part 5/i.test(x.textContent) || x.dataset.bsConsent; })[0];
    if (el) { el.dataset.bsConsent = '1'; el.textContent = text; }
  }
  function paintScreen6() {
    var e = EDNA; if (!e) return;
    if (!e.taken) consentLine('Part 5 comparison: asked during your assessment.');
    else {
      var lastD = e.assessments && e.assessments.length ? new Date(e.assessments[e.assessments.length - 1].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      consentLine(e.p5 && e.p5.consent ? 'Part 5 comparison: consent given' + (lastD ? ' ' + lastD : '') : 'Part 5 comparison: consent not given. Your adaptation levels still show in your report.');
    }
    var hb = [$('e6basic'), $('e6detail'), $('e6retake')];
    if (!e.taken) {
      hb.forEach(function (b) { if (b) b.classList.add('hide'); });
      if ($('e6h')) $('e6h').textContent = 'Not taken yet';
      /* no result, no type: the preview's "Part 1 showed you are Mixed…" line and loop figure go */
      ['e6result', 'e6stress', 'e6retakeNote'].forEach(function (id) { if ($(id)) $(id).textContent = ''; });
      if ($('loopFig6')) $('loopFig6').innerHTML = '';
      if ($('parts6')) $('parts6').innerHTML = takePanel('Your results appear here part by part once you finish. The assessment is free and your basic report comes with it.');
      if ($('e6meta')) $('e6meta').textContent = 'No assessment yet';
      return;
    }
    hb.forEach(function (b) { if (b) b.classList.remove('hide'); });
    $('e6h').textContent = e.name;
    $('e6stress').textContent = 'Part 1 stress result: ' + e.stress;
    $('loopFig6').innerHTML = e.first ? window.loopFigure(e.first, e.light)
      : window.loopFigure('logic', true) + '<div style="height:8px"></div>' + window.loopFigure('feeling', true);
    $('e6retakeNote').textContent = e.retake;
    $('e6detail').textContent = e.purchased ? 'Open your Advanced Report' : 'Get your Advanced Report · £99';
    /* these three shipped as preview chrome with no handlers (Munawar, 24 Nov) */
    var wire = function (b, fn) { if (b && !b.dataset.bsWired) { b.dataset.bsWired = '1'; b.addEventListener('click', fn); } };
    wire($('e6basic'), function () { openReport('basic'); });
    wire($('e6detail'), function () {
      if (EDNA && EDNA.purchased) openReport('detailed');
      else topGo('https://go.brandscaling.co.uk/checkout-page-quiz-report');
    });
    /* a retake opens only after Workbook 1 and 10 logged decisions; the note beside it says so.
       Until /edna has a retake entry the button explains rather than pretends */
    var rt = $('e6retake');
    if (rt) { rt.disabled = true; rt.title = e.retake || 'Retake opens after Workbook 1 and 10 logged decisions.'; rt.style.opacity = '.55'; rt.style.cursor = 'not-allowed'; }
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
      /* Open leads to My reports, where the documents live (Munawar, 24 Nov) */
      return '<tr><td>' + new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '</td><td>' + a.name + '</td><td>Basic' + (a.purchased ? ' · Advanced' : '') + '</td><td><a href="#" data-go="7">Open</a></td></tr>';
    }).join('');
    $('e6meta').textContent = 'Taken ' + new Date(e.assessments[e.assessments.length - 1].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · ' + e.assessments.length + ' assessment' + (e.assessments.length > 1 ? 's' : '');
  }
  function paintScreen7() {
    var e = EDNA; if (!e) return;
    var fmtD = function (x) { return new Date(x).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };
    var bCard = $('r7b') && $('r7b').closest('.panel');
    var bBtns = bCard ? [].slice.call(bCard.querySelectorAll('.btnrow button')) : [];
    if (!e.taken) {
      bBtns.forEach(function (b) { b.classList.add('hide'); });
      $('r7dbtn').innerHTML = '';
      $('r7dsub').textContent = 'Seven parts and what to adapt · £99 · unlocks after your assessment';
      $('r7parts').innerHTML = takePanel('Take the free assessment first; the basic report comes with it, and the Advanced Report can be added after.');
      if ($('r7earlier')) $('r7earlier').textContent = 'None yet.';
      return;
    }
    var lastA = e.assessments[e.assessments.length - 1];
    if ($('r7b') && $('r7b').nextElementSibling) $('r7b').nextElementSibling.textContent = 'Seven parts, your results in words · free with the assessment · ' + fmtD(lastA.date);
    bBtns.forEach(function (b) {
      b.classList.remove('hide');
      if (!b.dataset.bsWired) { b.dataset.bsWired = '1'; b.addEventListener('click', function () { openReport('basic'); }); }
    });
    if ($('r7earlier')) $('r7earlier').textContent = e.assessments.length > 1
      ? e.assessments.slice(0, -1).map(function (a) { return fmtD(a.date) + ' · ' + a.name; }).join(' · ')
      : 'None yet. Your first E-DNA was taken on ' + fmtD(e.assessments[0].date) + '.';
    var has = e.purchased;
    $('r7dbtn').innerHTML = has
      ? '<button class="btn primary small" type="button" id="r7open">Open</button>'
      : '<button class="btn primary small" type="button" id="r7buy">Get it · £99</button>';
    $('r7dsub').textContent = has ? 'Seven parts and what to adapt · in your account · Workbook 1 included'
      : 'Seven parts and what to adapt · £99 · includes Workbook 1 and 10 decisions';
    var rows = PARTS.map(function (p, i) { return [i + 1, HEAD[i + 1] ? p + ' (' + HEAD[i + 1] + ')' : p]; }).concat([[8, 'What to adapt, and what the app provides']]);
    $('r7parts').innerHTML = rows.map(function (rw) {
      return '<div class="rrow' + (has ? '' : ' locked') + '"' + (has ? ' data-r7open="' + rw[0] + '" style="cursor:pointer"' : '') + '><span class="t13 sec" style="width:56px;flex:none">' + (rw[0] < 8 ? 'Part ' + rw[0] : 'Plus') + '</span><span class="t19">' + rw[1] + '</span><span class="t13 b">' + (has ? 'Open ›' : '🔒') + '</span></div>';
    }).join('');
    var open = function () { openReport('detailed'); };
    var o = $('r7open'); if (o) o.addEventListener('click', open);
    var b = $('r7buy'); if (b) b.addEventListener('click', function () { topGo('https://go.brandscaling.co.uk/checkout-page-quiz-report'); });
    document.querySelectorAll('#r7parts [data-r7open]').forEach(function (rw) {
      rw.addEventListener('click', function () {
        var n = Number(rw.dataset.r7open);
        if (n === 8) openReport('plan'); else openReport('detailed', n);   /* the exact part (24 Nov) */
      });
    });
  }
  function paintScreen8() {
    if (EDNA && !EDNA.taken) {
      $('wbCards').innerHTML = takePanel('Your three workbooks are built from your result, each in the version for your Part 1 outcome.');
      $('wbList8').classList.remove('hide'); $('wbView').classList.add('hide');
      return;
    }
    if (!WBS || !WBS.workbooks) return;
    var list = (WBS.workbooks || []).map(function (w) { return { id: w.id, n: w.workbook, title: w.title || w.name, completed: !!w.isCompleted, started: !!w.hasInstance, locked: false }; })
      .concat((WBS.lockedWorkbooks || []).map(function (w) { return { n: w.workbook, title: w.title || w.name, locked: true, reason: w.reason || w.lockedReason || 'Locked' }; }));
    list.sort(function (a, b) { return (a.n || 9) - (b.n || 9); });
    if (!list.length) {
      $('wbCards').innerHTML = '<div class="empty"><b>No workbooks yet.</b> Your workbooks are built from your E-DNA; they unlock with your Advanced Report.</div>';
      return;
    }
    $('wbCards').innerHTML = list.map(function (w) {
      var status = w.locked ? 'Locked' : w.completed ? 'Completed' : w.started ? 'In progress' : 'Not started';
      return '<div class="wbcard' + (w.locked ? ' locked' : '') + '"><div class="t13 sec">Workbook ' + (w.n || '') + '</div><div class="t19 b" style="margin:2px 0 6px">' + w.title + '</div><div class="t13 sec">' + (w.locked ? w.reason : 'In your version') + '</div><div class="lrow" style="margin:12px 0 0"><span class="chip ' + (status === 'In progress' ? 'type' : 'grey') + '" style="display:inline-block">' + status + '</span>' + (w.locked ? '<span class="t13 b">🔒</span>' : '<button class="btn small ' + (status === 'In progress' ? 'primary' : 'secondary') + '" type="button" data-wb-live="' + w.id + '" data-wb-title="' + escT(w.title) + '">' + (w.completed ? 'Open' : status === 'In progress' ? 'Continue' : 'Start') + '</button>') + '</div></div>';
    }).join('');
    document.querySelectorAll('#wbCards [data-wb-live]').forEach(function (btn) {
      btn.addEventListener('click', function () { openLiveWb(btn.dataset.wbLive, btn.dataset.wbTitle || ''); });
    });
    $('wbList8').classList.remove('hide'); $('wbView').classList.add('hide');
  }

  /* ---------- the workbook player (24 Nov): the preview's Continue pointed at the retired
     dashboard; this renders the person's real workbook from GET /api/user/workbooks/:id/instance
     and autosaves answers, iOS-compatible (checkboxes comma-joined; a table = one JSON matrix) */
  var WB_INST = null; var WB_TABLES = {}; var WB_SAVET = {};
  function wbApiBase() { return (window.DI_API_BASE || (LOCAL ? 'http://127.0.0.1:8010' : 'https://qpbpbpiegm.us-east-1.awsapprunner.com')) + '/api/user/workbooks'; }
  function wbHeaders() { var h = headers(); h['Content-Type'] = 'application/json'; return h; }
  function runsHTML(runs, fallback) {
    if (!runs || !runs.length) return escT(fallback || '');
    return runs.map(function (r) {
      var t = escT(r.text);
      if (r.marks && r.marks.indexOf('bold') >= 0) t = '<b>' + t + '</b>';
      if (r.marks && r.marks.indexOf('italic') >= 0) t = '<i>' + t + '</i>';
      return t;
    }).join('');
  }
  function wbSave(fieldKey, value) {
    clearTimeout(WB_SAVET[fieldKey]);
    WB_SAVET[fieldKey] = setTimeout(function () {
      fetch(wbApiBase() + '/instances/' + WB_INST + '/answers', {
        method: 'POST', headers: wbHeaders(), body: JSON.stringify({ fieldKey: fieldKey, value: value }),
      }).then(function (r) {
        var n = $('wbSavedNote'); if (!n) return;
        n.textContent = r.ok ? 'Saved' : 'Not saved — try again';
        if (r.ok) setTimeout(function () { if (n.textContent === 'Saved') n.textContent = ''; }, 1500);
      }).catch(function () { var n = $('wbSavedNote'); if (n) n.textContent = 'Not saved — check your connection'; });
    }, 600);
  }
  function wbBlock(b, answers, si, bi) {
    var t = b.type;
    if (t === 'heading_1') return '<h2 class="t19 b" style="margin:18px 0 6px">' + runsHTML(b.runs, b.text) + '</h2>';
    if (t === 'heading_2') return '<div class="t19 b" style="margin:14px 0 4px">' + runsHTML(b.runs, b.text) + '</div>';
    if (t === 'body') return '<div class="t13" style="margin:6px 0">' + runsHTML(b.runs, b.text) + '</div>';
    if (t === 'list') return '<ul class="t13" style="margin:6px 0 6px 18px">' + (b.items || []).map(function (it) { return '<li style="margin:4px 0">' + runsHTML(it.runs, it.text) + '</li>'; }).join('') + '</ul>';
    if (t === 'callout') return '<div class="t13" style="margin:10px 0;padding:10px 12px;border-left:3px solid var(--grey-p3,#c9c2d4);background:rgba(0,0,0,.035);border-radius:8px">' + runsHTML(b.runs, b.text) + '</div>';
    if (t === 'question') {
      var k = b.fieldKey || ('q-' + si + '-' + bi);
      var v = answers[k] != null ? String(answers[k]) : '';
      var q = '<div class="t13 b" style="margin:12px 0 4px">' + runsHTML(b.questionRuns, b.questionText) + '</div>';
      if (b.questionType === 'long-text') return q + '<textarea class="t19" data-wbf="' + escT(k) + '" style="width:100%;min-height:90px">' + escT(v) + '</textarea>';
      if (b.questionType === 'checkboxes' || b.questionType === 'single-choice') {
        var radio = b.questionType === 'single-choice';
        var chosen = v ? v.split(',') : [];
        return q + (b.options || []).map(function (op) {
          var on = radio ? v === op : chosen.indexOf(op) >= 0;
          return '<label class="t13" style="display:flex;gap:8px;align-items:flex-start;margin:4px 0"><input type="' + (radio ? 'radio' : 'checkbox') + '" name="' + escT(k) + '" data-wbq="' + escT(k) + '" data-wbqt="' + b.questionType + '" value="' + escT(op) + '"' + (on ? ' checked' : '') + '><span>' + escT(op) + '</span></label>';
        }).join('');
      }
      return q + '<input class="t19" type="text" data-wbf="' + escT(k) + '" value="' + escT(v) + '" style="width:100%">';
    }
    if (t === 'table') {
      var cfg = b.tableConfig || {}; var rows = cfg.rows || [];
      var inputs = cfg.columnInputs || null; var tk = b.fieldKey;
      var saved = null;
      if (inputs && tk) {
        WB_TABLES[tk] = { rows: rows, inputs: inputs };
        if (answers[tk]) { try { saved = JSON.parse(answers[tk]); } catch (e2) { saved = null; } }
      }
      var head = (cfg.headers || []).map(function (hc) { return '<th>' + runsHTML(hc.runs, hc.text) + '</th>'; }).join('');
      var body = rows.map(function (row, ri) {
        return '<tr>' + row.map(function (cell, ci) {
          var ed = inputs && inputs[String(ci)];
          if (ed && tk) {
            var val = (saved && saved[ri] && saved[ri][ci] != null) ? saved[ri][ci] : (cell.text || '');
            return '<td><input class="t13" type="text" data-wbt="' + escT(tk) + '" data-r="' + ri + '" data-c="' + ci + '" value="' + escT(val) + '" placeholder="' + escT(ed.placeholder || '') + '" style="width:100%"></td>';
          }
          return '<td class="t13">' + runsHTML(cell.runs, cell.text) + '</td>';
        }).join('') + '</tr>';
      }).join('');
      return '<div class="bs-wbt"><table class="logtable t13">' + (head ? '<thead><tr>' + head + '</tr></thead>' : '') + '<tbody>' + body + '</tbody></table></div>';
    }
    return b.text ? '<div class="t13" style="margin:6px 0">' + escT(b.text) + '</div>' : '';
  }
  function wbTableMatrix(tk) {
    var t = WB_TABLES[tk]; if (!t) return null;
    var root = $('wbSections');
    return t.rows.map(function (row, ri) {
      return row.map(function (cell, ci) {
        var inp = root.querySelector('[data-wbt="' + tk + '"][data-r="' + ri + '"][data-c="' + ci + '"]');
        return inp ? inp.value : (cell.text || '');
      });
    });
  }
  function wireWbInputs() {
    var root = $('wbSections'); if (!root || root.dataset.bsWired) return;
    root.dataset.bsWired = '1';
    root.addEventListener('input', function (e) {
      var el = e.target; if (!el.dataset) return;
      if (el.dataset.wbf) { wbSave(el.dataset.wbf, el.value); return; }
      if (el.dataset.wbt) { var m = wbTableMatrix(el.dataset.wbt); if (m) wbSave(el.dataset.wbt, JSON.stringify(m)); }
    });
    root.addEventListener('change', function (e) {
      var el = e.target; if (!el.dataset || !el.dataset.wbq) return;
      var k = el.dataset.wbq;
      if (el.dataset.wbqt === 'single-choice') { wbSave(k, el.value); return; }
      var vals = [].slice.call(root.querySelectorAll('[data-wbq="' + k.replace(/"/g, '\\"') + '"]:checked')).map(function (x) { return x.value; }).sort();
      wbSave(k, vals.join(','));
    });
  }
  function openLiveWb(wbId, title) {
    $('wbList8').classList.add('hide'); $('wbView').classList.remove('hide');
    $('wbTitle').textContent = title || 'Workbook';
    $('wbSections').innerHTML = '<div class="empty t13 sec">Loading your workbook…</div>';
    WB_TABLES = {};
    fetch(wbApiBase() + '/' + wbId + '/instance', { headers: headers() })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.success) { $('wbSections').innerHTML = '<div class="empty t13">' + escT((d && d.error) || 'Could not open this workbook.') + '</div>'; return; }
        WB_INST = d.instance.id;
        var st = d.workbook.structure;
        if (typeof st === 'string') { try { st = JSON.parse(st); } catch (e) { st = null; } }
        var answers = d.answers || {};
        $('wbTitle').textContent = d.workbook.title || title;
        if ($('wbPart')) $('wbPart').textContent = 'Your workbook · answers save as you type';
        if ($('wbStatus')) $('wbStatus').textContent = d.instance.isCompleted ? 'Completed' : (d.answerCount ? 'In progress' : 'Started');
        var h = (st && st.sections ? st.sections : []).map(function (sec, si) {
          return '<div style="margin:0 0 10px">' + (sec.content || []).map(function (b, bi) { return wbBlock(b, answers, si, bi); }).join('') + '</div>';
        }).join('');
        h += '<div class="btnrow" style="margin-top:16px"><button class="btn small ' + (d.instance.isCompleted ? 'secondary' : 'primary') + '" type="button" id="wbComplete">' + (d.instance.isCompleted ? 'Completed ✓' : 'Mark this workbook complete') + '</button><span class="t13 sec" id="wbSavedNote" style="margin-left:8px"></span></div>';
        $('wbSections').innerHTML = h;
        wireWbInputs();
        api('/log/summary').then(function (s2) {
          if (s2.__status !== 200 || !$('wbCounts')) return;
          var sm = s2.summary || {};
          $('wbCounts').innerHTML = '<div class="count"><div class="t13 sec">Decisions logged</div><div class="n">' + (sm.decisions || 0) + '</div></div><div class="count"><div class="t13 sec">Loop held</div><div class="n">' + (sm.held || 0) + '</div></div>';
        });
        var ck = Object.keys(answers).filter(function (x) { return /commit/i.test(x); })[0];
        if ($('wbCommit')) $('wbCommit').textContent = ck && answers[ck] ? String(answers[ck]) : '—';
        var mc = $('wbComplete');
        if (mc) mc.addEventListener('click', function () {
          if (mc.textContent.indexOf('Completed') === 0) return;
          fetch(wbApiBase() + '/instances/' + WB_INST + '/complete', { method: 'POST', headers: wbHeaders() })
            .then(function (r) {
              if (!r.ok) return;
              mc.textContent = 'Completed ✓'; mc.className = 'btn small secondary';
              if ($('wbStatus')) $('wbStatus').textContent = 'Completed';
              WBS = null; loadEdnaScreens(); /* Workbook 3 may unlock */
            });
        });
        document.getElementById('frame').scrollTop = 0;
      }).catch(function () { $('wbSections').innerHTML = '<div class="empty t13">Could not open this workbook. Try again.</div>'; });
  }
  function repaintCurrent() {
    var cur = window.BS_SCREEN;
    if (cur === 1) paintEdnaCard();
    if (cur === 9 && window.openScreen9) window.openScreen9(); /* Part 5 consent comes from /edna */
    if (cur === 6) paintScreen6();
    if (cur === 7) paintScreen7();
    if (cur === 8) paintScreen8();
  }
  function loadEdnaScreens() {
    api('/edna').then(function (e) {
      if (e.__status !== 200) return;
      EDNA = e;
      if (!e.taken) {
        /* no result yet: the type chips must not claim one */
        notTakenChips();
      }
      repaintCurrent();
    });
    fetch((window.DI_API_BASE || (LOCAL ? 'http://127.0.0.1:8010' : 'https://qpbpbpiegm.us-east-1.awsapprunner.com')) + '/api/user/workbooks', { headers: headers() })
      .then(function (r) { return r.json(); }).then(function (w) { WBS = w; patchWbTile(); repaintCurrent(); }).catch(function () {});
  }
  ['openScreen6', 'openScreen7', 'openScreen8'].forEach(function (fn) {
    var orig = window[fn];
    window[fn] = function (key) {
      if (orig) orig(key);
      clearEdnaScreens(); /* never show the preview's sample results */
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
    var map = { open: ['grey', 'In the Frame'], waiting_owner: ['exv', 'Waiting on you'], waiting_room: ['grey', 'Waiting on the room'], ready: ['type', 'Ready'], decided: ['type', 'Decided'], reviewed: ['type', 'Reviewed'], closed: ['grey', 'Closed'] };
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
        '<div class="t19"><b>Read:</b> <span class="chip ' + (String(rd.read).indexOf('Ready') === 0 ? 'type' : 'exv') + '" style="display:inline-block">' + rd.read + '</span></div></div>';
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
          .then(function (res) { if (res.__status === 200) openLiveRoom(r.id, true); else bsNotice('Not saved', res.message || 'Try again.'); });
      });
    });
    document.querySelectorAll('#modeABody [data-raddentry]').forEach(function (b) {
      b.addEventListener('click', function () {
        var box = b.dataset.raddentry;
        var ta = document.querySelector('#modeABody [data-rentry="' + box + '"]');
        if (!ta.value.trim()) return;
        api('/rooms/' + r.id + '/entries', { method: 'POST', body: { box: box, text: ta.value.trim() } })
          .then(function (res) { if (res.__status === 201) openLiveRoom(r.id, true); else bsNotice('Not added', res.message || 'Try again.'); });
      });
    });
    var cb = $('rcheckBtn');
    if (cb) cb.addEventListener('click', function () {
      cb.disabled = true; cb.textContent = 'Reading the room…';
      api('/rooms/' + r.id + '/check', { method: 'POST' }).then(function (res) {
        if (res.__status !== 200) { bsNotice('Check did not run', res.message || 'Try again.'); cb.disabled = false; cb.textContent = 'Check my decision'; return; }
        openLiveRoom(r.id, true); patchCredits(); patchLog();
      });
    });
    var rb = $('rroundBtn');
    if (rb) rb.addEventListener('click', function () {
      api('/rooms/' + r.id + '/rounds', { method: 'POST' }).then(function () { openLiveRoom(r.id, true); });
    });
  }
  /* ---------- the invitation panel (24 Nov, second pass): it never shows the preview's
     example address; in a room not yet saved it saves the room first, then invites ---------- */
  var INV_ROOM = null;       /* the saved room the panel invites to; null while unsaved */
  var INV_SAVING = false;    /* the panel itself is saving a new room: keep what was typed */
  var NEWROOM_SAVE = null;   /* save(thenInvite, cb) of the new room on screen */
  function invSaid(msg) {
    var panel = $('invitePanel'); if (!panel) return;
    var old = panel.querySelector('.invok'); if (old) old.remove();
    panel.insertAdjacentHTML('beforeend', '<div class="invok t13" style="margin-top:8px"><b>' + msg + '</b></div>');
  }
  function nameFirst() {
    var ta = document.querySelector('#modeABody textarea');
    invSaid('Name the decision first, in the box below — then the invitation is created.');
    if (!ta) return;
    ta.focus();
    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ta.style.outline = '2px solid var(--type, #B8202E)';
    setTimeout(function () { ta.style.outline = ''; }, 2500);
  }
  function resetInvitePanel(panel) {
    var a = panel.querySelector('a');
    var line = a && a.parentNode;
    if (line) line.innerHTML = 'Or share a link: <a href="#">Create invite link</a> · expires in 7 days';
    var inp = panel.querySelector('input'); if (inp) inp.value = '';
    var note = panel.querySelector('.invok'); if (note) note.remove();
  }
  function wireInvite(roomId) {
    var panel = $('invitePanel'); if (!panel) return;
    var key = roomId || 'new';
    if (panel.dataset.live !== key) {
      var keep = INV_SAVING && panel.dataset.live === 'new' && roomId; /* the panel's own save */
      panel.dataset.live = key;
      if (!keep) resetInvitePanel(panel);
    }
    INV_ROOM = roomId || null;
    if (panel.dataset.wired) return;
    panel.dataset.wired = '1';
    var role = function () { return /read/i.test(panel.querySelector('select').value) ? 'read_only' : 'collaborator'; };
    var ensureRoom = function (cb) {
      if (INV_ROOM) { cb(INV_ROOM); return; }
      if (!NEWROOM_SAVE) { invSaid('Open a room first.'); return; }
      INV_SAVING = true;
      var ok = NEWROOM_SAVE(true, function (id) { INV_ROOM = id; cb(id); setTimeout(function () { INV_SAVING = false; }, 3000); });
      if (ok === false) INV_SAVING = false;
    };
    var makeInvite = function (email, done) {
      ensureRoom(function (id) {
        api('/rooms/' + id + '/invites', { method: 'POST', body: { email: email, role: role() } }).then(function (res) {
          if (res.__status !== 201) { invSaid(res.message || 'Could not create the invitation. Try again.'); return; }
          var a = panel.querySelector('a');
          var url = location.origin + '/?invite=' + res.invite.token; /* the dashboard's invite route (24 Nov) */
          a.textContent = url; a.href = url; a.dataset.real = '1';
          done(url);
        });
      });
    };
    var btn = panel.querySelector('button');
    var fresh = btn.cloneNode(true); btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', function () {
      var email = panel.querySelector('input').value.trim();
      if (!email || email.indexOf('@') < 0) { invSaid('Enter a full email address, or create a link below.'); return; }
      makeInvite(email, function () {
        invSaid('Invitation created for ' + email + '. Send them the link above — it opens this room after they agree to share.');
      });
    });
    /* the link: the first click creates a real invite and copies it, later clicks copy it again */
    panel.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a'); if (!a) return;
      e.preventDefault();
      var copy = function (url) {
        var p = navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject();
        p.then(function () { invSaid('Link copied. Send it to the person you are inviting; it expires in 7 days.'); },
               function () { invSaid('Copy the link above and send it; it expires in 7 days.'); });
      };
      if (a.dataset.real) { copy(a.href); return; }
      makeInvite(null, copy);
    });
  }
  var origOpenScreen4 = window.openScreen4;
  window.openScreen4 = function (key) {
    if (origOpenScreen4) origOpenScreen4(key);
    LIVEROOM = null;
    if ($('rooms')) $('rooms').innerHTML = '<div class="empty t13 sec">Loading…</div>'; /* not the preview's example rooms */
    api('/rooms').then(function (d) { if (d.__status === 200) paintRoomsList(d.rooms || []); });
    paintWaiting();
  };
  /* "Waiting for you" (24 Nov): room invitations and rooms waiting on the person. They lived
     in Home's Needs you, which the dashboard does not show, so they sit atop Decision rooms. */
  function paintWaiting() {
    var list = $('rooms'); if (!list) return;
    var host = $('bsWaiting');
    if (!host) { list.insertAdjacentHTML('beforebegin', '<div id="bsWaiting"></div>'); host = $('bsWaiting'); }
    api('/needs-you').then(function (d) {
      if (d.__status !== 200) return;
      var items = (d.items || []).filter(function (r) { return (r.event === 'N1' && r.invite_token) || r.room_id; });
      if (!items.length) { host.innerHTML = ''; return; }
      host.innerHTML = '<div class="t13 sec b" style="margin:0 0 6px">Waiting for you</div>' + items.map(function (r, i) {
        return '<div class="need" style="margin-bottom:8px"><div><span class="t13 k">' + escT(NYKIND[r.event] || r.event) + '</span> <span class="t19">' + escT(r.title) +
          '</span><div class="t13 sec">' + escT(r.line || '') + '</div></div>' +
          '<button class="btn small primary" type="button" data-wt="' + i + '">' + escT(r.action || (r.invite_token ? 'Join' : 'Open')) + '</button></div>';
      }).join('');
      host.onclick = function (e) {
        var b = e.target.closest && e.target.closest('[data-wt]'); if (!b) return;
        var r = items[parseInt(b.dataset.wt, 10)]; if (!r) return;
        if (r.event === 'N1' && r.invite_token) { joinInvite(r.invite_token); return; }
        if (r.room_id) openLiveRoom(r.room_id);
      };
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-liveroom]');
    if (!b) return;
    e.stopPropagation();
    openLiveRoom(b.dataset.liveroom);
  }, true);
  /* "+ New room": the blank state (BS-AI-003 §7.2), saved against the API. Wired on EVERY
     way a new room opens (the + New room button, Home's "Invite someone to a decision",
     Start a decision room), and again when the kind changes, since that redraws the boxes. */
  function ownerCircle() {
    var pc = document.querySelector('#people .pcircle:not(.plus)');
    if (!pc || !PROFILE) return;
    var ini = (((PROFILE.first_name || ' ')[0] || '') + ((PROFILE.last_name || ' ')[0] || '')).trim().toUpperCase() || '—';
    pc.innerHTML = PROFILE.photo_url ? '<img src="' + PROFILE.photo_url + '" alt="">' : ini;
    var tip = pc.parentNode && pc.parentNode.querySelector('.ptip');
    if (tip) tip.innerHTML = '<div class="nm">' + escT(((PROFILE.first_name || '') + ' ' + (PROFILE.last_name || '')).trim() || 'You') + ' <span class="t13 sec" style="font-weight:500">· Decision owner</span></div>';
  }
  var origOpenRoomNew = window.openRoomNew;
  window.openRoomNew = function () {
    if (origOpenRoomNew) origOpenRoomNew(); /* the approved blank layout */
    LIVEROOM = null;
    wireInvite(null);
    ownerCircle();
    wireNewRoom();
  };
  document.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'rkind' && !LIVEROOM) setTimeout(wireNewRoom, 0);
  });
  (function () {
    var nb = $('newRoom'); if (!nb) return;
    var fresh = nb.cloneNode(true); nb.parentNode.replaceChild(fresh, nb);
    fresh.addEventListener('click', function () {
      if (fresh.dataset.buy) return; /* rooms gated below Entry: the buy path handles it */
      window.openRoomNew();
    });
  })();
  function wireNewRoom() {
    (function () {
      var body = $('modeABody'); if (!body) return;
      var tas = body.querySelectorAll('textarea');
      var btns = [].slice.call(body.querySelectorAll('.btnrow button'));
      var orderPicked = null;
      var save = function (thenInvite, cb) {
        var text = tas[0] && tas[0].value.trim();
        if (!text) { nameFirst(); return false; }
        var kindSel = document.querySelector('input[name="rkind"]:checked');
        var payload = { decision_text: text, kind: (kindSel && kindSel.value) || 'new' };
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
                save(thenInvite, cb);
              });
            });
            invSaid('Choose the order to begin with (top of the Frame below), then the room is saved.');
            return;
          }
          if (res.__status !== 201) { invSaid(res.message || 'Could not save the room. Try again.'); return; }
          var roomId = res.room.id;
          var box1 = tas[1] && tas[1].value.trim();
          var after = function () {
            openLiveRoom(roomId);
            if (thenInvite) setTimeout(function () { $('invitePanel').classList.remove('hide'); }, 500);
            if (cb) cb(roomId);
          };
          if (box1) api('/rooms/' + roomId + '/boxes/box1', { method: 'PUT', body: { text: box1, loop: res.room.order === 'logic_first' ? 'logic' : 'feeling' } }).then(after);
          else after();
        });
        return true;
      };
      NEWROOM_SAVE = save;
      btns.forEach(function (b) {
        var clone = b.cloneNode(true); b.parentNode.replaceChild(clone, b);
        clone.addEventListener('click', function () { save(/invite/i.test(clone.textContent)); });
      });
    })();
  }
  /* production: the preview's order screen (10) never shows; purchases go to the real
     checkout and memberships to the site's membership section */
  var origShowScreen = window.showScreen;
  window.showScreen = function (n, c) {
    if (n === 10) { topGo('https://go.brandscaling.co.uk/checkout-page-quiz-report'); return; }
    return origShowScreen(n, c);
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-buy]');
    if (!b) return;
    var what = b.dataset.buy;
    if (what === 'topup') return; /* credit.part opens the top-up sheet; tuGo lands on the guard above */
    e.preventDefault(); e.stopImmediatePropagation();
    topGo(what === 'entry' ? '/home/#membership' : 'https://go.brandscaling.co.uk/checkout-page-quiz-report');
  }, true);
  /* The rooms gate (Rooms open with Entry · Join / Invite with Entry / Decide with others):
     the preview's own capture handler routes these to its checkout screen before the handler
     above can run, and every checkout-screen call lands on the report checkout — the wrong
     product for a membership gate. A window-capture listener runs first (23 Nov). */
  window.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#newRoom, #r4invite, #ctaRoom');
    if (!b || !b.dataset || b.dataset.buy !== 'entry') return;
    e.preventDefault(); e.stopPropagation();
    topGo('/home/#membership');
  }, true);
  /* Invite · up to 6: opens the invitation panel. In a room not yet saved, the panel's
     Send invitation / Create invite link save it first; with no decision named yet it says
     so in the panel and points at the box (no pop-up). */
  window.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#r4invite');
    if (!b) return;
    if (b.dataset && b.dataset.buy === 'entry') return; /* the gate above owns that case */
    e.preventDefault(); e.stopPropagation();
    var panel = $('invitePanel');
    panel.classList.remove('hide');
    if (!LIVEROOM) {
      var ta = document.querySelector('#modeABody textarea');
      if (ta && !ta.value.trim()) { nameFirst(); return; }
      invSaid('Type their email and press Send invitation, or create a link — the room is saved first.');
    }
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, true);

  /* an invite (#invite=token link, or a Needs you row): the consent list, then join and open */
  /* ---------- branded dialogs (24 Nov): the browser's own confirm()/alert() boxes are replaced
     by a white card in the brand register — flat fills, no gradient, no glass ---------- */
  function bsModalStyles() {
    if ($('bsModalCss')) return;
    var cs = document.createElement('style'); cs.id = 'bsModalCss';
    cs.textContent =
      '.bsm-ov{position:fixed;inset:0;background:rgba(11,11,11,.45);z-index:2000;display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.bsm{background:#FFFFFF;border-radius:16px;box-shadow:0 20px 60px rgba(11,11,11,.22);width:100%;max-width:560px;max-height:90vh;overflow:auto;padding:28px;font-family:inherit;color:var(--black,#0B0B0B)}' +
      '.bsm h2{font-size:24px;line-height:1.25;margin:4px 0 8px;font-weight:700;color:var(--type-text,var(--black,#0B0B0B))}' +
      '.bsm .k{font-size:13px;color:#5C5C5C}.bsm p{margin:0 0 10px;font-size:15px;line-height:1.5}.bsm .s{font-size:13px;color:#5C5C5C}' +
      '.bsm ul{margin:0 0 10px 18px;padding:0;font-size:14px;line-height:1.6}' +
      '.bsm .agree{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid #DADADA;border-radius:10px;font-size:14px;cursor:pointer;margin-top:4px}' +
      '.bsm .agree input{width:20px;height:20px;flex:none;margin:1px 0 0;accent-color:var(--type,#3D1A78)}' +
      '.bsm .agree.need{border-color:#B8202E;box-shadow:0 0 0 2px rgba(184,32,46,.15)}' +
      '.bsm .btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}' +
      '.bsm .bp,.bsm .bs{font-family:inherit;font-weight:600;font-size:15px;line-height:1;padding:13px 20px;border-radius:10px;cursor:pointer}' +
      '.bsm .bp{background:var(--type,#3D1A78);color:#FFFFFF;border:2px solid var(--type,#3D1A78)}' +
      '.bsm .bs{background:#FFFFFF;color:var(--type,#3D1A78);border:2px solid var(--type,#3D1A78)}' +
      '@media (max-width:520px){.bsm{padding:20px}.bsm .btns{flex-direction:column}.bsm .bp,.bsm .bs{width:100%}}';
    document.head.appendChild(cs);
  }
  function bsModal(html, wire) {
    bsModalStyles();
    var ov = document.createElement('div'); ov.className = 'bsm-ov';
    ov.innerHTML = '<div class="bsm" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(ov);
    var close = function () { if (ov.parentNode) ov.parentNode.removeChild(ov); };
    wire(ov, close);
    var first = ov.querySelector('input, button'); if (first) first.focus();
  }
  function bsNotice(title, text) {
    return new Promise(function (resolve) {
      bsModal('<h2>' + escT(title) + '</h2><p>' + escT(text) + '</p><div class="btns"><button type="button" class="bp" data-ok>OK</button></div>',
        function (ov, close) { ov.querySelector('[data-ok]').addEventListener('click', function () { close(); resolve(); }); });
    });
  }
  /* the approved "Join Dan's room?" consent card (screen 12, BS-AI-008 §5), with the real room */
  function bsConsent(info) {
    var who = escT(info.owner_name || 'The owner');
    return new Promise(function (resolve) {
      bsModal(
        '<div class="k">Decision Room · joining</div>' +
        '<h2>Join ' + who + '’s room?</h2>' +
        '<p>“' + escT(info.decision_text) + '” · ' + who + ', owner · ' + (info.people || 1) + ' ' + ((info.people || 1) === 1 ? 'person' : 'people') + ' in the room</p>' +
        '<p class="s">Joining shares the following with the people in this room, for this decision only:</p>' +
        '<ul><li>your <b>name</b> and your photo or initials</li><li>your <b>core type or Mixed state</b></li><li>your <b>loop and your mentor</b></li>' +
        '<li>your <b>progress</b> in the room</li><li>your <b>entries</b> in Box 2 and Box 3, with your name on each</li></ul>' +
        '<p class="s">Not shared: your report, your workbook answers, your Decision log, anything from another room. If you leave, your entries stay in the room with your name, because the sequence must still read; you can ask ' + who + ' to delete them. Your consent is recorded for this room only.</p>' +
        '<label class="agree"><input type="checkbox" data-agree><span>I agree to share these with the people in this room, for this decision only.</span></label>' +
        '<div class="btns"><button type="button" class="bp" data-join>Join the room</button><button type="button" class="bs" data-not>Not now</button></div>',
        function (ov, close) {
          var box = ov.querySelector('[data-agree]'); var lab = ov.querySelector('.agree');
          box.addEventListener('change', function () { lab.classList.remove('need'); });
          ov.querySelector('[data-join]').addEventListener('click', function () {
            if (!box.checked) { lab.classList.add('need'); return; }
            close(); resolve(true);
          });
          ov.querySelector('[data-not]').addEventListener('click', function () { close(); resolve(false); });
        });
    });
  }
  function joinInvite(token) {
    var clearHash = function () { history.replaceState(null, '', location.pathname + location.search); };
    api('/invites/' + token).then(function (info) {
      if (info.__status !== 200) { clearHash(); bsNotice('Invitation not found', info.message || 'Ask the person who invited you for a new link.'); return; }
      if (info.already_member && info.room_id) { clearHash(); if (window.showScreen) window.showScreen(4); setTimeout(function () { openLiveRoom(info.room_id); }, 400); return; }
      if (info.expired) { clearHash(); bsNotice('This invitation has expired', 'Ask ' + (info.owner_name || 'the person who invited you') + ' for a new one.'); return; }
      bsConsent(info).then(function (ok) {
        if (!ok) { clearHash(); return; }
        acceptInvite(token, clearHash);
      });
    });
  }
  function acceptInvite(token, clearHash) {
    api('/invites/' + token + '/accept', { method: 'POST', body: { consent: true } }).then(function (res) {
      clearHash();
      if (res.__status !== 200 && res.__status !== 201) {
        if (res.joined || res.room_id) { /* already a member */ } else { bsNotice('Could not join', res.message || 'This invitation has expired.'); return; }
      }
      if (res.needs_edna) bsNotice('Take your free E-DNA first', 'Your loop and mentor come from it. The room is open to you meanwhile.');
      /* joined from an emailed or shared link: continue in the dashboard, on this room */
      if (!EMBED && !LOCAL && res.room_id) { topGo('/?di=rooms&room=' + res.room_id); return; }
      var onRooms = window.BS_SCREEN === 4;
      if (!onRooms && window.showScreen) window.showScreen(4);
      setTimeout(function () { if (res.room_id) openLiveRoom(res.room_id); patchNeedsYou(); paintWaiting(); }, onRooms ? 0 : 400);
    });
  }
  (function () {
    var m = location.hash.match(/#invite=([A-Za-z0-9_-]+)/);
    var tok = m ? m[1] : null;
    if (!tok) { try { tok = localStorage.getItem('bs_pending_invite'); } catch (e) { /* storage blocked */ } }
    if (!tok) return;
    try { localStorage.removeItem('bs_pending_invite'); } catch (e) { /* storage blocked */ }
    setTimeout(function () { joinInvite(tok); }, EMBED ? 300 : 0);
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

  /* ---------- Home · "Your E-DNA profile" (Munawar, 25 Nov): the card the old dashboard
     Overview had, carried into the approved Home screen and drawn in its own panel style:
     core type, Dominant and Alternate loop, the assessment date, and the report ---------- */
  var LOOPS = { arch: ['Logic → Feeling → Logic', 'Feeling → Logic → Feeling'], alch: ['Feeling → Logic → Feeling', 'Logic → Feeling → Logic'] };
  function paintEdnaCard() {
    var home = $('main0'); if (!home || !EDNA) return;
    var cta = $('ctah') && $('ctah').closest('section'); if (!cta) return;
    var el = $('bsEdnaCard');
    if (!el) {
      el = document.createElement('section');
      el.id = 'bsEdnaCard'; el.className = 'glass panel'; el.setAttribute('aria-labelledby', 'bsEdnaH');
      cta.insertAdjacentElement('afterend', el);
    }
    var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var head = '<div class="strip" aria-hidden="true"></div><div class="lrow"><div><h2 class="t19 b" id="bsEdnaH" style="margin:0">Your E-DNA profile</h2>';
    if (!EDNA.taken) {
      el.innerHTML = head + '<div class="t13 sec">How you naturally make decisions</div></div></div>' +
        '<p class="t19" style="margin:8px 0 14px">You haven\'t taken the E-DNA assessment yet. It\'s free, takes about 30 minutes, and shows you how you naturally make decisions.</p>' +
        '<div class="btnrow" style="margin:0"><button class="btn primary" type="button" id="bsEdnaTake">Take the free E-DNA assessment</button></div>';
      $('bsEdnaTake').addEventListener('click', function () { topGo('/edna/index.html'); });
      return;
    }
    var tk = (PROFILE && PROFILE.type_key) || '';
    var side = tk === 'architect' || tk === 'architect-leaning' ? 'arch' : tk === 'alchemist' || tk === 'alchemist-leaning' ? 'alch' : null;
    var when = EDNA.assessments && EDNA.assessments[0] && EDNA.assessments[0].date;
    var whenTxt = when ? new Date(when).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    var loops = side ? LOOPS[side] : null;
    el.innerHTML = head + '<div class="t13 sec">From your E-DNA' + (whenTxt ? ' · assessed ' + esc(whenTxt) : '') + '</div></div></div>' +
      '<div class="ctagrid" style="margin-top:10px">' +
        '<div><div class="t13 sec">Core type</div><div class="t28 b" style="margin:0 0 10px;color:var(--type-text)">' + esc(EDNA.name) + '</div>' +
        (loops ? '<div class="stats" style="grid-template-columns:repeat(2,minmax(0,1fr))">' +
          '<div class="count"><div class="t13 sec">Dominant Decision Loop</div><div class="t19 b">' + loops[0] + '</div></div>' +
          '<div class="count"><div class="t13 sec">Alternate Decision Loop (under stress)</div><div class="t19 b">' + loops[1] + '</div></div></div>'
          : '<div class="t13 sec">No Dominant loop yet: both loops are open to you until it is confirmed.</div>') +
        '</div>' +
        '<div class="btnrow" style="margin:0;flex-direction:column;align-items:stretch"><button class="btn primary" type="button" id="bsEdnaReport">View your E-DNA report</button><button class="btn secondary small" type="button" id="bsEdnaMine">See my E-DNA</button></div>' +
      '</div>';
    $('bsEdnaReport').addEventListener('click', function () { openReport('basic'); });
    $('bsEdnaMine').addEventListener('click', function () { window.showScreen(6); });
  }

  /* re-patch after the preview's own openLaunch paints its example data */
  var origOpenLaunch = window.openLaunch;
  window.openLaunch = function (key) {
    if (origOpenLaunch) origOpenLaunch(key);
    clearHomeExamples();
    patchCredits(); patchLog(); patchHowYouDecide(); patchWbTile(); paintGuestBan(); paintEdnaCard();
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
        if (!tas[i]) return;
        tas[i].value = byBox[b].join('\n\n');
        /* the read view's boxes are two rows tall; a long entry (a document extract) was
           clipped with no visible scrollbar (Munawar, 24 Nov). Grow to the content, cap
           at 320px, and let the rest scroll. */
        tas[i].style.height = 'auto';
        tas[i].style.height = Math.min(tas[i].scrollHeight + 4, 320) + 'px';
        tas[i].style.overflowY = 'auto';
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

  /* ---------- Screen 9 · Settings (Munawar, 25 Nov): the approved design's own nine panels,
     filled from the member's real records. The design's markup is kept exactly; its example
     values are replaced, and a row with nothing real behind it (a card on file, two-step
     verification, quiet hours for push) is hidden rather than shown with sample data.
     Sources: /profile (names, photo, phone, country, time zone, business, membership),
     /credits (grants, ledger), /purchases (orders from GHL), /notification-prefs, /edna
     (Part 5 consent), /rooms, /devices; password and sign-out-everywhere go to Cognito. */
  var SET9 = (function () { var g = document.querySelector('#main9 .setgrid'); return g ? g.innerHTML : ''; })();
  var SUPPORT = '<a href="/privacy-policy/#s19" target="_top">Brandscaling support</a>';
  var NEV = {
    N1: 'Invited to a room', N2: 'Your input is needed', N3: 'Waiting on you (owner)', N4: 'Confirm your decision or the rule',
    N5: 'Room decision written to your log', N6: 'Review due', N7: 'Review reminder', N10: 'Credits used up',
    N13: 'Ready to retake', N14: 'Removed from a room, or room closed',
  };
  var TIERNAME = { free: 'Free', di: '£99 · Decision Intelligence', entry: 'Entry', expert: 'Expert', elite: 'Elite', enterprise: 'Enterprise' };
  var SCREEN9 = [
    ['Font', 'font', [['inter', 'Inter'], ['verdana', 'Verdana'], ['arial', 'Arial']]],
    ['Text size', 'size', [[100, '100%'], [125, '125%'], [150, '150%'], [200, '200%']]],
    ['Spacing', 'spacing', [['standard', 'Standard'], ['wide', 'Extra line and letter spacing']]],
    ['Motion', 'motion', [['standard', 'Standard'], ['reduced', 'Reduced']]],
    ['Theme', 'theme', [['light', 'Light'], ['dark', 'Dark'], ['contrast', 'High contrast']]],
    ['Transparency', 'transparency', [['standard', 'Standard'], ['reduced', 'Reduced']]],
  ];
  function ednaSettings() { try { return JSON.parse(localStorage.getItem('edna-settings') || '{}') || {}; } catch (e) { return {}; } }
  function cognitoTokens() {
    try {
      var pfx = 'CognitoIdentityServiceProvider.' + CLIENT_ID, u = localStorage.getItem(pfx + '.LastAuthUser');
      return u ? { access: localStorage.getItem(pfx + '.' + u + '.accessToken') } : {};
    } catch (e) { return {}; }
  }
  function cognitoCall(target, body) {
    return fetch('https://cognito-idp.us-east-1.amazonaws.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-amz-json-1.1', 'X-Amz-Target': 'AWSCognitoIdentityProviderService.' + target },
      body: JSON.stringify(body),
    }).then(function (r) { return r.json().then(function (j) { j.__ok = r.ok; return j; }, function () { return { __ok: r.ok }; }); });
  }
  function signOutHere() {
    try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf('CognitoIdentityServiceProvider.') === 0) localStorage.removeItem(k); }); } catch (e) { /* storage blocked */ }
    topGo('/');
  }
  function thisDevice() {
    var ua = navigator.userAgent || '';
    var br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) && !/Chromium/.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
    var os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'computer';
    return br + ' on ' + os;
  }
  /* the website reports itself once per load, so the device list has something real */
  setTimeout(function () { if (sess) api('/devices/seen', { method: 'POST', keep: true, body: { name: thisDevice(), platform: 'web' } }); }, 2500);

  window.openScreen9 = function () {
    var grid = document.querySelector('#main9 .setgrid');
    if (!grid || !PROFILE || !SET9) return;
    grid.innerHTML = SET9; /* the design, fresh */
    var main = $('main9');
    main.querySelectorAll('.chip.ex, .jbar').forEach(function (c) { c.classList.add('hide'); });
    /* the header chip: the member's own type, as on every other screen */
    var tk9 = KEYMAP[PROFILE.type_key] || 'mixed';
    if ($('typeChip9')) $('typeChip9').textContent = EDNA && !EDNA.taken ? 'E-DNA not yet taken' : (window.BS_T && window.BS_T[tk9] ? window.BS_T[tk9].chip : $('typeChip9').textContent);
    var fmt = function (x, long) { return x ? new Date(x).toLocaleDateString('en-GB', { day: 'numeric', month: long ? 'long' : 'short', year: 'numeric' }) : '—'; };
    var sec = function (id) { var h = $(id); return h ? h.closest('section') : null; };
    var say = function (el, t) { if (el) el.textContent = t; };
    var P = PROFILE;

    /* Profile */
    var ini = (((P.first_name || ' ')[0] || '') + ((P.last_name || ' ')[0] || '')).trim().toUpperCase() || '—';
    $('s9circle').innerHTML = P.photo_url ? '<img src="' + escT(P.photo_url) + '" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover">' : escT(ini);
    $('s9remove').classList.toggle('hide', !P.photo_url);
    say($('s9upload').parentElement.querySelector('.t13.sec'), 'JPEG or PNG. We crop it square and keep a small copy.');
    $('s9first').value = P.first_name || ''; $('s9last').value = P.last_name || '';
    $('s9email').value = P.email || '';
    $('s9phone').value = P.phone || '';
    var cs = $('s9country');
    cs.innerHTML = ['', 'United Kingdom', 'United Arab Emirates', 'Other'].map(function (c) { return '<option value="' + c + '">' + (c || 'Choose') + '</option>'; }).join('');
    cs.value = P.country || '';
    var tzs = [['Europe/London', 'London (GMT)'], ['Asia/Dubai', 'Dubai (GMT+4)']];
    var mine = ''; try { mine = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { /* old browser */ }
    if (mine && !tzs.some(function (t) { return t[0] === mine; })) tzs.push([mine, mine.replace(/_/g, ' ') + ' (this device)']);
    if (P.time_zone && !tzs.some(function (t) { return t[0] === P.time_zone; })) tzs.push([P.time_zone, P.time_zone.replace(/_/g, ' ')]);
    $('s9tz').innerHTML = '<option value="">Choose</option>' + tzs.map(function (t) { return '<option value="' + escT(t[0]) + '">' + escT(t[1]) + '</option>'; }).join('');
    $('s9tz').value = P.time_zone || '';
    $('s9biz').value = P.business_name || '';
    var pnote = sec('s9p').querySelector('div.t13.sec[style*="margin-top:8px"]');
    if (pnote) pnote.innerHTML = 'Your initials come from your names. To change the email you sign in with, contact ' + SUPPORT + ' from your current address.';
    var psave = sec('s9p').querySelector('.btnrow .btn.primary');
    psave.id = 's9save';
    psave.insertAdjacentHTML('afterend', '<span class="t13 sec" id="s9msg" style="margin-left:8px"></span>');

    /* Membership and credits */
    var tier = P.membership || 'free';
    $('s9tier').textContent = TIERNAME[tier] || tier;
    $('s9credits').innerHTML = '<span><b>' + (P.credits || 0) + '</b> decisions left</span>';
    $('s9grants').innerHTML = '<tr><td class="t13 sec" colspan="4">…</td></tr>';
    $('s9topup').textContent = tier === 'free' ? 'Get the Advanced Report · £99' : 'Top up';
    $('s9topup').dataset.buy = tier === 'free' ? 'report' : 'topup';
    $('s9cancel').classList.add('hide');
    say($('s9mnote'), tier === 'free' ? 'The E-DNA Advanced Report comes with 10 decisions and your three workbooks.' : 'When these are used, top-up packs carry you on. A membership adds a monthly allowance.');
    $('s9tiers').innerHTML = tier === 'free' || tier === 'di'
      ? '<div class="crow"><div><div class="t13 b">Memberships</div><div class="t13 sec">Entry, Expert and Elite: decision rooms, a monthly allowance and the Infinite Scaling layers</div></div><button class="btn secondary small" type="button" data-buy="entry">See memberships</button></div>'
      : '<div class="t13 sec">You are on ' + escT(TIERNAME[tier] || tier) + '. To change your membership, contact ' + SUPPORT + '.</div>';

    /* Subscription */
    var member = ['free', 'di'].indexOf(tier) < 0;
    $('s9substate').textContent = member ? 'Active' : 'No subscription';
    $('s9substate').className = 'chip ' + (member ? 'type' : 'grey');
    $('s9subrows').innerHTML = (member
      ? [['Plan', TIERNAME[tier] || tier], ['Billing', 'Taken by our checkout; each payment’s receipt is emailed to you']]
      : [['Plan', tier === 'di' ? 'E-DNA Advanced Report · one-off payment' : 'Free · the E-DNA assessment and your basic report'], ['Renews', 'Never · nothing is charged again']])
      .map(function (r) { return '<div class="crow"><div><div class="t13 b">' + r[0] + '</div><div class="t13 sec">' + escT(r[1]) + '</div></div></div>'; }).join('');
    $('s9subbtns').innerHTML = member ? '' : '<button class="btn primary small" type="button" data-buy="entry">See memberships</button>';

    /* Payment details: no card is stored by Brandscaling, so no card row */
    var pay = sec('s9pay');
    say(pay.querySelector('h2 + .t13.sec'), 'Payments are taken by our checkout. Brandscaling never holds your card details; your card stays with the payment provider.');
    pay.querySelectorAll('.crow').forEach(function (r) { r.classList.add('hide'); });
    var rth = pay.querySelector('table thead tr'); if (rth) rth.innerHTML = '<th>Date</th><th>Item</th>';
    $('s9receipts').innerHTML = '<tr><td class="t13 sec" colspan="2">…</td></tr>';

    /* Notifications: email per event (In the app is always on); push comes with the iOS app */
    $('s9chan').textContent = 'In the app · Email (push messages come with the iOS app)';
    $('s9rows').innerHTML = '<div class="t13 sec">…</div>';
    var nopts = sec('s9n').querySelector('.nopts');
    nopts.querySelectorAll('label.sw').forEach(function (l) { l.classList.add('hide'); });
    nopts.querySelector('.t13.sec').innerHTML = 'Email goes to your account email, <b>' + escT(P.email || '') + '</b>. Security and legal notices are always on.';

    /* Consent and sharing */
    var given = EDNA && EDNA.taken && EDNA.p5 && EDNA.p5.consent;
    say($('s9p5'), !EDNA || !EDNA.taken ? 'Asked during the assessment, in Part 5.' : given ? 'Consent given during your assessment.' : 'Not given. Your own Part 5 result still shows in your report.');
    $('s9p5btn').classList.add('hide');
    $('s9rooms').innerHTML = '<div class="t13 sec">…</div>';

    /* Screen: the same settings the E-DNA assessment and reports use (this browser) */
    say(sec('s9s').querySelector('h2 + .t13.sec'), 'These change how your E-DNA assessment and reports look in this browser, never your questions, answers or results.');
    var es = ednaSettings();
    var cur9 = { font: es.font || 'inter', size: es.size || 100, spacing: es.spacing || 'standard', motion: es.motion || 'standard', theme: es.theme || 'light', transparency: es.transparency || 'standard' };
    $('s9screen').innerHTML = SCREEN9.map(function (s, i) {
      return '<div class="srow9"><span class="t13 b" id="ss' + i + '">' + s[0] + '</span><div class="sset" role="radiogroup" aria-labelledby="ss' + i + '">' +
        s[2].map(function (o) { var on = String(cur9[s[1]]) === String(o[0]); return '<button type="button" data-set9="' + s[1] + '" data-v="' + o[0] + '" class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '">' + o[1] + '</button>'; }).join('') +
        '</div></div>';
    }).join('');

    /* Security */
    var secu = sec('s9sec');
    say(secu.querySelector('h2 + .t13.sec'), 'Your password is the same for the website and the iOS app. Changing it asks for your current one.');
    var rows = secu.querySelectorAll('.crow');
    if (rows[0]) { say(rows[0].querySelector('.t13.sec'), 'Change it here, or use “Forgotten password” on the sign-in page.'); rows[0].querySelector('button').id = 's9pw'; }
    if (rows[1]) rows[1].classList.add('hide'); /* two-step verification is not switched on for the sign-in service */
    $('s9devices').innerHTML = '<div class="t13 sec">…</div>';
    var allBtn = secu.querySelector('.btnrow .btn'); if (allBtn) { allBtn.id = 's9everywhere'; allBtn.textContent = 'Sign out everywhere'; }

    /* Account */
    var acct = sec('s9a');
    var terms = acct.querySelector('.crow');
    if (terms) terms.innerHTML = '<div><div class="t13 b">Terms</div><div class="t13 sec">Your account is held under the <a href="/terms-of-service/" target="_top">Terms of Use</a> and the <a href="/privacy-policy/" target="_top">Privacy Policy</a>.</div></div>';
    var acctLine = $('s9acctEmail').parentElement;
    acctLine.innerHTML = 'Signed in as <b>' + escT(P.email || '') + '</b>. Signing out keeps everything saved.';
    var copies = acct.querySelectorAll('.crow');
    if (copies[1]) copies[1].querySelector('button').id = 's9csv';
    if (copies[2]) { copies[2].querySelector('button').id = 's9pdf'; say(copies[2].querySelector('button'), 'Open · PDF'); say(copies[2].querySelector('.t13.sec'), 'Your basic and Advanced Reports; each has a PDF button'); }
    if (copies[3]) copies[3].querySelector('button').id = 's9all';
    var last = acct.querySelector(':scope > .t13.sec:last-child');
    if (last) last.innerHTML = 'To delete your account and its data, use <a href="/delete-account/" target="_top">Delete my account</a>; we confirm by email before anything is removed. <a href="/privacy-policy/" target="_top">Privacy Policy</a> · <a href="/terms-of-service/" target="_top">Terms of Use</a>';

    /* live tables */
    api('/credits').then(function (d) {
      if (d.__status !== 200 || !$('s9grants')) return;
      var SRC = { purchase_99: 'Advanced Report', pack: 'Top-up pack', tier: 'Membership', admin: 'Granted', assessment: 'With your assessment', report_purchase: 'Advanced Report' };
      var bal = d.balance != null ? d.balance : (P.credits || 0);
      var total = (d.grants || []).reduce(function (a, g) { return a + (g.amount || 0); }, 0);
      $('s9credits').innerHTML = total
        ? '<span><b>' + bal + ' of ' + total + '</b> decisions left</span><span class="bar"><span style="width:' + Math.max(0, Math.min(100, Math.round(100 * bal / total))) + '%"></span></span>'
        : '<span><b>' + bal + '</b> decisions left</span>';
      $('s9grants').innerHTML = (d.grants && d.grants.length) ? d.grants.map(function (g) {
        return '<tr><td>' + escT(SRC[g.source] || g.source || '—') + '</td><td>' + (g.amount || 0) + '</td><td>' + fmt(g.granted_at) + '</td><td>' + (g.expires_at ? fmt(g.expires_at) : 'No expiry') + '</td></tr>';
      }).join('') : '<tr><td class="t13 sec" colspan="4">None yet. Decisions come with the Advanced Report and memberships.</td></tr>';
      var led = (d.ledger || []).slice(0, 20); var left = bal;
      $('s9ledger').innerHTML = led.map(function (l) {
        var used = l.amount || 1; var row = '<tr><td>' + fmt(l.created_at) + '</td><td>' + escT(l.decision_text || l.reason || '—') + '</td><td>' + used + '</td><td>' + left + '</td></tr>';
        left += used; return row;
      }).join('');
      $('s9ledger').closest('table').classList.toggle('hide', !led.length);
      $('s9ledgerEmpty').classList.toggle('hide', !!led.length);
      /* receipts fall back to the purchase grants when GHL's order events are not on file */
      api('/purchases').then(function (pu) {
        if (!$('s9receipts')) return;
        var list = (pu.__status === 200 && pu.purchases && pu.purchases.length) ? pu.purchases.map(function (p) {
          var prod = String(p.product || '').toLowerCase();
          return [p.received_at, prod.indexOf('pack') >= 0 || p.pack ? 'Top-up pack' + (p.pack ? ' · ' + p.pack + ' decisions' : '') : 'E-DNA Advanced Report'];
        }) : (d.grants || []).filter(function (g) { return g.source === 'purchase_99' || g.source === 'pack' || g.source === 'report_purchase'; })
          .map(function (g) { return [g.granted_at, g.source === 'pack' ? 'Top-up pack · ' + g.amount + ' decisions' : 'E-DNA Advanced Report']; });
        $('s9receipts').innerHTML = list.map(function (r) { return '<tr><td>' + fmt(r[0]) + '</td><td>' + escT(r[1]) + '</td></tr>'; }).join('');
        $('s9receipts').closest('table').classList.toggle('hide', !list.length);
        $('s9receiptsEmpty').classList.toggle('hide', !!list.length);
        say($('s9receiptsEmpty'), 'No payments yet.');
      });
    });
    api('/notification-prefs').then(function (d) {
      if (!$('s9rows')) return;
      if (d.__status !== 200) { $('s9rows').innerHTML = '<div class="t13 sec">Could not load your switches. Try again in a moment.</div>'; return; }
      var sw = function (ev, on, locked, label) {
        return '<label class="sw"><input type="checkbox" role="switch" ' + (on ? 'checked ' : '') + (locked ? 'disabled ' : '') + 'aria-label="' + escT(label) + '" data-nev="' + ev + '"><span class="knob" aria-hidden="true"></span></label>';
      };
      $('s9rows').innerHTML = '<div class="nrow head"><span class="t13 sec b">Event</span><span class="t13 sec b">Email</span></div>' +
        (d.prefs || []).filter(function (p) { return NEV[p.event]; }).map(function (p) {
          return '<div class="nrow" data-push="' + (p.push ? 1 : 0) + '"><span><span class="t13">' + NEV[p.event] + '</span></span><span>' + sw(p.event, p.email, false, 'Email: ' + NEV[p.event]) + '</span></div>';
        }).join('') +
        '<div class="nrow"><span><span class="t13">Security and legal notices</span><span class="t13 sec note">Sign-in from a new device, email changed, terms changed. Cannot be switched off</span></span><span>' + sw('N15', true, true, 'Email: Security and legal notices') + '</span></div>';
      $('s9rows').querySelectorAll('.nrow').forEach(function (r) { r.style.gridTemplateColumns = '1fr 64px'; });
    });
    api('/rooms').then(function (d) {
      if (d.__status !== 200 || !$('s9rooms')) return;
      var rs = d.rooms || [];
      $('s9rooms').innerHTML = rs.map(function (r) {
        var own = r.my_role === 'decision_owner';
        return '<div class="crow"><div><div class="t13 b">' + escT(r.decision_text) + '</div><div class="t13 sec">' + (own ? 'Owner' : 'Collaborator') + ' · since ' + fmt(r.created_at) + ' · for this decision only</div></div>' + (own ? '<span class="t13 sec">Owner</span>' : '') + '</div>';
      }).join('');
      $('s9roomsEmpty').classList.toggle('hide', rs.length > 0);
    });
    api('/devices').then(function (d) {
      if (!$('s9devices')) return;
      var here = thisDevice();
      var ds = (d.__status === 200 && d.devices) || [];
      $('s9devices').innerHTML = ds.length ? ds.map(function (x) {
        var cur = x.device_name === here && x.platform === 'web';
        return '<div class="crow"><div><div class="t13 b">' + (cur ? 'This device · ' : '') + escT(x.device_name || 'Device') + '</div><div class="t13 sec">' + (cur ? 'Signed in now' : 'Last seen ' + fmt(x.last_seen_at)) + '</div></div>' + (cur ? '<span class="chip type">Current</span>' : '') + '</div>';
      }).join('') : '<div class="crow"><div><div class="t13 b">This device · ' + escT(here) + '</div><div class="t13 sec">Signed in now</div></div><span class="chip type">Current</span></div>';
    });
  };

  /* Settings actions: one handler on the screen, which stops the design's own example
     handlers (upload, consent, screen toggles) from also running */
  (function () {
    var m9 = $('main9'); if (!m9) return;
    m9.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('#s9upload, #s9remove, #s9emailChange, #s9save, [data-set9], #s9pw, #s9everywhere, #s9signout, #s9delete, #s9csv, #s9pdf, #s9all');
      if (!t) return;
      e.preventDefault(); e.stopPropagation();
      var id = t.id;
      if (id === 's9upload') {
        var fi = document.createElement('input'); fi.type = 'file'; fi.accept = 'image/jpeg,image/png';
        fi.addEventListener('change', function () {
          var f = this.files && this.files[0]; if (!f) return;
          var img = new Image();
          img.onload = function () {
            var side = Math.min(img.width, img.height);
            var cv = document.createElement('canvas'); cv.width = 256; cv.height = 256;
            cv.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, 256, 256);
            var url = cv.toDataURL('image/jpeg', 0.85);
            api('/profile/photo', { method: 'PUT', body: { data: url.split(',')[1], mime: 'image/jpeg' } }).then(function (res) {
              if (res.__status === 200) { PROFILE.photo_url = url; window.openScreen9(); }
              else bsNotice('Photo not saved', res.message || 'Could not save the photo.');
            });
          };
          img.src = URL.createObjectURL(f);
        });
        fi.click(); return;
      }
      if (id === 's9remove') { api('/profile/photo', { method: 'PUT', body: { data: null } }).then(function () { PROFILE.photo_url = null; window.openScreen9(); }); return; }
      if (id === 's9emailChange') { bsNotice('Change your email', 'Contact Brandscaling support from your current address with the new one (the address is under Contact Us in the Privacy Policy). We change it for the website and the iOS app together.'); return; }
      if (id === 's9save') {
        var body = { first_name: $('s9first').value.trim(), last_name: $('s9last').value.trim(), phone: $('s9phone').value.trim(), country: $('s9country').value, time_zone: $('s9tz').value, business_name: $('s9biz').value.trim() };
        $('s9msg').textContent = 'Saving…';
        api('/profile', { method: 'PUT', body: body }).then(function (res) {
          if (res.__status !== 200) { $('s9msg').textContent = res.message || 'Not saved.'; return; }
          Object.keys(body).forEach(function (k) { PROFILE[k] = body[k] || null; });
          ['name', 'name0'].forEach(function (n) { if ($(n)) $(n).textContent = PROFILE.first_name || ''; });
          window.openScreen9(); if ($('s9msg')) $('s9msg').textContent = 'Saved.';
        });
        return;
      }
      if (t.dataset && t.dataset.set9) {
        var es = ednaSettings(); var k = t.dataset.set9; var v = t.dataset.v;
        es[k] = k === 'size' ? Number(v) : v;
        try { localStorage.setItem('edna-settings', JSON.stringify(es)); } catch (x) { /* storage blocked */ }
        t.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === t); b.setAttribute('aria-pressed', String(b === t)); });
        return;
      }
      if (id === 's9pw') {
        bsModal('<h2>Change your password</h2><p>At least 8 characters, with a number, a capital letter and a lower-case letter.</p>' +
          '<label class="t13 sec" for="bsPwOld">Current password</label><input class="inp" id="bsPwOld" type="password" autocomplete="current-password" style="width:100%;margin:4px 0 10px">' +
          '<label class="t13 sec" for="bsPwNew">New password</label><input class="inp" id="bsPwNew" type="password" autocomplete="new-password" style="width:100%;margin:4px 0 10px">' +
          '<p class="t13" id="bsPwMsg" style="min-height:18px;margin:0 0 8px"></p>' +
          '<div class="btns"><button type="button" class="bs" data-no>Cancel</button><button type="button" class="bp" data-ok>Change password</button></div>',
          function (ov, close) {
            ov.querySelector('[data-no]').addEventListener('click', close);
            ov.querySelector('[data-ok]').addEventListener('click', function () {
              var tok = cognitoTokens().access; var msg = ov.querySelector('#bsPwMsg');
              if (!tok) { msg.textContent = 'Sign in again, then change it.'; return; }
              msg.textContent = 'Changing…';
              cognitoCall('ChangePassword', { AccessToken: tok, PreviousPassword: ov.querySelector('#bsPwOld').value, ProposedPassword: ov.querySelector('#bsPwNew').value }).then(function (r) {
                if (r.__ok) { close(); bsNotice('Password changed', 'Use the new password next time you sign in, on the website and in the iOS app.'); return; }
                msg.textContent = /NotAuthorized/.test(r.__type || '') ? 'Your current password is not right.' : /InvalidPassword/.test(r.__type || '') ? (r.message || 'That new password does not meet the rules.') : /LimitExceeded/.test(r.__type || '') ? 'Too many tries. Wait a few minutes.' : (r.message || 'Not changed. Try again.');
              }, function () { msg.textContent = 'Could not reach the sign-in service. Try again.'; });
            });
          });
        return;
      }
      if (id === 's9everywhere') {
        bsModal('<h2>Sign out everywhere?</h2><p>This signs you out on every device, this one included, and in the iOS app. You sign in again with your email and password.</p><div class="btns"><button type="button" class="bs" data-no>Cancel</button><button type="button" class="bp" data-ok>Sign out everywhere</button></div>',
          function (ov, close) {
            ov.querySelector('[data-no]').addEventListener('click', close);
            ov.querySelector('[data-ok]').addEventListener('click', function () {
              var tok = cognitoTokens().access;
              (tok ? cognitoCall('GlobalSignOut', { AccessToken: tok }) : Promise.resolve({})).then(signOutHere, signOutHere);
            });
          });
        return;
      }
      if (id === 's9signout') { signOutHere(); return; }
      if (id === 's9delete') { topGo('/delete-account/'); return; }
      if (id === 's9pdf') { openReport('basic'); return; }
      if (id === 's9csv') {
        api('/log', { fresh: true }).then(function (d) {
          if (d.__status !== 200) { bsNotice('Export failed', 'Could not load your log.'); return; }
          var rows = d.rows || d.log || [];
          if (!rows.length) { bsNotice('Nothing to export', 'Your log is empty.'); return; }
          var cols = Object.keys(rows[0]);
          var cell = function (v) { return '"' + String(v == null ? '' : (typeof v === 'object' ? JSON.stringify(v) : v)).replace(/"/g, '""') + '"'; };
          var text = cols.join(',') + '\n' + rows.map(function (r) { return cols.map(function (c) { return cell(r[c]); }).join(','); }).join('\n');
          var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); a.download = 'decision-log.csv'; a.click();
        });
        return;
      }
      if (id === 's9all') {
        t.disabled = true; var was = t.textContent; t.textContent = 'Preparing…';
        var parts = ['/profile', '/edna', '/log?view=mine', '/log?view=room', '/rooms', '/credits', '/purchases', '/notification-prefs', '/devices'];
        Promise.all(parts.map(function (p) { return api(p, { fresh: true }).then(function (j) { delete j.__status; return [p, j]; }, function () { return [p, null]; }); }))
          .then(function (res) {
            return fetch(wbApiBase(), { headers: headers() }).then(function (r) { return r.json(); }, function () { return null; }).then(function (w) {
              var out = { exported_at: new Date().toISOString() };
              res.forEach(function (r) { out[r[0].replace(/^\//, '').replace(/\?view=/, '_')] = r[1]; });
              out.workbooks = w;
              var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
              a.download = 'brandscaling-my-data.json'; a.click();
            });
          })
          .then(function () { t.disabled = false; t.textContent = was; }, function () { t.disabled = false; t.textContent = was; bsNotice('Download failed', 'Try again in a moment.'); });
        return;
      }
    });
    /* the design's own "type a name, repaint the circle" handler is bound to the original
       inputs only; keep the initials live on the restored ones */
    m9.addEventListener('input', function (e) {
      if (!e.target || (e.target.id !== 's9first' && e.target.id !== 's9last')) return;
      if (PROFILE && PROFILE.photo_url) return;
      var ini = ((($('s9first').value || ' ')[0] || '') + (($('s9last').value || ' ')[0] || '')).trim().toUpperCase() || '—';
      $('s9circle').textContent = ini;
    });
    m9.addEventListener('change', function (e) {
      var c = e.target && e.target.dataset && e.target.dataset.nev; if (!c || e.target.disabled) return;
      var row = e.target.closest('.nrow');
      api('/notification-prefs', { method: 'PUT', body: { event: c, email: e.target.checked, push: !row || row.dataset.push !== '0' } }).then(function (r) {
        if (r.__status !== 200) { e.target.checked = !e.target.checked; bsNotice('Not saved', r.message || 'Try again in a moment.'); }
      });
    });
  })();

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
  var PENDING_ATT = null; /* a file chosen on the question screen, attached right after Start */
  function attUpload(f) {
    if (!f || !S.id) return;
    var msg = $('bsAttMsg');
    if (f.size > 10 * 1024 * 1024) { if (msg) msg.textContent = 'Over 10 MB. Make it smaller and try again.'; return; }
    if (msg) msg.textContent = 'Reading ' + f.name + '…';
    var rd = new FileReader();
    rd.onload = function () {
      var b64 = String(rd.result).split(',')[1] || '';
      api('/decisions/' + S.id + '/attachments', {
        method: 'POST',
        body: { box: STEPS[S.i], filename: f.name, mime: f.type || 'text/plain', data: b64 },
      }).then(function (res) {
        var m = $('bsAttMsg');
        if (m) m.textContent = res.__status === 201 ? 'Read. Confirm the extract to put it in the box.' : (res.message || 'That did not work.');
        listAttach();
      });
    };
    rd.readAsDataURL(f);
  }
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
        var f = this.files && this.files[0]; this.value = ''; attUpload(f);
      });
      /* drag a file anywhere onto the box (Fariza, 24 Nov) */
      ['dragover', 'dragenter'].forEach(function (ev) {
        lb.addEventListener(ev, function (e) { e.preventDefault(); lb.style.outline = '2px dashed var(--indigo)'; });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        lb.addEventListener(ev, function (e) { e.preventDefault(); lb.style.outline = ''; });
      });
      lb.addEventListener('drop', function (e) {
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) attUpload(f);
      });
      $('bsAttList').addEventListener('click', function (e) {
        var c = e.target.closest && e.target.closest('[data-att-confirm]');
        if (c) {
          var attName = c.dataset.attName || 'the document';
          api('/attachments/' + c.dataset.attConfirm + '/confirm', { method: 'POST' }).then(function () {
            $('bsAttMsg').textContent = 'In the box. Your mentor reads the extract with your own words.';
            listAttach();
            /* the mentor engages with the document at once, instead of waiting for the
               next box (Fariza, 24 Nov: attaching felt pointless when nothing used it) */
            if (S.id && !S.busy) mentorEvent('replied', 'I attached ' + attName + '; its facts extract is now in the box. Work with it.');
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
          (a.confirmed_at ? '' : '<div class="btnrow" style="margin:0"><button class="btn small primary" type="button" data-att-confirm="' + a.id + '" data-att-name="' + String(a.filename || 'the document').replace(/"/g, '&quot;') + '">Confirm: put this in the box</button>' +
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
        '<div class="t19"><b>Read:</b> <span class="chip ' + (String(r.readiness.read).indexOf('Ready') === 0 ? 'type' : 'exv') + '" style="display:inline-block">' + r.readiness.read + '</span></div>';
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
      if (PENDING_ATT) { /* a file picked on the question screen attaches to Box 1 now */
        attUpload(PENDING_ATT); PENDING_ATT = null;
        var n0 = $('bsAttNote0'); if (n0) n0.textContent = '';
      }
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
          if (c.still_open) {
            /* 'Not yet': the Frame is not finished, so no Done card — back to the box the
               mentor names, the decision stays In the Frame, and Check runs again (24 Nov) */
            $('done0').classList.add('hide');
            var fb = c.response && c.response.focus_box;
            var fi = STEPS.indexOf(fb);
            S.i = fi >= 0 ? fi : 0; showBox();
            var lc = $('log0'); if (lc) { lc.classList.remove('hide'); lc.innerHTML = '<div class="t13 sec b" style="margin-bottom:4px">Not yet decided</div><div class="t19">Your mentor’s read is Not yet, so this stays In the Frame. Fill the box it names, then Check again.</div>'; }
            patchLog();
            return;
          }
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
      /* warm every tab's reads once the member is known, so even the first visit to the log
         or the rooms paints at once instead of showing "Loading…" (25 Nov) */
      setTimeout(function () {
        ['/log?view=mine', '/log?view=room', '/rooms', '/needs-you', '/log/summary', '/credits', '/notification-prefs', '/devices', '/purchases'].forEach(function (pth) {
          if (!READS[pth]) api(pth, { fresh: false }).then(function () { /* stored by api() */ });
        });
      }, 400);
    });
  }
    /* The question screen's "+ Attach document" shipped as preview chrome with no
       handler (Munawar pressed it, nothing happened — 24 Nov). A decision must exist
       before the backend can hold a file, so the pick is kept and attached to Box 1
       the moment Start succeeds. Drag-and-drop onto the question box does the same. */
    (function wireStartAttach() {
      var plus = document.querySelector('#l0 .plus');
      if (!plus || plus.dataset.bsWired) return;
      var fresh = plus.cloneNode(true); plus.parentNode.replaceChild(fresh, plus);
      fresh.dataset.bsWired = '1';
      var fi = document.createElement('input');
      fi.type = 'file'; fi.accept = ATTACH_OK; fi.style.display = 'none';
      fresh.insertAdjacentElement('afterend', fi);
      var note = document.createElement('span');
      note.id = 'bsAttNote0'; note.className = 't13 sec'; note.style.marginLeft = '8px';
      fi.insertAdjacentElement('afterend', note);
      function hold(f) {
        if (!f) return;
        if (f.size > 10 * 1024 * 1024) { note.textContent = 'Over 10 MB. Make it smaller and try again.'; return; }
        PENDING_ATT = f;
        note.textContent = f.name + ' · attaches to Box 1 when you press Start.';
      }
      fresh.addEventListener('click', function (e) { e.preventDefault(); fi.click(); });
      fi.addEventListener('change', function () { var f = this.files && this.files[0]; this.value = ''; hold(f); });
      var dz = document.querySelector('#l0 .entry.dec') || $('l0');
      if (dz) {
        ['dragover', 'dragenter'].forEach(function (ev) {
          dz.addEventListener(ev, function (e) { e.preventDefault(); dz.style.outline = '2px dashed var(--indigo)'; });
        });
        ['dragleave', 'drop'].forEach(function (ev) {
          dz.addEventListener(ev, function (e) { e.preventDefault(); dz.style.outline = ''; });
        });
        dz.addEventListener('drop', function (e) {
          var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          hold(f);
        });
      }
    })();

  /* ---------- every screen change: the type chips stay honest, and when embedded the
     dashboard's sidebar follows (the preview's own navigation calls its local showScreen,
     which always sets window.BS_SCREEN — so the hook sits on that) ---------- */
  function notTakenChips() {
    if (!EDNA || EDNA.taken) return;
    /* the preview paints a type ("Mixed") on every screen; no result means no type (Fariza, 24 Nov) */
    document.querySelectorAll('.who .chip.type, [id^="typeChip"]').forEach(function (c) { c.textContent = 'E-DNA not yet taken'; });
  }
  (function () {
    /* 25 Nov (Munawar): the dashboard's first tab is this app's Home screen (1), exactly as
       the approved design draws it, so Home is a screen the dashboard can show like the others */
    var SCR = { 1: 'home', 9: 'settings', 5: 'make', 2: 'make', 3: 'log', 12: 'log', 4: 'rooms', 7: 'reports', 8: 'workbooks', 6: 'edna', 14: 'scaling' };
    var NUM = { home: 1, settings: 9, make: 5, log: 3, rooms: 4, reports: 7, workbooks: 8, edna: 6, scaling: 14 };
    var cur = window.BS_SCREEN;
    var READY = false; /* the page's own last line shows Home; the embed's first screen comes after it */
    try {
      Object.defineProperty(window, 'BS_SCREEN', {
        configurable: true,
        get: function () { return cur; },
        set: function (v) {
          cur = v;
          setTimeout(notTakenChips, 0);
          if (!EMBED || !READY) return;
          try { if (SCR[v]) parent.postMessage({ bsScreen: SCR[v] }, location.origin); } catch (e) { /* parent gone */ }
        },
      });
    } catch (e) { /* older browsers: the chips still update on load */ }
    if (!EMBED) return;
    /* screens that belong to a tab: the full Frame (2) is part of Make a decision, the review (12)
       of the log. Without this the dashboard's echo of 'make' sent the full Frame and a reopened
       decision back to an empty Make a decision page (24 Nov) */
    var BELONGS = { home: [1], settings: [9], make: [5, 2], log: [3, 12], rooms: [4], reports: [7], workbooks: [8], edna: [6], scaling: [14] };
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || !e.data || !e.data.bsShow) return;
      var n = NUM[e.data.bsShow];
      if (n && (BELONGS[e.data.bsShow] || [n]).indexOf(cur) < 0) window.showScreen(n);
    });
    /* after DOMContentLoaded, which comes after the page's trailing showScreen(1) — a plain
       setTimeout could run first when the parser yields between scripts (seen in testing) */
    var firstScreen = function () {
      READY = true;
      window.showScreen(NUM[QS.get('screen')] || 5);
      var rm = QS.get('room');
      if (rm) setTimeout(function () { openLiveRoom(rm); }, 900);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', firstScreen);
    else setTimeout(firstScreen, 0);
  })();

  boot();
})();
