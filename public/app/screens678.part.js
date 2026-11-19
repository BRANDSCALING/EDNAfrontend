/* ===== Screens 6, 7, 8: My E-DNA · My reports · My workbooks (example data; words only, no scores: BS-DI-003 §9.1) ===== */
(function(){
  const $=id=>document.getElementById(id);
  const PARTS=['Core Type Decision Intelligence Loop Identity','Subtype Refinement Identity','Alternate Decision Intelligence Loop Awareness','Learning Style Preferences','Neurodiversity & Accessibility','Mindset & Personality','Meta-Beliefs & Values'];
  const HEAD={6:'Disposition',7:'Beliefs & values'};   // report headings for Parts 6 and 7 (BS-DI-005)

  // Example result records per preview state. Architect = the worked example in BS-DI-005 §14; the others are invented to the same shape.
  const R={
    architect:{ name:'Architect', first:'logic', light:false, stress:'Under stress you switched in one context (Pricing, full switch); your loop held everywhere else.',
      p2:{result:'Master Strategist', second:null}, p3:[['Dominant-loop','Mastery','logic'],['Non-dominant','Moderate','feeling'],['Same-loop','High','logic'],['Alternate-loop','Moderate','feeling']],
      p4:[['Modality','Multimodal'],['Approach','Structured'],['Concept processing','Concrete'],['Working environment','Individual'],['Pace','Versatile']],
      p5:{consent:true, style:'Neurodivergent people with exceptional strengths', patterns:'Fast-switching focus · Structure and clarity · Layered processing', strength:'depth of focus'},
      p6:[['Mindset','Growth'],['Confidence','Confident'],['Patience','Balanced'],['Risk style','Risk-averse'],['Energy','Inward']],
      p7:[['Success means','Profit'],['Build for','Both'],['Progress means','Proven'],['Proof is','Numbers'],['Others are seen as','Both'],['Opportunity is','Limited']],
      retake:'Retake available: a retake is a new assessment; the earlier report stays.' },
    alchemist:{ name:'Alchemist', first:'feeling', light:false, stress:'Under stress you switched in one context (Conflict, partial switch); your loop held everywhere else.',
      p2:{result:'Visionary Oracle', second:'Energetic Empath'}, p3:[['Dominant-loop','High','feeling'],['Non-dominant','Low','logic'],['Same-loop','High','feeling'],['Alternate-loop','Moderate','logic']],
      p4:[['Modality','Visual'],['Approach','Global'],['Concept processing','Abstract'],['Working environment','Collaborative'],['Pace','Fast']],
      p5:{consent:true, style:'Neurotypical people', patterns:'No specific pattern was found.', strength:'pattern recognition'},
      p6:[['Mindset','Growth'],['Confidence','Confident'],['Patience','Impatient'],['Risk style','Risk-taking'],['Energy','Outward']],
      p7:[['Success means','Purpose'],['Build for','Both'],['Progress means','New'],['Proof is','Stories'],['Others are seen as','Collaborators'],['Opportunity is','Abundant']],
      retake:'Retake available: a retake is a new assessment; the earlier report stays.' },
    archlean:{ name:'Mixed (Architect-leaning)', first:'logic', light:true, stress:'Under stress you moved to Feeling in money decisions and stayed with Logic elsewhere. Two contexts were unstable.',
      p2:{result:'Likely subtype: Master Strategist', second:null}, p3:[['Dominant-loop','Moderate','logic'],['Non-dominant','Moderate','feeling'],['Same-loop','Moderate','logic'],['Alternate-loop','Low','feeling']],
      p4:[['Modality','Read/Write'],['Approach','Structured'],['Concept processing','Concrete'],['Working environment','Individual'],['Pace','Slow']],
      p5:{consent:false, style:null, patterns:null, strength:null},
      p6:[['Mindset','Growth'],['Confidence','Balanced'],['Patience','Balanced'],['Risk style','Risk-averse'],['Energy','Inward']],
      p7:[['Success means','Profit'],['Build for','Customers'],['Progress means','Proven'],['Proof is','Numbers'],['Others are seen as','Both'],['Opportunity is','Limited']],
      retake:'Retake Parts 1 to 3 after Workbook 1 and 10 logged decisions, 8 of them held in the loop they began with (proposed numbers, BS-AI-002 §11.4). Your log: 7 logged · 6 held.' },
    alchlean:{ name:'Mixed (Alchemist-leaning)', first:'feeling', light:true, stress:'Under stress you moved to Logic in conflict and stayed with Feeling elsewhere. Two contexts were unstable.',
      p2:{result:'Likely subtype: Visionary Oracle', second:null}, p3:[['Dominant-loop','Moderate','feeling'],['Non-dominant','Low','logic'],['Same-loop','Moderate','feeling'],['Alternate-loop','Moderate','logic']],
      p4:[['Modality','Visual'],['Approach','Global'],['Concept processing','Abstract'],['Working environment','Collaborative'],['Pace','Versatile']],
      p5:{consent:true, style:'Neurodivergent people', patterns:'Sensory load', strength:null},
      p6:[['Mindset','Growth'],['Confidence','Confident'],['Patience','Impatient'],['Risk style','Balanced'],['Energy','Outward']],
      p7:[['Success means','Purpose'],['Build for','Both'],['Progress means','New'],['Proof is','Stories'],['Others are seen as','Collaborators'],['Opportunity is','Both']],
      retake:'Retake Parts 1 to 3 after Workbook 1 and 10 logged decisions, 8 of them held in the loop they began with (proposed numbers, BS-AI-002 §11.4). Your log: 7 logged · 6 held.' },
    mixed:{ name:'Mixed', first:null, light:true, stress:'Under stress you used Logic in money decisions and Feeling in people decisions; no single loop held.',
      p2:{result:'Likely mirror pair: Master Strategist or Visionary Oracle', second:null}, p3:[['Dominant-loop','Moderate','logic'],['Non-dominant','Moderate','feeling'],['Same-loop','Low','logic'],['Alternate-loop','Moderate','feeling']],
      p4:[['Modality','Multimodal'],['Approach','Adaptive'],['Concept processing','Flexible'],['Working environment','Adaptive'],['Pace','Versatile']],
      p5:{consent:true, style:'Neurotypical people', patterns:'No specific pattern was found.', strength:null},
      p6:[['Mindset','Balanced'],['Confidence','Balanced'],['Patience','Balanced'],['Risk style','Balanced'],['Energy','Balanced']],
      p7:[['Success means','Both'],['Build for','Both'],['Progress means','Proven'],['Proof is','Both'],['Others are seen as','Both'],['Opportunity is','Limited']],
      retake:'Retake Parts 1 to 3 after Workbook 1 and 10 logged decisions, 8 of them held in the loop they began with (proposed numbers, BS-AI-002 §11.4). Your log: 7 logged · 4 held · not yet.' }
  };
  const lvl={'Very low':1,'Low':2,'Moderate':3,'High':4,'Mastery':5};
  const bar=(level,loop)=>`<span class="bar5 ${loop}" aria-label="${level}">${[1,2,3,4,5].map(i=>`<i class="${i<=lvl[level]?'f':''}"></i>`).join('')}</span>`;
  const chipLoop=loop=>`<span class="chip loopchip ${loop==='logic'?'ind':'red'}" style="padding:1px 8px">${loop==='logic'?'Logic':'Feeling'}</span>`;

  /* ---------- Screen 6: My E-DNA ---------- */
  function openScreen6(key){
    const r=R[key], t=window.BS_T[key];
    $('typeChip6').textContent=t.chip;
    $('e6h').textContent=r.name;
    $('e6result').textContent=t.result;
    $('e6stress').textContent='Part 1 stress result: '+r.stress;
    $('loopFig6').innerHTML = r.first ? window.loopFigure(r.first, r.light) : window.loopFigure('logic',true)+'<div style="height:8px"></div>'+window.loopFigure('feeling',true);
    $('e6retakeNote').textContent=r.retake;
    const mixed=key!=='architect'&&key!=='alchemist';
    $('e6retake').textContent = mixed?'Retake Parts 1 to 3':'Retake E-DNA';
    const tier=window.BS_TIER||'di'; const hasDetail=tier!=='free';
    $('e6detail').textContent = hasDetail?'Open your Advanced Report':'Get your Advanced Report · £99';
    const parts=[
      [2, r.p2.result + (r.p2.second?`<div class="t13 sec">close second: ${r.p2.second}</div>`:''), mixed?'Mixed results have no subtype until the retake; a likely subtype is shown.':'How you execute: the subtype inside your core type.'],
      [3, `<div class="bars">${r.p3.map(([n,l,lp])=>`<div class="t13"><span class="w">${n}</span> ${bar(l,lp)} <b>${l}</b></div>`).join('')}</div>`, mixed?'Results are capped at Moderate while your Dominant loop is unconfirmed.':'Awareness of your own loop and of others’. Each bar is the loop it measures.'],
      [4, r.p4.map(([d,v])=>`<div class="t13"><span class="w">${d}</span> <b>${v}</b></div>`).join(''), 'How you take information in and work with it.'],
      [5, r.p5.consent ? `<div class="t19 b type">${r.p5.style}</div><div class="t13">${r.p5.patterns}${r.p5.strength?' · exceptional strength: '+r.p5.strength:''}</div>` : `<div class="t19 b type">Permission denied</div><div class="t13">Give consent in Settings to see your comparison. Your adaptation levels are shown in the report either way.</div>`, 'THIS IS NOT A DIAGNOSIS. Your results describe how you work best.'],
      [6, r.p6.map(([d,v])=>`<div class="t13"><span class="w">${d}</span> <b>${v}</b></div>`).join(''), 'Report heading: Disposition. Five lines, each a band with a marker in the report.'],
      [7, r.p7.map(([b,v])=>`<div class="t13"><span class="w">${b}</span> <b>${v}</b></div>`).join(''), 'Report heading: Beliefs & values. Beliefs that act on a decision; the mentor reads them.']
    ];
    $('parts6').innerHTML = parts.map(([n,body,note])=>`<section class="glass panel part" aria-label="Part ${n}"><div class="strip" aria-hidden="true"></div><div class="pband"><span class="t13 sec">Part ${n}</span><span class="t19 b">${HEAD[n]||PARTS[n-1]}</span></div><div class="pbody">${body}</div><div class="t13 sec" style="margin-top:8px">${note}</div><a href="#" class="t13 b" data-go="7" style="display:inline-block;margin-top:8px">Open in your report ›</a></section>`).join('');
    $('e6hist').innerHTML = `<tr><td>3 Nov 2026</td><td>${r.name}</td><td>Basic${hasDetail?' · Advanced':''}</td><td><a href="#" data-go="7">Open</a></td></tr>`;
    $('e6meta').textContent='Taken 3 November 2026 · 1 assessment';
  }

  /* ---------- Screen 7: My reports ---------- */
  function openScreen7(key){
    const t=window.BS_T[key]; $('typeChip7').textContent=t.chip;
    const tier=window.BS_TIER||'di'; const hasDetail=tier!=='free';
    $('r7dbtn').innerHTML = hasDetail ? `<button class="btn primary small" type="button">Open</button><button class="btn secondary small" type="button">PDF</button>` : `<button class="btn primary small" type="button">Get it · £99</button>`;
    $('r7dsub').textContent = hasDetail ? 'Seven parts and what to adapt · bought 3 November 2026 · Workbook 1 included' : 'Seven parts and what to adapt · £99 · includes Workbook 1 and 10 decisions';
    const rows=PARTS.map((p,i)=>[i+1, HEAD[i+1]?`${p} (${HEAD[i+1]})`:p]).concat([[8,'What to adapt, and what the app provides']]);
    $('r7parts').innerHTML = rows.map(([n,p])=>`<div class="rrow${hasDetail?'':' locked'}"><span class="t13 sec" style="width:56px;flex:none">${n<8?'Part '+n:'Plus'}</span><span class="t19">${p}</span><span class="t13 b">${hasDetail?'Open ›':'🔒'}</span></div>`).join('');
  }

  /* ---------- Screen 8: My workbooks ---------- */
  // Exercise lines by column of BS-DI-009.1 §3; Workbooks 2 and 3 summarised from BS-DI-009.2 / 009.3 titles only
  const EX={
    core:[['Your loop in your own words','One satisfied decision through Began with, Checked by, Went round again, Finally validated by; three ticks; one line.','Done'],
          ['Your stress map','One pre-filled row per unstable context: the stress; what overrode or took over; what was dropped; the cost. Then the four-item list before the next decision there.','Done'],
          ['Hold the loop on a live decision','In the Decision Frame with your primary mentor: the mentor’s questions and warning; the mentor writes the log line.','In progress · Decision Frame'],
          ['Four weekly cycles','Your working rhythm; the Decision log filtered to this workbook; the dashboard by context and switch; stop and scale points.','Week 2 of 4 · Decision log'],
          ['Review','Where the loop held; the stress each time it did not; the slowest decisions or the decisions reopened.','Not yet']],
    lean:[['One recent decision','What it began with and what settled it, and which loop that makes.','Done'],
          ['Where you move to the other loop','Pre-filled rows for the contexts where the other loop was used under stress; the four-item list for the leaning loop.','Done'],
          ['The Decision Frame, both orders shown','The leaning order chosen for the whole workbook; no warning either way; the mentor says what it noticed.','In progress · Decision Frame'],
          ['Four weekly cycles with three guardrails','A task-switch limit; a written reason before any change of direction; the Decision log with a loop-used column; dashboard by loop used.','Week 2 of 4 · Decision log'],
          ['Review and retake','Where the leaning loop held; the stress each time it did not; which loop came easier; the Retake button.','Not yet']],
    mixed:[['One recent decision','What it began with and what settled it, which loop that makes, and whether it came easily or took effort.','Done'],
          ['One piece of work, two tracks','Architect track (specification and checkpoint) and Alchemist track (vision and demo), each rated for energy, quality, friction and finished.','Done'],
          ['Both orders, chosen per decision','Both mentors’ questions side by side; which answer you act on is recorded.','In progress · Decision Frame'],
          ['Four weekly cycles','The dashboard counting Architect against Alchemist; “still level” and ready-to-retake points.','Week 2 of 4 · Decision log'],
          ['Review and retake','Which loop led; which track came easier and which was finished; which loop you finished in under stress; the Retake button.','Not yet']]
  };
  const COMMIT={ core:'“To hold my Dominant Decision Intelligence Loop under stress, I will ___”', lean:'“To hold the [leaning] loop to the end of every decision, I will ___”', mixed:'“To finish every decision in the loop it began with, I will ___”' };
  function col(key){ return key==='mixed'?'mixed':(key==='archlean'||key==='alchlean')?'lean':'core'; }
  let WBKEY='architect';
  function openScreen8(key){
    WBKEY=key; const t=window.BS_T[key]; $('typeChip8').textContent=t.chip;
    const tier=window.BS_TIER||'di'; const hasDetail=tier!=='free';
    const wbs=[
      {n:1,part:1,title:t.wb[0],status:'In progress',prog:'Exercise 3 of 5 · week 2 of 4',access:hasDetail?'Included with your Advanced Report':'Included with the Advanced Report · £99',open:hasDetail},
      {n:2,part:2,title:t.wb[1],status:'Not started',prog:'11 screens',access:tier==='entry'||tier==='out'?'Included in your membership':'Entry membership and above',open:tier==='entry'||tier==='out'},
      {n:3,part:3,title:t.wb[2],status:'Not started',prog:'5 exercises',access:tier==='entry'||tier==='out'?'Included in your membership':'Entry membership and above',open:tier==='entry'||tier==='out'}
    ];
    $('wbCards').innerHTML = wbs.map(w=>`<div class="wbcard${w.open?'':' locked'}"><div class="t13 sec">Workbook ${w.n} · Part ${w.part}</div><div class="t19 b" style="margin:2px 0 6px">${w.title}</div><div class="t13 sec">${w.prog} · ${w.access}</div><div class="lrow" style="margin:12px 0 0"><span class="chip ${w.status==='In progress'?'type':'grey'}">${w.status}</span>${w.open?`<button class="btn small ${w.status==='In progress'?'primary':'secondary'}" type="button" data-wb="${w.n}">${w.status==='In progress'?'Continue':'Start'}</button>`:`<span class="t13 b">🔒</span>`}</div></div>`).join('');
    document.querySelectorAll('#wbCards [data-wb]').forEach(b=>b.addEventListener('click',()=>openWb(Number(b.dataset.wb))));
    $('wbList8').classList.remove('hide'); $('wbView').classList.add('hide');
  }
  function openWb(n){
    const t=window.BS_T[WBKEY], c=col(WBKEY);
    $('wbPart').textContent=`Workbook ${n} · Part ${n}`; $('wbTitle').textContent=t.wb[n-1]; $('wbStatus').textContent=n===1?'In progress':'Not started';
    const ex = n===1 ? EX[c] : [['Workbook '+n,'Content record: '+(n===2?'BS-DI-009.2 (11 screens)':'BS-DI-009.3 (5 exercises)')+'. Shown here as the shape only.','Not started']];
    $('wbSections').innerHTML =
      `<div class="wrow"><div><div class="t19 b">Your result</div><div class="t13 sec">${t.result} Your own values from Part 1 are filled in.</div></div><span class="chip grey">Read</span></div>`
    + `<div class="wrow fold"><div><div class="t19 b">The words used in this workbook ▸</div><div class="t13 sec">Each canonical term, defined once. Folded away.</div></div></div>`
    + ex.map((e,i)=>`<div class="wrow"><div><div class="t13 sec">Exercise ${i+1}</div><div class="t19 b">${e[0]}</div><div class="t13 sec">${e[1]}</div></div><span class="chip ${e[2].startsWith('Done')?'type':e[2].startsWith('Not')?'grey':'ex'}" style="flex:none">${e[2]}</span></div>`).join('')
    + `<div class="wrow fold"><div><div class="t19 b">Worked example ▸</div><div class="t13 sec">One example, example figures only. Folded away.</div></div></div>`;
    const mixed=c!=='core';
    $('wbCounts').innerHTML = mixed
      ? `<div class="count"><div class="t13 sec">Began with Logic</div><div class="n">4</div></div><div class="count"><div class="t13 sec">Began with Feeling</div><div class="n">3</div></div><div class="count"><div class="t13 sec">Finished in the loop it began with</div><div class="n">6</div></div><div class="count"><div class="t13 sec">Under stress</div><div class="n">2</div></div>`
      : `<div class="count"><div class="t13 sec">Decisions in this workbook</div><div class="n">7</div></div><div class="count"><div class="t13 sec">Loop held</div><div class="n">6</div></div><div class="count"><div class="t13 sec">Where you switched</div><div class="n">1</div></div><div class="count"><div class="t13 sec">Under stress</div><div class="n">2</div></div>`;
    $('wbWeeks').textContent='Four weekly cycles · week 2 of 4 · stop and scale points set in Exercise 4.';
    $('wbCommit').textContent=COMMIT[c];
    $('wbList8').classList.add('hide'); $('wbView').classList.remove('hide'); $('frame').scrollTop=0;
  }
  document.querySelector('[data-back="wblist"]').addEventListener('click',()=>{ $('wbList8').classList.remove('hide'); $('wbView').classList.add('hide'); });

  window.openScreen6=openScreen6; window.openScreen7=openScreen7; window.openScreen8=openScreen8; window.openWorkbook=openWb;
})();
