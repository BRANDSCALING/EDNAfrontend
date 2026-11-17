/* REPORT-JS-START */
/* ===== E-DNA scoring and basic report (preview). Scoring rules: BS-DI-004 Sections 1.5, 2.4, 3.4, 4.3, 5.3, 6.3, 7.4 (starting values). Page wording and layout: BS-DI-003 2.8, 3.8, 4.6, 5.6, 6.8, 7.8, 8.8 and BS-DI-005. ===== */
let lean = 'none'; let rpSizes = 'spec'; let rpSizesInit = false;   /* preview only: 'spec' = 28/19/13 px (BS-DI-005); 'app' = 24/17/13, the app's own sizes (BS-DI-007 Section 0), proposed for the phone */   /* preview only: the Part 1 leaning when core === 'mixed' ('architect', 'alchemist' or 'none'). In the app it comes from Part 1. */
const P1_CODE = [['L', 'F'], ['F', 'L'], ['L', 'F']];   /* option index -> loop, per question position: begins with, checked by, finally validated by (the "checked by" options are shown feeling-first) */
const P1_CTX = { '1': 'Investing money', '2': 'Pricing', '3': 'Choosing who to work with', '4': 'Launching', '5': 'A personal decision', '6': 'Accepting an offer', '7': 'Ending an arrangement' };

/* ---- example answers, preview only: used for any part the person has not answered in this preview ---- */
const EX_P1 = {
  architect: { '1A': 'LFL', '1B': 'LFL', '2A': 'LFL', '2B': 'FLF', '3A': 'LFL', '3B': 'LFL', '4A': 'LDL', '4B': 'LFL' },
  alchemist: { '1A': 'FLF', '1B': 'FLF', '2A': 'FLF', '2B': 'LFL', '3A': 'FLF', '3B': 'FLF', '4A': 'FDF', '4B': 'FLF' },
  mixedA: { '1A': 'LFL', '1B': 'FLF', '2A': 'LFL', '2B': 'FLF', '3A': 'LFL', '3B': 'LFL', '4A': 'FLF', '4B': 'LFL' },
  mixedR: { '1A': 'FLF', '1B': 'LFL', '2A': 'FLF', '2B': 'LFL', '3A': 'FLF', '3B': 'FLF', '4A': 'LFL', '4B': 'FLF' },
  mixed: { '1A': 'LFL', '1B': 'LFL', '2A': 'FLF', '2B': 'FLF', '3A': 'LFL', '3B': 'FLF', '4A': 'FLF', '4B': 'LFL' }
};
const EX_P2 = {
  architect: ['MS', 'MS', 'MS', 'IA', 'MS', 'MS', 'MS', 'SB', 'MS', 'MS'],
  alchemist: ['VO', 'MP', 'VO', 'MP', 'EE', 'MP', 'VO', 'MP', 'VO', 'EE'],
  mixedA: ['MS', 'VO', 'IA', 'MS', 'MP', 'MS', 'SB', 'EE', 'MS', 'VO'],
  mixedR: ['VO', 'MS', 'MP', 'VO', 'IA', 'VO', 'EE', 'SB', 'VO', 'MS'],
  mixed: ['IA', 'MP', 'IA', 'MS', 'MP', 'IA', 'VO', 'MP', 'IA', 'MP']
};
/* Part 3 example: option index chosen on each screen, in p3list() order */
const EX_P3 = { architect: [0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0], alchemist: [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0], mixed: [0, 2, 2, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0] };
const EX_P4 = [2, 0, 0, 0, 0, 0, 0, 0, 1, 0];
const EX_P5 = [1, 0, 2, 1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 2, 0, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1];
const EX_P6 = [4, 3, 3, 1, 1, 1, 1, 1, 3, 4, 3, 3, 3, 2, 2, 2, 1, 2, 3, 3];
const EX_P7 = ['A', 'B', 'B', 'A', 'both', 'B', 'both', 'both', 'both', 'A', 'B', 'both', 'A', 'A', 'B', 'A', 'A', 'B', 'A', 'both', 'Craft'];
const EX_P7_MIXED = EX_P7.slice(); EX_P7_MIXED[5] = 'other'; EX_P7_MIXED[11] = 'other';   /* preview: a belief with no clear result (two Neither / Other on Opportunity is) */

function exKey() { return core === 'mixed' ? (lean === 'architect' ? 'mixedA' : lean === 'alchemist' ? 'mixedR' : 'mixed') : core; }

/* ---- gather answers: the person's own where complete, otherwise the example set (flagged) ---- */
function p1answers() {
  const out = {}; let complete = true;
  scenarios.forEach((sc, i) => { if (sc.reserve && !reserveDone) return; const a = saved[i]; if (!a || a.q0 === null || a.q1 === null || a.q2 === null || a.q0 === undefined) { complete = false; return; }
    out[sc.id] = [0, 1, 2].map(q => a['q' + q] === 'either' ? 'D' : P1_CODE[q][Number(a['q' + q])]).join(''); });
  if (!complete || Object.keys(out).length < 8) return { ans: EX_P1[exKey()], example: true };
  return { ans: out, example: false };
}
function p1pattern(s) { const b = s[0], v = s[2]; if (b === 'D' || v === 'D') return 'Either'; if (b === 'L' && v === 'L') return 'Architect'; if (b === 'F' && v === 'F') return 'Alchemist'; return 'Mixed'; }
function scorePart1(ans) {
  const W = [1.5, 1, 1.5]; const normal = {}, stress = {}; let eithers = 0; const tot = { A: 0, B: 0 }; const pts = {};
  Object.keys(ans).forEach(id => { const s = ans[id]; let A = 0, B = 0; for (let i = 0; i < 3; i++) { if (s[i] === 'L') A += W[i]; else if (s[i] === 'F') B += W[i]; else { A += W[i] / 2; B += W[i] / 2; } }
    const pat = p1pattern(s); if (pat === 'Either') eithers++; tot.A += A; tot.B += B; (id.endsWith('A') ? normal : stress)[id[0]] = { pat, A, B }; pts[id] = { A, B, pat }; });
  const ctxs = Object.keys(normal).sort(); const n = Object.keys(ans).length; const need = ctxs.length === 4 ? 3 : 5; const unstableLimit = ctxs.length === 4 ? 2 : 3;
  const pats = ctxs.map(c => normal[c].pat); const cA = pats.filter(p => p === 'Architect').length, cB = pats.filter(p => p === 'Alchemist').length;
  const lead = cA >= need ? 'Architect' : cB >= need ? 'Alchemist' : null;
  const ctxIdx = {}; let unstable = 0; const switched = [];
  ctxs.forEach(c => { const A = normal[c].A + (stress[c] ? stress[c].A : 0), B = normal[c].B + (stress[c] ? stress[c].B : 0); ctxIdx[P1_CTX[c]] = A + B ? Math.abs(A - B) / (A + B) : 0; if (ctxIdx[P1_CTX[c]] < 0.5) unstable++;
    const np = normal[c].pat, sp = stress[c] ? stress[c].pat : np; if (lead && np === lead && sp !== lead && sp !== 'Either') switched.push({ ctx: P1_CTX[c], kind: sp === 'Mixed' ? 'partial' : 'full' }); });
  const overall = (tot.A - tot.B) / (tot.A + tot.B);
  let result, why = '';
  if (n >= 14 && eithers >= 5) { result = 'Mixed'; why = '5 or more Depends out of 14: retake in 4 weeks'; }
  else if (lead && unstable < unstableLimit && eithers < 3) { result = lead; }
  else if (lead) { result = 'Mixed (' + lead + '-leaning)'; why = lead + ' leads under normal conditions but ' + unstable + ' contexts are unstable'; }
  else if (overall >= 0.15) { result = 'Mixed (Architect-leaning)'; why = 'no pattern dominates; overall index ' + overall.toFixed(2); }
  else if (overall <= -0.15) { result = 'Mixed (Alchemist-leaning)'; why = 'no pattern dominates; overall index ' + overall.toFixed(2); }
  else { result = 'Mixed'; why = 'no pattern dominates; overall index ' + overall.toFixed(2); }
  const coreOf = result === 'Architect' ? 'architect' : result === 'Alchemist' ? 'alchemist' : 'mixed';
  const leanOf = result.indexOf('Architect-leaning') > 0 ? 'architect' : result.indexOf('Alchemist-leaning') > 0 ? 'alchemist' : 'none';
  return { result, core: coreOf, lean: leanOf, why, scenarios: n, eithers, normalPatterns: pats, switched, fullSwitch: switched.some(s => s.kind === 'full'), ctxIdx, unstable, overall: Math.round(overall * 100) / 100, pts };
}

