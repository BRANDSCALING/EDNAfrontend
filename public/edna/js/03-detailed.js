/* DETAILED-JS-START */
/* E-DNA detailed report (£99). A second renderer over the same result record as the basic report (BS-DI-005 Section 18).
   Nothing is re-scored. Text from BS-DI-003 2.4 to 2.6 and 2.8. Design: BS-DI-005 specification (Inter; 28 / 19 / 13; colour by result type). */
const D1_TXT = {
  architect: { stmt: 'System first. Meaning emerges after the system makes sense.',
    strengths: ['Clarity', 'Repeatable results', 'Scale through process', 'Clear trade-offs'],
    blind: ['Slow to change direction on feeling signals', 'Can underweight brand and energy'],
    fail: ['A perfect model that never ships', 'Plans that break when conditions change', 'Misreading people whose signals are felt rather than stated'],
    best: ['Regulated industries', 'Operations-heavy scaling', 'Products where reliability leads', 'Creating systems and structure'],
    adapt: [
      ["Order of content", "Overview → Definitions → Constraints → Steps → Examples → Risks → Action", "Everything the app gives you is written in this order: your workbooks, your report pages and every AI Architect answer. You see the whole picture and the limits first, then the steps, then what it looks like done and what could go wrong, and only then what to do. Nothing asks you to act before the system makes sense."],
      ["Tools you will be given", "SOPs, checklists, dashboards, “what could go wrong” lists, decision trees, mind maps", "Inside your workbooks: when an exercise asks you to plan, price, hire or launch, it gives you one of these to fill in: a step-by-step procedure, a checklist you tick off, a dashboard page of the numbers that matter, a “what could go wrong” list (you list how the plan could fail before you start), or a decision tree. A structure to fill in, not a blank page."],
      ["How AI Architect works with you", "“What evidence would change your mind?” “Which assumption affects the result most?”", "AI Architect challenges you the way you decide. When you bring it a decision, it works through your Decision Intelligence Loop with you: the data you have, how it feels and how people react, the new data that answers that, and the decision. It asks for the evidence and the assumption behind each step, and it tells you when your final decision rests on a feeling instead of the data."],
      ["Working rhythm", "Weekly Plan → Do → Check → Act, or Scrum sprints of up to one month", "Your action plans are cut into weekly or sprint-length cycles, each with a stop point (what tells you to stop) and a scale point (what tells you to do more). You know in advance when you review and what you review against."]] },
  alchemist: { stmt: 'Feeling first. The story must feel right before the numbers line up.',
    strengths: ['Vision', 'Pattern recognition', 'Connecting weak signals', 'Brand and story power', 'Breakthrough ideas', 'Energy', 'The bigger picture'],
    blind: ['Passes over constraints', 'Skips specifications', 'Inconsistent follow-through', 'Ignores data'],
    fail: ['Strategy drift', 'Frequent changes of direction that unsettle the team', 'Experiments that are not measured'],
    best: ['Creating a new category', 'Brand-led growth', 'Early discovery', 'Starting from nothing', 'Firefighting'],
    adapt: [
      ["Order of content", "Story → Why it matters → Pattern → Principles → Guardrails → First moves → Measures", "Everything the app gives you is written in this order: your workbooks, your report pages and every AI Alchemist answer. The story and why it matters come first, then the pattern, the few principles and guardrails to hold, then the first moves. The numbers come last, as measures of whether it worked. Nothing asks you to specify before you can see it."],
      ["Tools you will be given", "Story briefs, hypothesis canvases, vision ladders, a working demo first", "Inside your workbooks: when an exercise asks you to plan, price, hire or launch, it gives you a one-page story brief, a hypothesis canvas (what must be true for this to work), a vision ladder (from where you are to where you can see), or asks you to build a rough working example before any specification. Something to see and react to, not a form."],
      ["How AI Alchemist works with you", "“What must be true?” “Which two constraints matter now?” “How will we know it worked?”", "AI Alchemist challenges you the way you decide. When you bring it a decision, it works through your Decision Intelligence Loop with you: what feels right and the story, whether the numbers support it, what that does to the feeling, and the decision. It takes the vision as given, asks what must be true and which two constraints you will hold, and it tells you when your final decision rests on data you do not yet believe in."],
      ["Working rhythm", "Sense → Test → Show, then blocks of time to write down what worked", "Your action plans run as short sense-test-show cycles: notice the signal, try it, show it to someone. After each cycle the workbook books a block of time to write down what worked, so the breakthroughs become something your team can repeat."]] },
  mixed: { stmt: 'A Dominant Decision Intelligence Loop cannot be identified yet.',
    causes: ['Strong conditioning (for example, years in a corporate role)', 'Constant firefighting to the point where it becomes conditioning or causes stress', 'Adapting to fit what past roles rewarded', 'Prolonged stress'],
    strengths: ['An understanding of both loops', 'Aware of either style', 'Wide range of experience'],
    risks: ['Inconsistent strategy', 'Loss of trust in teams', 'Burnout', 'A jack of all trades, master of none'],
    adapt: [
      ["Find the loop", "Workbooks, then retake E-DNA in about 4 weeks", "Your first workbooks are built to find your Dominant Decision Intelligence Loop, not to teach a subject. Each exercise makes you decide something real and records which loop you began and finished with. After about 4 weeks you retake E-DNA and the result confirms your Core Type Decision Intelligence Loop Identity."],
      ["Two-track exercises", "One Architect track and one Alchemist track for every exercise", "Every exercise comes in two versions and you do both. Architect track: write down exactly what will be done and how success will be measured, then review progress at a set checkpoint. Alchemist track: describe the result you can see, then build a quick working example to show someone. Which one came easier, and which one you finished, is the evidence."],
      ["Guardrails", "Fewer switches, a stated reason for every change of direction, a written record of each decision", "While your loop is unconfirmed the workbooks add three guardrails to your plans: a limit on how many tasks you switch between in a week, a one-line reason you must write before changing direction, and a decision log. These are what stop the strategy drift and the loss of trust that Mixed people report."],
      ["How the AI mentors work with you", "AI Architect and AI Alchemist, both, until your Dominant loop is confirmed", "When you bring either mentor a decision, it works through the loop with you box by box (data, feeling, new data, decision) and records which loop you began and finished with, without warning you either way. For important decisions the app shows both mentors' answers side by side. Noticing which answer you act on is part of finding your loop."]] }
};
const D1_LEAN_WHY = { architect: 'Most likely an Architect whose Dominant Decision Intelligence Loop is not yet strong, so you switch constantly.', alchemist: 'Most likely an Alchemist whose Dominant Decision Intelligence Loop is not yet strong, so you switch constantly.', none: 'No Dominant Decision Intelligence Loop can be identified yet: you switch constantly, or your answers do not yet show a loop.' };
function d1word(c) { return c === 'L' ? 'Logic' : c === 'F' ? 'Feeling' : 'Depends'; }
function d1seq(s, strong, loop) {
  /* s: three answers (L, F or D) in order begins / checked by / finally validated. loop: 'A' or 'R', the loop whose words stand in for a "Depends" answer. Four boxes, the third being the repeat of the check (box 2 ⇄ box 1). */
  const exp = loop === 'R' ? ['F', 'L', 'F'] : ['L', 'F', 'L'];
  const w = [0, 1, 2].map(i => s[i] === 'D' ? exp[i] : s[i]); const dep = [0, 1, 2].map(i => s[i] === 'D');
  const box = (i) => '<i class="' + w[i] + '">' + d1word(w[i]) + '</i>';
  const rep = '<i class="rep"><span class="w' + w[0] + '">' + d1word(w[0]) + '</span><span class="ar2 ' + (w[0] === 'L' ? 'LF' : 'FL') + '"><svg viewBox="0 0 20 14" width="16" height="12"><path d="M2 4h13M12 1l3 3-3 3" class="a1"/><path d="M18 10H5M8 7l-3 3 3 3" class="a2"/></svg></span><span class="w' + w[1] + '">' + d1word(w[1]) + '</span></i>';
  return '<span class="rd-seq' + (strong ? ' strong' : '') + '">' + box(0) + '<b>→</b>' + box(1) + '<b>→</b>' + rep + '<b>→</b>' + box(2) + '</span>';
}
function d1pat(p, core, sw) {
  /* names the loop used relative to the person: Dominant / Non-dominant for an Architect or Alchemist; Architect / Alchemist for Mixed (no Dominant loop yet). sw (stress rows only): the switch under it. */
  const cls = p === 'Architect' ? 'A' : p === 'Alchemist' ? 'R' : 'G';
  let w = p === 'Either' ? 'Depends' : p === 'Mixed' ? 'Mixed' : p;
  if (core !== 'mixed' && (p === 'Architect' || p === 'Alchemist')) w = ((p === 'Architect') === (core === 'architect')) ? 'Dominant' : 'Non-dominant';
  else if (core !== 'mixed' && p === 'Mixed') w = 'Partly non-dominant';
  const sub = sw === undefined ? '' : '<span class="rd-sw ' + (sw ? sw.kind : 'none') + '">' + (sw ? (sw.kind === 'full' ? 'Full switch' : 'Partial switch') : 'No switch') + '</span>';
  return '<span class="rd-pat ' + cls + '">' + w + sub + '</span>'; }
function d1list(title, items, cls) { return '<div class="rd-block' + (cls ? ' ' + cls : '') + '"><div class="rp-h19">' + title + '</div><ul class="rd-ul">' + items.map(x => '<li>' + x + '</li>').join('') + '</ul></div>'; }
function renderDetailed1(R, narrow) {
  const r = R.p1; const t = r.core; const a1 = p1answers(); const ans = a1.ans; const T = D1_TXT[t];
  let h = '<section class="rp rd" data-rt="' + t + '">' + rpBand(1, 'Core Type Decision Intelligence Loop Identity') + '<div class="rp-body">';
  /* 1. Your result (the basic card, unchanged; it carries the example tag) */
  h += renderPart1(R).replace(/^<section[^>]*>[\s\S]*?<div class="rp-body">/, '<div class="rd-basic">').replace(/<\/div><\/section>$/, '</div>');
  /* 2. The score behind the result */
  const A = Object.values(r.pts).reduce((x, p) => x + p.A, 0), B = Object.values(r.pts).reduce((x, p) => x + p.B, 0); const pa = Math.round(100 * A / (A + B)), pb = 100 - pa;
  h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div>';
  h += '<p class="rp-sent">Across ' + r.scenarios + ' scenarios your answers gave <b>' + A.toFixed(1) + ' points to the Architect loop</b> and <b>' + B.toFixed(1) + ' to the Alchemist loop</b>' + (t === 'mixed' ? '' : ': ' + (t === 'architect' ? pa : pb) + '% of the points went to your Dominant Decision Intelligence Loop') + '.</p>';
  h += '<div class="rd-split"><span class="A" style="width:' + pa + '%">Logic ' + pa + '%</span><span class="R" style="width:' + pb + '%">Feeling ' + pb + '%</span></div>';
  /* steadiness, in words */
  const ctxNames = Object.keys(r.ctxIdx); const unstableCtx = ctxNames.filter(c => r.ctxIdx[c] < 0.5);
  if (t !== 'mixed') {
    h += '<div class="rp-s"><b>' + unstableCtx.length + '</b> of <b>' + ctxNames.length + '</b> contexts are unstable.</div>';
  }
  /* 3. Every scenario */
  h += '<hr class="rp-divider"><div class="rp-h19">Your decision sequence in every scenario</div>';
  h += '<p class="rp-sent">We have broken your Decision Intelligence Loop down scenario by scenario, so you can see where you stayed with your Dominant loop and where you moved to your non-dominant loop, under normal conditions and under stress.</p>';   /* approved by Fariza Javed, 16 November 2026 */
  const ctxs = Object.keys(ans).map(id => id[0]).filter((v, i, a) => a.indexOf(v) === i).sort();
  const dom = t === 'architect' ? 'Architect' : t === 'alchemist' ? 'Alchemist' : null;
  const line = (label, seq, pat, sw) => {
    if (!seq) return '<div class="ln"><em>' + label + '</em><span>—</span></div>';
    const isDom = dom ? pat === dom : false;
    const who = !dom ? (pat === 'Either' ? 'Depends' : pat === 'Mixed' ? 'Both loops' : pat + ' loop') : isDom ? 'Dominant' : (pat === 'Architect' || pat === 'Alchemist') ? 'Non-dominant' : 'Partly non-dominant';
    let mark = '';
    if (dom && sw !== undefined) mark = sw ? (sw.kind === 'full' ? '<span class="mk full"><i>✕</i>Full switch</span>' : '<span class="mk partial"><i>–</i>Partial switch</span>') : '<span class="mk none"><i>✓</i>No switch</span>';
    return '<div class="ln"><em>' + label + '</em>' + d1seq(seq, isDom || !dom, (pat === 'Alchemist' || (pat !== 'Architect' && (dom ? dom === 'Alchemist' : r.lean === 'alchemist'))) ? 'R' : 'A') + '<span class="meta"><span class="who ' + (isDom ? 'd' : !dom && pat === 'Architect' ? 'A' : !dom && pat === 'Alchemist' ? 'R' : 'n') + '">' + who + '</span>' + mark + '</span></div>';
  };
  h += '<div class="rd-scen2">';
  ctxs.forEach(c => { const n = ans[c + 'A'], s = ans[c + 'B']; const sw = r.switched.find(x => x.ctx === P1_CTX[c]) || null;
    h += '<div class="ctx"><div class="c">' + P1_CTX[c] + '</div>' + line('Normal', n, n && r.pts[c + 'A'].pat) + line('Stress', s, s && r.pts[c + 'B'].pat, sw) + '</div>'; });
  h += '</div>';
  if (dom) {
    const swDef = '<div class="rd-def"><div><b>No switch</b> means you used your Dominant loop to make your decision.</div><div><b>Partial switch</b> means you began your decision with your Dominant loop but then finally validated it with your non-dominant loop.</div><div><b>Full switch</b> means you both began and finally validated your decision with your non-dominant loop.</div></div>';
    if (r.switched.length) h += '<p class="rp-sent"><b>Where you switched.</b> Under stress you left your Dominant Decision Intelligence Loop in: ' + r.switched.map(s => s.ctx + ' (' + s.kind + ')').join('; ') + '.</p>' + swDef;
    else h += '<p class="rp-sent"><b>You did not switch.</b> Under stress you kept your Dominant Decision Intelligence Loop in every context.</p>' + swDef;
  } else {
    const normA = ctxs.filter(c => ans[c + 'A'] && r.pts[c + 'A'].pat === 'Architect').length, normR = ctxs.filter(c => ans[c + 'A'] && r.pts[c + 'A'].pat === 'Alchemist').length;
    const strA = ctxs.filter(c => ans[c + 'B'] && r.pts[c + 'B'].pat === 'Architect').length, strR = ctxs.filter(c => ans[c + 'B'] && r.pts[c + 'B'].pat === 'Alchemist').length;
    const N = ctxs.length; const ln = r.lean; const lead = ln === 'architect' ? 'Architect' : ln === 'alchemist' ? 'Alchemist' : null; const other = lead === 'Architect' ? 'Alchemist' : 'Architect';
    const otherCtx = ctxs.filter(c => ans[c + 'B'] && r.pts[c + 'B'].pat === other).map(c => P1_CTX[c]);
    const first = lead === 'Alchemist' ? 'Alchemist' : 'Architect', second = first === 'Architect' ? 'Alchemist' : 'Architect';
    const n1 = first === 'Architect' ? normA : normR, n2 = first === 'Architect' ? normR : normA, s1 = first === 'Architect' ? strA : strR, s2 = first === 'Architect' ? strR : strA;
    h += '<ul class="rd-ul big"><li>Under normal conditions you used the ' + first + ' loop in <b>' + n1 + '</b> of <b>' + N + '</b> scenarios and the ' + second + ' loop in <b>' + n2 + '</b>.</li><li>Under stress you used the ' + first + ' loop in <b>' + s1 + '</b> of <b>' + N + '</b> scenarios and the ' + second + ' loop in <b>' + s2 + '</b>.</li></ul>';
    if (lead) {
      h += '<p class="rp-sent"><b>Therefore:</b></p><ul class="rd-ul big"><li><b>' + lead + '</b> leads and is most likely your Dominant Decision Intelligence Loop.</li><li><b>' + other + '</b> shows up ' + (otherCtx.length ? 'mainly under stress' : 'rarely') + ' and is most likely your non-dominant Decision Intelligence Loop.</li>' + (otherCtx.length ? '<li>Under stress you used the ' + other + ' loop in: ' + otherCtx.join(', ') + '.</li>' : '') + '</ul>';
      h += '<p class="rp-sent"><b>Next step.</b> You lean ' + lead + '. Work through the ' + lead + ' workbooks to strengthen that loop until it becomes your Dominant Decision Intelligence Loop, then retake E-DNA in 4 weeks to confirm it.</p>';
    } else {
      h += '<p class="rp-sent"><b>Therefore:</b> neither loop leads yet, so no Dominant Decision Intelligence Loop can be named.</p>';
      h += '<p class="rp-sent"><b>Next step.</b> Work through both sets of workbooks and notice which loop comes easier, then retake E-DNA in 4 weeks.</p>';
    }
  }
  /* 'Your leaning, and why' (Mixed) removed with 'What this means for you' (Fariza Javed, 15 November 2026): Part 1 ends at the scenario summary. */
  /* 'What this means for you' moved out of Part 1 (Fariza Javed, 15 November 2026): the core-type statement opens Part 2; strengths, blind spots, failure modes and best contexts are given at subtype level in Part 2. */
  /* 5. What to adapt, and what the app provides */
  h += '</div></section>';
  return h;
}

