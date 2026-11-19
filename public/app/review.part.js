/* ===== Screen 12 (bar: 11 · Review): the review on the review date, as a conversation of at most three mentor turns. Example data. ===== */
(function(){
  const $=id=>document.getElementById(id);
  const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  /* Example decision per Preview-as state: the latest decided row of the person's log (index.html T.rows[0]); what it rested on; the pattern line the mentor names at the end (BS-AI-002 §5 move 12). */
  const EX={
    architect:{ rests:'the 2024 response and the pipeline', order:'Logic → Feeling → Logic', a1:'Five of six accepted. One asked for a call and stayed at the old rate until March.', a2:'Nothing in the order. I would have set the March date for the sixth client in Box 4, not after.', a3:'When a price decision rests on a past response, write the exception into the decision itself.', pattern:'That is the second price decision in a row settled by the last rise’s figure. Your Box 1 is doing its job.' },
    alchemist:{ rests:'the story and two constraints you named', order:'Feeling → Logic → Feeling', a1:'Thirty-two of the forty joined. The course is still not finished, and nobody has asked for it.', a2:'I would have put the second constraint, the forty, into Box 2 as a number earlier instead of carrying it as a feeling.', a3:'A constraint I name myself holds better than a number someone gives me.', pattern:'Two launches now rest on a story held by constraints you set. When the numbers arrive later, they have agreed with you both times.' },
    archlean:{ rests:'the footfall count and the rent difference', order:'Logic → Feeling → Logic', a1:'We moved on 1 December. Takings are up a third; the fit-out cost more than Box 1 had.', a2:'I would have asked Box 2 how the team felt about the move before I had the lease in front of me.', a3:'Finish the Logic boxes before I ask how it feels: that is the order I am practising.', pattern:'You began with Logic and finished in it. That is three of your last four decisions held in the Architect order; your retake is getting closer.' },
    alchlean:{ rests:'the feeling about the street and the rent difference checked against it', order:'Feeling → Logic → Feeling', a1:'We moved. The street feels right and the takings agree so far.', a2:'I went to the rent numbers before I had said what the shop should feel like. Next time the story first.', a3:'Name the story before I open the spreadsheet.', pattern:'You began with Feeling and finished in it. Three of your last four decisions held the Alchemist order; the retake rule is close.' },
    mixed:{ rests:'the footfall count, then the feeling about the street', order:'Logic → Feeling → Logic (chosen for this decision)', a1:'We moved. It is working, though I am not sure the numbers decided it.', a2:'I chose the Logic order and finished on a feeling. I would hold the order I chose to the end.', a3:'Write down which loop I started in and finish there.', pattern:'This decision began with Logic and ended with Feeling. Your log now shows where each loop held; no warning, just the record that feeds your retake.' }
  };
  const Q=[ 'What happened? Did the decision hold?', 'What would you change in how you decided it? Not what you decided: how.', 'What do you carry forward to the next decision like this one?' ];
  let step=0, outcome='', ans=[], mentor='arch', CUR='architect';
  function mentorName(){ return mentor==='arch'?'AI Architect':'AI Alchemist'; }
  function bubble(who,text){ return who==='m' ? `<div class="rvm"><img src="assets/ai_${mentor==='arch'?'architect':'alchemist'}_approved.gif" alt="${mentorName()}"><div class="rvb ${mentor}">${text}</div></div>` : `<div class="rvme"><div class="rvb me">${esc(text)}</div></div>`; }
  function draw(){
    const T=window.BS_T[CUR], r=T.rows[0], e=EX[CUR];
    $('rvTitle').textContent=r[1]; $('typeChip12').textContent=T.chip;
    $('rvMentor').textContent=mentorName(); $('rvMentor2').textContent=mentorName(); $('rvImg').src='assets/ai_'+(mentor==='arch'?'architect':'alchemist')+'_approved.gif'; $('rvImg').alt=mentorName();
    $('rvMentorSub').textContent = T.primary==='both' ? 'Mixed: both mentors work with you equally' : 'Your primary mentor';
    $('rvSwap').classList.toggle('hide', T.primary!=='both'); $('rvSwapBtn').textContent='Review with '+(mentor==='arch'?'AI Alchemist':'AI Architect')+' instead';
    $('rvLog').textContent=`${r[0]} · ${r[1]} · ${e.order} · 1 round · no warning · decided yes · rests on ${e.rests} · review today`;
    let h=bubble('m',`On ${r[0]} you decided: <b>${esc(r[1])}</b>. It rested on ${esc(e.rests)}. ${Q[0]}`);
    for(let i=0;i<step;i++){ h+=bubble('me',(i===0?outcomeWord()+'. ':'')+ans[i]); if(i+1<3) h+=bubble('m',Q[i+1]); }
    $('rvChat').innerHTML=h;
    if(step<3){
      const chips = step===0 ? `<div class="rvchips" role="radiogroup" aria-label="Did it hold">${[['held','Held'],['partly','Held in part'],['changed','Changed direction'],['reopened','Reopened']].map(c=>`<button type="button" class="${outcome===c[0]?'on':''}" data-oc="${c[0]}" aria-pressed="${outcome===c[0]}">${c[1]}</button>`).join('')}</div>` : '';
      $('rvInput').innerHTML = chips + `<label class="sr t13" for="rvTa">Your answer</label><textarea id="rvTa" class="rvta" rows="3" placeholder="${step===0?'In a line or two: what happened':step===1?'What you would change in how you decided':'What you carry forward'}">${esc(ans[step]||EX[CUR]['a'+(step+1)])}</textarea><div class="btnrow"><button class="btn primary small" type="button" id="rvSend">Send</button><span class="t13 sec">${step+1} of 3</span></div>`;
      $('rvInput').classList.remove('hide'); $('rvDone').classList.add('hide');
      $('rvOut').innerHTML = outcome ? `<span class="chip ${outcome==='held'?'type':outcome==='partly'?'ex':'grey'}">${outcomeWord()}</span> <span class="t13 sec">· recorded at the end</span>` : '<span class="chip grey">Not yet reviewed</span>';
    } else {
      $('rvInput').classList.add('hide');
      $('rvChat').insertAdjacentHTML('beforeend', bubble('m',`Logged: review ${new Date().getDate()} Nov · ${outcomeWord().toLowerCase()} · your three answers are on the row. ${esc(e.pattern)}`));
      $('rvDone').classList.remove('hide');
      $('rvDone').innerHTML=`<div class="t19 b" style="margin-bottom:6px">Review recorded</div><div class="t13 sec" style="margin-bottom:10px">The log row now carries the outcome and your answers. This review has left Needs you.</div><div class="btnrow"><button class="btn primary small" type="button" data-go="3">Back to my log</button>${outcome==='changed'||outcome==='reopened'?'<button class="btn secondary small" type="button" data-go="2">Decide it again in the Frame</button>':''}<button class="btn secondary small" type="button" data-go="1">Home</button></div>`;
      $('rvOut').innerHTML=`<span class="chip ${outcome==='held'?'type':outcome==='partly'?'ex':'grey'}">${outcomeWord()}</span> <span class="t13 sec">· ${new Date().getDate()} Nov</span>`;
    }
  }
  function outcomeWord(){ return {held:'Held',partly:'Held in part',changed:'Changed direction',reopened:'Reopened'}[outcome]||'Held'; }
  window.openScreen12=function(cur){ if(cur!==CUR){ CUR=cur; step=0; outcome=''; ans=[]; mentor = window.BS_T[cur].primary==='alch' ? 'alch' : 'arch'; } draw(); };
  document.addEventListener('click',e=>{
    const oc=e.target.closest('#main12 [data-oc]'); if(oc){ outcome=oc.dataset.oc; const ta=$('rvTa'); if(ta) ans[0]=ta.value; draw(); return; }
    if(e.target.closest('#rvSend')){ const ta=$('rvTa'); ans[step]=(ta.value||'').trim()||EX[CUR]['a'+(step+1)]; if(step===0 && !outcome) outcome='held'; step++; draw(); $('rvChat').lastElementChild?.scrollIntoView({block:'nearest'}); return; }
    if(e.target.closest('#rvSwapBtn')){ mentor = mentor==='arch'?'alch':'arch'; draw(); return; }
  });
})();