const SUBS = ['MS', 'SB', 'IA'], SUBA = ['VO', 'MP', 'EE'];
const W2 = { 0: 1.5, 1: 1.5, 8: 1.5, 9: 1.5 };
function p2answers() { const out = []; for (let i = 0; i < 10; i++) { if (!saved2[i]) return { ans: EX_P2[exKey()], example: true }; out.push(saved2[i]); } return { ans: out, example: false }; }
function scorePart2(ans, coreT, fullSwitch) {
  const side = coreT === 'architect' ? SUBS : coreT === 'alchemist' ? SUBA : SUBS.concat(SUBA); const s = {}; side.forEach(k => s[k] = 0); let ultPicks = [];
  ans.forEach((k, i) => { const w = W2[i] || 1; if (k === 'UA' || k === 'UAl') { ultPicks.push(i); (k === 'UA' ? SUBS : SUBA).forEach(t => { if (t in s) s[t] += w / 3; }); } else if (k in s) s[k] += w; });
  const pairs = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]; const consistent = pairs.filter(p => ans[p[0]] === ans[p[1]]).length;
  const total = Object.values(s).reduce((a, b) => a + b, 0) || 1; const ranked = Object.keys(s).sort((a, b) => s[b] - s[a]);
  const out = { scores: s, consistent, flag: consistent < 3 || s[ranked[0]] / total < 0.4 };
  if (coreT === 'mixed') {
    const sumA = SUBS.reduce((a, k) => a + s[k], 0), sumR = SUBA.reduce((a, k) => a + s[k], 0); out.sideA = sumA; out.sideR = sumR;
    /* Leaning after Part 2 (BS-DI-003 3.9): each pick counts for its side (Architect subtype or The Ultimate Architect = Architect; Alchemist likewise). 7 or more of 10 on one side sets the leaning, and may reverse the Part 1 leaning; otherwise the Part 1 leaning stands. Core type stays Mixed. */
    const picksA = ans.filter(k => k === 'UA' || SUBS.indexOf(k) >= 0).length, picksR = ans.filter(k => k === 'UAl' || SUBA.indexOf(k) >= 0).length; out.picksA = picksA; out.picksR = picksR; out.lean1 = lean;
    out.lean = picksA >= 7 ? 'architect' : picksR >= 7 ? 'alchemist' : lean; lean = out.lean;
    if (lean === 'architect') out.likely = SUBS.slice().sort((a, b) => s[b] - s[a])[0];
    else if (lean === 'alchemist') out.likely = SUBA.slice().sort((a, b) => s[b] - s[a])[0];
    else { const prs = [['MS', 'VO'], ['IA', 'MP'], ['SB', 'EE']]; out.pair = prs.slice().sort((a, b) => (s[b[0]] + s[b[1]]) - (s[a[0]] + s[a[1]]))[0]; }
    return out;
  }
  /* The Ultimate (BS-DI-003 3.9, BS-DI-004 2.4): more than 10 years' experience (profile answer D) needs the Ultimate on at least 7 of 10; everyone else on all 10. The four criteria apply to both. */
  const experienced = (typeof profile !== 'undefined') && profile === 3; const need = experienced ? 7 : 10;
  const c1 = ultPicks.length >= need && [0, 1, 8, 9].every(i => ultPicks.indexOf(i) >= 0);
  const rest = ans.filter(k => k !== 'UA' && k !== 'UAl'); const c2 = rest.length === 0 || new Set(rest).size >= 2;
  const c3 = side.every(k => s[k] >= 2); const c4 = !fullSwitch; out.ultimate = { c1, c2, c3, c4, need, experienced };
  if (c1 && c2 && c3 && c4) { out.result = coreT === 'architect' ? 'UA' : 'UAl'; return out; }
  out.result = ranked[0]; if (s[ranked[0]] - s[ranked[1]] <= 1.0) out.second = ranked[1];
  return out;
}

const LV3 = [[85, 'Mastery'], [70, 'High'], [50, 'Moderate'], [30, 'Low'], [0, 'Very low']];
function level3(x) { return LV3.find(l => x >= l[0])[1]; }
function p3answers() {
  const list = p3list(); const out = {}; let complete = true;
  list.forEach(it => { const key = it.q.id + '-' + it.ver + (it.recall || ''); const sv = saved3[key]; if (!sv || sv.a === undefined) complete = false; out[key] = sv; });
  if (complete) return { ans: out, example: false };
  const ex = EX_P3[core]; const o2 = {}; list.forEach((it, i) => { o2[it.q.id + '-' + it.ver + (it.recall || '')] = { a: ex[i] }; }); return { ans: o2, example: true };
}
function p3score(it, sv, p1ans) {
  const q = it.q, ver = it.ver; const opts = (ver === 'mixed' && q.mixedOpts) ? q.mixedOpts : (q.v ? q.v[ver].opts : q.opts); const o = opts[sv.a]; if (!o) return 0;
  if (q.id === 'P3-Q01' || q.id === 'P3-Q03') { const seq = p1ans[it.recall]; if (!seq || o.k === 'NA' || !o.k) return 0; const pat = seq[0] + seq[2]; if (pat.indexOf('D') >= 0) return 50; let m = 0; if (o.k[0] === pat[0]) m++; if (o.k[1] === pat[1]) m++; return m === 2 ? 100 : m === 1 ? 50 : 0; }
  if (q.id === 'P3-Q05' || q.id === 'P3-Q06') { if (ver === 'mixed') return o.s || 0; const want = (q.loop === ver) ? 'same' : 'diff'; return o.k === want ? 100 : 0; }
  return o.s || 0;
}
function scorePart3(ans, p1ans) {
  const list = p3list(); const sc = {}; list.forEach(it => { sc[it.q.id + '-' + it.ver + (it.recall || '')] = p3score(it, ans[it.q.id + '-' + it.ver + (it.recall || '')] || {}, p1ans); });
  const g = k => sc[k] === undefined ? 0 : sc[k]; const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
  let res;
  if (core !== 'mixed') {
    const c = core, same = c === 'architect' ? 'P3-Q05' : 'P3-Q06', alt = c === 'architect' ? 'P3-Q06' : 'P3-Q05';
    const dom = g('P3-Q01-' + c + '1A'); const non = avg([g('P3-Q02-' + c), g('P3-Q03-' + c + '2B'), g('P3-Q04-' + c)]);
    const sm = avg([g(same + '-' + c), g('P3-Q08-' + c), g('P3-Q11-' + c)]);
    const al = (g(alt + '-' + c) + 1.25 * g('P3-Q07-' + c) + g('P3-Q09-' + c) + 1.25 * g('P3-Q10-' + c) + g('P3-Q12-' + c)) / 5.5;
    res = [{ k: 'Dominant-loop awareness', v: dom, loop: c }, { k: 'Non-dominant-loop awareness', v: non, loop: c === 'architect' ? 'alchemist' : 'architect' }, { k: 'Same-loop awareness', v: sm, loop: c }, { k: 'Alternate-loop awareness', v: al, loop: c === 'architect' ? 'alchemist' : 'architect' }];
    const cap = dom; res.forEach((r, i) => { r.capped = i > 0 && r.v > cap; if (r.capped) r.v = cap; r.level = level3(r.v); });
    const trig = g('P3-Q01-' + c + '1A') === 0 && g('P3-Q03-' + c + '2B') === 0;
    return { results: res, area: [[res[0], res[1]], [res[2], res[3]]], consistency: trig ? 'triggered: P3-Q01 and P3-Q03 point to the other loop' : 'not triggered' };
  }
  /* Mixed: per loop. Preview rule (to be confirmed in BS-DI-004 3.4): Architect-loop awareness = P3-Q01 on the Architect-pattern scenario and P3-Q02 Alchemist version (understanding a logic-first decision); Alchemist-loop awareness = P3-Q01 on the Alchemist-pattern scenario and P3-Q02 Architect version; P3-Q03 and Q04 count towards the leaning loop (Architect when none). Awareness of Architects = P3-Q05, Q07 (Alchemist version) ×1.25, Q12 (Alchemist version) plus the shared Q08, Q09, Q10 ×1.25, Q11; Awareness of Alchemists the same with Q06, Q07 and Q12 (Architect version). Each result capped at 69 (Moderate) while Part 1 is unconfirmed (BS-DI-003 4.4). */
  const shared = [g('P3-Q08-mixed'), g('P3-Q09-mixed'), g('P3-Q11-mixed')], sharedW = 1.25 * g('P3-Q10-mixed');
  const lp = lean === 'alchemist' ? 'alchemist' : 'architect';
  const archSelf = [g('P3-Q01-architect1A'), g('P3-Q02-alchemist')], alchSelf = [g('P3-Q01-alchemist2A'), g('P3-Q02-architect')];
  (lp === 'architect' ? archSelf : alchSelf).push(g('P3-Q03-architect2B'), g('P3-Q04-architect'));
  const ofA = (g('P3-Q05-mixed') + 1.25 * g('P3-Q07-alchemist') + g('P3-Q12-alchemist') + shared[0] + shared[1] + shared[2] + sharedW) / 7.5;
  const ofR = (g('P3-Q06-mixed') + 1.25 * g('P3-Q07-architect') + g('P3-Q12-architect') + shared[0] + shared[1] + shared[2] + sharedW) / 7.5;
  const A = { k: 'Architect-loop awareness', v: avg(archSelf), loop: 'architect' }, R = { k: 'Alchemist-loop awareness', v: avg(alchSelf), loop: 'alchemist' };
  const OA = { k: 'Awareness of Architects', v: ofA, loop: 'architect' }, OR = { k: 'Awareness of Alchemists', v: ofR, loop: 'alchemist' };
  if (lean === 'architect') { A.k += ' (your leaning and possible Dominant loop)'; R.k += ' (your possible non-dominant loop)'; }
  if (lean === 'alchemist') { R.k += ' (your leaning and possible Dominant loop)'; A.k += ' (your possible non-dominant loop)'; }
  const all = [A, R, OA, OR]; const above = all.some(r => r.v > 69); const capDom = lean === 'alchemist' ? R.v : lean === 'architect' ? A.v : Math.max(A.v, R.v);
  all.forEach(r => { r.raw = r.v; if (r.v > capDom) r.v = capDom; if (r.v > 69) r.v = 69; r.level = level3(r.v); });
  const self = lean === 'alchemist' ? [R, A] : [A, R], others = lean === 'alchemist' ? [OR, OA] : [OA, OR];
  return { results: all, area: [self, others], consistency: above ? 'triggered: a result above Moderate before the cap' : 'not triggered' };
}