/* ---------- Part 2: Subtype Refinement Identity (BS-DI-003 3.1 to 3.5, 3.9) ---------- */
const SUB_D = {
  MS: { blind: ['Over-planning', 'Slow to catch unexpected opportunities', 'Distance from what is happening on the ground'], fail: ['Strategy for show', 'Rigid roadmaps', 'Late feedback'], best: ['Several product lines', 'Fundraising', 'Entering a market in stages'] },
  SB: { blind: ['Invents too little', 'Applies process where it is not needed', 'Resists change'], fail: ['Bureaucracy', 'Improving one area at the expense of the whole', 'Out-of-date playbooks'], best: ['Scaling once the product sells reliably', 'Operations', 'Customer service', 'Compliance', 'Franchise models'] },
  IA: { blind: ['Analysis that slows decisions', 'Perfectionism', 'Undervaluing experience that is not written down'], fail: ['Late decisions', 'Tunnel vision on one measure', 'Results other people do not buy into'], best: ['Pricing', 'Growth analysis', 'Forecasting', 'Experiments'] },
  UA: { blind: ['Few; the risk is overload from switching between strategy, systems and proof'], fail: ['Building an empire for its own sake', 'A weak story for customers'], best: [] },
  VO: { blind: ['Passes over constraints', 'Weak handover to the people who execute'], fail: ['A big vision with no structure', 'Frequent changes of direction that unsettle the team', 'Missed basics'], best: ['Starting from nothing', 'Creating a brand or category', 'The fundraising story'] },
  MP: { blind: ['Hesitates to ship', 'Lets scope grow', 'Overspends'], fail: ['Stalls on perfection', 'Polishes things customers do not value'], best: ['Premium products', 'Brand', 'Design-led growth'] },
  EE: { blind: ['Boundaries slip', 'Focus spreads', 'Waits for everyone to agree'], fail: ['Burnout', 'Unclear ownership', 'Soft commitments'], best: ['Partnerships for going to market', 'Communities', 'Advocacy', 'Hiring'] },
  UAl: { blind: ['Few; the risk is promising more than the systems can deliver'], fail: ['Growing the story faster than operations'], best: [] }
};
const P2_DIMS = ['What you protect when time is short', 'Your decision rhythm', 'How you control scope', 'The tools you reach for first', 'What you fall back on under pressure'];
function d2chip(k) { const A = k === 'UA' || SUBS.indexOf(k) >= 0; return '<span class="rd-chip ' + (A ? 'A' : 'R') + (k === 'UA' || k === 'UAl' ? ' u' : '') + '">' + SUB_TXT[k][0] + '</span>'; }
function d2bars(keys, s, onKeys) {
  const total = keys.reduce((a, k) => a + s[k], 0) || 1; let h = '<div class="rd-stab rd-sub">';
  keys.slice().sort((a, b) => s[b] - s[a]).forEach(k => { const A = SUBS.indexOf(k) >= 0; const pc = Math.round(100 * s[k] / total);
    h += '<div class="row"><span class="l' + (onKeys.indexOf(k) >= 0 ? ' on' : '') + '">' + SUB_TXT[k][0] + '</span><span class="bar"><i class="' + (A ? 'A' : 'R') + '" style="width:' + pc + '%"></i></span><span class="v"><b>' + s[k].toFixed(1) + '</b> pts · ' + pc + '%</span></div>'; });
  return h + '</div>';
}
function d2dims(ans, t) {
  const pairs = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]; let n = 0;
  let h = '<div class="rd-dims"><div class="hd"><span>Dimension</span><span>Building something new</span><span>Fixing something that has gone wrong</span><span>Consistent</span></div>';
  pairs.forEach((p, i) => { const same = ans[p[0]] === ans[p[1]]; if (same) n++;
    h += '<div class="row"><span class="d">' + P2_DIMS[i] + '</span><span>' + d2chip(ans[p[0]]) + '</span><span>' + d2chip(ans[p[1]]) + '</span><span class="mk ' + (same ? 'yes' : 'no') + '"><i>' + (same ? '✓' : '–') + '</i></span></div>'; });
  return { html: h + '</div>', n };
}
/* Subtype expansion copy (draft for approval, 15 November 2026). Facts from BS-DI-003 3.2 to 3.6 and the Part 2 answer options (BS-DI-006 Part 2); the explanations are written from them. */
const SUB_X = {
  MS: {
    is: 'A Master Strategist is an Architect who executes by choosing the order of moves. Once a decision is made, you turn it into a sequence: which bets come first, what each one has to show before the next starts, and what you will say no to. You win by timing: the right bet at the right moment, not every bet at once.',
    exec: [['When time is cut', 'You protect the plan: the order of the steps and which moves come first. Quality, data and people are adjusted to fit the sequence, not the other way round.'],
      ['Your rhythm', 'You work in blocks. You set a few moves, run them for a stretch, then stop, review and re-plan. Progress is measured at the review, not day to day.'],
      ['Keeping scope in bounds', 'You tie everything to the moves you chose and cut what does not serve them. A good idea that is not on the sequence waits.'],
      ['The first thing you create', 'A roadmap or a map of the options. Before a procedure, a dashboard or a brief, you want to see the moves laid out.'],
      ['Under pressure', 'You step back and re-order the moves. When something breaks, your first act is to re-order the priorities and set the next few moves, then let the fix follow.']],
    wrong: [['Over-planning', 'The roadmap gets more detailed while the market moves. The plan is checked against the plan, not against what customers did this week.'],
      ['Missed opportunities', 'An opening that was not in the sequence is slow to register, because it does not fit the order you set.'],
      ['Distance from the ground', 'You see the business through the plan. Signals that arrive as a feeling (a team that has gone quiet, a customer who hesitates) register late, because they do not arrive as numbers.'],
      ['Strategy for show', 'A deck that describes the strategy replaces decisions that act on it. Roadmaps go rigid, feedback comes late, and the next review arrives before the lesson does.']],
    improve: [['Shorter time from plan to learning', 'Every bet gets a midpoint check at week three or four, not only at the end of the block. If the early indicator is not moving, you decide then.'],
      ['Regular demos', 'Show a working version of each bet to real customers inside the block. A demo is feedback you cannot plan around.'],
      ['A stop or scale rule for every bet', 'Write, before the block starts, what would make you stop and what would make you do more. Then the review is a decision, not a debate.']],
    games: [['Chess with a clock', 'The clock forces a move before the plan is complete.'], ['Connect Four', 'Every move shapes what is available three moves later; two minutes a game.'], ['Risk', 'The plan meets the dice and the other players; you re-plan every turn.']],
    exercise: 'Give one live bet a stop or scale rule and a week-4 check this week.',
    best: ['Several product lines or markets running at once', 'Fundraising and investor plans', 'Entering a market in stages'],
    avoid: ['A crisis that needs a fix today: re-planning first delays it', 'A single product that needs daily operational grip rather than a sequence', 'Any plan you have not shown to a customer within the block'],
    ladder: 'From here, The Ultimate Architect is reached by adding the other two Architect ways of executing to your own. From the Internal Analyser: prove each bet with a test before you scale it. From the Systemised Builder: once a bet works, make it a routine so it runs without you. The Ultimate Architect holds all three: the sequence, the proof and the system.'
  },
  IA: {
    is: 'An Internal Analyser is an Architect who executes by being right. Once a decision is made, you turn it into a question that data can answer: what has to be true, how you would know, and what the numbers say. You win by precision: fewer wrong moves, because each one was tested first.',
    exec: [['When time is cut', 'You protect the accuracy: the data and the assumptions the work rests on. A plan built on a wrong number is not a plan.'],
      ['Your rhythm', 'You work in test cycles. Run a test, check the results, decide the next one. The cycle is short and the reading is weekly.'],
      ['Keeping scope in bounds', 'Nothing is added until the analysis says it should be. Scope grows by evidence, not by enthusiasm.'],
      ['The first thing you create', 'A dashboard or a test plan. You want the measures in place before the work starts.'],
      ['Under pressure', 'You go deeper into the detail and the data. When something breaks, you find out exactly what happened before anything changes.']],
    wrong: [['Analysis that slows decisions', 'The next test is always one more test. The decision waits for a certainty the data cannot give.'],
      ['Perfectionism', 'A model that is nearly right is treated as wrong. Time goes into the last decimal place, not the decision.'],
      ['Undervaluing what is not written down', 'Experience that arrives as judgement rather than data is discounted, so the people who have it stop offering it.'],
      ['Results other people do not buy into', 'The finding is right and the room does not move, because it was presented as numbers without the story.']],
    improve: [['A shorter time to insight', 'Set the success criteria and the stopping rule before each test, so the test ends when the answer is good enough, not when it is perfect.'],
      ['Findings as a simple story', 'Present each result as one sentence a non-analyst would repeat, with the numbers underneath it.'],
      ['Two-week cycles', 'Keep each test to two weeks with a weekly reading. If it needs longer, it is two tests.']],
    games: [['Wordle', 'A fixed number of guesses: commit to the best answer you have.'], ['Articulate', 'Explain the word in 30 seconds; the first clue that works beats the perfect one.']],
    exercise: 'Write the stopping rule before your next analysis, and present the result as one sentence with the numbers underneath.',
    best: ['Pricing', 'Growth analysis and forecasting', 'Experiments where the answer is worth the wait'],
    avoid: ['Decisions that have to be made before the data exists', 'Presenting a finding without the one-sentence story', 'Running a test with no stopping rule'],
    ladder: 'From here, The Ultimate Architect is reached by adding the other two Architect ways of executing to your own. From the Master Strategist: put your tests in an order that serves a plan, so proof leads somewhere. From the Systemised Builder: turn a proven result into a routine that runs without you. The Ultimate Architect holds all three: the sequence, the proof and the system.'
  },
  VO: {
    is: 'A Visionary Oracle is an Alchemist who executes by seeing where things are going first. Once a decision is made, you turn it into a direction: the story of what this becomes, why now, and the first proof that it is real. You win by being early: the pattern you saw before others did.',
    exec: [['When time is cut', 'You protect the vision: the story and where this is going. Quality, people and plan are shaped to serve the direction.'],
      ['Your rhythm', 'You work in rounds. Show a working version, get reactions, show the next. The reaction is the plan.'],
      ['Keeping scope in bounds', 'You let an idea explore while the pattern becomes clear, then settle it. Scope is open early and closed late.'],
      ['The first thing you create', 'A story brief or a short video of what it will become. Before a checklist or a dashboard, you want people to see it.'],
      ['Under pressure', 'You re-tell the story and test the next step towards it. When something breaks, you make sure the setback does not change where you are going.']],
    wrong: [['Constraints passed over', 'The direction is right and the budget, the team or the timeline was not in the picture. The story runs ahead of what can be built.'],
      ['Weak handover', 'The people who execute get the vision but not the steps, so they fill the gap with guesses.'],
      ['Frequent changes of direction', 'Each new pattern you see becomes a new direction. The team is unsettled, and the basics are missed while the story moves on.'],
      ['A big vision with no structure', 'The story converts, and there is nothing underneath it to deliver what it promised.']],
    improve: [['A working version every few weeks', 'Put the date of the next demo in the diary before you tell the next story. Show something that works to real customers every two to four weeks. The demo supplies the structure the story leaves out.'],
      ['A must-be-true list for every idea', 'Before an idea becomes a direction, write the three things that must be true for it to work, and give yourself 30 days to prove them. If they are not true at day 30, the idea waits.'],
      ['Name the cost of a change of direction', 'Before you change direction, write the one constraint it breaks (budget, team or time) and who will carry it. Then hand over the first three steps, not only the vision.']],
    games: [['Charades', 'The idea only counts when someone else can act on it, under a timer.'], ['Jenga', 'Every move is a change under a constraint; over-adjusting brings it down.']],
    exercise: 'Before your next change of direction, write the one constraint it breaks and hand over the first three steps.',
    best: ['Starting from nothing', 'Creating a brand or a category', 'The fundraising story'],
    avoid: ['Changing direction without naming what it costs', 'Handing over a vision without the first three steps', 'Operating work that needs the same thing done well every day'],
    ladder: 'From here, The Ultimate Alchemist is reached by adding the other two Alchemist ways of executing to your own. From the Magnetic Perfectionist: a quality bar the story has to meet before it ships. From the Energetic Empath: the people carried with you, with clear commitments. The Ultimate Alchemist holds all three: the vision, the quality and the people, with proof.'
  },
  SB: {
    is: 'A Systemised Builder is an Architect who executes by making things run. Once a decision is made, you turn it into a routine: the procedure, the checks and the people who own each step, so it happens the same way every time without you. You win by reliability: output that can be counted on.',
    exec: [['When time is cut', 'You protect the flow: the routine and the system that keep things running. A plan or a feature can wait; the thing that runs every day cannot.'],
      ['Your rhythm', 'You work continuously. A weekly routine keeps everything moving, with daily checks when something is new or fragile.'],
      ['Keeping scope in bounds', 'You standardise. Once something works, it becomes the way it is done, and what is not in the standard is not done.'],
      ['The first thing you create', 'A checklist or a step-by-step procedure. Before a roadmap or a dashboard, you want the steps written down.'],
      ['Under pressure', 'You add process: more structure, more routine. When something breaks, you put daily checks on it until it runs smoothly again, then write a procedure so it does not happen again.']],
    wrong: [['Invents too little', 'The routine runs well and nothing new is tried, because new things do not have a procedure yet.'],
      ['Process where it is not needed', 'A one-off gets a checklist. The overhead of the system costs more than the thing it controls.'],
      ['Resists change', 'A better way is turned down because the current way works. Playbooks go out of date while they are still followed.'],
      ['Improving one area at the expense of the whole', 'The part you own runs perfectly and the business around it is starved, because the measure was the part, not the whole.']],
    improve: [['Protect capacity for experiments', 'Keep 10 to 15% of capacity for things that have no procedure yet, and let them fail without a post-mortem.'],
      ['Change control with a log', 'Record each problem and its fix, and review the log monthly so the playbook changes with the business.'],
      ['Measure the whole', 'Add one measure that belongs to the business, not to your area, to every weekly review.']],
    games: [['Tetris', 'The routine has to keep running while what arrives keeps changing.'], ['Scrabble', 'You play the tiles you are dealt, not the word you planned: a small experiment every turn.'], ['Uno', 'The rules of the round change with every card; a fixed routine loses.']],
    exercise: 'Block 10% of next week for something that has no procedure yet.',
    best: ['Scaling once the product sells reliably', 'Operations, customer service and compliance', 'Franchise and repeatable models'],
    avoid: ['Putting a procedure on something you have done once', 'Keeping a playbook that the business has outgrown', 'Starting from nothing, where there is nothing yet to systemise'],
    ladder: 'From here, The Ultimate Architect is reached by adding the other two Architect ways of executing to your own. From the Master Strategist: an order of moves, so the system serves a direction. From the Internal Analyser: a test before a change becomes the standard. The Ultimate Architect holds all three: the sequence, the proof and the system.'
  },
  EE: {
    is: 'An Energetic Empath is an Alchemist who executes through people. Once a decision is made, you turn it into a cause: who is involved, why they care, the shared win, and the next step each person takes. You win by momentum: people move because you moved them.',
    exec: [['When time is cut', 'You protect the people: the momentum and the relationships around the work. The plan, the standard and the story bend before the team does.'],
      ['Your rhythm', 'You work in conversations. You talk with the people involved until you are aligned, then move together, in short bursts with clear goals.'],
      ['Keeping scope in bounds', 'You agree the scope with the people involved and hold everyone to it. Scope is a commitment, not a list.'],
      ['The first thing you create', 'A list of the people involved and what each has committed to. Before a roadmap or a brief, you want to know who is in.'],
      ['Under pressure', 'You rally the people around it. When something breaks, you get everyone together, clear the tension and agree the way through.']],
    wrong: [['Boundaries slip', 'Every ask is a yes, because saying no costs a relationship. Your capacity goes before your commitments do.'],
      ['Focus spreads', 'Many partners, many causes, and no one thing finished. Energy is spent where people are, not where the business needs it.'],
      ['Waits for everyone to agree', 'A decision that needed one person waits for the room. Alignment becomes the goal instead of the result.'],
      ['Soft commitments and unclear ownership', 'Everyone is in and no one owns it. Wins are celebrated and not written down, so they cannot be repeated.']],
    improve: [['An exit rule for every partnership', 'Before a partnership or pilot starts, write its time limit and the condition that ends it. Review it on that date, not when it starts to feel wrong.'],
      ['Wins written down within a week', 'After each win, write who did what and what it produced. A win that is written down can be repeated without you in the room.'],
      ['One owner and one decider per task', 'For each piece of work, name the one person responsible and the one who decides. Alignment is for the direction; it is not needed for every step.']],
    games: [['Monopoly', 'Every deal has a price and saying no is a move; bankruptcy is a hard exit rule.'], ['Poker', 'Folding is saying no; one decision at a time, on your own read.']],
    exercise: 'Write the exit rule for one current partnership and the single owner for one shared task.',
    best: ['Partnerships for going to market', 'Communities and advocacy', 'Hiring and building a team'],
    avoid: ['A commitment made in the room that the capacity cannot carry', 'A partnership with no exit rule', 'Deep solo analysis that needs no one else'],
    ladder: 'From here, The Ultimate Alchemist is reached by adding the other two Alchemist ways of executing to your own. From the Visionary Oracle: a direction the people are moving towards. From the Magnetic Perfectionist: a quality bar the shared work has to meet. The Ultimate Alchemist holds all three: the vision, the quality and the people, with proof.'
  },
  MP: {
    is: 'A Magnetic Perfectionist is an Alchemist who executes by making the thing right. Once a decision is made, you turn it into a standard: what it has to look and feel like, the details that matter, and the quality bar it must meet. You win by pull: people want what you made because of how it is made.',
    exec: [['When time is cut', 'You protect the quality: what it looks and feels like, and the details that matter. Scope and speed give way before the standard does.'],
      ['Your rhythm', 'You work in polish cycles. Refine until it is right, with a date to put it out. The date is the only thing that stops the polishing.'],
      ['Keeping scope in bounds', 'You set the quality bar and cut everything that falls below it. Scope is controlled by standard, not by list.'],
      ['The first thing you create', 'A quality bar: the standard the result must meet. Before a roadmap or a story, you define what good looks like.'],
      ['Under pressure', 'You hold the quality bar, or raise it. When something breaks, you refine the part that failed until it is right, with a date to put it back out.']],
    wrong: [['Hesitates to ship', 'The date moves because the work is not yet right. Customers wait for a version they would have paid for last month.'],
      ['Scope grows', 'Each refinement reveals another detail that matters. The standard rises and the ship date goes with it.'],
      ['Overspends', 'Quality is bought at a cost the business limits cannot carry.'],
      ['Polishing what customers do not value', 'The detail you refined is one the customer never noticed, while the one they asked for waits.']],
    improve: [['One ship day a week', 'Pick one day a week on which something goes out, whatever state it is in. Sort the work into red (must be right), amber (should be) and green (can wait). Only red stops the ship.'],
      ['The quality bar written next to the limits', 'Write the quality bar with the budget and the date beside it. If all three cannot be met, the standard is lowered in the open, not the date moved in silence.'],
      ['Polish only what the customer noticed', 'Each month look at activation, retention and willingness to pay. Keep refining the detail that moved one of them; stop refining the detail that moved none.']],
    games: [['Pictionary, timed to 60 seconds', 'A rough drawing that is understood beats a perfect one that is not finished.'], ['Cluedo', 'You lose by waiting: accuse before you are certain, or another player will.']],
    exercise: 'Set a 20-minute timer on one piece of work you would normally polish for an hour, and send what exists when it rings.',
    best: ['Premium products', 'Brand and design-led growth', 'Anything customers judge by feel'],
    avoid: ['A launch where speed matters more than finish', 'Refining without a ship date', 'Spending on quality the margin cannot carry'],
    ladder: 'From here, The Ultimate Alchemist is reached by adding the other two Alchemist ways of executing to your own. From the Visionary Oracle: a direction the quality serves, so the standard points somewhere. From the Energetic Empath: the people carried with you, with clear commitments. The Ultimate Alchemist holds all three: the vision, the quality and the people, with proof.'
  },
  UA: {
    is: 'The Ultimate Architect is an Architect who holds all three Architect ways of executing at once. Once a decision is made, you set the order of moves, prove each one with a test, and turn what works into a system that runs without you. You win by integration: strategy, proof and systems that reinforce each other.',
    exec: [['When time is cut', 'You protect all three at once: the plan, the system and the data, adjusted together rather than one sacrificed for another.'],
      ['Your rhythm', 'Moves set in blocks, a weekly routine to run them, and tests to prove them. Strategy sprints alternate with operations sprints.'],
      ['Keeping scope in bounds', 'The chosen moves set the scope, standards hold it, and analysis gates what is added.'],
      ['The first thing you create', 'A one-page map that links the roadmap, the procedures and the tests, so all three can be seen together.'],
      ['Under pressure', 'You re-plan, tighten the process and check the data at once. When something breaks, you re-align the plan, the process and the data behind it together.']],
    wrong: [['Overload from switching', 'Strategy, systems and proof all need you, and switching between them costs more than any one of them.'],
      ['An empire for its own sake', 'The structure grows because it can, not because a customer asked for it.'],
      ['A weak story for customers', 'Everything inside the business is right and the outside world cannot say what you do.']],
    improve: [['Working prototypes', 'Keep testing ideas with a working version, not a plan for one. The prototype is the proof.'],
      ['Outside challenge to the story', 'Invite someone outside the business to challenge the customer story every quarter.'],
      ['One review, two measures', 'A monthly strategy and operations review with two measures only: impact and stability.']],
    gamesIntro: 'Do you find you excel at the following games? Keep playing them and improve your scores or levels to help you stay at this level.',
    games: [['Chess with a clock', 'Master Strategist'], ['Connect Four', 'Master Strategist'], ['Risk', 'Master Strategist'], ['Wordle', 'Internal Analyser'], ['Articulate', 'Internal Analyser'], ['Tetris', 'Systemised Builder'], ['Scrabble', 'Systemised Builder'], ['Uno', 'Systemised Builder']],
    exercise: 'Invite one outsider to challenge your customer story this month.',
    best: [], avoid: ['Growing the structure faster than the customer story', 'Carrying all three roles yourself as the team grows'],
    ladder: 'You are at the top of the Architect ladder. Staying there means keeping the three ways of executing in balance: the Master Strategist’s sequence, the Internal Analyser’s proof and the Systemised Builder’s system. When one of the three goes quiet, the others start to fail with it.'
  },
  UAl: {
    is: 'The Ultimate Alchemist is an Alchemist who holds all three Alchemist ways of executing at once. Once a decision is made, you set the direction, hold the quality bar and carry the people with you, and you prove it with results. You win by integration: a story that converts, a product that pulls and a community that scales, with proof.',
    exec: [['When time is cut', 'You protect all three at once: the vision, the quality and the people, kept in step rather than one sacrificed for another.'],
      ['Your rhythm', 'Show it, refine it and bring people with it, in step. Bursts of demos followed by consolidation.'],
      ['Keeping scope in bounds', 'Explore, then set the bar, with everyone agreed on what is in and what is out.'],
      ['The first thing you create', 'A one-page vision that links the story, the standard and the people.'],
      ['Under pressure', 'You re-tell the story, hold the quality and rally the people at once. When something breaks, you re-harmonise the idea, the quality and the people together.']],
    wrong: [['Promising more than the systems can deliver', 'The story and the product pull people in faster than operations can serve them.'],
      ['The story outgrows operations', 'Each demo raises expectations; the consolidation that should follow is skipped for the next demo.']],
    improve: [['Operations level with the story', 'After every burst of demos, a consolidation sprint before the next burst. Nothing new is promised until the last promise runs.'],
      ['Data to refine the story', 'Use the numbers (pull and capacity) to change the story, not only to confirm it.'],
      ['Demo, decide, write down', 'Every demo ends with a decision and a written record, with two measures: pull and capacity.']],
    gamesIntro: 'Do you find you excel at the following games? Keep playing them and improve your scores or levels to help you stay at this level.',
    games: [['Charades', 'Visionary Oracle'], ['Jenga', 'Visionary Oracle'], ['Pictionary, timed to 60 seconds', 'Magnetic Perfectionist'], ['Cluedo', 'Magnetic Perfectionist'], ['Monopoly', 'Energetic Empath'], ['Poker', 'Energetic Empath']],
    exercise: 'After your next demo, write the decision and the two measures (pull and capacity) before you plan the next one.',
    best: [], avoid: ['Promising in a demo what operations cannot yet deliver', 'Skipping the consolidation sprint for the next burst'],
    ladder: 'You are at the top of the Alchemist ladder. Staying there means keeping the three ways of executing in balance: the Visionary Oracle’s direction, the Magnetic Perfectionist’s quality and the Energetic Empath’s people. When one of the three goes quiet, the others start to fail with it.'
  }
};
function d2boxes(side, s, ultKey, picks, onKeys) {
  /* Four boxes, one per subtype including The Ultimate, percentage only (Fariza Javed, 15 November 2026). The Ultimate box shows the share of answers that chose it. */
  const order = ultKey === 'UAl' ? ['VO', 'EE', 'MP'] : side; /* mirror order to the Architect side (Fariza Javed, 15 November 2026) */
  const keys = order.concat([ultKey]); const total = side.reduce((a, k) => a + s[k], 0) || 1;
  let h = '<div class="rd-boxes">';
  keys.forEach(k => { const ult = k === ultKey; const pc = ult ? Math.round(100 * picks / 10) : Math.round(100 * s[k] / total); const A = k === 'UA' || SUBS.indexOf(k) >= 0;
    h += '<div class="bx ' + (A ? 'A' : 'R') + (onKeys.indexOf(k) >= 0 ? ' on' : '') + '"><div class="n">' + SUB_TXT[k][0] + '</div><div class="p">' + pc + '%</div>' + (ult ? '<div class="s">of answers chose it</div>' : '<div class="s">of your points</div>') + '</div>'; });
  return h + '</div>';
}
function d2sub(k, R) {
  const X = SUB_X[k]; if (!X) return '<p class="rp-note">Copy for ' + SUB_TXT[k][0] + ' follows once the pattern is approved.</p>';
  const nm = SUB_TXT[k][0]; const art = /^The /.test(nm) ? '' : (/^[AEIOU]/.test(nm) ? 'an ' : 'a ');
  let h = '<div class="rp-h19">What ' + art + nm + ' is</div><p class="rp-sent">' + X.is + '</p>';
  h += '<div class="rp-h19">How you execute decisions in practice</div><div class="rd-adapt">';
  X.exec.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; });
  h += '</div>';
  return h;
}
function d2games(X) {
  /* Games and an exercise that practise the same habit (approved by Fariza Javed, 15 November 2026). Adults' games, well known. */
  if (!X.games) return '';
  return '<div class="row"><span class="k">' + (X.gamesIntro ? 'Games to keep playing' : 'Games to practise this') + '</span><span class="v">' + (X.gamesIntro ? '<div>' + X.gamesIntro + '</div>' : '') + '<ul class="rd-ul rd-games">' + X.games.map(g => '<li><b>' + g[0] + '</b> · ' + g[1] + '</li>').join('') + '</ul></span></div>';
}
function d2subWrong(k) {
  const X = SUB_X[k]; if (!X) return '';
  const stay = k === 'UA' || k === 'UAl';
  let h = '<hr class="rp-divider"><div class="rp-h19">Where your execution goes wrong</div><div class="rd-adapt">';
  X.wrong.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; });
  h += '</div><hr class="rp-divider"><div class="rp-h19">' + (stay ? 'How to stay developed' : 'How to improve') + '</div><div class="rd-adapt">';
  X.improve.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; });
  h += d2games(X) + '</div><div class="rd-cols">' + (X.best.length ? d1list('Where your way of executing wins', X.best, 'good') : '') + d1list('What to avoid', X.avoid, 'warn') + '</div>';
  return h;
}
function d2ladder(k, side) {
  const X = SUB_X[k]; const ultKey = side === 'A' ? 'UA' : 'UAl'; const three = side === 'A' ? ['MS', 'IA', 'SB'] : ['VO', 'MP', 'EE'];
  let h = '<hr class="rp-divider"><div class="rp-h19">' + (k === ultKey ? 'The ' + (side === 'A' ? 'Architect' : 'Alchemist') + ' ladder' : 'Your growth ladder to The Ultimate ' + (side === 'A' ? 'Architect' : 'Alchemist')) + '</div>';
  if (X) h += '<p class="rp-sent">' + X.ladder + '</p>';
  h += '<div class="rd-ladder">';
  three.forEach(t => { h += '<div class="st' + (t === k ? ' on' : '') + '"><div class="n">' + SUB_TXT[t][0] + (t === k ? ' <small>(you)</small>' : '') + '</div><div class="v">' + (SUB_X[t] ? SUB_X[t].is.split('. ')[0] + '.' : SUB_TXT[t][1]) + '</div></div>'; });
  h += '<div class="st top' + (k === ultKey ? ' on' : '') + '"><div class="n">' + SUB_TXT[ultKey][0] + (k === ultKey ? ' <small>(you)</small>' : '') + '</div><div class="v">' + SUB_TXT[ultKey][1] + ' ' + SUB_TXT[ultKey][2] + '</div></div></div>';
  return h;
}
const P2_MEAS = ['What you protect when time is short', 'Your decision rhythm', 'How you keep scope in bounds', 'The first thing you create', 'What you reach for under pressure'];
function d2dims(ans) {
  const pairs = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]; let n = 0;
  let h = '<div class="rd-dims"><div class="hd"><span>What we measured</span><span>Building something new</span><span>Fixing something that has gone wrong</span><span>Same answer</span></div>';
  pairs.forEach((p, i) => { const same = ans[p[0]] === ans[p[1]]; if (same) n++;
    h += '<div class="row"><span class="d">' + P2_MEAS[i] + '</span><span>' + d2chip(ans[p[0]]) + '</span><span>' + d2chip(ans[p[1]]) + '</span><span class="mk ' + (same ? 'yes' : 'no') + '"><i>' + (same ? '✓' : '–') + '</i></span></div>'; });
  return { html: h + '</div>', n };
}
function renderDetailed2(R, narrow) {
  const t = R.p1.core, r = R.p2; const a2 = p2answers(); const ans = a2.ans; const A = t === 'architect'; const coreName = A ? 'Architect' : 'Alchemist';
  let h = '<section class="rp rd" data-rt="' + t + '">' + rpBand(2, 'Subtype Refinement Identity') + '<div class="rp-body">';
  /* 1. What this part is about, and the result */
  h += '<div class="rp-h19">How you execute your decisions</div><p class="rp-sent">Part 1 showed how you decide.<br>Part 2 shows how you carry a decision out once it is made: what you protect when time is short, the rhythm you work in, how you keep scope in bounds, the first thing you create, and what you reach for under pressure.</p>';
  if (t !== 'mixed') {
    const main = r.result, sec = r.second; const ult = main === 'UA' || main === 'UAl'; const side = A ? SUBS : SUBA; const ultKey = A ? 'UA' : 'UAl';
    h += '<div class="rp-s">' + (sec ? 'Your subtypes' : 'Your subtype') + '</div><h2 class="rp-name">' + SUB_TXT[main][0] + '</h2>' + (sec ? '<div class="rp-sub">close second: ' + SUB_TXT[sec][0] + '</div>' : '');
    /* 2. What it is, and how you execute */
    h += d2sub(main, R);
    /* 3. How we came to that conclusion */
    const picks = ans.filter(k => k === ultKey).length;
    h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div><p class="rp-sent">Your 10 answers each point to one of the four ' + coreName + ' subtypes. Your subtype is the one with the largest share' + (sec ? '; a second subtype within a point of it is shown as a close second' : '') + '.</p>';
    h += d2boxes(side, r.scores, ultKey, picks, ult ? side.concat([ultKey]) : [main].concat(sec ? [sec] : []));
    const dm = d2dims(ans);
    h += '<p class="rp-sent">Each of the five things we measured was asked twice: once while building something new, once while fixing something that has gone wrong. The same subtype both times is a settled answer.</p>' + dm.html;
    h += '<p class="rp-sent">Same answer in <b>' + dm.n + '</b> of <b>5</b>.' + (r.flag ? ' Fewer than 3 the same, or no subtype with 40% of the points, means your subtype is shown but is less settled. The workbook will confirm it.' : '') + '</p>';
    /* 4. Where it goes wrong, how to improve, where it wins */
    h += d2subWrong(main);
    if (sec) h += '<hr class="rp-divider"><div class="rp-h19">Your close second: ' + SUB_TXT[sec][0] + '</div>' + d2sub(sec, R).replace('<div class="rp-h19">What ', '<div class="rp-h13">What ').replace('<div class="rp-h19">How you execute decisions in practice</div>', '<div class="rp-h13">How ' + (/^[AEIOU]/.test(SUB_TXT[sec][0]) ? 'an ' : 'a ') + SUB_TXT[sec][0] + ' executes</div>') + d2subWrong(sec).replace('<hr class="rp-divider">', '');
    /* 5. Growth ladder */
    h += d2ladder(main, A ? 'A' : 'R');
  } else if (r.likely) {
    /* Mixed with a leaning (Fariza Javed, 15 November 2026): only the likely subtype on the leaning side, laid out exactly like a confirmed subtype. No mirror and no other loop: the goal is one Dominant loop, practised with that subtype only. The mirror and the non-dominant loop come in the awareness section of a later report, once the Dominant loop is confirmed. */
    const k = r.likely; const side = SUBS.indexOf(k) >= 0 ? 'A' : 'R'; const leanName = r.lean === 'architect' ? 'Architect' : 'Alchemist';
    h += '<div class="rp-s">Your likely subtype</div><h2 class="rp-name">' + SUB_TXT[k][0] + '</h2><p class="rp-sent">You appear to be ' + SUB_TXT[k][0] + ', but as your Dominant Decision Intelligence Loop has not yet been identified, this is subject to change.</p>';
    h += d2sub(k, R);
    h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div><p class="rp-sent">You lean ' + leanName + ', so your answers are read against the four ' + leanName + ' subtypes. Your likely subtype is the one with the largest share.</p>';
    h += d2boxes(side === 'A' ? SUBS : SUBA, r.scores, side === 'A' ? 'UA' : 'UAl', ans.filter(x => x === (side === 'A' ? 'UA' : 'UAl')).length, [k]);
    h += '<div class="rd-def"><div><b>' + r.picksA + '</b> of your answers were Architect and <b>' + r.picksR + '</b> Alchemist. 7 or more on one side sets the leaning; otherwise your Part 1 leaning stands. Your core type stays Mixed.</div></div>';
    const dm = d2dims(ans); h += '<p class="rp-sent">Each of the five things we measured was asked twice: once while building something new, once while fixing something that has gone wrong. The same subtype both times is a settled answer.</p>' + dm.html + '<p class="rp-sent">Same answer in <b>' + dm.n + '</b> of <b>5</b>.</p>';
    h += d2subWrong(k) + d2ladder(k, side);
    h += '<div class="rd-def"><div>This is subject to change until your Dominant Decision Intelligence Loop is confirmed. Practise the ' + leanName + ' workbooks and the games above, then retake E-DNA in 4 weeks.</div></div>';
  } else {
    /* Mixed with no leaning (Fariza Javed, 15 November 2026): the exact same order as a single subtype, with the two mirror subtypes side by side (Architect mirror left, Alchemist mirror right). */
    const MIR = { MS: 'VO', VO: 'MS', IA: 'MP', MP: 'IA', SB: 'EE', EE: 'SB' };
    let kA, kR;
    { const p = r.pair; kA = p[0]; kR = p[1]; const pt = PAIR_TXT[p.join('-')];
      h += '<div class="rp-s">Your likely mirror pair</div><h2 class="rp-name">' + SUB_TXT[kA][0] + ' or ' + SUB_TXT[kR][0] + '</h2><p class="rp-sent">You appear to be ' + SUB_TXT[kA][0] + ' or ' + SUB_TXT[kR][0] + ', but as your Dominant Decision Intelligence Loop has not yet been identified, this is subject to change.</p><p class="rp-sent"><b>' + pt[0] + '.</b> ' + pt[1] + '</p>'; }
    const XA = SUB_X[kA], XR = SUB_X[kR]; const likely = null;
    const col = (k, inner) => '<div class="rd-mcol ' + (SUBS.indexOf(k) >= 0 ? 'A' : 'R') + (likely === k ? ' on' : '') + '"><div class="rd-mh">' + SUB_TXT[k][0] + (likely === k ? ' <small>likely</small>' : likely ? ' <small>mirror</small>' : '') + '</div>' + inner + '</div>';
    const rows = (list) => '<div class="rd-adapt">' + list.map(x => '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>').join('') + '</div>';
    const two = (title, fa, fr) => '<hr class="rp-divider"><div class="rp-h19">' + title + '</div><div class="rd-cols rd-mirror">' + col(kA, fa) + col(kR, fr) + '</div>';
    h += two('What each one is', '<p class="rp-sent">' + XA.is + '</p>', '<p class="rp-sent">' + XR.is + '</p>');
    h += two('How each one executes decisions in practice', rows(XA.exec), rows(XR.exec));
    h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div><p class="rp-sent">As your Dominant Decision Intelligence Loop is not yet confirmed, your answers are scored on both sides.</p>';
    h += '<div class="rd-cols">' + d2boxes(SUBS, r.scores, 'UA', ans.filter(x => x === 'UA').length, [kA]) + d2boxes(SUBA, r.scores, 'UAl', ans.filter(x => x === 'UAl').length, [kR]) + '</div>';
    h += '<div class="rd-def"><div><b>' + r.picksA + '</b> of your answers were Architect and <b>' + r.picksR + '</b> Alchemist. 7 or more on one side ' + (likely ? 'sets the leaning; otherwise your Part 1 leaning stands' : 'would set a leaning') + '. Your core type stays Mixed.</div></div>';
    const dm = d2dims(ans); h += '<p class="rp-sent">Each of the five things we measured was asked twice: once while building something new, once while fixing something that has gone wrong. The same subtype both times is a settled answer.</p>' + dm.html + '<p class="rp-sent">Same answer in <b>' + dm.n + '</b> of <b>5</b>.</p>';
    h += two('Where execution goes wrong', rows(XA.wrong), rows(XR.wrong));
    h += two('How to improve', rows(XA.improve).replace(/<\/div>$/, d2games(XA) + '</div>'), rows(XR.improve).replace(/<\/div>$/, d2games(XR) + '</div>'));
    h += two('Where each way of executing wins, and what to avoid', d1list('Wins', XA.best, 'good') + d1list('Avoid', XA.avoid, 'warn'), d1list('Wins', XR.best, 'good') + d1list('Avoid', XR.avoid, 'warn'));
    h += '<div class="rd-cols rd-mirror">' + col(kA, d2ladder(kA, 'A').replace('<hr class="rp-divider">', '').replace(' <small>(you)</small>', likely === kA ? ' <small>(likely)</small>' : '')) + col(kR, d2ladder(kR, 'R').replace('<hr class="rp-divider">', '').replace(' <small>(you)</small>', likely === kR ? ' <small>(likely)</small>' : '')) + '</div>';
    h += '<div class="rd-def"><div>' + (likely ? 'This is subject to change until your Dominant Decision Intelligence Loop is confirmed. Practise the ' + (r.lean === 'architect' ? 'Architect' : 'Alchemist') + ' workbooks, then retake E-DNA in 4 weeks.' : 'You have no confirmed subtype until your Dominant Decision Intelligence Loop is confirmed. Take the workbook to identify and strengthen it, then retake E-DNA in 4 weeks.') + '</div></div>';
  }
  return h + '</div></section>';
}

