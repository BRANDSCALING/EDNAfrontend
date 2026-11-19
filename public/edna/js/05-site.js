/*
 * 05-site.js — the production bridge (17 Nov 2026, Munawar).
 *
 * Fariza's dev-package web-app (01–04.js) is kept VERBATIM; this file, loaded between 03 and 04,
 * turns the preview into the live site assessment:
 *   - requires a Cognito sign-in (same user pool as the iOS app; token read from the SPA's
 *     localStorage — same origin), else redirects to the site sign-in
 *   - starts at the welcome screen, not the preview's report screen
 *   - removes the preview-only controls (jump bar, "Preview as", size toggle) per BS-DI-006 §11
 *   - derives core/lean from the real Part 1 answers (the preview used a manual switcher)
 *   - autosaves progress to this browser per user; restores a finished assessment from the
 *     backend (GET /api/v1/quiz/results — the same record the iOS app writes and reads)
 *   - on finish, submits the answers to POST /api/v2/edna/complete: the SERVER computes the
 *     report (BS-DI-005 §8) and stores it in the shared database; offline submits are queued
 *     and retried like the iOS app's pendingSync
 *   - gates the detailed report and plan on fullResultPurchased (GHL checkout; BS-DI-003 §9.1)
 */
(function () {
  'use strict';

  /* ---------- config ---------- */
  var CLIENT_ID = (window.EDNA_COGNITO_CLIENT_ID || '7p2sthlo5p654mi99gcr8rjhtd');
  var API = (window.EDNA_API_BASE || 'https://qpbpbpiegm.us-east-1.awsapprunner.com');
  var CHECKOUT = (window.EDNA_CHECKOUT_URL || 'https://go.brandscaling.co.uk/checkout-page-quiz-report');

  /* ---------- Cognito session (written by the SPA's amazon-cognito-identity-js) ---------- */
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
      if (!p || !p.sub) return null;
      if ((p.exp || 0) * 1000 < Date.now() + 60000) return null; /* expired / about to expire */
      return { token: tok, sub: p.sub, email: p.email || '', name: p.name || '' };
    } catch (e) { return null; }
  }

  /* Embedded in the dashboard's "My E-DNA profile" tab (18 Nov 2026): the shell provides
     the chrome, so the page hides its own header and progress bar. Content is untouched. */
  var EMBED = new URLSearchParams(window.location.search).get('embed') === '1';
  if (EMBED) {
    var est = document.createElement('style');
    est.textContent = 'header{display:none!important}.progress{display:none!important}body{padding-top:8px}';
    document.head.appendChild(est);
  }

  var sess = cognitoSession();
  /* Anonymous start (Fariza, 18 Nov 2026): no account is needed to TAKE the test — people go
     straight to the questions, and the account is created at the end to receive the report.
     Signed-out progress lives under the 'anon' key and is adopted by the account on return. */
  var ANON = !sess;

  var keyId = sess ? sess.sub : 'anon';
  var progressKey = 'edna.v2.progress.' + keyId;
  var pendingKey = 'edna.v2.pendingSync.' + keyId;
  if (sess) {
    /* Adopt a signed-out run: the person just created their account to receive the report. */
    try {
      var anonRaw = localStorage.getItem('edna.v2.progress.anon');
      if (anonRaw && !localStorage.getItem(progressKey)) {
        localStorage.setItem(progressKey, anonRaw);
      }
      if (anonRaw) localStorage.removeItem('edna.v2.progress.anon');
    } catch (e) { /* storage unavailable */ }
  }
  var completedInfo = null;   /* { savedAt, retakeAvailableAt } once known */
  var purchased = false;      /* fullResultPurchased from the backend */
  var submitted = false;
  var restored = false;       /* snapshot() must not run before restore, or the initial
                                 render would overwrite the stored progress with a fresh state */

  function authHeaders() {
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + sess.token };
  }

  /* ---------- answers <-> the app's stores (shapes match EDNAKit's EDNAAnswers exactly,
     so a record written here restores on iOS and vice versa) ---------- */

  function toAnswers() {
    var out = {
      profile: profile === null ? undefined : profile,
      p1: {}, p1Either: {}, supp: {}, suppText: {},
      p2: [], p3: {}, p4: [], p5: [], consent5: consent5 === null ? undefined : consent5,
      p6: [], p7: [], reserveDone: !!reserveDone
    };
    scenarios.forEach(function (sc, i) {
      if (sc.reserve && !reserveDone) return;
      var a = saved[i]; if (!a || a.q0 == null || a.q1 == null || a.q2 == null) return;
      out.p1[sc.id] = [0, 1, 2].map(function (q) {
        return a['q' + q] === 'either' ? 'D' : P1_CODE[q][Number(a['q' + q])];
      }).join('');
      sc.q.forEach(function (q, qi) {
        if (a['q' + qi] === 'either' && (a['t' + qi] || '').trim()) out.p1Either[q.id] = a['t' + qi];
      });
    });
    Object.keys(savedSupp).forEach(function (id) {
      var sv = savedSupp[id] || {};
      if (sv.a !== undefined) out.supp[id] = sv.a === 'other' ? -1 : Number(sv.a);
      if ((sv.text || '').trim()) out.suppText[id] = sv.text;
    });
    for (var i2 = 0; i2 < 10; i2++) out.p2.push(saved2[i2] || null);
    Object.keys(saved3).forEach(function (k) {
      var v = saved3[k] || {};
      out.p3[k] = { a: v.a, otherText: v.otherText, trig: v.trig, trigText: v.trigText };
    });
    for (var i4 = 0; i4 < 10; i4++) out.p4.push(saved4[i4] === undefined ? null : saved4[i4]);
    for (var i5 = 0; i5 < part5.length; i5++) out.p5.push(saved5[i5] === undefined ? null : saved5[i5]);
    for (var i6 = 0; i6 < part6.length; i6++) out.p6.push(saved6[i6] === undefined ? null : saved6[i6]);
    for (var i7 = 0; i7 < part7.length; i7++) {
      var s7 = saved7[i7] || {};
      out.p7.push({ k: s7.k || null, otherText: s7.otherText || undefined });
    }
    return out;
  }

  function fromAnswers(ans) {
    if (!ans) return;
    if (ans.profile !== undefined && ans.profile !== null) profile = Number(ans.profile);
    Object.keys(ans.p1 || {}).forEach(function (id) {
      var idx = scenarios.findIndex(function (s) { return s.id === id; });
      if (idx < 0) return;
      var pat = ans.p1[id]; var a = { approved: true };
      for (var q = 0; q < 3; q++) {
        var ch = pat[q];
        a['q' + q] = ch === 'D' ? 'either' : String(P1_CODE[q].indexOf(ch));
        var qid = scenarios[idx].q[q] && scenarios[idx].q[q].id;
        a['t' + q] = (qid && (ans.p1Either || {})[qid]) || '';
      }
      saved[idx] = a;
    });
    reserveDone = !!ans.reserveDone;
    Object.keys(ans.supp || {}).forEach(function (id) {
      savedSupp[id] = { a: ans.supp[id] === -1 ? 'other' : Number(ans.supp[id]), text: (ans.suppText || {})[id] || '' };
    });
    (ans.p2 || []).forEach(function (k, i) { if (k) saved2[i] = k; });
    Object.keys(ans.p3 || {}).forEach(function (k) {
      var v = ans.p3[k] || {}; var o = {};
      if (v.a !== undefined && v.a !== null) o.a = v.a;
      if (v.otherText) o.otherText = v.otherText;
      if (v.trig !== undefined && v.trig !== null) o.trig = v.trig;
      if (v.trigText) o.trigText = v.trigText;
      saved3[k] = o;
    });
    (ans.p4 || []).forEach(function (v, i) { if (v !== null && v !== undefined) saved4[i] = Number(v); });
    (ans.p5 || []).forEach(function (v, i) { if (v !== null && v !== undefined) saved5[i] = Number(v); });
    if (ans.consent5 !== undefined && ans.consent5 !== null) consent5 = !!ans.consent5;
    (ans.p6 || []).forEach(function (v, i) { if (v !== null && v !== undefined) saved6[i] = Number(v); });
    (ans.p7 || []).forEach(function (v, i) {
      if (v && v.k) saved7[i] = { k: v.k, otherText: v.otherText || '' };
    });
  }

  /* ---------- local progress (this browser, per user — like the iOS device copy) ---------- */
  function snapshot() {
    if (!restored) return;
    try {
      localStorage.setItem(progressKey, JSON.stringify({
        at: screens[at], answers: toAnswers(), p3Trigger: !!p3Trigger, savedAt: new Date().toISOString()
      }));
    } catch (e) { /* storage full/blocked — non-fatal */ }
  }
  function restoreLocal() {
    try {
      var raw = localStorage.getItem(progressKey); if (!raw) return false;
      var snap = JSON.parse(raw); if (!snap || !snap.answers) return false;
      fromAnswers(snap.answers);
      p3Trigger = !!snap.p3Trigger;
      var idx = screens.indexOf(snap.at);
      at = idx >= 0 ? idx : 0;
      return true;
    } catch (e) { return false; }
  }

  /* ---------- backend ---------- */
  function unwrapLayer7(raw) {
    var text = raw;
    for (var i = 0; i < 3; i++) {
      try {
        var v = JSON.parse(text);
        if (v && typeof v === 'object') return v;
        if (typeof v === 'string') { text = v; continue; }
      } catch (e) { break; }
    }
    return null;
  }

  function fetchRemote() {
    if (ANON) return Promise.resolve(null); /* nothing stored server-side without an account */
    return fetch(API + '/api/v1/quiz/results/' + encodeURIComponent(sess.sub.toUpperCase()), { headers: authHeaders() })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var d = j && (j.results || j.data || j);
        if (!d) return null;
        purchased = !!(d.fullResultPurchased || d.full_result_purchased);
        var raw = d.layer7Result || d.layer7_result;
        if (!raw) return null;
        var env = typeof raw === 'string' ? unwrapLayer7(raw) : raw;
        if (!env || !env.ednaV2) return null;  /* old-quiz record: start fresh */
        return {
          answers: env.ednaV2.answers,
          savedAt: env.ednaV2.savedAt,
          retakeAvailableAt: d.retakeAvailableAt || d.retake_available_at || null
        };
      })
      .catch(function () { return null; });
  }

  function submit() {
    if (ANON) return; /* saved locally; submitted after the account is created (the gate) */
    if (submitted) return;
    submitted = true;
    var payload = {
      userId: sess.sub.toUpperCase(),       /* iOS stores the sub UPPERCASED; keep one convention */
      email: sess.email, name: sess.name,
      savedAt: new Date().toISOString(),
      answers: toAnswers(),
      clientResult: computeReport()         /* reference implementation; server recomputes and compares */
    };
    localStorage.setItem(pendingKey, JSON.stringify(payload));
    send(payload);
  }
  function send(payload) {
    fetch(API + '/api/v2/edna/complete', { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        localStorage.removeItem(pendingKey);
        localStorage.removeItem(progressKey);
        completedInfo = { savedAt: payload.savedAt, retakeAvailableAt: j && j.retakeAvailableAt };
        console.log('✅ [EDNA] Result stored on the server');
      })
      .catch(function (e) {
        console.warn('⚠️ [EDNA] Submit failed, queued for retry:', e.message);
      });
  }
  function retryPending() {
    if (ANON) return;
    try {
      var raw = localStorage.getItem(pendingKey); if (!raw) return;
      send(JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }

  /* ---------- preview-control removal + production hooks around render() ---------- */
  var jumpBar = document.querySelector('.jump'); if (jumpBar) jumpBar.remove();

  function stripPreviewControls() {
    /* the report/detailed preview bars ("Preview as", size toggle) live in .rp-preview / .rd-preview */
    document.querySelectorAll('.rp-preview, .rd-preview').forEach(function (el) { el.remove(); });
    document.querySelectorAll('h1').forEach(function (h) {
      if ((h.textContent || '').trim() === 'Preview as') {
        var sec = h.closest('section') || h.parentElement;
        if (sec) sec.remove();
      }
    });
    ['rp-as', 'rp-sizes'].forEach(function (n) {
      var el = document.querySelector('input[name="' + n + '"]');
      if (el) {
        var box = el.closest('section') || el.closest('.seg') || el.parentElement;
        if (box) box.remove();
      }
    });
    var asSel = document.getElementById('rp-as-sel');
    if (asSel) { var sb = asSel.closest('section') || asSel.parentElement; if (sb) sb.remove(); }
  }

  function deriveCore() {
    try {
      var a1 = p1answers();
      if (!a1.example) { var r1 = scorePart1(a1.ans); core = r1.core; lean = r1.lean; }
    } catch (e) { /* scoring not ready on very first screens */ }
  }

  /* ---------- PDF download (17 Nov 2026) ----------
   * "Your free report is saved in your account... and download it as a PDF" (approved copy).
   * The PDF is the approved on-screen report itself, printed: a print stylesheet plus the
   * browser's save-as-PDF. BS-DI-008 (the PDF record) is not in our handover set; until it
   * is, the PDF follows the on-screen report 1:1. The old site's server-side Puppeteer→S3
   * pipeline is a separate later work item (WEBSITE-BUILD-PLAN 17 Nov §4). */
  (function injectPrintCss() {
    var st = document.createElement('style');
    st.textContent = '@media print {'
      + ' @page { margin: 14mm; }'
      + ' html, body { background: #fff !important; }'
      + ' .progress, .actions, .modal, .linkish, .bs-pdf-note { display: none !important; }'
      + ' #screen { display: block; }'
      + ' .wrap { display: block; }'
      + ' .panel { box-shadow: none !important; border: 0; padding-left: 0; padding-right: 0; }'
      + ' h1, h2, h3 { break-after: avoid; }'
      + ' table, figure { break-inside: avoid; }'
      + ' * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }'
      + '}';
    document.head.appendChild(st);
  })();

  function printReport(label) {
    var root = document.documentElement;
    var prevTheme = root.getAttribute('data-theme');
    var prevTitle = document.title;
    root.setAttribute('data-theme', 'light'); /* the PDF always prints light */
    document.title = label; /* browsers name the saved PDF after the title */
    var restore = function () {
      if (prevTheme) root.setAttribute('data-theme', prevTheme); else root.removeAttribute('data-theme');
      document.title = prevTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    setTimeout(function () { window.print(); }, 50); /* let the theme repaint first */
    setTimeout(restore, 60000); /* fallback if afterprint never fires */
  }

  function addDashboardButton(s) {
    if (ANON || EMBED || s !== 'end') return;
    var row = document.querySelector('#screen .actions');
    if (!row || row.querySelector('.bs-dash-btn')) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'back bs-dash-btn'; b.textContent = 'My dashboard';
    b.addEventListener('click', function () { location.href = '/'; });
    row.insertBefore(b, row.firstChild);
  }

  function addPdfButton(s) {
    if (s !== 'report' && s !== 'detailed') return;
    var row = document.querySelector('#screen .actions');
    if (!row || row.querySelector('.bs-pdf-btn')) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'back bs-pdf-btn';
    b.textContent = 'Download as PDF';
    b.addEventListener('click', function () {
      printReport(s === 'detailed' ? 'E-DNA detailed report' : 'E-DNA report');
    });
    row.insertBefore(b, row.firstChild);
  }

  function lockedScreen(which) {
    var el = document.getElementById('screen');
    document.getElementById('crumb').textContent = 'E-DNA · ' + (which === 'adapt' ? 'Your plan' : 'Detailed report');
    el.innerHTML = '<div class="wrap" style="gap:24px">'
      + '<section class="panel"><h1>Your <span class="brand">detailed report</span> and workbook</h1>'
      + '<p>Every result explained: the scores behind it, your strengths and blind spots, the contexts in which you switch, and your plan. It comes with a free workbook built from your answers.</p>'
      + '<p><a class="btn" href="' + CHECKOUT + '" target="_blank" rel="noopener">Get my detailed report (£99)</a></p>'
      + '<p class="small">Already purchased? It can take a minute to come through. <button type="button" id="edna-refresh" class="linkish">Check again</button></p>'
      + '<p class="small"><button type="button" id="edna-back" class="linkish">Back to my report</button></p>'
      + (EMBED ? '' : '<p class="small"><button type="button" id="edna-dash" class="linkish">My dashboard</button></p>')
      + '</section></div>';
    var rb = document.getElementById('edna-refresh');
    if (rb) rb.addEventListener('click', function () {
      fetchRemote().then(function () { renderGuarded(); });
    });
    var bb = document.getElementById('edna-back');
    if (bb) bb.addEventListener('click', function () { at = screens.indexOf('report'); renderGuarded(); });
    var db = document.getElementById('edna-dash');
    if (db) db.addEventListener('click', function () { location.href = '/'; });
  }

  /* The end-of-test account gate (Fariza, 18 Nov 2026): the test runs without an account;
     the report needs one. Wording follows her instruction; flagged for her copy approval. */
  function accountGate() {
    var el = document.getElementById('screen');
    document.getElementById('crumb').textContent = 'E-DNA · Your report';
    el.innerHTML = '<div class="wrap" style="gap:24px">'
      + '<section class="panel"><h1>Create an account to <span class="brand">receive your report</span></h1>'
      + '<p><b>You have finished the E-DNA assessment.</b> Your answers are saved on this device. '
      + 'Create a free account and your report is ready the moment you sign in — on the website and in the iOS app.</p>'
      + '<div class="actions"><button type="button" id="gate-signin" class="back">Sign in</button>'
      + '<button type="button" id="gate-create">Create my free account</button></div>'
      + '</section></div>';
    document.getElementById('gate-create').addEventListener('click', function () {
      location.href = '/?signin=1&from=edna&mode=register';
    });
    document.getElementById('gate-signin').addEventListener('click', function () {
      location.href = '/?signin=1&from=edna';
    });
  }

  /* Submit whenever a COMPLETE set of real answers exists (18 Nov 2026): the person can
     come back on any screen ("What comes next", the plan) and the result must still reach
     the server. Previously only the finish/report screens submitted, so a completed run
     restored elsewhere never saved. */
  function submitIfComplete() {
    if (ANON || submitted || completedInfo) return;
    try {
      var R = computeReport();
      var allReal = R && R.example && Object.keys(R.example).every(function (k) { return !R.example[k]; });
      if (allReal) submit();
    } catch (e) { /* not complete yet */ }
  }

  var origRender = render;
  function renderGuarded() {
    deriveCore();
    var s = screens[at];
    if (ANON && (s === 'report' || s === 'end' || s === 'detailed' || s === 'adapt')) {
      snapshot(); /* keep the finished answers safe before leaving for sign-up */
      accountGate();
      return;
    }
    if ((s === 'detailed' || s === 'adapt') && !purchased) {
      lockedScreen(s);
      snapshot();
      return;
    }
    origRender();
    stripPreviewControls();
    addPdfButton(s);
    addDashboardButton(s);
    if (s === 'finish' || s === 'report' || s === 'end') submitIfComplete();
    snapshot();
  }
  render = renderGuarded;

  /* ---------- start-up: restore, then show the right screen ---------- */
  at = 0; /* production starts at the welcome screen, not the preview's report */

  fetchRemote().then(function (remote) {
    if (remote && remote.answers) {
      fromAnswers(remote.answers);
      completedInfo = { savedAt: remote.savedAt, retakeAvailableAt: remote.retakeAvailableAt };
      submitted = true; /* already stored server-side */
      at = screens.indexOf('report');
      /* #plan (the dashboard's "Your E-DNA plan" card, 18 Nov 2026) opens the approved
         'adapt' screen; renderGuarded shows the £99 gate until purchased, as on iOS. */
      if (window.location.hash === '#plan') at = screens.indexOf('adapt');
      restored = true;
      renderGuarded();
    } else if (restoreLocal()) {
      /* #plan works here too: a completed-but-locally-restored person still reaches the
         plan screen (the £99 gate shows until the purchase flag is confirmed remotely). */
      if (window.location.hash === '#plan' && screens[at] === 'report') at = screens.indexOf('adapt');
      restored = true;
      renderGuarded();
      /* one send only: a queued payload retries; otherwise a complete run submits fresh */
      var hasPending = false; try { hasPending = !!localStorage.getItem(pendingKey); } catch (e) {}
      if (hasPending) { if (!submitted) retryPending(); submitted = true; }
      else submitIfComplete();
    } else {
      restored = true;
      retryPending();
      snapshot(); /* start the progress record from the welcome screen */
    }
  });
})();