const P4_DESC = { Visual: 'diagrams, charts', Auditory: 'discussion, listening, repetition', 'Read/Write': 'text, lists, notes', Kinaesthetic: 'hands-on, doing', Multimodal: 'a flexible mix', Structured: 'step by step, outlines and order', Global: 'big picture first, then detail', Concrete: 'facts, details, real examples', Abstract: 'theories, patterns, connections', Flexible: 'moves between the two', Individual: 'alone, at your own rhythm', Collaborative: 'discussion and shared energy', Fast: 'short intense bursts, momentum', Slow: 'steady and methodical, depth', Versatile: 'fast when needed, slow for mastery' };
const P4_DOM = [['Modality', 'How information comes in', ['Visual', 'Auditory', 'Read/Write', 'Kinaesthetic', 'Multimodal'], 'moves between the two'], ['Approach', 'How information is ordered', ['Structured', 'Global', 'Adaptive'], 'moves between the two'], ['Concept processing', 'How information is framed', ['Concrete', 'Abstract', 'Flexible'], ''], ['Working environment', 'Where information is best absorbed', ['Individual', 'Collaborative', 'Adaptive'], 'works well in both'], ['Pace', 'How information flows', ['Fast', 'Slow', 'Versatile'], '']];
function p4answers() { const out = []; for (let i = 0; i < 10; i++) { if (saved4[i] === undefined) return { ans: EX_P4, example: true }; out.push(saved4[i]); } return { ans: out, example: false }; }
function scorePart4(ans) { const out = []; let clear = 0; P4_DOM.forEach((d, i) => { const a = part4[i * 2].opts[ans[i * 2]].r, b = part4[i * 2 + 1].opts[ans[i * 2 + 1]].r; if (a === b) { out.push({ dom: d[0], r: a, clear: true }); clear++; } else out.push({ dom: d[0], r: P4_FLAT[d[0]], clear: false }); }); return { domains: out, profile: clear >= 3 ? 'clear' : 'flat' }; }

const P5_DOMS = ['Attention and regulation', 'Language and processing', 'Structure and routine', 'Sensory load', 'Body chemistry and diet'];
const P5_PAT = { 'Attention and regulation': ['Fast-switching focus', 'Fast idea generation, creative leaps, energy under pressure'], 'Language and processing': ['Visual and spoken processing', 'Pattern recognition, storytelling, seeing connections others miss'], 'Structure and routine': ['Structure and clarity', 'Precision, sustained focus, deep understanding of systems'], 'Sensory load': ['Sensory sensitivity', 'Fine perception, noticing signals early'] };
function p5answers() { const out = []; for (let i = 0; i < part5.length; i++) { if (saved5[i] === undefined) return { ans: EX_P5, example: true, consent: consent5 === null ? true : consent5 }; out.push(saved5[i]); } return { ans: out, example: false, consent: consent5 === null ? false : consent5 }; }
function scorePart5(ans, consent) {
  const dom = P5_DOMS.map(d => { let pts = 0; part5.forEach((st, i) => { if (st.d === d) pts += st.rev ? 2 - ans[i] : ans[i]; }); const sc = pts / 8 * 100; return { dom: d, score: Math.round(sc), level: sc >= 60 ? 'High' : sc >= 40 ? 'Moderate' : 'Low', blocks: sc >= 60 ? 3 : sc >= 40 ? 2 : 1 }; });
  const patterns = dom.filter(d => d.level === 'High' && P5_PAT[d.dom]).map(d => P5_PAT[d.dom]); const layered = patterns.length >= 2;
  const strengths = ['depth of focus', 'pattern recognition', 'creativity'].map(n => { let pts = 0; part5.forEach((st, i) => { if (st.d === 'Strength: ' + n) pts += ans[i]; }); return { n, score: Math.round(pts / 4 * 100) }; }).filter(s => s.score >= 60);
  const style = patterns.length === 0 ? 'Neurotypical people' : strengths.length ? 'Neurodivergent people with exceptional strengths' : 'Neurodivergent people';
  return { domains: dom, patterns, layered, strengths, style, consent: !!consent };
}

const P6_DOMS = [['Mindset', 'Fixed', 'Situational', 'Growth'], ['Confidence', 'Self-doubting', 'Situational', 'Confident'], ['Patience', 'Impulsive', 'Balanced', 'Patient'], ['Risk style', 'Risk-averse', 'Risk-balanced', 'Risk-taking'], ['Energy', 'Inward', 'Balanced', 'Outward']];
function p6answers() { const out = []; for (let i = 0; i < part6.length; i++) { if (saved6[i] === undefined) return { ans: EX_P6, example: true }; out.push(saved6[i]); } return { ans: out, example: false }; }
function scorePart6(ans) { return P6_DOMS.map(d => { let pts = 0; part6.forEach((st, i) => { if (st.d === d[0]) pts += st.rev ? 4 - ans[i] : ans[i]; }); const sc = pts / 16 * 100; const band = sc < 40 ? 0 : sc < 70 ? 1 : 2; return { dom: d[0], score: Math.round(sc), band, labels: [d[1], d[2], d[3]], result: d[band + 1] }; }); }