/* ---------- Part 3: Alternate Decision Intelligence Loop Awareness (BS-DI-003 4.1 to 4.7) ---------- */
const D3_MEAN = { /* what each result measures, by core type (BS-DI-003 4.2, 4.3) */
  architect: ['Knowing that your decisions begin with logic and are finally validated by logic, and being able to explain how.', 'Understanding what a feeling-first decision looks like, noticing when you have decided on feeling alone under pressure without returning to logic, and knowing what caused it.', 'Recognising another Architect and working well with them, including an Architect of a different subtype.', 'Recognising an Alchemist or a Mixed person, and adapting how you work with them.'],
  alchemist: ['Knowing that your decisions begin with feeling and are finally validated by feeling, and being able to explain how.', 'Understanding what a logic-first decision looks like, noticing when you have decided on numbers alone under pressure without returning to feeling, and knowing what caused it.', 'Recognising another Alchemist and working well with them, including an Alchemist of a different subtype.', 'Recognising an Architect or a Mixed person, and adapting how you work with them.'],
  mixed: ['How well you understand the Architect loop from the inside: where a logic-first decision begins, how it is checked and what finally validates it.', 'How well you understand the Alchemist loop from the inside: where a feeling-first decision begins, how it is checked and what finally validates it.', 'Recognising an Architect from what they say and do, translating their plan into something you can use, and working and repairing a clash with them.', 'Recognising an Alchemist from what they say and do, translating their story into something you can use, and working and repairing a clash with them.']
};
const D3_LEVEL = { /* what the level means, written to the person (BS-DI-003 4.2, 4.3 level tables) */
  0: { 'Very low': 'You cannot yet describe how you decide.', 'Low': 'You partly understand where your decisions begin and what validates them.', 'Moderate': 'You understand your loop in familiar situations.', 'High': 'You understand your loop clearly and can explain it.', 'Mastery': 'You use your Dominant loop deliberately in every situation.' },
  1: { 'Very low': 'You are confused between the loops, or have no understanding of your other loop at all; under pressure you lose your own sense of what validates a decision.', 'Low': 'You often switch without noticing, or rarely switch but do not understand how your other loop works.', 'Moderate': 'You occasionally switch without noticing and need guardrails.', 'High': 'You understand your non-dominant loop accurately, but in practice you still sometimes lose your own validation.', 'Mastery': 'You use the input of your non-dominant loop fully without losing your own identity, and still make the decision with your Dominant loop.' },
  2: { 'Very low': 'You do not yet recognise people who decide the same way as you.', 'Low': 'You assume everyone on your loop decides exactly as you do, and miss subtype differences.', 'Moderate': 'You recognise people on your loop, but sometimes clash over subtype differences.', 'High': 'You recognise people on your loop and work well with them.', 'Mastery': 'You recognise subtype differences on your loop and use them constructively.' },
  3: { 'Very low': 'You do not yet recognise how people on the alternate loop decide.', 'Low': 'You do not recognise alternate loops, and read the difference as a difference in values.', 'Moderate': 'You occasionally fail to recognise alternate loops and need a second person to co-lead.', 'High': 'You are aware of alternate loops, but do not always understand or use their decisions constructively.', 'Mastery': 'You accurately understand alternate loops and use them constructively to your advantage.' }
};
const D3_IMPROVE = { /* by the lowest level (BS-DI-003 4.5) */
  'Very low': [['Simple guides to both loops', 'Read the one-page guide to each loop and how to translate between them, before your next joint decision.'], ['One measure from each loop', 'Put one logic measure and one feeling measure on every decision, written before you decide.'], ['A switch check', 'After each decision under pressure, ask once: did I switch? If yes, what triggered it?'], ['Short practice', 'Short exercises with examples of both loops, one a week.']],
  'Low': [['Simple guides to both loops', 'Read the one-page guide to each loop and how to translate between them, before your next joint decision.'], ['One measure from each loop', 'Put one logic measure and one feeling measure on every decision, written before you decide.'], ['A switch check', 'After each decision under pressure, ask once: did I switch? If yes, what triggered it?'], ['Short practice', 'Short exercises with examples of both loops, one a week.']],
  'Moderate': [['Weeks led by each loop in turn', 'Alternate a week led by your loop with a week led by the other loop on one piece of shared work.'], ['“What could go wrong” lists with the other core type', 'Before a plan starts, list how it could fail, with someone of the other core type in the room.'], ['A repair routine', 'Use the step-by-step guide for repairing a clash the next time a decision splits.']],
  'High': [['Rotate who leads', 'Rotate who leads meetings between the core types, and notice what each leader asks for first.'], ['Practice on real decisions', 'Take one live decision a month and run it the other loop\u2019s way before deciding.'], ['A session with your mirror subtype', 'A quarterly session with your mirror subtype, the person who executes as you do on the other loop.']],
  'Mastery': [['Roles shared across both loops', 'Share roles across both loops so the right loop leads at each stage.'], ['Dashboards that show both measures', 'Keep one logic measure and one feeling measure visible on every dashboard.'], ['Mentor others', 'Mentor people on the other loop in reading yours.']]
};
const D3_WORK = { /* working with the alternate loop, by core type (BS-DI-003 4.3) */
  architect: [['What to recognise in an Alchemist', 'Emerging patterns, momentum in the story, how the market feels.'], ['How to translate', 'Turn an Alchemist\u2019s story into a list of what must be true, then into constraints and criteria.'], ['How to work together', 'Let the Alchemist show a working example first, decide, then write the detailed plan to scale it.'], ['Agreed measures', 'One sign of pull (how many people take it up) and one proof (how many tests pass).'], ['How to repair a clash', 'Acknowledge the other person\u2019s feeling first, then bring the discussion back to the fewest constraints needed.']],
  alchemist: [['What to recognise in an Architect', 'Constraints, capacity limits, what the system can actually do.'], ['How to translate', 'Turn an Architect\u2019s model into a storyline, then a promise, then a working example.'], ['How to work together', 'Let the Architect write the plan first, test it, then tell the story so people take it up.'], ['Agreed measures', 'One sign of stability (service levels met) and one sign of pull (engagement, recommendation).'], ['How to repair a clash', 'Accept the constraints you missed, then keep the heart of the story in a version that can be delivered.']]
};
const D3_FAIL = [['Story against detailed plan', 'One person argues from a story, the other from a detailed plan; each dismisses the other.'], ['Wrong timing', 'A working example shown before anything is defined, or a full detailed plan written before anything is proven.'], ['One measure only', 'Decisions made only by numbers, or only by feel.'], ['Wrong loop leading', 'The loop that should lead a meeting ends up left out of it.'], ['Same loop, different subtype', 'Two people on the same loop clash because they execute differently, for example a Master Strategist and a Systemised Builder.'], ['Slow repair', 'A clash drains speed and trust.']];
const D3_SCEN = {
  architect: [['Launch deadline, weak take-up', 'With low alternate-loop awareness you miss the Alchemist\u2019s concern about the story, add more detail and tests, and miss the gap. With high awareness you recognise the concern, review a working example, list what must be true, set the constraints and agree a version that can be delivered.'], ['Strong in one loop only', 'With a very strong Dominant loop you rarely switch and make sound decisions alone, but dismiss an Alchemist partner\u2019s concerns as unfounded. With higher alternate-loop awareness you recognise the concern as a valid signal from the other loop and test it before deciding.']],
  alchemist: [['Sudden demand, operations under strain', 'With low non-dominant-loop awareness you switch to numbers alone under the pressure and lose the story that created the demand. With high awareness you notice the switch, add a capacity model and cut lines, and keep the heart of the story while staying stable.'], ['Launch deadline, criteria not met', 'With low alternate-loop awareness you re-tell the story until the Architect feels it, and the launch goes out before it can be delivered. With high awareness you accept the points you had missed and keep the heart of the story in a version that can be delivered.']]
};
const MIRROR3 = { MS: 'VO', VO: 'MS', IA: 'MP', MP: 'IA', SB: 'EE', EE: 'SB', UA: 'UAl', UAl: 'UA' };
function d3abilities(R) {
  /* Per-ability scores, 0 to 100, from the same scoring as the card (BS-DI-004); grouped under the four results in card order. */
  const list = p3list(); const a3 = p3answers(); const a1 = p1answers(); const sc = {};
  list.forEach(it => { const key = it.q.id + '-' + it.ver + (it.recall || ''); sc[key] = p3score(it, a3.ans[key] || {}, a1.ans || {}); });
  const g = k => sc[k] === undefined ? 0 : Math.round(sc[k]); const c = R.p1.core;
  if (c !== 'mixed') { const same = c === 'architect' ? 'P3-Q05' : 'P3-Q06', alt = c === 'architect' ? 'P3-Q06' : 'P3-Q05';
    return [[['Dominant-loop understanding', g('P3-Q01-' + c + '1A')]], [['Non-dominant-loop understanding', g('P3-Q02-' + c)], ['Switch awareness', g('P3-Q03-' + c + '2B')], ['Recovery after switching', g('P3-Q04-' + c)]], [['Recognition (same loop)', g(same + '-' + c)], ['Working together (same loop)', g('P3-Q08-' + c)], ['Conflict repair (same loop)', g('P3-Q11-' + c)]], [['Recognition (alternate loop)', g(alt + '-' + c)], ['Translation', g('P3-Q07-' + c)], ['Working together (alternate loop)', g('P3-Q09-' + c)], ['Shared decision rules', g('P3-Q10-' + c)], ['Conflict repair (alternate loop)', g('P3-Q12-' + c)]]]; }
  const lp = R.p3.area[0][0].loop; const selfA = [['Architect loop from the inside', g('P3-Q01-architect1A')], ['A logic-first decision', g('P3-Q02-alchemist')]], selfR = [['Alchemist loop from the inside', g('P3-Q01-alchemist2A')], ['A feeling-first decision', g('P3-Q02-architect')]];
  (lp === 'architect' ? selfA : selfR).push(['Switch awareness', g('P3-Q03-architect2B')], ['Recovery after switching', g('P3-Q04-architect')]);
  const shared = [['Working together (same loop)', g('P3-Q08-mixed')], ['Working together (alternate loop)', g('P3-Q09-mixed')], ['Shared decision rules', g('P3-Q10-mixed')], ['Conflict repair (same loop)', g('P3-Q11-mixed')]];
  const ofA = [['Recognising an Architect', g('P3-Q05-mixed')], ['Translating an Architect', g('P3-Q07-alchemist')], ['Repairing a clash with an Architect', g('P3-Q12-alchemist')]].concat(shared), ofR = [['Recognising an Alchemist', g('P3-Q06-mixed')], ['Translating an Alchemist', g('P3-Q07-architect')], ['Repairing a clash with an Alchemist', g('P3-Q12-architect')]].concat(shared);
  return lp === 'alchemist' ? [selfR, selfA, ofR, ofA] : [selfA, selfR, ofA, ofR];
}
function renderDetailed3(R, narrow) {
  const t = R.p1.core, r = R.p3; const A = t === 'architect'; const mixed = t === 'mixed'; const coreName = A ? 'Architect' : 'Alchemist';
  const results = r.area[0].concat(r.area[1]); const ab = d3abilities(R);
  let h = '<section class="rp rd" data-rt="' + t + '">' + rpBand(3, 'Alternate Decision Intelligence Loop Awareness') + '<div class="rp-body">';
  /* 1. What this part is about */
  h += '<div class="rp-h19">How well you read yourself and others</div><p class="rp-sent">Part 2 showed how you execute.<br>Part 3 shows how well you understand your own decision making process and that of others too. It is a skill, not a preference, so it can be practised and it is reassessed with Part 1 after the workbook.</p>';
  /* 2. The basic card, unchanged */
  /* Wording of the results intro (Fariza Javed, 16 November 2026) */
  const resIntro = mixed
    ? '<p class="rp-sent">How well you understand</p><ul class="rd-ul big"><li><b>the Architect Decision Intelligence Loop</b> (a logic-first decision, from the inside)</li><li><b>the Alchemist Decision Intelligence Loop</b> (a feeling-first decision, from the inside)</li></ul><p class="rp-sent">and how well you recognise them in others</p><ul class="rd-ul big"><li><b>Architects:</b> people whose Dominant loop is the Architect loop.</li><li><b>Alchemists:</b> people whose Dominant loop is the Alchemist loop.</li></ul>'
    : '<p class="rp-sent">How well you understand your</p><ul class="rd-ul big"><li><b>Dominant Decision Intelligence Loop</b> (your Dominant loop, helping you make the best decisions)</li><li><b>Non-dominant Decision Intelligence Loop</b> (your non-dominant loop, which you switch to under stress)</li></ul><p class="rp-sent">and how well you recognise them in others</p><ul class="rd-ul big"><li><b>Same loop:</b> the Dominant loop in others that is the same as yours.</li><li><b>Alternate loop:</b> the Dominant loop in others that is your non-dominant loop.</li></ul>';
  h += '<div class="rp-s">Your results</div>' + renderPart3(R).replace(/^<section[^>]*>[\s\S]*?<div class="rp-body">/, '<div class="rd-basic">').replace(/<\/div><\/section>$/, '</div>').replace(/<p class="rp-sent">[\s\S]*?<\/p>/, resIntro);
  /* 3. What each result means, and your level */
  h += '<hr class="rp-divider"><div class="rp-h19">What each result means</div><div class="rd-adapt">';
  results.forEach((x, i) => { const lvTxt = mixed ? D3_LEVEL[i < 2 ? 0 : 3][x.level] : D3_LEVEL[i][x.level]; h += '<div class="row"><span class="k">' + x.k + '<small>' + x.level + '</small></span><span class="v">' + D3_MEAN[t][mixed ? (x.loop === 'architect' ? (i < 2 ? 0 : 2) : (i < 2 ? 1 : 3)) : i] + ' <b>Your level, ' + x.level + ':</b> ' + lvTxt + '</span></div>'; });
  h += '</div>';
  if (!mixed) h += '<p class="rp-sent">No result can be higher than your Dominant-loop awareness, because you understand your other loop, and other people\u2019s loops, through your own Dominant loop.</p>';
  else h += '<p class="rp-sent">While your Dominant Decision Intelligence Loop is not yet confirmed, each result shows Moderate at most, because no loop leads yet.</p>';
  /* 4. The score behind the result */
  h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div><p class="rp-sent">Each result is built from the abilities below. Every ability is scored from your answers to the Part 3 scenarios, out of 100, and the result is their average' + (mixed ? '' : '; translation and shared decision rules count a little more') + '.</p>';
  results.forEach((x, i) => { h += '<div class="rd-abil"><div class="t ' + (x.loop === 'architect' ? 'A' : 'R') + '">' + x.k + ' \u00b7 ' + x.level + (x.capped ? ' <small>(set to your Dominant-loop level)</small>' : '') + '</div><div class="rd-stab">';
    ab[i].forEach(q => { h += '<div class="row"><span class="l">' + q[0] + '</span><span class="bar"><i class="' + (x.loop === 'architect' ? 'A' : 'R') + '" style="width:' + q[1] + '%"></i></span><span class="v"><b>' + q[1] + '</b> / 100</span></div>'; });
    h += '</div></div>'; });
  const trig = (() => { const key = 'P3-Q03-' + (mixed ? 'architect' : t) + '2B'; const sv = (typeof saved3 !== 'undefined') && saved3[key]; return sv && sv.trigger !== undefined && part3[2].trigger ? (sv.triggerText || part3[2].trigger.opts[sv.trigger]) : null; })();
  if (trig) h += '<p class="rp-sent"><b>What triggered your switch under pressure:</b> ' + trig + '.</p>';
  /* 5. Where awareness goes wrong */
  h += '<hr class="rp-divider"><div class="rp-h19">Where awareness goes wrong</div><p class="rp-sent">The patterns that cost speed and trust between people on different loops, or on the same loop with different subtypes.</p><div class="rd-adapt">';
  D3_FAIL.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; });
  h += '</div>';
  if (!mixed) { h += '<div class="rp-h19">What this looks like in practice</div><div class="rd-adapt">'; D3_SCEN[t].forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; }); h += '</div>'; }
  /* 6. How to improve: the lowest result first */
  const low = results.slice().sort((a, b) => a.v - b.v)[0];
  h += '<hr class="rp-divider"><div class="rp-h19">How to improve</div><p class="rp-sent">Start with your lowest result, <b>' + low.k.replace(/ \(.*\)/, '') + '</b> (' + low.level + '). ' + (mixed ? 'The first goal is one Dominant Decision Intelligence Loop; the workbook for your leaning does that, and your Part 3 results are reassessed with Part 1 after it.' : 'The workbook gives targeted practice for it.') + '</p><div class="rd-adapt">';
  D3_IMPROVE[low.level].forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; });
  if (!mixed) { const k = R.p2.result; const m = MIRROR3[k]; const mg = m === 'UAl' ? ['VO', 'MP', 'EE'] : m === 'UA' ? ['MS', 'IA', 'SB'] : [m];
    const games = []; mg.forEach(s => SUB_X[s].games.forEach(g => games.push([g[0], SUB_TXT[s][0]])));
    h += '<div class="row"><span class="k">Games to help you read the other loop</span><span class="v"><div>Your mirror subtype is <b>' + SUB_TXT[m][0] + '</b>: the same way of executing as you, on the ' + (A ? 'Alchemist' : 'Architect') + ' loop. Play these games to improve your awareness of the skills used by the other loop to decide and execute.</div><ul class="rd-ul rd-games">' + games.map(g => '<li><b>' + g[0] + '</b> \u00b7 ' + g[1] + '</li>').join('') + '</ul></span></div>'; }
  h += '</div>';
  /* 7. Working with the alternate loop */
  if (!mixed) { h += '<hr class="rp-divider"><div class="rp-h19">Working with the ' + (A ? 'Alchemist' : 'Architect') + ' loop</div><div class="rd-adapt">'; D3_WORK[t].forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; }); h += '</div>'; }
  else {
    /* Mixed: games to help find the Dominant loop (approved by Fariza Javed, 16 November 2026) */
    const L = lean === 'alchemist' ? 'Alchemist' : lean === 'architect' ? 'Architect' : null; const O = L === 'Architect' ? 'Alchemist' : 'Architect';
    const ROWS = [['Architect', 'MS', 'Choosing the order of moves and deciding before the plan is complete'], ['Architect', 'IA', 'Working it out from the evidence, with a limit on guesses, and explaining it simply'], ['Architect', 'SB', 'Keeping a routine running while what arrives keeps changing'], ['Alchemist', 'VO', 'Getting an idea across so others can act on it, under a timer, and moving under a constraint'], ['Alchemist', 'MP', 'Committing to the best version you have before it is perfect, or before you are certain'], ['Alchemist', 'EE', 'Saying no, holding a boundary, one decision at a time on your own read']];
    h += '<hr class="rp-divider"><div class="rp-h19">Games to help you find your Dominant loop</div><p class="rp-sent">You do not yet have a confirmed Dominant Decision Intelligence Loop, so there is no single set of games for you yet. Each game below rewards one loop\u2019s way of deciding and executing. Try a few from each side and notice which ones you are naturally good at, or simply enjoy. When one side clearly fits, keep playing those games to strengthen your execution on that loop, and later play the other side\u2019s games to build your awareness of it.</p>';
    if (L) h += '<p class="rp-sent">You lean ' + L + ', so start with the ' + L + ' side of the table and use the ' + O + ' side as a check: if you find those games easier or more enjoyable, your leaning may be the other way, and the workbook will show it.</p>';
    h += '<div class="rd-games3"><div class="hd"><span>Loop</span><span>Subtype</span><span>Games</span><span>What they reward</span></div>';
    ROWS.forEach(r => { h += '<div class="row ' + (r[0] === 'Architect' ? 'A' : 'R') + '"><span class="lp">' + r[0] + '</span><span class="st">' + SUB_TXT[r[1]][0] + '</span><span class="gm">' + SUB_X[r[1]].games.map(g => g[0]).join(' \u00b7 ') + '</span><span class="wr">' + r[2] + '</span></div>'; });
    h += '</div><div class="rd-adapt">';
    h += '<div class="row"><span class="k">1. Find your loop</span><span class="v">Play two or three games from each side over the next two weeks. Note which side you win at, or come back to without being asked. Natural ease on one side may suggest a natural tendency to that loop; the workbook for your leaning confirms it, then retake E-DNA in 4 weeks.</span></div>';
    h += '<div class="row"><span class="k">2. Strengthen it</span><span class="v">Once your Dominant loop is confirmed, keep playing that side\u2019s games, especially those of your subtype, to strengthen how you execute on it.</span></div>';
    h += '<div class="row"><span class="k">3. Then build awareness</span><span class="v">After that, play the other side\u2019s games to improve your awareness of the skills the other loop uses to decide and execute. This comes in your updated report, not now.</span></div></div>';
  }
  return h + '</div></section>';
}

