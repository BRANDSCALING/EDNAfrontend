/* ===== Launch view: one question, then one box at a time with the mentor ===== */
(function(){
  const $=id=>document.getElementById(id);
  const W={logic:'Logic',feeling:'Feeling'};
  const LBL={ logic:{box1:'Your facts',box2:'How it feels',box3:'What answers it',end:'What it rests on',box4:'Your decision'},
              feeling:{box1:'How it feels',box2:'The facts',box3:'What it does to the feeling',end:'What it rests on',box4:'Your decision'} };
  const PAST={ logic:{box1:'What you began with',box2:'What you checked it against',box3:'What you went back to',end:'Where it stands now',box4:'What you are leaning towards'},
               feeling:{box1:'What you began with',box2:'What you checked it against',box3:'What you went back to',end:'Where it stands now',box4:'What you are leaning towards'} };
  const STEPS=['box1','box2','box3','end','box4'];
  const S={key:'architect',first:'logic',i:0,entries:{},rounds:1,thread:[],mentor:'arch',busy:false,started:false,urgent:false,decided:false};

  function loopOf(step){ const second=S.first==='logic'?'feeling':'logic'; return step==='box2'?second:step==='box4'?'dec':S.first; }
  function labels(){ return S.started?PAST[S.first]:LBL[S.first]; }
  function strip(){
    $('lstrip').innerHTML=STEPS.map((st,i)=>`<li class="${i===S.i?'on':i<S.i?'done':''} ${loopOf(st)}"><span class="w">${labels()[st]}</span><span class="n">${loopOf(st)==='dec'?'':W[loopOf(st)]}</span></li>`).join('');
  }
  function showBox(){
    const st=STEPS[S.i], lp=loopOf(st);
    $('lbW').textContent=labels()[st]; $('lbW').className='w '+lp;
    $('lbN').textContent=(lp==='dec'?'':W[lp]+' · ')+`step ${S.i+1} of 5`;
    $('lbT').value=S.entries[st]||''; $('lbT').placeholder = st==='box4'?(S.started?'What you are leaning towards, if anything':'Your decision, written out'):'';
    $('lbRound').classList.toggle('hide',st!=='end');
    $('lbSend').textContent = st==='box4'?'Check my decision':'Send';
    $('lbHint').textContent = st==='end'?'Or go round again: add more '+W[S.first==='logic'?'feeling':'logic']+' and '+W[S.first]+'.':'';
    strip();
  }
  function setMentor(side){ S.mentor=side; $('m0img').src=side==='arch'?'assets/ai_architect_approved.gif':'assets/ai_alchemist_approved.gif'; $('m0img').alt=$('m0name').textContent=side==='arch'?'AI Architect':'AI Alchemist'; $('mbubble').classList.toggle('alch',side==='alch'); }
  function say(t){ $('m0text').textContent=t; }
  function sayHTML(h){ $('m0text').innerHTML=h; }
  $('m0text').addEventListener('click',e=>{ const r=e.target.closest('[data-retry]'); if(!r) return; if(window.BS_MENTOR!=='live') return; e.stopPropagation(); if(S.lastEvent) ask(S.lastEvent,null); });

  async function ask(event,userText){
    if(S.busy) return; S.busy=true; S.lastEvent=event;
    const sample=(window.claude&&window.claude.use)?await claude.use('sample'):null; if(!sample){ say('The live mentor is not available in this view.'); S.busy=false; return; }
    const p=window.BS_PROFILES[S.key]; const mentor=S.mentor==='arch'?'AI Architect':'AI Alchemist';
    if(userText) S.thread.push({role:'user',content:userText});
    const second=S.first==='logic'?'feeling':'logic';
    const ctx=`YOU ARE: ${mentor}${p.core.startsWith('Mixed')?' (this person is Mixed; both mentors are equal; they chose the '+(S.first==='logic'?'Architect':'Alchemist')+' order)':''}.
THE PERSON'S E-DNA (example data): ${p.text}
THE FRAME NOW: ${S.started?'a decision ALREADY STARTED before the Frame (use the past tense: what they began with, what they checked against, where it stands)':'a NEW decision'}; order=${S.first==='logic'?'Logic -> Feeling -> Logic':'Feeling -> Logic -> Feeling'}; urgent=${S.urgent}; rounds=${S.rounds}. The screen shows ONE box at a time; the person is on ${STEPS[S.i]}. Ask only for that box.
Decision box: ${$('d0').value.trim()||'(empty)'}
Box 1 (${W[S.first]}): ${S.entries.box1||'(empty)'}
Box 2 (${W[second]}): ${S.entries.box2||'(empty)'}
Box 3 (${W[S.first]}): ${S.entries.box3||'(empty)'}
End with ${W[S.first]}: ${S.entries.end||'(empty)'}
Box 4 Your decision: ${S.entries.box4||'(empty)'}
EVENT: ${event}
Reply with the JSON object only.`;
    const msgs=[{role:'user',content:window.BS_RULES+'\n\n'+ctx+(S.thread.length?'\n\nCONVERSATION SO FAR:\n'+S.thread.slice(-8).map(m=>(m.role==='user'?'Person: ':mentor+': ')+m.content).join('\n'):'')}];
    sayHTML(window.thinkHTML?window.thinkHTML('Reading your boxes'):'…');
    try{
      const call=()=>sample.json(msgs,{modelTier:'default',cache:false});
      const out=window.mentorCall?await window.mentorCall(call,()=>sayHTML(window.thinkHTML('Taking longer than usual, trying once more'))):await call(); const r=typeof out==='string'?JSON.parse(out):out;
      say(r.reply||'(no reply)'); S.thread.push({role:'assistant',content:r.reply||''});
      if(r.warning){ say((r.reply||'')+' '+r.warning.gap); }
      if(r.readiness){ const rd=$('ready0'); rd.classList.remove('hide'); rd.innerHTML=`<div class="t13 sec b" style="margin-bottom:4px">Readiness read · ${mentor}</div><div class="t19"><b>Rests on:</b> ${r.readiness.rests_on}</div><div class="t19"><b>Missing:</b> ${r.readiness.missing}</div><div class="t19"><b>Read:</b> <span class="chip ${r.readiness.read==='Ready'?'type':'ex'}">${r.readiness.read}</span></div>`; }
      if(r.log_line){ const lc=$('log0'); lc.classList.remove('hide'); lc.innerHTML=`<div class="t13 sec b" style="margin-bottom:4px">Written to your Decision log (prototype: not saved)</div><div class="t19">${r.log_line}</div>`;
        const d=new Date(); d.setMonth(d.getMonth()+3); const rv=d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
        const dc=$('doneCard'); dc.classList.remove('hide'); dc.innerHTML=`<div class="t19 b">Done. This decision is in your log.</div><div class="row"><div><div class="t13 sec">Review date</div><div class="t19">${rv} · we will remind you</div></div><div><div class="t13 sec">Loop used</div><div class="t19">${S.first==='logic'?'Logic → Feeling → Logic':'Feeling → Logic → Feeling'}${S.rounds>1?' · '+S.rounds+' rounds':''}</div></div></div><div class="btnrow" style="margin:0"><button class="btn secondary small" type="button" data-go="3">Open in your log</button><button class="btn secondary small" type="button" data-go="4">Decide with others</button></div><div class="t13 sec" style="margin-top:8px">AI mentor · can be wrong · you decide.</div>`; }
      if(r.leave_frame){ $('lbox').classList.add('hide'); }
    }catch(e){ if(e&&e.code==='not_granted') say('The mentor needs your permission to run in this preview; allow it and send again.'); else sayHTML(window.downHTML?window.downHTML():'The mentor could not answer that time; send again.'); }
    S.busy=false;
  }

  function begin(){
    const d=$('d0').value.trim(); if(!d) return;
    S.started=$('o_started').checked; S.urgent=$('o_urgent').checked; S.i=0; S.entries={}; S.rounds=1; S.thread=[]; S.decided=false;
    $('ready0').classList.add('hide'); $('log0').classList.add('hide'); $('done0').classList.add('hide'); $('doneCard').classList.add('hide'); $('lbox').classList.remove('hide');
    $('l0').classList.add('hide'); $('l1').classList.remove('hide'); $('l1dec').textContent=d;
    const p=window.BS_PROFILES[S.key];
    if(p.core.startsWith('Mixed')){
      $('orderpick').classList.remove('hide');
      $('orderpick').innerHTML=`<label class="order ind sel" data-first="logic"><input type="radio" name="o0" checked><span class="t19"><span class="b ind">Begin with Logic</span><br><span class="t13 sec">Logic → Feeling → Logic · AI Architect</span></span></label><label class="order red" data-first="feeling"><input type="radio" name="o0"><span class="t19"><span class="b" style="color:var(--red-d1)">Begin with Feeling</span><br><span class="t13 sec">Feeling → Logic → Feeling · AI Alchemist</span></span></label>`;
      $('orderpick').querySelectorAll('.order').forEach(o=>o.addEventListener('click',()=>{ $('orderpick').querySelectorAll('.order').forEach(x=>x.classList.remove('sel')); o.classList.add('sel'); S.first=o.dataset.first; setMentor(S.first==='logic'?'arch':'alch'); showBox(); }));
      S.first = p.order;
    } else { $('orderpick').classList.add('hide'); S.first=p.order; }
    setMentor(S.first==='logic'?'arch':'alch'); showBox();
    ask('The person wrote the decision and pressed Start'+(S.started?' and said they have already started on it':'')+(S.urgent?' and said it is urgent':'')+'. Restate it as one decision in one line and ask for Box 1 in their order, with its question. Nothing else.', 'Decision: '+d);
  }
  function send(){
    const st=STEPS[S.i]; const v=$('lbT').value.trim(); if(!v) return;
    S.entries[st]=(S.entries[st]?S.entries[st]+'\n':'')+v;
    if(st==='box4'){ S.decided=true; $('done0').classList.remove('hide');
      ask('The person filled Box 4 and pressed Check my decision. Read every box. Give the warning if one applies (none for Mixed or leaning: say what you noticed). If urgent, remind them of their stress result and commitment first. Give the readiness read, propose a review date, and if Ready write the log line.', 'Your decision: '+v); return; }
    const next=STEPS[S.i+1]; S.i++; showBox();
    ask(`The person filled ${st} and sent it. Work that box in your order in one or two sentences, then ask for the next box (${next}) with its question. If the box needs more before moving on, say what is missing and ask for it instead.`, labels()[st]+': '+v);
  }
  $('start0').addEventListener('click',begin);
  $('lbSend').addEventListener('click',send);
  $('lbT').addEventListener('keydown',e=>{ if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)) send(); });
  $('lbRound').addEventListener('click',()=>{ S.rounds++; S.i=1; showBox(); ask('The person chose to go round the loop again. Say that is round '+S.rounds+' and ask for Box 2 again.', 'Go round again.'); });
  $('lbSave').addEventListener('click',()=>say('Saved. Your log shows it as In the Frame. Come back when you have the next step.'));
  $('r0send').addEventListener('click',()=>{ const v=$('r0').value.trim(); if(!v) return; $('r0').value=''; ask('The person replied in the conversation. Answer it and keep working the current box.', v); });
  $('r0').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); $('r0send').click(); } });
  $('other0').addEventListener('click',()=>{ setMentor(S.mentor==='arch'?'alch':'arch'); ask('The person asked the OTHER mentor to read the same boxes. You are now that mentor. Read them from your loop in three sentences; the decision still validates with the person’s own loop.', 'Read the same boxes from your loop.'); });
  $('new0').addEventListener('click',()=>{ $('l1').classList.add('hide'); $('l0').classList.remove('hide'); $('d0').value=''; });
  $('expand0').addEventListener('click',()=>{ if(window.showScreen) window.showScreen(2,false); });
  $('openlog0').addEventListener('click',()=>{ if(window.showScreen) window.showScreen(3); });
  $('ctaRoom').addEventListener('click',()=>{ if(window.showScreen) window.showScreen(4); });
  $('ctaGo').addEventListener('click',()=>{ if(window.showScreen) window.showScreen(5); });

  window.launchState=()=>({decision:$('d0').value, entries:S.entries, first:S.first, started:S.started, urgent:S.urgent, decided:S.decided});
  window.openMake=function(key){
    S.key=key; const p=window.BS_PROFILES[key];
    $('typeChip5').textContent=p.core; $('l1').classList.add('hide'); $('l0').classList.remove('hide');
    $('mline0').textContent = p.core.startsWith('Mixed') ? 'Both mentors work with you until your Dominant loop is confirmed.' : `${p.mentor} takes you through it in your order: ${p.order==='logic'?'Logic → Feeling → Logic':'Feeling → Logic → Feeling'}.`;
  };
  window.openLaunch=function(key){
    S.key=key; const p=window.BS_PROFILES[key];
    $('typeChip0').textContent=p.core;
    $('ctaline').textContent = p.core.startsWith('Mixed') ? 'Both mentors work with you, one step at a time, until your Dominant loop is confirmed.' : `${p.mentor} takes you through it in your order, one step at a time.`;
    const cr=document.getElementById('credits'); if(cr){ $('credits0').className=cr.className; $('credits0').innerHTML=cr.innerHTML; }
    const wb=document.getElementById('wbList'); if(wb) $('wbList0').innerHTML=wb.innerHTML;
    const rows={architect:[['19 Nov','Raise the day rate to £750 for new clients','Decided · review 1 Mar'],['11 Nov','Take on the second office unit','In the Frame · 8 days'],['6 Nov','Keep the Friday delivery slot','Reviewed']],
                alchemist:[['19 Nov','Launch the membership in January at 40','Decided · review at module 2'],['11 Nov','Bring a partner into the events side','In the Frame · 8 days'],['6 Nov','Cancel the spring workshop','Reviewed']]};
    const rr=rows[key]||rows.architect; $('logRows0').innerHTML=rr.map(r=>`<tr class="by-mentor"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');
    const fig=document.getElementById('loopFig'); if(fig) $('loopFig0').innerHTML=fig.innerHTML;
    const lc=document.getElementById('loopChip'); if(lc){ $('loopChip0').textContent=lc.textContent; $('loopChip0').className=lc.className; }
    const NEW=window.BS_ACCT==='new', mixed=p.core.startsWith('Mixed');
    // first open (R1): one panel, one action; the dashboard panels show empty states (R4)
    $('firstRun').classList.toggle('hide',!NEW); document.querySelector('#main0 .cta:not(#firstRun)').classList.toggle('hide',NEW);
    if(NEW){
      $('frline').textContent = mixed ? 'Your E-DNA showed no Dominant loop yet. Each decision you make here helps find it: you choose the order, your mentor keeps you in it to the end, and your log records which loop you used.' : `Your E-DNA showed you are an ${p.core}. Your Dominant loop is ${p.order==='logic'?'Logic → Feeling → Logic':'Feeling → Logic → Feeling'}. ${p.mentor} takes you through one decision at a time in that order and keeps you in it to the end: that is the skill.`;
      $('frsteps').innerHTML = ['Write the decision in your own words.','Fill one box at a time; your mentor asks the question for each.','Check: your mentor reads every box and tells you what it rests on. You decide.'].map(x=>`<li>${x}</li>`).join('');
      const tier=window.BS_TIER||'di'; $('frcred').textContent = tier==='free' ? 'Free: 3 decisions to try the Frame. Your Advanced Report and 10 decisions are £99.' : '';
      $('logRows0').innerHTML=`<tr><td colspan="3"><div class="empty"><b>No decisions yet.</b> Your first one appears here with its loop, what it rested on and its review date.</div></td></tr>`;
      $('needs0').innerHTML=`<div class="empty"><b>Nothing waiting.</b> Rooms that need your input and reviews that are due appear here, and reach you as a notification.</div>`; $('needN').textContent='0'; $('needN').classList.add('hide');
      $('howdecide0').innerHTML=`<div class="empty"><b>Empty until your first decision.</b> This shows which loop you used, how often it held, and what your reviews found.</div>`;
      $('wbList0').innerHTML=`<div class="empty"><b>Workbook 1 is ready</b> once you have made one decision; it uses your log.</div>`;
    } else {
      $('needN').classList.remove('hide'); $('needN').textContent='2';
      $('needs0').innerHTML=`<div class="need"><div><span class="t13 k">Room · today</span><span class="t19">Open a second office in Manchester in Q2</span><div class="t13 sec">Priya and Tom added to Box 2 and 3 · waiting on your End with</div></div><button class="btn secondary small" type="button" data-go="4">Open</button></div>`
        + `<div class="need"><div><span class="t13 k">Review · due today</span><span class="t19">Hire a part-time bookkeeper</span><div class="t13 sec">Decided 3 November · three questions with your mentor</div></div><button class="btn secondary small" type="button" data-go="12">Review</button></div>`
        + `<div class="need"><div><span class="t13 k">Review · 1 March</span><span class="t19">Raise the day rate to £750 for new clients</span></div><span class="chip grey">In 3 months</span></div>`;
      // How you decide (R5): dominant against non-dominant, from the log; Mixed: Architect order against Alchemist order
      const dom = p.order==='logic'?'L':'F', non = dom==='L'?'F':'L';
      const nDom = mixed?4:6, nNon = mixed?3:1, held = mixed?6:6, total=7, sw = mixed?3:1;
      const bar = `<div class="hd"><div class="t13 sec">${mixed?'Decisions by the order you chose':'Decisions made in your Dominant loop against your non-dominant loop'}</div><div class="bar2" role="img" aria-label="${nDom} dominant, ${nNon} non-dominant">${dom==='L'?`<span class="L" style="width:${100*nDom/total}%"></span><span class="F" style="width:${100*nNon/total}%"></span>`:`<span class="F" style="width:${100*nDom/total}%"></span><span class="L" style="width:${100*nNon/total}%"></span>`}</div><div class="key"><span><i style="background:var(--indigo)"></i>Logic ${dom==='L'?nDom:nNon}${mixed?'':dom==='L'?' · Dominant':''}</span><span><i style="background:var(--red)"></i>Feeling ${dom==='F'?nDom:nNon}${mixed?'':dom==='F'?' · Dominant':''}</span></div>`
        + `<div class="stats"><div class="count"><div class="t13 sec">Held the loop to the end</div><div class="n">${held} of ${total}</div></div><div class="count"><div class="t13 sec">Where you switched</div><div class="n">${sw}</div><div class="t13 sec">${mixed?'money · people · conflict':'money, under a deadline'}</div></div><div class="count"><div class="t13 sec">Reviews</div><div class="n">3</div><div class="t13 sec">2 held · 1 changed direction</div></div><div class="count"><div class="t13 sec">Time to decide</div><div class="n">2 days</div><div class="t13 sec">median · fastest 20 min</div></div></div>`
        + `<div class="mline">${mixed?'Your log leans to the '+(p.order==='logic'?'Architect':'Alchemist')+' order, 4 of 7. Three more logged decisions and you can retake Parts 1 to 3.':p.mentor+': six of seven held. The one switch was under a deadline on money; that matches your Part 1 stress result. Mark the next money decision urgent and I will remind you before Box 4.'}</div></div>`;
      $('howdecide0').innerHTML=bar;
    }
    document.querySelectorAll('#roomsBadge,#roomsBadgeT,#bellN').forEach(b=>{ b.textContent=NEW?'0':(b.id==='bellN'?'2':'1'); b.classList.toggle('zero',NEW); });
  };
})();