const P7_B = [['Success means', [0, 6, 12, 18], 'Profit', 'Purpose', 'Profit and purpose'], ['Build for', [1, 7, 13], 'Speed', 'Craft', 'Speed and craft'], ['Progress means', [2, 8, 14], 'New', 'Proven', 'New or proven'], ['Proof is', [3, 9, 15], 'Numbers', 'Stories', 'Numbers and stories'], ['Others are seen as', [4, 10, 16, 19], 'Collaborators', 'Competitors', 'Collaborators or competitors'], ['Opportunity is', [5, 11, 17], 'Plenty', 'Limited', 'Plenty or limited']];
function p7answers() { const out = []; for (let i = 0; i < part7.length; i++) { if (!saved7[i] || !saved7[i].k) return { ans: exKey() === 'mixed' ? EX_P7_MIXED : EX_P7, example: true }; out.push(saved7[i].k); } return { ans: out, example: false }; }
function scorePart7(ans) {
  const VAL = { A: 0, both: 50, B: 100 }; const beliefs = P7_B.map(b => { const vals = b[1].filter(i => ans[i] !== 'other').map(i => VAL[ans[i]]); const nOther = b[1].length - vals.length; if (nOther >= 2 || vals.length === 0) return { belief: b[0], none: true, a: b[2], c: b[3] }; const sc = vals.reduce((x, y) => x + y, 0) / vals.length; const r = sc < 40 ? 0 : sc < 70 ? 1 : 2; return { belief: b[0], score: Math.round(sc), band: r, a: b[2], c: b[3], both: b[4], result: r === 0 ? b[2] : r === 2 ? b[3] : 'Both' }; });
  const ends = beliefs.filter(b => !b.none).map(b => b.result); const flagged = [['Speed', 'Limited'], ['Purpose', 'Stories'], ['Craft', 'Competitors'], ['New', 'Limited']].filter(p => ends.indexOf(p[0]) >= 0 && ends.indexOf(p[1]) >= 0).map(p => p.join(' + '));
  return { beliefs, flagged, override: ans[20] };
}

function computeReport() {
  const a1 = p1answers(); const r1 = scorePart1(a1.ans);
  /* preview: the Part 1 result follows the "Preview as" choice when example answers are used; with real answers it follows the answers */
  if (!a1.example) { core = r1.core; lean = r1.lean; }
  const a2 = p2answers(); const r2 = scorePart2(a2.ans, core, r1.fullSwitch);
  if (core === 'mixed' && r2.lean !== undefined) { lean = r2.lean; r1.lean = r2.lean; }   /* the leaning after Part 2 is the one the report shows (BS-DI-003 3.9) */
  const a3 = p3answers(); const r3 = scorePart3(a3.ans, a1.ans);
  const a4 = p4answers(); const r4 = scorePart4(a4.ans);
  const a5 = p5answers(); const r5 = scorePart5(a5.ans, a5.consent);
  const a6 = p6answers(); const r6 = scorePart6(a6.ans);
  const a7 = p7answers(); const r7 = scorePart7(a7.ans);
  return { p1: r1, p2: r2, p3: r3, p4: r4, p5: r5, p6: r6, p7: r7, example: { p1: a1.example, p2: a2.example, p3: a3.example, p4: a4.example, p5: a5.example, p6: a6.example, p7: a7.example } };
}

/* ---------- rendering ---------- */
const SUB_TXT = {
  MS: ['Master Strategist', 'Win by sequencing the right bets at the right time.', 'Prioritising, managing several bets at once, clear trade-offs, a firm “no”.', 'Tighter feedback loops, regular demos, a shorter time from plan to learning.'],
  SB: ['Systemised Builder', 'Win by making the business run predictably.', 'Standard operating procedures, output, reliability, cost control.', 'Protect 10–15% of capacity for experiments.'],
  IA: ['Internal Analyser', 'Win by being right: truth through data and models.', 'Spotting real signals, finding cause and effect, putting numbers on risk, decision quality.', 'A shorter time to insight, and findings presented as a simple story with the numbers.'],
  UA: ['The Ultimate Architect', 'Strategy, systems and proof integrated.', 'Consistent bets, systems that scale, learning that is proven.', 'Keep testing ideas with working prototypes; invite outside challenge to the story.'],
  VO: ['Visionary Oracle', 'Win by seeing the future pattern first.', 'Stories that define a category, sensing where the market is going, unexpected bets.', 'Shorter demo cycles and more discipline about constraints.'],
  MP: ['Magnetic Perfectionist', 'Win by crafting product quality and features that draw people in.', 'An eye for product quality, detail, polished user experience, products people want.', 'Tie quality standards to business limits and ship every week.'],
  EE: ['Energetic Empath', 'Win by mobilising people and energy around a cause.', 'Community, partnerships, recruiting, momentum.', 'Firmer boundaries and exit rules; wins written down and formalised.'],
  UAl: ['The Ultimate Alchemist', 'Vision, quality and people integrated, with proof.', 'A story that converts, a product that pulls, communities that scale.', 'Keep operations level with the story; use data to refine the story.']
};
const PAIR_TXT = { 'MS-VO': ['Both set direction', 'One plans the future through logic, the other sees it through feeling.'], 'IA-MP': ['Both refine the detail until it is right', 'One through data, models and testing, the other through quality standards and polish.'], 'SB-EE': ['Both keep the business running day to day', 'One through systems and routines, the other through people and momentum.'] };
function rpBand(part, title) { return '<div class="rp-band"><span class="p">Part ' + part + '</span><span class="t">' + title + '</span></div>'; }
function rpType(R) { return R.p1.core; }
function exTag(on) { return on ? '<span class="rp-ex">Preview: example answers</span>' : ''; }

function loopRow(which, style, cap, labels) {
  /* which: 'A' Architect loop (Logic → Feeling → Logic) or 'R' Alchemist loop; style: 'solid', 'light' or 'grey' */
  const L = which === 'A'; const first = L ? 'Logic' : 'Feeling', mid = L ? 'Feeling' : 'Logic';
  const cls1 = style === 'grey' ? 'G' : L ? (style === 'light' ? 'Ll' : 'L') : (style === 'light' ? 'Fl' : 'F');
  const cls2 = style === 'grey' ? 'G' : L ? (style === 'light' ? 'Fl' : 'F') : (style === 'light' ? 'Ll' : 'L');   /* Fariza Javed, 15 November 2026: every Logic box is Architect Indigo and every Feeling box is Founder Red, in every loop; the Dominant loop in solid colours, the non-dominant loop in the light shades */
  const rep = style === 'grey' ? 'G' : (L ? '' : 'F');
  const u1 = L ? 'facts, numbers, a plan' : 'gut, instinct, intuition', u2 = L ? 'gut, instinct, intuition' : 'whether the numbers support it', u4 = L ? 'it adds up' : 'it feels right';
  let h = '<div class="rp-loop' + (labels ? '' : ' nolab') + '">' + (cap ? '<div class="cap">' + cap + '</div>' : '');
  const lab = s => labels ? '<div class="lab">' + s + '</div>' : ''; const ar = '<div class="ar"><span class="h">→</span><span class="v">↓</span></div>';
  h += '<div>' + lab('Begins with') + '<div class="bx ' + cls1 + '">' + first + '</div><div class="u">' + u1 + '</div></div>' + ar;
  h += '<div>' + lab('Checked by') + '<div class="bx ' + cls2 + '">' + mid + '</div><div class="u">' + u2 + '</div></div>' + ar;
  h += '<div>' + lab('') + '<div class="rep ' + rep + '"><span class="w' + (L ? 'L' : 'F') + '">' + first + '</span><span class="ar2 ' + (L ? 'LF' : 'FL') + '" aria-label="repeats"><svg viewBox="0 0 20 14" width="18" height="13"><path d="M2 4h13M12 1l3 3-3 3" class="a1"/><path d="M18 10H5M8 7l-3 3 3 3" class="a2"/></svg></span><span class="w' + (L ? 'F' : 'L') + '">' + mid + '</span></div><div class="u">can repeat any number of times</div></div>' + ar;
  h += '<div>' + lab('Finally validated by') + '<div class="bx ' + cls1 + '">' + first + '</div><div class="u">' + u4 + '</div></div>';
  h += '<ul class="uline"><li>Begins with ' + first.toLowerCase() + ': ' + u1 + '</li><li>Checked by ' + mid.toLowerCase() + ' and ' + first.toLowerCase() + ': ' + u2 + ', more data \u00b7 can repeat any number of times</li><li>End validated with ' + first.toLowerCase() + ': ' + u4 + '</li></ul></div>';
  return h;
}
function renderPart1(R) {
  const r = R.p1; const t = r.core; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(1, 'Core Type Decision Intelligence Loop Identity') + '<div class="rp-body">' + exTag(R.example.p1);
  if (t === 'architect' || t === 'alchemist') {
    const A = t === 'architect';
    h += '<h2 class="rp-name">' + (A ? 'Architect' : 'Alchemist') + '</h2><div class="rp-s">Primary AI mentor: ' + (A ? 'AI Architect' : 'AI Alchemist') + '</div>';
    h += '<p class="rp-sent">' + (A ? 'System first: your decisions begin with logic and are finally validated by logic.' : 'Feeling first: your decisions begin with feeling and are finally validated by feeling.') + '</p>';
    h += '<div class="rp-s">Your Dominant Decision Intelligence Loop</div>' + loopRow(A ? 'A' : 'R', 'solid', '', true) + '<span class="rp-pill">✓ Under stress, you mostly stick to your Dominant Decision Intelligence Loop</span>';
  } else {
    const ln = r.lean;
    h += '<h2 class="rp-name"><span class="mx">Mixed</span>' + (ln === 'architect' ? ' <span class="la">(Architect-leaning)</span>' : ln === 'alchemist' ? ' <span class="lr">(Alchemist-leaning)</span>' : '') + '</h2><div class="rp-s">' + (ln === 'architect' ? 'Primary AI mentor: AI Architect' : ln === 'alchemist' ? 'Primary AI mentor: AI Alchemist' : 'AI mentors: AI Architect and AI Alchemist') + '</div>';
    if (ln === 'architect') h += '<p class="rp-sent">You do not have a Dominant Decision Intelligence Loop yet. You lean towards the Architect loop but switch to the Alchemist loop under stress.</p>';
    else if (ln === 'alchemist') h += '<p class="rp-sent">You do not have a Dominant Decision Intelligence Loop yet. You lean towards the Alchemist loop but switch to the Architect loop under stress.</p>';
    else h += '<p class="rp-sent">We could not yet identify your Dominant Decision Intelligence Loop.</p><p class="rp-sent"><b>Target:</b> practising the workbooks will help you identify it and strengthen it. Retake E-DNA in 4 weeks.</p><p class="rp-sent"><b>Goal:</b> to identify and strengthen a Dominant Decision Intelligence Loop.</p>';
    if (ln === 'architect') h += loopRow('A', 'light', 'Normal conditions') + loopRow('R', 'light', 'Under stress');
    else if (ln === 'alchemist') h += loopRow('R', 'light', 'Normal conditions') + loopRow('A', 'light', 'Under stress');
    else h += loopRow('A', 'light', '', true) + loopRow('R', 'light');
    h += '<hr class="rp-divider"><div class="rp-note">Both core types use logic and feeling. Neither is better.</div>';

    h += '<div class="rp-s">There are two types of loop sequence: Architect and Alchemist. To improve decision making, one loop sequence should become dominant and stable.</div>';
    if (ln === 'architect') h += '<div class="rp-s">Next: practise the Architect loop with the Architect workbooks until it is your Dominant loop, then retake E-DNA in 4 weeks.</div>';
    else if (ln === 'alchemist') h += '<div class="rp-s">Next: practise the Alchemist loop with the Alchemist workbooks until it is your Dominant loop, then retake E-DNA in 4 weeks.</div>';
  }
  return h + '</div></section>';
}