/* ---------- Part 4: Learning Style Preferences (BS-DI-003 5.1 to 5.7) ---------- */
const D4_MEAN = { /* what each result means for how the person learns, and what to ask for; written from BS-DI-003 5.3 to 5.5 */
  Visual: ['You take information in best when you can see it: a diagram, a chart, a sketch of how the parts fit. A page of text slows you; the same content as a picture lands at once.', 'Ask for the diagram first and the explanation second.'],
  Auditory: ['You take information in best when you hear it: a conversation, a talk, something repeated aloud. You learn by asking questions and hearing the answer.', 'Talk it through, and keep a recording of any explanation you will need again.'],
  'Read/Write': ['You take information in best when you can read it and write it down: text, lists, notes. Writing it out is how you think it through.', 'Ask for it in writing, and make your own notes before you act on it.'],
  Kinaesthetic: ['You take information in best by doing: open the tool, enter your own numbers, try it until it makes sense. A demonstration helps less than a go.', 'Ask for a template you can change, not a description of one.'],
  Multimodal: ['No single way leads. You use whichever format fits the task, which makes you flexible and means you sometimes have to choose.', 'Pick the format by the job: a diagram for a structure, a conversation for a judgement, a template for a method.'],
  Structured: ['You learn step by step, in order, each piece built on the last. Skipping ahead costs you; a long guide read from the first page works.', 'Ask for the order of the steps before the detail.'],
  Global: ['You need the whole first, then the detail. Until you can see how it fits together, no single part makes sense.', 'Ask for the overview or the map first; skim before you read.'],
  Adaptive: ['You move between the two: an overview for new ground, step by step once you are in it, and you work well alone or with others.', 'Decide at the start which the task needs, then switch deliberately.'],
  Concrete: ['An idea makes sense to you through facts, details and a real example from a business like yours. A principle on its own does not land until you see it applied.', 'Ask for the worked case, with numbers.'],
  Abstract: ['An idea makes sense to you through the principle: why it works and where else it applies. Once you have the pattern, the examples follow.', 'Ask for the rule first, then one example.'],
  Flexible: ['You move between the two: the example when an idea is new, the principle to carry it somewhere else.', 'Ask for both, and notice which one you reach for when it is new.'],
  Individual: ['You learn something difficult best alone, at your own rhythm. Discussion before you have thought it through costs you focus.', 'Prepare alone before any group session, and say so.'],
  Collaborative: ['You learn something difficult best with other people: discussion and shared energy. Talking it through is how it becomes clear.', 'Find a partner, a group or a course with others for anything hard.'],
  Fast: ['You learn in short, intense bursts; momentum carries you. A long, slow module loses you.', 'Ask for the key deliverables and sprint through them; add the depth afterwards.'],
  Slow: ['You learn steadily and methodically; depth over speed. Under time pressure you ask for a longer timeline to keep accuracy.', 'Protect the time. Do not trade accuracy for a deadline that can be moved.'],
  Versatile: ['You learn fast when you need to and slowly for mastery.', 'Decide which the task is before you start, and do not let urgency decide for you.']
};
const D4_SCEN = [['A new concept, such as a financial model', 'A visual, structured learner builds a flowchart; an auditory learner listens to a discussion; a kinaesthetic learner enters data into a template and changes the numbers.'], ['A group workshop', 'Collaborative learners do well in breakout groups; individual learners benefit from a solo preparation sheet before sharing.'], ['Time pressure', 'Fast-paced learners sprint through the key deliverables; slow-paced learners ask for longer timelines to keep accuracy.']];
function renderDetailed4(R, narrow) {
  const t = R.p1.core, r = R.p4; const a4 = p4answers().ans;
  let h = '<section class="rp rd" data-rt="' + t + '">' + rpBand(4, 'Learning Style Preferences') + '<div class="rp-body">';
  /* 1. What this part is about */
  h += '<div class="rp-h19">How you learn</div><p class="rp-sent">Part 3 showed how well you understand your own decision making process and that of others too.<br>Part 4 shows how you prefer to take in and process information: through reading, listening, seeing or doing; step by step or big picture first; concrete or abstract; alone or with others; and at what pace. It is a preference, not a skill: no style is better than another but each style is better suited to different types of learning.</p>';
  /* 2. The basic page, unchanged */
  /* The basic page's closing note ("Every person has a result in all five areas…") is not repeated in the detailed report (Fariza Javed, 16 November 2026). */
  h += '<div class="rp-s">Your results</div>' + renderPart4(R, narrow).replace(/^<section[^>]*>[\s\S]*?<div class="rp-body">/, '<div class="rd-basic">').replace(/<\/div><\/section>$/, '</div>').replace(/<hr class="rp-divider"><div class="rp-note">Every person has a result in all five areas\.[^<]*<\/div>/, '').replace(/<div class="rp-note">Every person has a result in all five areas\.[^<]*<\/div>/, '');
  /* 3. What each result means */
  h += '<hr class="rp-divider"><div class="rp-h19">What each result means for how you learn</div><div class="rd-adapt">';
  r.domains.forEach((d, i) => { const M = D4_MEAN[d.r] || ['', '']; h += '<div class="row"><span class="k">' + d.dom + '<small>' + d.r + '</small></span><span class="v">' + M[0] + ' <b>What to ask for:</b> ' + M[1] + '</span></div>'; });
  h += '</div>';
  /* 4. The answers behind the result */
  const clear = r.domains.filter(d => d.clear).length;
  h += '<hr class="rp-divider"><div class="rp-h19">The answers behind your result</div><p class="rp-sent">Each area was asked twice, in two different situations. The same answer both times gives that result; two different answers give the flexible result for that area.</p>';
  h += '<div class="rd-dims rd-dims4"><div class="hd"><span>Area</span><span>First situation</span><span>Second situation</span><span>Same answer</span></div>';
  r.domains.forEach((d, i) => { const q1 = part4[i * 2], q2 = part4[i * 2 + 1]; const o1 = q1.opts[a4[i * 2]].r, o2 = q2.opts[a4[i * 2 + 1]].r;
    h += '<div class="row"><span class="d">' + d.dom + '</span><span><small>' + q1.ctx + '</small><span class="rd-chip4">' + o1 + '</span></span><span><small>' + q2.ctx + '</small><span class="rd-chip4">' + o2 + '</span></span><span class="mk ' + (d.clear ? 'yes' : 'no') + '"><i>' + (d.clear ? '✓' : '–') + '</i></span></div>'; });
  h += '</div><p class="rp-sent">Same answer in <b>' + clear + '</b> of <b>5</b> areas: your profile is <b>' + (r.profile === 'clear' ? 'clear' : 'flat') + '</b>. ' + (r.profile === 'clear' ? 'A clear profile means delivery can match it closely.' : 'A flat profile means you are versatile, but you may need guidance on when to switch approach.') + '</p>';
  /* 5. Using your preferences */
  h += '<hr class="rp-divider"><div class="rp-h19">What this looks like in practice</div><div class="rd-adapt">';
  D4_SCEN.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; });
  h += '</div><div class="rd-def"><div>Your reports, workbooks and AI mentor explanations follow these preferences. How, exactly, is in the closing section after Part 7.</div></div>';
  return h + '</div></section>';
}