function p2row(title, body) { return '<div class="rp-p4row"><button type="button" class="rp-p4head two" aria-expanded="false"><span class="l"><span class="d">' + title + '</span></span><span class="chev" aria-hidden="true">\u203a</span></button><div class="rp-p4opts" hidden><div class="rp-note">' + body + '</div></div></div>'; }
function renderPart2Phone(R) {
  /* Phone layout (proposed 13 Nov 2026): result first, the subtype map as compact tiles, then the detail (strengths, path) in tap-to-open rows. Same words and results as the web page (BS-DI-003 3.8). */
  const t = R.p1.core, r = R.p2; const A = t === 'architect'; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(2, 'Subtype Refinement Identity') + '<div class="rp-body">';
  const tiles = (side, onKey, lightKey, likelyCls) => { const ult = side === 'A' ? 'UA' : 'UAl'; const three = side === 'A' ? ['MS', 'IA', 'SB'] : ['VO', 'MP', 'EE'];
    let m = '<div class="rp-map"><div class="cap">The ' + (side === 'A' ? 'Architect' : 'Alchemist') + ' subtypes</div><div class="rp-tile' + (onKey === ult ? ' on' : '') + '">' + SUB_TXT[ult][0] + '</div><div class="rp-tiles3">';
    three.forEach(k => { let cls = 'rp-tile'; if (onKey === ult) cls += ' light'; else if (k === onKey) cls += likelyCls ? ' ' + likelyCls : ' on'; else if (k === lightKey) cls += ' light'; m += '<div class="' + cls + '">' + SUB_TXT[k][0] + '</div>'; });
    return m + '</div></div>'; };
  let rows = '';
  if (t !== 'mixed') {
    const main = r.result, sec = r.second; const ult = main === 'UA' || main === 'UAl'; const coreName = A ? 'Architect' : 'Alchemist';
    h += '<div class="rp-s">' + (sec ? 'Your subtypes' : 'Your subtype') + '</div><h2 class="rp-name">' + SUB_TXT[main][0] + '</h2>';
    if (sec) { h += '<div class="rp-sub">close second: ' + SUB_TXT[sec][0] + '</div><p class="rp-sent">Your answers are close between two subtypes. Your workbook develops both and works towards The Ultimate ' + coreName + '.</p>' + tiles(A ? 'A' : 'R', main, sec);
      rows += p2row(SUB_TXT[main][0], SUB_TXT[main][1]) + p2row(SUB_TXT[sec][0], SUB_TXT[sec][1]); }
    else { h += '<p class="rp-sent">' + SUB_TXT[main][1] + '</p>' + tiles(A ? 'A' : 'R', main, null);
      rows += p2row('Strengths', SUB_TXT[main][2]) + (ult ? p2row('Path to stay The Ultimate ' + coreName, 'Well done! Keep practising the workbooks occasionally to stay at this level. ' + SUB_TXT[main][3]) : p2row('Path to The Ultimate ' + coreName, SUB_TXT[main][3])); }
  } else if (r.likely) {
    const k = r.likely; const side = SUBS.indexOf(k) >= 0 ? 'A' : 'R';
    h += '<div class="rp-s">Your likely subtype</div><h2 class="rp-name">' + SUB_TXT[k][0] + '</h2><p class="rp-sent">You appear to be ' + SUB_TXT[k][0] + ', but as your Dominant Decision Intelligence Loop has not yet been identified, this is subject to change.</p>' + tiles(side, k, null, side === 'A' ? 'likelyA' : 'likelyR');
    rows += p2row('Your path', 'Take the workbook to help you identify and strengthen your Dominant Decision Intelligence Loop. Practise, then retake E-DNA in 4 weeks.');
    h += '{ROWS}<div class="rp-note">You have no confirmed subtype until your Dominant Decision Intelligence Loop is confirmed. Your answers also add evidence to your Part 1 leaning.</div></div></section>';
    return h.replace('{ROWS}', '<div class="rp-p4list">' + rows + '</div>');
  } else {
    const p = r.pair; const pt = PAIR_TXT[p.join('-')];
    h += '<div class="rp-s">Your likely mirror pair</div><h2 class="rp-name">' + SUB_TXT[p[0]][0] + ' or ' + SUB_TXT[p[1]][0] + '</h2><p class="rp-sent">You appear to be ' + SUB_TXT[p[0]][0] + ' or ' + SUB_TXT[p[1]][0] + ', but as your Dominant Decision Intelligence Loop has not yet been identified, this is subject to change.</p>';
    h += '<div class="rp-map"><div class="cap">Mirror subtypes: Alchemist \u21c4 Architect</div><div class="rp-mirror">';
    [['VO', 'MS'], ['MP', 'IA'], ['EE', 'SB'], ['UAl', 'UA']].forEach(pr => { const on = pr[1] === p[0]; h += '<div class="rp-tile' + (on ? ' likelyG' : '') + '">' + SUB_TXT[pr[0]][0] + '</div><div class="sw">\u21c4</div><div class="rp-tile' + (on ? ' likelyG' : '') + '">' + SUB_TXT[pr[1]][0] + '</div>'; });
    h += '</div></div>';
    rows += p2row(pt[0], pt[1]) + p2row('Your path', 'Take the workbook to help you identify and strengthen your Dominant Decision Intelligence Loop. Practise, then retake E-DNA in 4 weeks.');
    h += '<div class="rp-p4list">' + rows + '</div><div class="rp-note">You have no confirmed subtype until your Dominant Decision Intelligence Loop is confirmed.</div></div></section>';
    return h;
  }
  return h + '<div class="rp-p4list">' + rows + '</div></div></section>';
}
function renderPart2(R, narrow) {
  if (narrow) return renderPart2Phone(R);
  const t = R.p1.core, r = R.p2; const A = t === 'architect'; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(2, 'Subtype Refinement Identity') + '<div class="rp-body">' + exTag(R.example.p2) + '<div class="rp-cols"><div style="display:grid;gap:8px">';
  const tiles = (side, onKey, lightKey, likelyCls) => { const ult = side === 'A' ? 'UA' : 'UAl'; const three = side === 'A' ? ['MS', 'IA', 'SB'] : ['VO', 'MP', 'EE'];   /* display order, BS-DI-005 */
    let m = '<div class="rp-map"><div class="cap">The ' + (side === 'A' ? 'Architect' : 'Alchemist') + ' subtypes</div><div class="rp-tile' + (onKey === ult ? ' on' : (onKey && onKey !== ult && likelyCls === undefined ? '' : '')) + (onKey === ult ? '' : '') + '">' + SUB_TXT[ult][0] + '</div><div class="rp-tiles3">';
    three.forEach(k => { let cls = 'rp-tile'; if (onKey === ult) cls += ' light'; else if (k === onKey) cls += likelyCls ? ' ' + likelyCls : ' on'; else if (k === lightKey) cls += ' light'; m += '<div class="' + cls + '">' + SUB_TXT[k][0] + '</div>'; });
    return m + '</div></div>'; };
  if (t !== 'mixed') {
    const main = r.result, sec = r.second; const ult = main === 'UA' || main === 'UAl'; const coreName = A ? 'Architect' : 'Alchemist';
    h += '<div class="rp-s">' + (sec ? 'Your subtypes' : 'Your subtype') + '</div><h2 class="rp-name">' + SUB_TXT[main][0] + '</h2>';
    if (sec) h += '<div class="rp-sub">close second: ' + SUB_TXT[sec][0] + '</div><p class="rp-sent">Your answers are close between two subtypes. Your workbook develops both and works towards The Ultimate ' + coreName + '.</p><div class="rp-h13">' + SUB_TXT[main][0] + '</div><div class="rp-s">' + SUB_TXT[main][1] + '</div><div class="rp-h13">' + SUB_TXT[sec][0] + '</div><div class="rp-s">' + SUB_TXT[sec][1] + '</div>';
    else { h += '<p class="rp-sent">' + SUB_TXT[main][1] + '</p><div class="rp-h13">Strengths</div><div class="rp-s">' + SUB_TXT[main][2] + '</div>';
      if (ult) h += '<div class="rp-h13">Path to stay The Ultimate ' + coreName + '</div><div class="rp-s">Well done! Keep practising the workbooks occasionally to stay at this level. ' + SUB_TXT[main][3] + '</div>';
      else h += '<div class="rp-h13">Path to The Ultimate ' + coreName + '</div><div class="rp-s">' + SUB_TXT[main][3] + '</div>'; }
    h += '</div>' + tiles(A ? 'A' : 'R', main, sec) + '</div>';
  } else if (r.likely) {
    const k = r.likely; const side = SUBS.indexOf(k) >= 0 ? 'A' : 'R';
    h += '<div class="rp-s">Your likely subtype</div><h2 class="rp-name">' + SUB_TXT[k][0] + '</h2><p class="rp-sent">You appear to be ' + SUB_TXT[k][0] + ', but as your Dominant Decision Intelligence Loop has not yet been identified, this is subject to change.</p>';
    h += '<div class="rp-h13">Your path</div><div class="rp-s">Take the workbook to help you identify and strengthen your Dominant Decision Intelligence Loop. Practise, then retake E-DNA in 4 weeks.</div><hr class="rp-divider"><div class="rp-s">You have no confirmed subtype until your Dominant Decision Intelligence Loop is confirmed. Your answers also add evidence to your Part 1 leaning.</div>';
    h += '</div>' + tiles(side, k, null, side === 'A' ? 'likelyA' : 'likelyR') + '</div>';
  } else {
    const p = r.pair; const key = p.join('-'); const pt = PAIR_TXT[key];
    h += '<div class="rp-s">Your likely mirror pair</div><h2 class="rp-name">' + SUB_TXT[p[0]][0] + ' or ' + SUB_TXT[p[1]][0] + '</h2><p class="rp-sent">You appear to be ' + SUB_TXT[p[0]][0] + ' or ' + SUB_TXT[p[1]][0] + ', but as your Dominant Decision Intelligence Loop has not yet been identified, this is subject to change.</p>';
    h += '<div class="rp-h13">' + pt[0] + '</div><div class="rp-s">' + pt[1] + '</div><div class="rp-h13">Your path</div><div class="rp-s">Take the workbook to help you identify and strengthen your Dominant Decision Intelligence Loop. Practise, then retake E-DNA in 4 weeks.</div><hr class="rp-divider"><div class="rp-s">You have no confirmed subtype until your Dominant Decision Intelligence Loop is confirmed.</div></div>';
    h += '<div class="rp-map"><div class="cap">Mirror subtypes: Alchemist ⇄ Architect</div><div class="rp-mirror">';
    [['VO', 'MS'], ['MP', 'IA'], ['EE', 'SB'], ['UAl', 'UA']].forEach(pr => { const on = pr[1] === p[0]; h += '<div class="rp-tile' + (on ? ' likelyG' : '') + '">' + SUB_TXT[pr[0]][0] + '</div><div class="sw">⇄</div><div class="rp-tile' + (on ? ' likelyG' : '') + '">' + SUB_TXT[pr[1]][0] + '</div>'; });
    h += '</div></div></div>';
  }
  return h + '</div></section>';
}

function renderPart3(R) {
  const t = R.p1.core, r = R.p3; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(3, 'Alternate Decision Intelligence Loop Awareness') + '<div class="rp-body">' + exTag(R.example.p3);
  h += '<p class="rp-sent">' + (t === 'mixed' ? 'How well you understand both Decision Intelligence Loops, and how well you recognise each loop in other people.' : 'How well you understand your Dominant and non-dominant Decision Intelligence Loops, and how well you recognise them in others. Same loop: the Dominant loop in others that is the same as yours. Alternate loop: the Dominant loop in others that is your non-dominant loop.') + '</p>';
  const bar = x => { const n = { 'Very low': 1, 'Low': 2, 'Moderate': 3, 'High': 4, 'Mastery': 5 }[x.level]; let b = '<div class="rp-bar ' + (x.loop === 'architect' ? 'A' : 'R') + '">'; for (let i = 1; i <= 5; i++) b += '<i class="' + (i <= n ? 'f' : '') + '"></i>'; return b + '</div>'; };
  const scale = '<div class="sp"></div><div class="rp-scale"><span>Very low</span><span>Low</span><span>Moderate</span><span>High</span><span>Mastery</span></div><div class="sp"></div>';
  ['Self-awareness', 'Awareness of others'].forEach((name, ai) => { h += '<h3 class="rp-h19">' + name + '</h3><div class="rp-bars">'; r.area[ai].forEach(x => { h += '<div class="bl">' + x.k + '</div>' + bar(x) + '<div class="lv">' + x.level + '</div>'; }); h += scale + '</div>'; });
  h += '<hr class="rp-divider"><div class="rp-key"><span><i style="background:#EC4049"></i>Alchemist loop</span><span><i style="background:#42047D"></i>Architect loop</span></div>';
  if (t === 'mixed') h += '<div class="rp-note">While your Dominant Decision Intelligence Loop is not yet confirmed, each result shows Moderate at most.</div>';
  return h + '</div></section>';
}