/* ---------- Part 5: Neurodiversity & Accessibility (BS-DI-003 6.1 to 6.9) ---------- */
const D5_DOM = { 'Attention and regulation': 'How focus starts, how long it lasts, and how it moves between tasks.', 'Language and processing': 'How easily you understand text, speech and symbols, and in which form.', 'Structure and routine': 'How much you need predictability, stability and clear rules.', 'Sensory load': 'How your brain filters noise, light, movement and busy settings.', 'Body chemistry and diet': 'How what you eat and drink affects your focus and behaviour.' };
const D5_LEVEL = { Low: 'This area works for you as it is. No adaptation is switched on.', Moderate: 'Adaptations in this area help you, and are switched on.', High: 'Adaptations in this area make a real difference to how you work, and are switched on.' };
const D5_PAT = { /* pattern: what it can look like, strengths, what you can do (BS-DI-003 6.5) */
  'Fast-switching focus': ['Focus that varies; drawn to new things; works best with high stimulation; loses track of time.', 'Work in short segments of five to seven minutes with a small goal and a visible tick for each; review in sprints, not in one long sitting.'],
  'Visual and spoken processing': ['Finds dense text slow or tiring; strong visual and spatial thinking.', 'Ask for the audio or the diagram before the document; read the short summary first and the full text only when you need it.'],
  'Structure and clarity': ['Prefers structure, literal clarity and consistent settings.', 'Ask for the agenda in advance and notice of any change; keep the same lesson flow each time: introduction, content, reflection.'],
  'Sensory sensitivity': ['Strong reaction to sound, light or movement.', 'Use focus mode, sound off and reduced motion; choose a quiet, settled space for the work that matters.'],
  'Layered processing': ['Two or more of the patterns above together.', 'Combine the formats (audio, visual, interactive); alternate sprints with deep dives; pace your schedule to your energy.']
};
const D5_SCEN = { 'Fast-switching focus': ['A long module', 'You lose concentration partway through; the module is broken into five short blocks with checkpoints.'], 'Visual and spoken processing': ['A workbook with dense text', 'You get audio playback and visual summaries instead of the full text.'], 'Structure and clarity': ['An unexpected change in a project', 'You get a before-and-after map and clear rules for the change.'], 'Sensory sensitivity': ['A busy, noisy workspace', 'You get focus mode and gentle transitions.'] };
function renderDetailed5(R, narrow) {
  const t = R.p1.core, r = R.p5; const c = r.consent;
  let h = '<section class="rp rd" data-rt="' + t + '">' + rpBand(5, 'Neurodiversity &amp; Accessibility') + '<div class="rp-body">';
  /* 1. What this part is about */
  h += '<div class="rp-h19">What environment you need to work well</div><p class="rp-sent">Part 4 showed how you prefer to take in and process information.<br>Part 5 shows the conditions under which you process information and perform consistently: focus, energy, sensitivity to noise and busy settings, and how you respond to pressure. It is not a diagnosis. It describes how you work best, so that you can adjust your pacing, environment and routine, and the app can set what it is able to: formats, settings and pace. It matches the system to you; it does not correct you.</p>';
  /* 2. The basic page, unchanged */
  h += '<div class="rp-s">Your results</div>' + renderPart5(R, narrow).replace(/^<section[^>]*>[\s\S]*?<div class="rp-body">/, '<div class="rd-basic">').replace(/<\/div><\/section>$/, '</div>');
  /* 3. What each area means, and your level */
  h += '<hr class="rp-divider"><div class="rp-h19">What each area means</div><div class="rd-adapt">';
  r.domains.forEach(d => { h += '<div class="row"><span class="k">' + d.dom + '<small>' + d.level + '</small></span><span class="v">' + D5_DOM[d.dom] + ' <b>Your level, ' + d.level + ':</b> ' + D5_LEVEL[d.level] + '</span></div>'; });
  h += '</div>';
  /* 4. Your patterns (after consent only) */
  h += '<hr class="rp-divider"><div class="rp-h19">Your patterns</div>';
  if (!c) h += '<div class="rd-def"><div>Your patterns, your exceptional strengths and the comparison with neurotypical and neurodivergent people are shown once you give permission: the i on your result above. Your adaptation levels are shown either way, and saying no changes nothing else in your report.</div></div>';
  else if (r.patterns.length === 0 && r.strengths.length === 0) h += '<p class="rp-sent">No specific pattern was found. The areas marked Moderate still have their adaptations switched on.</p>';
  else {
    h += '<p class="rp-sent">A pattern applies when an area is High. The strengths listed are what to look for; they are not a claim that everyone with the pattern has them.</p><div class="rd-adapt">';
    if (r.layered) h += '<div class="row"><span class="k">Layered processing</span><span class="v">' + D5_PAT['Layered processing'][0] + ' <b>What you can do:</b> ' + D5_PAT['Layered processing'][1] + '</span></div>';
    r.patterns.forEach(p => { const P = D5_PAT[p[0]]; h += '<div class="row"><span class="k">' + p[0] + '<small>Strengths to look for: ' + p[1] + '</small></span><span class="v"><b>What it can look like:</b> ' + P[0] + ' <b>What you can do:</b> ' + P[1] + '</span></div>'; });
    r.strengths.forEach(x => { h += '<div class="row"><span class="k">Exceptional strength: ' + x.n + '</span><span class="v">Your answers show unusual ' + x.n + '. It shows whatever your processing style, and it is a strength to plan around, not a pattern to adapt for.</span></div>'; });
    h += '</div>';
  }
  /* 5. The score behind the result */
  h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div><p class="rp-sent">Each area has at least four statements, answered Never, Sometimes or Often. Your score is your answers as a share of the highest possible: up to 39 is Low, 40 to 59 Moderate, 60 and above High.' + (c ? ' An exceptional strength shows at 60 or above.' : '') + '</p><div class="rd-stab rd-sub5">';
  r.domains.forEach(d => { h += '<div class="row"><span class="l">' + d.dom + '</span><span class="bar"><i style="width:' + d.score + '%"></i><em style="left:40%"></em><em style="left:60%"></em></span><span class="v"><b>' + d.score + '</b> · ' + d.level + '</span></div>'; });
  if (c) r.strengths.forEach(x => { h += '<div class="row"><span class="l">Strength: ' + x.n + '</span><span class="bar"><i style="width:' + x.score + '%"></i><em style="left:60%"></em></span><span class="v"><b>' + x.score + '</b> · shown</span></div>'; });
  h += '</div>';
  /* 6. What this looks like in practice */
  const sc = r.patterns.map(p => D5_SCEN[p[0]]).filter(Boolean);
  if (c && sc.length) { h += '<hr class="rp-divider"><div class="rp-h19">What this looks like in practice</div><div class="rd-adapt">'; sc.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span></div>'; }); h += '</div>'; }
  /* 7. Settings and routine */
  const diet = r.domains.find(d => d.dom === 'Body chemistry and diet');
  h += '<hr class="rp-divider"><div class="rp-h19">Settings and routine you can use now</div><div class="rd-adapt">';
  h += '<div class="row"><span class="k">Accessibility settings</span><span class="v">Every Brandscaling app and website lets you set the font (Inter, Verdana or Arial), text size, extra spacing, reduced motion, a light, dark or high-contrast theme, and reduced transparency. Set them before your next session; they apply everywhere, including the assessment itself.</span></div>';
  if (diet && diet.level !== 'Low') h += '<div class="row"><span class="k">Diet and routine</span><span class="v">Your focus changes with what and when you eat or drink. Keep regular mealtimes, and keep a food and drink diary for two weeks to see what affects your focus.</span></div>';
  h += '</div><div class="rp-foot"><b>THIS IS NOT A DIAGNOSIS.</b> Your results describe how you work best.</div>';
  return h + '</div></section>';
}

/* ---------- Part 6: Mindset & Personality (BS-DI-003 7.1 to 7.9) ---------- */
const D6_DOM = { Mindset: 'How you frame challenge, effort and mistakes.', Confidence: 'How sure you are of your own judgement when deciding.', Patience: 'How quickly you move from a feeling or idea to action.', 'Risk style': 'How you engage with uncertainty and possible loss.', Energy: 'How you recharge and sustain focus.' };
const D6_RES = { /* result: [what it can look like, strengths, watch-outs, what to adapt (you), what the app provides] from BS-DI-003 7.3 to 7.7 */
  Growth: ['You treat challenges as information and failure as the next attempt, and recover quickly.', 'Adaptability, persistence, open to feedback', 'Takes on too much without stopping to reflect or consolidate', 'After each stretch, stop for one structured review before you take on the next.', 'Stretch goals, fast cycles and structured reviews.'],
  Situational: ['You are flexible in some areas and rigid in others.', 'Judges each context, self-aware', 'Responds inconsistently under pressure', 'Before a decision under pressure, ask: where can I test, and where do I need certainty?', 'Alternates challenge and stability, and asks the same question in the workbook.'],
  Fixed: ['You prefer stability, treat ability as fixed and find mistakes threatening.', 'High standards, precision, predictability', 'Avoids experiments; defensive when given feedback', 'Take one low-risk experiment a month, and treat its result as information, not a verdict.', 'Low-risk learning paths, gradual wins and predictable milestones.'],
  Confident: ['You trust your own judgement and commit to a decision.', 'Decisive, reassures others', 'Can overlook other views or warning signs', 'Before you commit, look for one piece of evidence against the decision and write it down.', 'A prompt to look for evidence against the decision before committing.'],
  'Self-doubting': ['You second-guess decisions and look for approval before acting.', 'Careful, open to advice', 'Delays or reverses decisions; gives authority to others', 'Make small, safe decisions without asking, and keep a record of the ones that worked.', 'Small, safe decisions to build a record, and mentor check-ins after each decision.'],
  Patient: ['You wait for enough information before acting.', 'Considered decisions, steady progress', 'Can miss time-limited opportunities', 'Give every decision a deadline when you open it, and decide on the date with what you have.', 'Decision deadlines and time limits.'],
  Balanced: ['You act quickly or wait, depending on the situation.', 'Matches speed to the decision', 'Can misjudge which situation is which', 'Ask one question first: is this decision reversible? If yes, move; if not, wait.', 'The same short check before each decision.'],
  Impulsive: ['You act on the first feeling or idea.', 'Speed, seizes opportunities', 'Decisions made before the loop finishes; regret and reversals', 'Pause before any large decision and write one reason for it before you act.', 'A pause before large decisions and a written reason for each one.'],
  'Risk-taking': ['You act quickly on the upside and are comfortable with ambiguity.', 'Decisive, innovative, first to market', 'Over-commits; scales recklessly', 'Stage every bet, and write the stop point before you start.', '“What could go wrong” lists, staged bets, stop and scale checkpoints, reviews after each decision.'],
  'Risk-balanced': ['You balance caution with momentum.', 'Measured experiments, steady execution', 'Analysis slows decisions; slow to commit', 'Set the test and its end date before you start analysing, and commit when it ends.', 'Milestone approvals, structured tests and checkpoints before scaling.'],
  'Risk-averse': ['You look for stability and predictability.', 'Consistent, reliable, thorough checks', 'Misses windows of opportunity', 'Run one experiment that is safe to fail each month, and increase exposure gradually.', 'Safety buffers, experiments that are safe to fail, a gradual increase in exposure.'],
  Outward: ['You are energised by people, collaboration and momentum.', 'Builds momentum through people and collaboration', 'Too much time with others; scattered focus', 'Protect solo follow-through time after every live session.', 'Live sessions balanced with solo follow-through.'],
  Inward: ['You are energised by time alone and deep thinking.', 'Focus, depth, clear thinking', 'Low visibility; ideas not shared', 'Share one written idea a week, and send a brief before every meeting.', 'Written channels, protected deep-work time, briefs before meetings.']
};
const D6_ENERGY_BAL = ['You move between solo and group work by context.', 'Flexible, reads social situations well', 'Drained if one mode lasts too long', 'Check each week what recharged you and what drained you, and rebalance.', 'Alternates deep work and group sessions, with a weekly check of what recharges and what drains.'];
function renderDetailed6(R, narrow) {
  const t = R.p1.core, r = R.p6;
  let h = '<section class="rp rd" data-rt="' + t + '">' + rpBand(6, 'Mindset &amp; Personality') + '<div class="rp-body">';
  /* 1. What this part is about */
  h += '<div class="rp-h19">Your mindset</div><p class="rp-sent">Part 5 showed what environment you need to work well.<br>Part 6 shows your disposition: the attitude and tone you bring into a decision before your Decision Intelligence Loop starts, throughout the sequence and at the end. Five areas: mindset, confidence, patience, risk style and energy. It describes tendencies, not who you are. Your disposition acts on a decision while it is being made: where your mindset is at the point of final validation decides the course of the decision.</p>';
  /* 2. The basic page, unchanged */
  /* The basic page's note ("The marker shows where the person sits…") is not repeated in the detailed report (Fariza Javed, 16 November 2026). */
  h += '<div class="rp-s">Your results</div>' + renderPart6(R).replace(/^<section[^>]*>[\s\S]*?<div class="rp-body">/, '<div class="rd-basic">').replace(/<\/div><\/section>$/, '</div>').replace(/<hr class="rp-divider"><div class="rp-note">The marker shows where the person sits\.[^<]*<\/div>/, '').replace(/<div class="rp-note">The marker shows where the person sits\.[^<]*<\/div>/, '');
  /* 3. What each result means */
  h += '<hr class="rp-divider"><div class="rp-h19">What each result means</div><div class="rd-adapt">';
  r.forEach(d => { const X = (d.dom === 'Energy' && d.result === 'Balanced') ? D6_ENERGY_BAL : D6_RES[d.result];
    h += '<div class="row"><span class="k">' + d.dom + '<small>' + d.result + '</small></span><span class="v">' + D6_DOM[d.dom] + ' ' + X[0] + ' <b>Strengths:</b> ' + X[1] + '. <b>Watch-outs:</b> ' + X[2] + '.' + (d.dom === 'Mindset' ? ' <small class="rd-src">Growth and fixed mindset follow Carol Dweck’s definition (Stanford University).</small>' : '') + '</span></div>'; });
  h += '</div>';
  /* 4. The score behind the result */
  h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div><p class="rp-sent">Each area has four statements, from strongly disagree to strongly agree, some worded in each direction. Your score places you in one of three sections: up to 39, 40 to 69, or 70 and above. The sections are an order, not a ranking.</p><div class="rd-stab rd-sub6">';
  r.forEach(d => { h += '<div class="row"><span class="l">' + d.dom + '</span><span class="bar"><i style="width:' + d.score + '%"></i><em style="left:40%"></em><em style="left:70%"></em></span><span class="v"><b>' + d.score + '</b> · ' + d.result + '</span></div>'; });
  h += '</div>';
  /* 5. What to adapt, and what the app provides */
  h += '<hr class="rp-divider"><div class="rp-h19">What to adapt</div><p class="rp-sent">One practice for each area, written for your result. What the app provides for each is in the closing section after Part 7.</p><div class="rd-adapt">';
  r.forEach(d => { const X = (d.dom === 'Energy' && d.result === 'Balanced') ? D6_ENERGY_BAL : D6_RES[d.result]; h += '<div class="row"><span class="k">' + d.dom + '<small>' + d.result + '</small></span><span class="v">' + X[3] + '</span></div>'; });
  h += '</div>';
  return h + '</div></section>';
}

/* ---------- Part 7: Meta-Beliefs & Values (BS-DI-003 8.1 to 8.9) ---------- */
const D7_BEL = { 'Success means': 'What you count as success.', 'Build for': 'What you value in how a business is built.', 'Progress means': 'What you count as moving forward.', 'Proof is': 'What you believe shows a business is working.', 'Others are seen as': 'How you see others in the market.', 'Opportunity is': 'How much opportunity you believe there is.' };
const D7_END = { /* end: [what it means, what to adapt (you), what the app provides (BS-DI-003 8.6)] */
  Profit: ['You count success in money and return.', 'Add one line to every goal on what it means for customers.', 'Frames goals and progress in money terms first, with a short note on what it means for customers.'],
  Purpose: ['You count success as the difference the business makes.', 'Link each impact goal to the financial target that funds it.', 'Frames goals by the difference made, and links each financial target to the impact it funds.'],
  Speed: ['You value building fast and wide.', 'Before each stage of scaling, one check that the last stage holds.', 'Quick launches, with a check before each stage of scaling.'],
  Craft: ['You value building carefully and refining.', 'Agree the ready-to-ship standard before you start, and ship when it is met.', 'A ready-to-ship standard agreed in advance.'],
  New: ['Progress, for you, is trying new things.', 'Give every experiment a review point, and keep only what works.', 'Experiments with review points to keep what works.'],
  Proven: ['Progress, for you, is improving what already works.', 'Set a window each quarter to test one new idea.', 'Improvement cycles, with set windows to test new ideas.'],
  Numbers: ['You believe measured results show a business is working.', 'Put one customer story next to every figure you report.', 'Reports in figures, with customer stories alongside.'],
  Stories: ['You believe what customers and people see and say shows a business is working.', 'Put two figures under every story you tell.', 'Reports in customer stories, with a short summary of the figures.'],
  Collaborators: ['You see others in your market as people to work with.', 'Agree roles and boundaries before any partnership starts.', 'Partnerships with agreed roles and boundaries.'],
  Competitors: ['You see others in your market as people to beat.', 'Benchmark against them, and name one thing you would learn from them.', 'Benchmarks against others in the market.'],
  Plenty: ['You believe there is enough opportunity to go round.', 'Add a resource and feasibility check to every plan.', 'Plans include resource and feasibility checks.'],
  Limited: ['You believe opportunity must be won and protected.', 'Run small tests that make more of what you already have.', 'Plans include small tests that make more of existing resources.'],
  Both: ['You hold both beliefs; which one leads depends on the situation. This is not a lack of view.', 'Name which end is leading before you decide, so the choice is deliberate.', 'Shows both framings, and uses the one that fits the situation you described.']
};
const D7_SEP = { 'Proof is': 'Proof is what you believe shows a business is working. Part 1 is the order you think in.', 'Build for': 'Build for is what you value in how a business is built. Patience (Part 6) is how quickly you act.', 'Progress means': 'This is what you value as progress, not how much risk you will take. How you handle uncertainty is Risk style in Part 6.', 'Opportunity is': 'Opportunity is what you believe about the market. Mindset (Part 6) is how you see your own ability to improve.' };
const D7_PAIR = { 'Speed + Limited': ['You want to move fast while protecting resources.', 'A spending limit for each stage.'], 'Purpose + Stories': ['The impact is clear to you but harder to show to investors.', 'Each story paired with two figures.'], 'Craft + Competitors': ['You want it right and you want to be ahead.', 'A ship date and a quality standard agreed together.'], 'New + Limited': ['Many new ideas with tight resources.', 'A limit on how many new ideas run at once.'] };
const D7_STALL = { Purpose: ['Purpose', 'It would feel like putting money before the people you serve.'], Craft: ['Craft', 'The offer is not good enough yet to charge more.'], Competitors: ['Competitors', 'Someone else in the market could use it against you.'] };
function renderDetailed7(R, narrow) {
  const t = R.p1.core, r = R.p7; const a7 = p7answers().ans;
  let h = '<section class="rp rd" data-rt="' + t + '">' + rpBand(7, 'Meta-Beliefs &amp; Values') + '<div class="rp-body">';
  /* 1. What this part is about */
  h += '<div class="rp-h19">Your beliefs and values</div><p class="rp-sent">Part 6 showed your mindset.<br>Part 7 shows what you believe about business: what success means, how a business should be built, what progress means, what counts as proof, how you see others in the market and how much opportunity there is. These beliefs can allow, limit or override a decision even when logic and feeling agree: they act on the decision while it is being made, alongside your disposition. No belief is right or wrong.</p>';
  /* 2. The basic page, without its note */
  h += '<div class="rp-s">Your results</div>' + renderPart7(R, narrow).replace(/^<section[^>]*>[\s\S]*?<div class="rp-body">/, '<div class="rd-basic">').replace(/<\/div><\/section>$/, '</div>').replace(/<hr class="rp-divider"><div class="rp-note">No belief is right or wrong[^<]*<\/div>/, '').replace(/<div class="rp-note">No belief is right or wrong[^<]*<\/div>/, '');
  /* 3. What each belief means */
  h += '<hr class="rp-divider"><div class="rp-h19">What each belief means</div><div class="rd-adapt">';
  r.beliefs.forEach((b, i) => {
    let v;
    if (b.none) v = 'We could not give you a clear result for this belief: two or more of your answers were in your own words. They are reviewed and used to improve E-DNA.';
    else if (b.result === 'Both') { v = D7_END.Both[0];
      if (b.belief === 'Success means') v += ' ' + ({ A: 'When an unexpected sum landed in the business, you put it where it would bring the best return: profit led.', B: 'When an unexpected sum landed in the business, you put it into the difference the business makes: purpose led.', both: 'When an unexpected sum landed in the business, you split it: part to earn, part to serve.' }[a7[18]] || '');
      if (b.belief === 'Others are seen as') v += ' ' + ({ A: 'Offered a shared offer by a business in your market, you took it: collaborators led.', B: 'Offered a shared offer by a business in your market, you declined: competitors led.', both: 'Offered a shared offer by a business in your market, it depended on the business and the offer.' }[a7[19]] || '');
      if (b.belief !== 'Success means' && b.belief !== 'Others are seen as') v += ' Your answers were split between ' + b.a.toLowerCase() + ' and ' + b.c.toLowerCase() + '.'; }
    else v = D7_END[b.result][0];
    h += '<div class="row"><span class="k">' + b.belief + '<small>' + (b.none ? 'No clear result' : b.result === 'Both' ? b.both : b.result) + '</small></span><span class="v">' + D7_BEL[b.belief] + ' ' + v + (D7_SEP[b.belief] ? ' <small class="rd-src">' + D7_SEP[b.belief] + '</small>' : '') + '</span></div>'; });
  h += '</div>';
  /* 4. The score behind the result */
  h += '<hr class="rp-divider"><div class="rp-h19">The score behind your result</div><p class="rp-sent">Each belief is a line between two ends, both described in equally positive words. Your answers place you on it: up to 39 is the first end, 40 to 69 is Both, 70 and above is the other end. Most questions were trade-offs between two equally positive statements; a few were decisions in context.</p><div class="rd-stab rd-sub7">';
  r.beliefs.forEach(b => { if (b.none) { h += '<div class="row"><span class="l">' + b.belief + '</span><span class="bar"><i style="width:0"></i></span><span class="v">No clear result</span></div>'; return; }
    h += '<div class="row"><span class="l">' + b.belief + '<small>' + b.a + ' → ' + b.c + '</small></span><span class="bar"><i style="width:' + b.score + '%"></i><em style="left:40%"></em><em style="left:70%"></em></span><span class="v"><b>' + b.score + '</b> · ' + (b.result === 'Both' ? 'Both' : b.result) + '</span></div>'; });
  h += '</div>';
  /* 5. Where beliefs point to different choices */
  h += '<hr class="rp-divider"><div class="rp-h19">Where your beliefs point to different choices</div>';
  if (!r.flagged.length) h += '<p class="rp-sent">None of your beliefs point to different choices in the same decision.</p>';
  else { h += '<p class="rp-sent">Every belief is valid. These pairs can point to different choices in the same decision.</p><div class="rd-adapt">'; r.flagged.forEach(f => { const P = D7_PAIR[f]; if (P) h += '<div class="row"><span class="k">' + f + '</span><span class="v">' + P[0] + ' <b>What helps:</b> ' + P[1] + '</span></div>'; }); h += '</div>'; }
  /* 6. A decision that stalled */
  const st = D7_STALL[r.override];
  h += '<div class="rp-h19">A decision that stalled</div><p class="rp-sent">' + (st ? 'When a decision you had already made stalled (raising your prices), the belief holding it back was <b>' + st[0] + '</b>: ' + st[1] + ' A belief can override logic and feeling whilst the decision is being made, altering it from how you would have made it without the belief. Knowing which belief alters your decisions makes it visible next time.' : r.override === 'none' ? 'When a decision you had already made stalled (raising your prices), nothing held you back: you would raise the price. No belief overrode the decision.' : 'When a decision you had already made stalled, you answered in your own words; the answer is reviewed and used to improve E-DNA.') + '</p>';
  /* 7. What to adapt */
  h += '<hr class="rp-divider"><div class="rp-h19">What to adapt</div><p class="rp-sent">One practice for each belief, written for your result. What the app provides for each is in the closing section.</p><div class="rd-adapt">';
  r.beliefs.forEach(b => { if (b.none) return; const E = D7_END[b.result === 'Both' ? 'Both' : b.result]; h += '<div class="row"><span class="k">' + b.belief + '<small>' + (b.result === 'Both' ? b.both : b.result) + '</small></span><span class="v">' + E[1] + '</span></div>'; });
  h += '</div>';
  return h + '</div></section>';
}
function renderAdapts(R, narrow) {
  /* The closing section: how the app adapts to the person, collected from every part. Comes after the report, never inside a part (Fariza Javed, 15 November 2026). */
  const t = R.p1.core; const T = D1_TXT[t]; const who = t === 'architect' ? 'an Architect' : t === 'alchemist' ? 'an Alchemist' : 'Mixed';
  const rows = (t === 'mixed' && R.p1.lean !== 'none') ? [
    ['Strengthen your leaning loop', (R.p1.lean === 'architect' ? 'Architect' : 'Alchemist') + ' workbooks only, then retake E-DNA in about 4 weeks', 'You lean ' + (R.p1.lean === 'architect' ? 'Architect' : 'Alchemist') + ', so your workbooks are the ' + (R.p1.lean === 'architect' ? 'Architect' : 'Alchemist') + ' versions only. Each exercise makes you decide something real using that loop and records which loop you began and finished with. After about 4 weeks you retake E-DNA; when the loop holds under normal conditions and under stress, it is confirmed as your Dominant Decision Intelligence Loop.'],
    T.adapt[2],
    ['How AI ' + (R.p1.lean === 'architect' ? 'Architect' : 'Alchemist') + ' works with you', 'Your primary AI mentor is AI ' + (R.p1.lean === 'architect' ? 'Architect' : 'Alchemist'), 'When you bring a decision, AI ' + (R.p1.lean === 'architect' ? 'Architect' : 'Alchemist') + ' works through the ' + (R.p1.lean === 'architect' ? 'Architect' : 'Alchemist') + ' loop with you box by box, helps you hold that loop to the end of the decision, and records which loop your decision used. The record feeds your reassessment.']
  ] : T.adapt;
  const SUB_ADAPT = {"MS": [["Order of content", "Thesis → Bets → Milestones → Risks → Contingencies"], ["Tools", "layered roadmaps, option trees, objectives and key results (OKRs), “what could go wrong” lists"], ["Rhythm and reviews", "quarterly strategy reviews with a stop or scale rule for each bet; 6–8 week bet cycles with a midpoint check"], ["Measures", "early indicators for each bet and the worst case for each"]], "SB": [["Order of content", "Service standard → SOP → Training → Measurement → Continuous improvement"], ["Tools", "runbooks, checklists, playbooks, process control charts"], ["Rhythm and reviews", "change control and a log of problems and fixes; weekly operations sprints and monthly improvement sessions"], ["Measures", "cycle time, defect rate, cost per unit, service levels met"]], "IA": [["Order of content", "Hypothesis → Design → Sample size → Run → Interpret → Act"], ["Tools", "experiment lists, analysis notebooks, cause-and-effect diagrams"], ["Rhythm and reviews", "success criteria and stopping rules set before each test; 2-week test cycles with a weekly review of variance"], ["Measures", "improvement achieved, error margins, value of each decision"]], "UA": [["Order of content", "Strategy on one page → Operating design → Evidence plan"], ["Tools", "one map linking objectives, SOPs and experiments"], ["Rhythm and reviews", "a monthly strategy and operations review with two measures (impact and stability); strategy sprints alternating with operations sprints"]], "VO": [["Order of content", "Future → Why now → Pattern → First proof"], ["Tools", "story briefs, concept videos, mood boards"], ["Rhythm and reviews", "a \"must be true\" list and a 30-day window to prove each idea; discovery led by demos, then written down"], ["Measures", "how widely the story is taken up, momentum, first proofs delivered"]], "MP": [["Order of content", "Hook → The feeling the customer wants → Quality bar → What can be cut"], ["Tools", "quality bars, product standards, cut lines, design principles"], ["Rhythm and reviews", "red, amber and green cut lines with a weekly ship date; polish sprints with firm points at which to ship"], ["Measures", "activation, retention, customer recommendation scores, willingness to pay"]], "EE": [["Order of content", "Who → Why they care → Shared win → Next step"], ["Tools", "partner plans, a chart of who is responsible, accountable, consulted and informed for each task, commitment logs, community routines"], ["Rhythm and reviews", "exit criteria, time-limited pilots and partner scorecards; short sprints with partners and clear goals"], ["Measures", "revenue from partners, active advocates, contribution margin"]], "UAl": [["Order of content", "Vision on one page → Proof ladder → Operating guardrails"], ["Tools", "a demo calendar, proof measures and quality gates"], ["Rhythm and reviews", "demo → decide → write down, with two measures (pull and capacity); bursts of demos followed by consolidation sprints"]]};
  let h = '<section class="rp rd rd-adapts" data-rt="' + t + '"><div class="rp-band"><span class="p">What comes next</span><span class="t">What to adapt, and what the app provides</span></div><div class="rp-body">';
  h += '<p class="rp-sent">Your report has shown you how you decide, execute, learn and work best. E-DNA does not change you; it makes you aware, so that you can adapt. From here, two things happen: what you adapt yourself, and what the app provides for you (the order your workbooks are written in, the tools they hand you, how your AI mentor works a decision through with you, the formats and settings you choose). This is what being ' + who + ' changes in practice.</p>';
  h += '<div class="rp-h19">From Part 1: your Decision Intelligence Loop</div><div class="rd-adapt">';
  rows.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '<small>' + x[1] + '</small></span><span class="v">' + x[2] + '</span></div>'; });
  h += '</div>';
  /* From Part 2: the subtype's order of content, tools, rhythm and measures (BS-DI-003 3.4 to 3.5) */
  if (t !== 'mixed' || R.p2.likely) { const k2 = t !== 'mixed' ? R.p2.result : R.p2.likely; const sec2 = t !== 'mixed' ? R.p2.second : null;
    h += '<div class="rp-h19">From Part 2: how you execute</div><div class="rd-adapt">';
    (SUB_ADAPT[k2] || []).forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '<small>' + SUB_TXT[k2][0] + '</small></span><span class="v">' + x[1].charAt(0).toUpperCase() + x[1].slice(1) + '.</span></div>'; });
    if (sec2 && SUB_ADAPT[sec2]) h += '<div class="row"><span class="k">Close second<small>' + SUB_TXT[sec2][0] + '</small></span><span class="v">' + SUB_ADAPT[sec2].map(x => x[0] + ': ' + x[1]).join('. ') + '.</span></div>';
    h += '<div class="row"><span class="k">Games<small>' + SUB_TXT[k2][0] + '</small></span><span class="v">' + (SUB_X[k2] ? SUB_X[k2].games.map(g => g[0]).join(' \u00b7 ') : '') + '.</span></div></div>'; }
  else h += '<div class="rp-h19">From Part 2: how you execute</div><p class="rp-sent">Your subtype is confirmed once your Dominant Decision Intelligence Loop is confirmed; the subtype rows are added here then.</p>';
  /* From Part 3: what the app provides for the lowest result (BS-DI-003 4.5) and the mirror games */
  { const res3 = R.p3.area[0].concat(R.p3.area[1]); const low3 = res3.slice().sort((a, b) => a.v - b.v)[0]; const lv = low3.level;
    const APP3 = { 'Very low': 'Simple guides that explain each loop and how to translate between them; one logic measure and one feeling measure on every decision; a prompt to check whether you have switched; short practice exercises with examples of both loops.', 'Low': 'Simple guides that explain each loop and how to translate between them; one logic measure and one feeling measure on every decision; a prompt to check whether you have switched; short practice exercises with examples of both loops.', 'Moderate': 'Weeks led by each loop in turn; “what could go wrong” lists made with someone of the other core type; the step-by-step guide for repairing a clash.', 'High': 'Who leads meetings rotates between the core types; practice on real decisions; a quarterly session with your mirror subtype.', 'Mastery': 'Roles shared across both loops; dashboards that show both measures; mentoring others.' };
    h += '<div class="rp-h19">From Part 3: how well you read yourself and others</div><div class="rd-adapt">';
    h += '<div class="row"><span class="k">Your lowest result first<small>' + low3.k.replace(/ \(.*\)/, '') + ' \u00b7 ' + lv + '</small></span><span class="v">' + APP3[lv] + '</span></div>';
    if (t !== 'mixed') { const m3 = MIRROR3[R.p2.result]; const mg = m3 === 'UAl' ? ['VO', 'MP', 'EE'] : m3 === 'UA' ? ['MS', 'IA', 'SB'] : [m3]; const gl = []; mg.forEach(x => SUB_X[x].games.forEach(g => gl.push(g[0])));
      h += '<div class="row"><span class="k">Games to help you read the other loop<small>' + SUB_TXT[m3][0] + '</small></span><span class="v">' + gl.join(' \u00b7 ') + '.</span></div>'; }
    else h += '<div class="row"><span class="k">Reading the other loop</span><span class="v">Built once your Dominant Decision Intelligence Loop is confirmed; the mirror subtype\u2019s games are added here then.</span></div>';
    h += '</div>'; }
  /* From Part 4: formats, environment, pace, tools (BS-DI-003 5.4) */
  const d4 = {}; R.p4.domains.forEach(d => { d4[d.dom] = d.r; });
  const fmt = { Visual: 'diagrams and charts first, with the text underneath', Auditory: 'audio explanations and discussion prompts first', 'Read/Write': 'text summaries and checklists first', Kinaesthetic: 'hands-on tasks and templates first', Multimodal: 'every format offered; you choose by task' }[d4['Modality']];
  const env = { Individual: 'solo reflection prompts; a preparation sheet before any group work', Collaborative: 'group discussion prompts and shared exercises', Adaptive: 'both, with solo preparation before group discussion' }[d4['Working environment']];
  const pace = { Fast: 'short lessons and sprints, depth available afterwards', Slow: 'extended deep dives and longer timelines', Versatile: 'short lessons by default, deep dives on request' }[d4['Pace']];
  const ord = { Structured: 'step by step, in order', Global: 'the overview first, then the steps', Adaptive: 'the overview first for new ground, then step by step' }[d4['Approach']];
  const fr = { Concrete: 'a worked case with numbers before the principle', Abstract: 'the principle before the example', Flexible: 'the example first when an idea is new, the principle to carry it elsewhere' }[d4['Concept processing']];
  h += '<div class="rp-h19">From Part 4: how you learn</div><div class="rd-adapt">';
  [['Formats', d4['Modality'], 'Every module comes as text, diagrams, audio and hands-on tasks; yours opens with ' + fmt + '.'], ['Order and framing', d4['Approach'] + ' \u00b7 ' + d4['Concept processing'], 'Explanations run ' + ord + ', and are framed as ' + fr + '.'], ['Environment', d4['Working environment'], env.charAt(0).toUpperCase() + env.slice(1) + '.'], ['Pace', d4['Pace'], pace.charAt(0).toUpperCase() + pace.slice(1) + '.']].forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '<small>' + x[1] + '</small></span><span class="v">' + x[2] + '</span></div>'; });
  h += '</div>';
  /* From Part 5: pattern adaptations, accessibility settings, diet and routine (BS-DI-003 6.5, 6.6) */
  const P5A = { 'Fast-switching focus': 'Short, engaging segments of five to seven minutes; small goals and game-style check-ins; visible progress; sprint-based reviews.', 'Visual and spoken processing': 'Audio with every key module; short summaries and diagrams instead of heavy text; clear headings and symbols.', 'Structure and clarity': 'A predictable lesson flow (introduction, content, reflection); an agenda in advance; advance notice of any change; minimal ambiguity.', 'Sensory sensitivity': 'Reduced motion, stable visuals, sound off; a focus mode; gentle transitions.', 'Layered processing': 'Audio, visual and interactive formats together; sprints alternating with deep dives; scheduling paced to energy.' };
  const p5 = R.p5; const p5rows = [];
  if (p5.layered) p5rows.push(['Layered processing', 'two or more patterns', P5A['Layered processing']]);
  p5.patterns.forEach(p => p5rows.push([p[0], 'High in ' + Object.keys(P5_PAT).find(k => P5_PAT[k][0] === p[0]).toLowerCase(), P5A[p[0]]]));
  const mods = p5.domains.filter(d => d.level === 'Moderate' && !p5.patterns.some(p => P5_PAT[d.dom] && P5_PAT[d.dom][0] === p[0]));
  if (mods.length) p5rows.push(['Moderate areas', mods.map(d => d.dom).join(' \u00b7 '), 'Adaptations are switched on for each at a lighter touch: shorter segments, summaries and diagrams, an agenda in advance, or a calmer screen, as the area needs.']);
  p5rows.push(['Accessibility settings', 'BS-BRAND-001 9.3', 'Font, text size, spacing, reduced motion, theme and transparency, set once and applied everywhere.']);
  const dietD = p5.domains.find(d => d.dom === 'Body chemistry and diet'); if (dietD && dietD.level !== 'Low') p5rows.push(['Diet and routine', dietD.level, 'Prompts to keep regular mealtimes and, where useful, a food and drink diary.']);
  h += '<div class="rp-h19">From Part 5: what environment you need to work well</div><div class="rd-adapt">';
  p5rows.forEach(x => { h += '<div class="row"><span class="k">' + x[0] + '<small>' + x[1] + '</small></span><span class="v">' + x[2] + '</span></div>'; });
  h += '</div>';
  /* From Part 6: what the app provides for each disposition result (BS-DI-003 7.3 to 7.7); Part 6 shapes the tone of the AI mentors (7.9) */
  h += '<div class="rp-h19">From Part 6: your mindset</div><div class="rd-adapt">';
  R.p6.forEach(d => { const X = (d.dom === 'Energy' && d.result === 'Balanced') ? D6_ENERGY_BAL : D6_RES[d.result]; h += '<div class="row"><span class="k">' + d.dom + '<small>' + d.result + '</small></span><span class="v">' + X[4] + '</span></div>'; });
  const mind = R.p6[0].result, conf = R.p6[1].result;
  h += '<div class="row"><span class="k">Tone of your AI mentor<small>' + mind + ' \u00b7 ' + conf + '</small></span><span class="v">' + (conf === 'Self-doubting' ? 'Reassurance first: your mentor confirms what you got right before it stretches you.' : conf === 'Confident' ? 'Challenge first: your mentor asks for the evidence against your decision before it agrees with you.' : 'Reassurance where you are unsure, challenge where you are strong; your mentor reads which area it is.') + (mind === 'Fixed' ? ' Feedback comes as the next small step, never as a verdict on ability.' : mind === 'Growth' ? ' Feedback comes as the next stretch, with a review built in.' : '') + ' Before you commit, your mentor checks where your mindset is at the point of final validation.</span></div>';
  h += '</div>';
  /* From Part 7: what the app provides for each belief result (BS-DI-003 8.6) and for flagged pairs (8.5) */
  h += '<div class="rp-h19">From Part 7: your beliefs and values</div><div class="rd-adapt">';
  R.p7.beliefs.forEach(b => { if (b.none) return; const E = D7_END[b.result === 'Both' ? 'Both' : b.result]; h += '<div class="row"><span class="k">' + b.belief + '<small>' + (b.result === 'Both' ? b.both : b.result) + '</small></span><span class="v">' + E[2] + '</span></div>'; });
  R.p7.flagged.forEach(f => { const P = D7_PAIR[f]; if (P) h += '<div class="row"><span class="k">' + f + '</span><span class="v">' + P[1] + '</span></div>'; });
  h += '</div>';
  /* Your workbooks: a living list, extended as each workbook is created (BS-DI-009) */
  const lw = t === 'mixed' ? (R.p1.lean === 'alchemist' ? 'Alchemist' : 'Architect') : (t === 'architect' ? 'Architect' : 'Alchemist');
  h += '<div class="rp-h19">Your workbooks</div><div class="rd-adapt">';
  h += '<div class="row"><span class="k">Decision Intelligence Loop<small>' + lw + ' workbooks</small></span><span class="v">' + (t === 'mixed' ? 'Practise the ' + lw + ' loop until it is your Dominant loop, then retake E-DNA in 4 weeks.' : 'Strengthen your Dominant loop and the contexts in which you switch under stress.') + '</span></div>';
  { const res3 = R.p3.area[0].concat(R.p3.area[1]); const low3 = res3.slice().sort((a, b) => a.v - b.v)[0]; h += '<div class="row"><span class="k">Awareness<small>Part 3</small></span><span class="v">Targeted practice for your lowest result, ' + low3.k.replace(/ \(.*\)/, '') + '; reassessed with Part 1 after the workbook.</span></div>'; }
  h += '</div><p class="rp-note">This list grows as workbooks are added.</p></div></section>';
  return h;
}
function detailedHTML(narrow) {
  const R = computeReport();
  return '<div class="rp-root' + (narrow ? ' rp-narrow' : '') + (narrow && rpSizes === 'app' ? ' rp-app' : '') + '">' + reportPreviewBar(R, narrow) + '<h1 class="rp-h">Your detailed E-DNA report</h1><p class="rp-lead">Every result explained: the scores behind it, every scenario, where you switch, your strengths and blind spots, and how the app provides.</p>'
    + renderDetailed1(R, narrow) + renderDetailed2(R, narrow) + renderDetailed3(R, narrow) + renderDetailed4(R, narrow) + renderDetailed5(R, narrow) + renderDetailed6(R, narrow) + renderDetailed7(R, narrow) + '<p class="rp-note">Your plan, \u201cWhat to adapt, and what the app provides\u201d, is a separate document that follows this report.</p></div>';
}
function adaptHTML(narrow) {
  /* The separate document that follows the detailed report (Fariza Javed, 16 November 2026): what to adapt, and what the app provides. A living document: workbooks are added as they are created. */
  const R = computeReport();
  return '<div class="rp-root' + (narrow ? ' rp-narrow' : '') + (narrow && rpSizes === 'app' ? ' rp-app' : '') + '">' + reportPreviewBar(R, narrow) + '<h1 class="rp-h">What to adapt, and what the app provides</h1><p class="rp-lead">Your plan, from every part of your E-DNA report: what you adapt yourself, what the app provides for you, and your workbooks.</p>' + renderAdapts(R, narrow) + '</div>';
}
/* DETAILED-JS-END */