function renderPart4Phone(R) {
  /* Phone layout (proposed 13 Nov 2026): one row per area in the pattern of iOS insight lists; the full option list opens on tap (progressive disclosure). Same words and results as the web page. */
  const t = R.p1.core, r = R.p4; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(4, 'Learning Style Preferences') + '<div class="rp-body"><div class="rp-p4list">';
  P4_DOM.forEach((d, i) => { const res = r.domains[i].r; const desc = (res === 'Adaptive') ? d[3] : P4_DESC[res];
    h += '<div class="rp-p4row"><button type="button" class="rp-p4head" aria-expanded="false"><span class="l"><span class="d">' + d[0] + '</span><span class="dd">' + d[1] + '</span></span><span class="r"><span class="rp-box">' + res + '</span><span class="desc">' + desc + '</span></span><span class="chev" aria-hidden="true">\u203a</span></button><div class="rp-p4opts" hidden><div class="rp-opts">' + d[2].map(o => '<div class="rp-opt' + (o === res ? ' on' : '') + '">' + o + '</div>').join('') + '</div></div></div>'; });
  h += '</div><div class="rp-note">Every person has a result in all five areas. No style is better than another. Tap an area to see all its options.</div>';
  return h + '</div></section>';
}
function renderPart4(R, narrow) {
  if (narrow) return renderPart4Phone(R);
  const t = R.p1.core, r = R.p4; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(4, 'Learning Style Preferences') + '<div class="rp-body">' + exTag(R.example.p4) + '<div class="rp-cards">';
  P4_DOM.forEach((d, i) => { const res = r.domains[i].r; const desc = (res === 'Adaptive') ? d[3] : P4_DESC[res]; h += '<div class="rp-card"><div class="d">' + d[0] + '</div><div class="dd">' + d[1] + '</div><div class="rp-box">' + res + '</div><div class="desc">' + desc + '</div><div class="rp-opts">' + d[2].map(o => '<div class="rp-opt' + (o === res ? ' on' : '') + '">' + o + '</div>').join('') + '</div></div>'; });
  h += '</div><hr class="rp-divider"><div class="rp-note">Every person has a result in all five areas. No style is better than another.</div>';
  return h + '</div></section>';
}

function renderPart5Phone(R) {
  /* Phone layout, third design (13 Nov 2026): all on white, no panels. Result; patterns and strengths as outlined white cards with their line visible; the five adaptation areas as thin rows. Same words and results as the web page (BS-DI-003 6.8). */
  const t = R.p1.core, r = R.p5; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(5, 'Neurodiversity &amp; Accessibility') + '<div class="rp-body">';
  if (!r.consent) h += '<div class="rp-denied"><div class="n">Permission denied</div><div class="s">You have not given permission to see this result. You can change this at any time by clicking on the i on your right.</div><button type="button" class="rp-i" id="rp-consent" aria-label="More information: give permission">i</button></div>';
  else {
    h += '<div class="rp-p5head"><div class="rp-s">Your results show similarities to those of</div><h2 class="rp-name">' + r.style + '</h2>';
    h += '<p class="rp-s p5line">' + (r.style === 'Neurotypical people' ? 'They describe how you work best. Any adaptations you need are shown below.' : r.style === 'Neurodivergent people' ? 'They describe how you work best: with adaptations in one or more areas.' : 'They describe how you work best: with adaptations in one or more areas, and with exceptional strengths in one or more areas.') + '</p></div>';
    if (r.patterns.length === 0) h += '<div class="rp-s">No specific pattern was found.</div>';
    h += '<div class="rp-plist">';
    const pc = (name, line, cls) => '<div class="rp-pcard ' + cls + '"><button type="button" class="rp-pbtn" aria-expanded="false"><span class="n">' + name + '</span><span class="chev" aria-hidden="true">\u203a</span></button><div class="s" hidden>' + line + '</div></div>';
    if (r.layered) h += pc('Layered processing', 'Two or more of the patterns below apply to you.', 'layer');
    /* the pattern cards sit two to a row and open on tap; an odd last one takes the full width */
    h += '<div class="rp-pgrid' + (r.patterns.length % 2 ? ' odd' : '') + '">' + r.patterns.map(p => pc(p[0], 'Strengths to look for: ' + p[1], '')).join('') + '</div>';
    r.strengths.forEach(s => { h += pc('Exceptional strength: ' + s.n, 'Your answers show unusual ' + s.n + '.', 'str'); });
    h += '</div><div class="rp-s">You agreed to this comparison. You can withdraw at any time in your settings.</div>';
  }
  h += '<h3 class="rp-h19" style="margin-top:4px">What to adapt in each area</h3><div class="rp-s">How much each area needs: low, moderate or high</div><div class="rp-adapt">';
  r.domains.forEach(d => { h += '<div class="row"><span>' + d.dom + '</span><span class="rp-blocks"><i class="' + (d.blocks >= 1 ? 'f' : '') + '"></i><i class="' + (d.blocks >= 2 ? 'f' : '') + '"></i><i class="' + (d.blocks >= 3 ? 'f' : '') + '"></i></span><span class="lv">' + d.level + '</span></div>'; });
  h += '</div><hr class="rp-divider"><div class="rp-foot"><b>THIS IS NOT A DIAGNOSIS.</b> Your results describe how you work best.</div>';
  return h + '</div></section>';
}
function renderPart5(R, narrow) {
  if (narrow) return renderPart5Phone(R);
  const t = R.p1.core, r = R.p5; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(5, 'Neurodiversity &amp; Accessibility') + '<div class="rp-body">' + exTag(R.example.p5) + '<div class="rp-cols eq"><div style="display:grid;gap:10px;align-content:start">';
  if (!r.consent) h += '<div class="rp-denied"><div class="n">Permission denied</div><div class="s">You have not given permission to see this result. You can change this at any time by clicking on the i on your right.</div><button type="button" class="rp-i" id="rp-consent" aria-label="More information: give permission">i</button></div>';
  else {
    h += '<div class="rp-s">Your results show similarities to those of</div><h2 class="rp-name">' + r.style + '</h2>';
    h += '<p class="rp-sent">' + (r.style === 'Neurotypical people' ? 'They describe how you work best. Any adaptations you need are shown on the right.' : r.style === 'Neurodivergent people' ? 'They describe how you work best: with adaptations in one or more areas.' : 'They describe how you work best: with adaptations in one or more areas, and with exceptional strengths in one or more areas.') + '</p>';
    if (r.patterns.length === 0) h += '<div class="rp-s">No specific pattern was found.</div>';
    if (r.layered) h += '<div class="rp-pat layer"><div class="n">Layered processing</div><div class="s">Two or more of the patterns below apply to you.</div></div>';
    r.patterns.forEach(p => { h += '<div class="rp-pat"><div class="n">' + p[0] + '</div><div class="s">Strengths to look for: ' + p[1] + '</div></div>'; });
    r.strengths.forEach(s => { h += '<div class="rp-pat"><div class="n">Exceptional strength: ' + s.n + '</div><div class="s">Your answers show unusual ' + s.n + '.</div></div>'; });
    h += '<div class="rp-s">You agreed to this comparison. You can withdraw at any time in your settings.</div>';
  }
  h += '</div><div><h3 class="rp-h19">What to adapt in each area</h3><div class="rp-s">How much each area needs: low, moderate or high</div><div class="rp-adapt">';
  r.domains.forEach(d => { h += '<div class="row"><span>' + d.dom + '</span><span class="rp-blocks"><i class="' + (d.blocks >= 1 ? 'f' : '') + '"></i><i class="' + (d.blocks >= 2 ? 'f' : '') + '"></i><i class="' + (d.blocks >= 3 ? 'f' : '') + '"></i></span><span class="lv">' + d.level + '</span></div>'; });
  h += '</div></div></div><hr class="rp-divider"><div class="rp-foot"><b>THIS IS NOT A DIAGNOSIS.</b> Your results describe how you work best.</div>';
  return h + '</div></section>';
}

function renderPart6(R) {
  const t = R.p1.core, r = R.p6; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(6, 'Mindset &amp; Personality') + '<div class="rp-body">' + exTag(R.example.p6) + '<h3 class="rp-disp">Disposition</h3><div style="display:grid;gap:14px">';
  r.forEach(d => { h += '<div class="rp-dom"><div class="dl">' + d.dom + '</div><div><div class="rp-track"><i class="' + (d.band === 0 ? 'on' : '') + '"></i><i class="' + (d.band === 1 ? 'on' : '') + '"></i><i class="' + (d.band === 2 ? 'on' : '') + '"></i><span class="mk" style="left:' + d.score + '%"></span></div><div class="rp-tl"><span>' + d.labels[0] + '</span><span>' + d.labels[1] + '</span><span>' + d.labels[2] + '</span></div></div><div class="res">' + d.result + '</div></div>'; });
  h += '</div><hr class="rp-divider"><div class="rp-note">The marker shows where the person sits. No position is better than another.</div>';
  return h + '</div></section>';
}

function renderPart7Phone(R) {
  /* Phone layout (proposed 13 Nov 2026): one row per belief, result as a chip; the three results and the Both explanation open on tap. Same words and results as the web page (BS-DI-003 8.8). */
  const t = R.p1.core, r = R.p7; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(7, 'Meta-Beliefs &amp; Values') + '<div class="rp-body"><div class="rp-h13">Beliefs &amp; values</div><div class="rp-p4list">';
  r.beliefs.forEach(b => {
    const both = !b.none && b.result === 'Both';
    const chip = b.none ? '<span class="rp-box nores">No clear result</span>' : '<span class="rp-box">' + (both ? b.both : b.result) + '</span>';
    const detail = b.none ? '<div class="rp-note">We couldn\u2019t give you a clear result for this belief. Thank you for your answers in your own words. We review every answer and use them to improve E-DNA, so future results for this part are more accurate.</div>'
      : '<div class="rp-opts">' + [b.a, 'Both', b.c].map(o => '<div class="rp-opt' + (o === b.result ? ' on' : '') + '">' + o + '</div>').join('') + '</div>' + (both ? '<div class="rp-note" style="margin-top:6px">Which one leads depends on the situation. Your detailed report explains when each one leads.</div>' : '');
    h += '<div class="rp-p4row"><button type="button" class="rp-p4head" aria-expanded="false"><span class="l"><span class="d">' + b.belief + '</span></span><span class="r">' + chip + '</span><span class="chev" aria-hidden="true">\u203a</span></button><div class="rp-p4opts" hidden>' + detail + '</div></div>'; });
  h += '</div><div class="rp-note">No belief is right or wrong, and no position is better than another. Tap a belief to see all three results.</div>';
  return h + '</div></section>';
}
function renderPart7(R, narrow) {
  if (narrow) return renderPart7Phone(R);
  const t = R.p1.core, r = R.p7; let h = '<section class="rp" data-rt="' + t + '">' + rpBand(7, 'Meta-Beliefs &amp; Values') + '<div class="rp-body">' + exTag(R.example.p7) + '<div class="rp-h13">Beliefs &amp; values</div><div style="display:grid;gap:10px">';
  r.beliefs.forEach((b, i) => { h += '<div class="rp-row"><div class="bl">' + b.belief + '</div>';
    if (b.none) h += '<div class="rp-nores">We couldn’t give you a clear result for this belief. Thank you for your answers in your own words. We review every answer and use them to improve E-DNA, so future results for this part are more accurate.</div>';
    else { const both = b.result === 'Both'; h += '<div class="rp-box">' + (both ? b.both : b.result) + (both ? '<button type="button" class="rp-i rp-tipbtn" aria-label="More information" aria-expanded="false">i</button><div class="rp-tip" hidden>Which one leads depends on the situation. Your detailed report explains when each one leads.</div>' : '') + '</div><div class="rp-pills">' + [b.a, 'Both', b.c].map(o => '<div class="rp-opt' + (o === b.result ? ' on' : '') + '">' + o + '</div>').join('') + '</div>'; }
    h += '</div>'; });
  h += '</div><hr class="rp-divider"><div class="rp-note">No belief is right or wrong, and no position is better than another.</div>';
  return h + '</div></section>';
}

function reportPreviewBar(R, narrow) {
  const opts = [['architect', 'Architect'], ['alchemist', 'Alchemist'], ['mixedA', 'Mixed (Architect-leaning)'], ['mixedR', 'Mixed (Alchemist-leaning)'], ['mixed', 'Mixed']]; const cur = exKey();
  const anyEx = Object.values(R.example).some(x => x);
  if (narrow) {
    return '<div class="rp-preview"><label>Preview as <select id="rp-as-sel">' + opts.map(o => '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label><label>Text <select id="rp-sz-sel"><option value="app"' + (rpSizes === 'app' ? ' selected' : '') + '>22 / 15 / 13 (phone, proposed)</option><option value="spec"' + (rpSizes === 'spec' ? ' selected' : '') + '>28 / 19 / 13 (BS-DI-005)</option></select></label>' + (anyEx ? '<span class="ex">' + (Object.values(R.example).every(x => x) ? 'All parts shown from example answers.' : 'Parts not answered in this preview use example answers.') + '</span>' : '') + '</div>';
  }
  const sizes = narrow ? '<span style="flex-basis:100%"></span><span><b>Report text (preview):</b></span><label><input type="radio" name="rp-sz" value="spec"' + (rpSizes === 'spec' ? ' checked' : '') + '>28 / 19 / 13 px (BS-DI-005)</label><label><input type="radio" name="rp-sz" value="app"' + (rpSizes === 'app' ? ' checked' : '') + '>24 / 17 / 13 (app sizes, proposed)</label>' : '';
  return '<div class="rp-preview"><span><b>Preview as:</b></span>' + opts.map(o => '<label><input type="radio" name="rp-as" value="' + o[0] + '"' + (o[0] === cur ? ' checked' : '') + '>' + o[1] + '</label>').join('') + sizes + (anyEx ? '<span class="ex">Parts marked “example answers” use example data, because they were not answered in this preview. Parts you answered use your answers.</span>' : '') + '</div>';
}
function reportHTML(narrow) {
  const R = computeReport();
  return '<div class="rp-root' + (narrow ? ' rp-narrow' : '') + (narrow && rpSizes === 'app' ? ' rp-app' : '') + '">' + reportPreviewBar(R, narrow) + '<h1 class="rp-h">Your E-DNA report</h1><p class="rp-lead">Your free report covers all seven parts. Each part is scored on its own and shown with its own result.</p>'
    + renderPart1(R) + renderPart2(R, narrow) + renderPart3(R) + renderPart4(R, narrow) + renderPart5(R, narrow) + renderPart6(R) + renderPart7(R, narrow) + '</div>';
}
function wireReport(root, rerender, openConsent) {
  root.querySelectorAll('input[name="rp-as"]').forEach(i => i.addEventListener('change', e => { const v = e.target.value; core = v === 'mixedA' || v === 'mixedR' || v === 'mixed' ? 'mixed' : v; lean = v === 'mixedA' ? 'architect' : v === 'mixedR' ? 'alchemist' : 'none'; rerender(); }));
  const asSel = root.querySelector('#rp-as-sel'); if (asSel) asSel.addEventListener('change', e => { const v = e.target.value; core = v === 'mixedA' || v === 'mixedR' || v === 'mixed' ? 'mixed' : v; lean = v === 'mixedA' ? 'architect' : v === 'mixedR' ? 'alchemist' : 'none'; rerender(); });
  const szSel = root.querySelector('#rp-sz-sel'); if (szSel) szSel.addEventListener('change', e => { rpSizes = e.target.value; rerender(); });
  root.querySelectorAll('input[name="rp-sz"]').forEach(i => i.addEventListener('change', e => { rpSizes = e.target.value; rerender(); }));
  root.querySelectorAll('.rp-chip').forEach(b => b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') === 'true'; root.querySelectorAll('.rp-chip').forEach(x => x.setAttribute('aria-pressed', 'false')); const line = root.querySelector('#rp-chipline'); if (on) { line.textContent = 'Tap a pattern or strength to read what it means.'; } else { b.setAttribute('aria-pressed', 'true'); line.textContent = b.dataset.d; } }));
  root.querySelectorAll('.rp-pbtn').forEach(b => b.addEventListener('click', () => { const s = b.nextElementSibling; s.hidden = !s.hidden; b.setAttribute('aria-expanded', s.hidden ? 'false' : 'true'); b.parentElement.classList.toggle('open', !s.hidden); }));
  root.querySelectorAll('.rp-p4head').forEach(b => b.addEventListener('click', () => { const o = b.nextElementSibling; o.hidden = !o.hidden; b.setAttribute('aria-expanded', o.hidden ? 'false' : 'true'); b.parentElement.classList.toggle('open', !o.hidden); }));
  root.querySelectorAll('.rp-tipbtn').forEach(b => { const tip = b.nextElementSibling; const toggle = on => { tip.hidden = !on; b.setAttribute('aria-expanded', on ? 'true' : 'false'); }; b.addEventListener('click', () => toggle(tip.hidden)); b.addEventListener('mouseenter', () => toggle(true)); b.addEventListener('mouseleave', () => toggle(false)); b.addEventListener('focus', () => toggle(true)); b.addEventListener('blur', () => toggle(false)); b.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); }); });
  const c = root.querySelector('#rp-consent'); if (c) c.addEventListener('click', openConsent);
}
/* REPORT-JS-END */
