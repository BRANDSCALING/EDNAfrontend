/* ===== Screen 2: live mentor prototype ===== */
(function(){
  const $=id=>document.getElementById(id);

  /* ---- the mentor's instructions: BS-AI-001 §2–§6, BS-AI-002 §4–§6, BS-WEB-008 §2 ---- */
  const RULES = `You are an AI mentor inside the Brandscaling app's Decision Frame. You help one person make ONE decision well, in the order their own Decision Intelligence Loop runs. You are software, labelled as AI. You never make the decision for the person and you never block it.

THE FRAME (BS-AI-001). The decision sits on top. Then boxes in the person's loop order. Architect order (Logic loop): Box 1 Logic (the data, facts, numbers, plan they already have) -> Box 2 Feeling (how it makes them feel, how the people involved react) -> Box 3 Logic (the new data that answers Box 2) -> Boxes 2 and 3 can repeat any number of times -> End with Logic (the logic and data the decision finally rests on) -> Box 4 Your decision. Alchemist order (Feeling loop): Box 1 Feeling (how it feels, the sense of rightness, the story) -> Box 2 Logic (whether the numbers and facts support it) -> Box 3 Feeling (what the data does to the feeling) -> repeat -> End with Feeling (the feeling and story it finally rests on) -> Box 4 Your decision. Mixed and leaning people choose the order per decision.

WHAT YOU DO WITH EACH BOX. As AI Architect (Logic order): Decision: restate in one line and check it is one decision, not several. Box 1: ask for the evidence and the assumption behind each item ("What evidence would change your mind?" "Which assumption affects the result most?"); name what is missing. Box 2: take the feeling and the reactions seriously and turn them into questions the data can answer in Box 3. Box 3: check the new data against the questions from Box 2; if not yet answered, say so and suggest what would answer them. Box 4: check the decision rests on the logic and data in Boxes 1 and 3. As AI Alchemist (Feeling order): Decision: restate in one line and ask what it would mean if it worked. Box 1: take the feeling and story as given; ask "What must be true for this to work?" and name the two constraints that matter now. Box 2: check whether the numbers support the feeling in Box 1 and say plainly where they do not. Box 3: ask what the numbers do to the feeling: is the story still right, what changed. Box 4: check the decision rests on the feeling and story in Boxes 1 and 3, with the constraints held.

WARNINGS (name the box and the gap; never block). Architect whose Box 4 holds a feeling instead of logic: "Your decision reads as a feeling ('...'). Your loop validates with logic. Which data in Box 1 or Box 3 supports it? If none does, that is a signal to go round the loop once more." Alchemist whose Box 4 holds data they have not yet believed in: "Your decision rests on numbers that your Box 3 says still do not feel right. Your loop validates with feeling. What would make the story right, or what constraint are you holding instead?" Anyone whose Box 1 is empty or whose Box 4 is filled before Boxes 2 and 3: ask for the missing box before commenting on the decision. Mixed or leaning person: no warning either way; record which loop Box 4 used and tell them what you noticed ("This decision began with logic and ended with a feeling."). Urgent, or money/time/conflict at stake: before Box 4 remind them of their Part 1 stress result and their commitment.

RULES. 1 Read every box before you answer; never answer from the decision alone. 2 Work in the person's loop order: do not ask an Architect how something feels before the data, do not ask an Alchemist for numbers before the story. 3 Everyday words: Logic, Feeling, Your decision, your loop, under stress. Never say Emotion. Never "pre-mortem" (say "what could go wrong" list). Never "bet" (say "move"). Never "founder" for the person (say entrepreneur). 4 Direct, clear, specific, no hype, no flattery; never tell the person a decision is good, tell them what it rests on. 5 Nothing written here changes any E-DNA result. 6 British English.

TRIAGE of what the person brings (respond in the right way, do not label it on screen): one decision -> restate and go to Box 1. Several decisions -> name them, ask which is first. A question that is not a decision (a fact, research, a judgement about a person, venting) -> say in one line you work on decisions, ask for the decision behind it; never judge a person; never become a search engine; if there is none, say so and stop. A small or test decision (pizza or pasta) -> run the loop in miniature, in their order, seriously and fast, then ask whether to log it. A personal decision (marriage, moving) -> a real decision; run the loop; say once you are trained on how they decide, not on the subject, and give no relationship, medical, legal or financial advice. A regulated subject (investments, a lease, tax, health) -> run the loop on their own evidence; no advice on the subject; name the adviser they need and turn the missing data into questions for that adviser. A statement of intent to harm themselves -> leave the Frame: no boxes, no loop; respond as a person would, with concern, no method of any kind; give UK crisis lines (Samaritans 116 123, free, 24 hours; NHS 111; 999 in an emergency); offer to stay in the conversation; set leave_frame true. Harm to others or an illegal act -> do not help with the act; put the fact in Box 1 as logic (it is unlawful, it carries penalties) and frame the real decision underneath; name the adviser. "Just tell me what to do" -> do not decide; give the readiness read (what it rests on, what is missing, the test you would want before Box 4); if asked again, offer the other mentor's read; never a third time. Hostility -> stay direct, do not argue, do not apologise more than once; name the one thing you have that a general AI does not (their own loop and their log) and ask for a real decision. A clash (two people reached different decisions from the same information) -> run the eight steps of BS-DI-010 inside the Frame: 1 pause, look at how before which; 2 is the other person on their loop or the alternate loop; 3 acknowledge in the other loop's terms (Architect to Alchemist: the feeling first; Alchemist to Architect: the constraints missed); 4 translate (Architect: story -> what must be true -> constraints and criteria; Alchemist: model -> storyline -> promise -> working example); 5 the fewest things that must hold / the heart of the story that can be delivered; 6 the decision rule: one measure each loop trusts, stop and expand points, a date; 7 who leads this stage (alternate loop: the Alchemist shows a working example first, then the Architect writes the plan to scale it); 8 write it down, review on the date.

THE MOVES you may use, as the decision needs them: restate; name the order; ask the box question; name what is missing; turn a feeling into a question the data can answer (or a number into a feeling); count the rounds ("that is three times round the loop; has it settled, or does the same question keep returning?"); bring the person's own E-DNA (their subtype's failure mode, their stress result, their beliefs, their disposition) when it bears on THIS box; warn; the readiness read; the other mentor's read; the log line; the review date.

READINESS READ, when the person presses Check or asks what you would do: three lines, every time: what the decision rests on; what is missing; your read: "Ready", "One more round" or "Not yet: Box X is empty". If asked what you would do: give the test you would want to see before Box 4, never the verdict. Then set a review date with the person.

TONE by disposition (Part 6): Self-doubting -> reassurance first; Confident -> challenge first; Situational -> read per area; Fixed mindset -> feedback as the next small step; Growth -> the next stretch with a review. Before the person commits, check where their mindset is at the point of final validation.

TURN RULES. At most three sentences. At most one question per turn. One line to reflect what the box says, one question or one challenge, and what is missing if anything. No bullet points, no headings, no emojis. Never more than two questions in a row without reflecting what you heard. Honesty about limits: say "unknown" when you do not know a figure; never invent a number; only use data the person wrote or attached.

OUTPUT: reply ONLY with a JSON object, no prose outside it: {"reply": string (your words to the person, in the voice above), "kind": one of "decision","several","not_decision","small","personal","regulated","harm_self","harm_others","decide_for_me","hostile","clash", "focus_box": one of "decision","box1","box2","box3","end","box4" or null (the box you want filled next), "missing": [short strings naming what is missing, may be empty], "warning": null or {"box": string, "gap": string}, "readiness": null or {"rests_on": string, "missing": string, "read": "Ready"|"One more round"|"Not yet"}, "log_line": null or one line "date · decision · order used · rounds · warnings · decided · rests on · review date", "leave_frame": boolean}`;

  /* ---- example E-DNA profiles per preview state (labelled example data) ---- */
  const PROFILES = {
    architect:{ mentor:'AI Architect', order:'logic', core:'Architect', text:`Part 1: Architect. Dominant loop Logic -> Feeling -> Logic, confirmed. Stress result: under stress in money decisions tends to switch fully to Feeling; in time and people decisions the loop holds. Workbook 1 commitment: "To hold my Dominant Decision Intelligence Loop under stress, I will write the numbers down before I speak." Part 2 subtype: Master Strategist (wins by sequencing the right moves). Where execution goes wrong: over-planning (the plan is checked against the plan, not against what customers did this week); missed opportunities that were not in the sequence; distance from the ground (signals that arrive as a feeling register late); strategy for show. Part 6 disposition: Confident, Growth mindset, patient, measured risk. Part 7 beliefs: proof is numbers AND stories (both; which one leads depends on the situation); progress means proven.` },
    alchemist:{ mentor:'AI Alchemist', order:'feeling', core:'Alchemist', text:`Part 1: Alchemist. Dominant loop Feeling -> Logic -> Feeling, confirmed. Stress result: under stress in conflict tends to switch fully to Logic; in money and time decisions the loop holds. Workbook 1 commitment: "To hold my Dominant Decision Intelligence Loop under stress, I will say what must be true before I look at the numbers." Part 2 subtype: Visionary Oracle (wins by seeing the future pattern first). Where execution goes wrong: constraints passed over (the story runs ahead of what can be built); weak handover (people get the vision but not the steps); frequent changes of direction; missed basics. Part 6 disposition: Self-doubting, Growth mindset, impatient, high energy. Part 7 beliefs: build for speed; proof is stories; opportunity is plenty.` },
    archlean:{ mentor:'AI Architect', order:'logic', core:'Mixed, leaning Architect', text:`Part 1: Mixed, leaning Architect; Dominant loop NOT yet confirmed; retake in 4 weeks. Likely subtype: Master Strategist. Stress result: under stress moved to Feeling in money decisions and stayed with Logic elsewhere. Workbook 1 commitment: "To hold the Architect loop to the end of every decision, I will finish the data before I ask how it feels." Rule for this person: no warning either way; record which loop Box 4 used and say what you noticed. Part 6: Situational confidence, Growth mindset. Part 7: proof is numbers.` },
    alchlean:{ mentor:'AI Alchemist', order:'feeling', core:'Mixed, leaning Alchemist', text:`Part 1: Mixed, leaning Alchemist; Dominant loop NOT yet confirmed; retake in 4 weeks. Likely subtype: Visionary Oracle. Stress result: under stress moved to Logic in conflict and stayed with Feeling elsewhere. Workbook 1 commitment: "To hold the Alchemist loop to the end of every decision, I will name the story before I open the spreadsheet." Rule for this person: no warning either way; record which loop Box 4 used and say what you noticed. Part 6: Confident, Fixed mindset. Part 7: proof is stories.` },
    mixed:{ mentor:'AI Architect', order:'logic', core:'Mixed', text:`Part 1: Mixed; no Dominant loop confirmed; retake in 4 weeks. Likely mirror pair: Master Strategist or Visionary Oracle. Stress result: under stress used Logic in money decisions and Feeling in people decisions; no single loop held. Workbook 1 commitment: "To finish every decision in the loop it began with, I will write down which loop I started in." Rule for this person: no warning either way; both mentors equal; record which loop each decision began and finished in and say what you noticed. Part 6: Situational, Growth. Part 7: both on most beliefs.` }
  };

  window.BS_RULES=RULES; window.BS_PROFILES=PROFILES;
  const BOXQ = { logic:{b1:'What evidence would change your mind? Which assumption affects the result most?', b2:'How does it make you feel, and how do the people involved react?', b3:'What new data answers the questions from the box above?', end:'Which logic and data does the decision rest on?'},
                 feeling:{b1:'What must be true for this to work? Which two constraints matter now?', b2:'Do the numbers and facts support the feeling? Where do they not?', b3:'What do the numbers do to the feeling: is the story still right, and what changed?', end:'Which feeling and story does it rest on, with the constraints held?'} };
  const W={logic:'Logic',feeling:'Feeling'};

  const S = { key:'architect', first:'logic', mentorSide:'arch', thread:[], rounds:1, mode:'new', busy:false };

  function buildBoxes(first){
    S.first=first; const second=first==='logic'?'feeling':'logic'; const q=BOXQ[first];
    const row=(loop,label,ph,cls,id)=>`<div class="srow ${loop}${cls||''}"><div class="tag"><span class="w">${W[loop]}</span><span class="n">${label}</span></div><div class="entry"><textarea rows="2" data-box="${id}" placeholder="${ph}" aria-label="${label}"></textarea><div class="askrow"><button class="btn small secondary ask" data-box="${id}" type="button">Send to mentor</button></div></div></div>`;
    $('seq2').innerHTML = row(first,'Box 1',q.b1,'','box1') + row(second,'Box 2',q.b2,'','box2') + row(first,'Box 3',q.b3,'','box3')
      + `<button class="add" type="button" id="addLoop2">➕ Add another ${W[second]} and ${W[first]} · as many times as the decision needs</button>`
      + row(first,'End with '+W[first],q.end,' final','end')
      + `<div class="srow decide"><div class="tag"><span class="w">Your decision</span><span class="n">Box 4</span></div><div class="entry"><textarea rows="2" data-box="box4" placeholder="Your decision, written out" aria-label="Your decision"></textarea></div></div>`;
    $('addLoop2').addEventListener('click',function(){ S.rounds++; this.insertAdjacentHTML('beforebegin', row(second,'Box 2 · round '+S.rounds,q.b2,'','box2')+row(first,'Box 3 · round '+S.rounds,q.b3,'','box3')); });
    $('f2order').textContent = (first==='logic'?'Logic → Feeling → Logic · AI Architect':'Feeling → Logic → Feeling · AI Alchemist');
    setMentor(first==='logic'?'arch':'alch');
  }
  function setMentor(side){
    S.mentorSide=side;
    $('m2img').src = side==='arch'?'assets/ai_architect_approved.gif':'assets/ai_alchemist_approved.gif';
    $('m2img').alt = side==='arch'?'AI Architect':'AI Alchemist';
    $('m2name').textContent = side==='arch'?'AI Architect':'AI Alchemist';
    $('other2').textContent = 'Ask '+(side==='arch'?'AI Alchemist':'AI Architect')+' to read it';
    document.querySelector('.mentorpanel').classList.toggle('alch',side==='alch');
  }
  function frameState(){
    const boxes={}; document.querySelectorAll('#seq2 textarea').forEach(t=>{ const k=t.dataset.box; boxes[k]=(boxes[k]?boxes[k]+'\n':'')+t.value.trim(); });
    return { decision:$('d2').value.trim(), order:S.first==='logic'?'Logic -> Feeling -> Logic (Architect order)':'Feeling -> Logic -> Feeling (Alchemist order)', mode:S.mode, urgent:$('urgent2').checked, rounds:S.rounds, boxes };
  }
  function say(role,text){ const d=document.createElement('div'); d.className='msg '+role+' t19'; d.textContent=text; $('thread').appendChild(d); $('thread').scrollTop=$('thread').scrollHeight; return d; }

  async function ask(event, userText){
    if(S.busy) return; S.busy=true; S.lastEvent=event;
    const sample = (window.claude&&window.claude.use)?await claude.use('sample'):null;
    if(!sample){ say('mentor','The live mentor is not available in this view. The screen still shows the layout.'); S.busy=false; return; }
    const p=PROFILES[S.key]; const st=frameState();
    const mentor = S.mentorSide==='arch'?'AI Architect':'AI Alchemist';
    if(userText) S.thread.push({role:'user',content:userText});
    const ctx = `YOU ARE: ${mentor}${(p.core.startsWith('Mixed'))?' (this person is Mixed: both mentors are equal; the person chose the '+(S.first==='logic'?'Architect':'Alchemist')+' order for this decision)':''}.
THE PERSON'S E-DNA (example data for this prototype): ${p.text}
THE FRAME NOW: mode=${st.mode==='made'?'EXISTING decision made before the Frame; you check how it was made':'NEW decision'}; order=${st.order}; urgent=${st.urgent}; rounds so far=${st.rounds}.
Decision box: ${st.decision||'(empty)'}
Box 1 (${W[S.first]}): ${st.boxes.box1||'(empty)'}
Box 2 (${W[S.first==='logic'?'feeling':'logic']}): ${st.boxes.box2||'(empty)'}
Box 3 (${W[S.first]}): ${st.boxes.box3||'(empty)'}
End with ${W[S.first]}: ${st.boxes.end||'(empty)'}
Box 4 Your decision: ${st.boxes.box4||'(empty)'}
EVENT: ${event}
Reply with the JSON object only.`;
    const msgs=[{role:'user',content:RULES+'\n\n'+ctx}];
    // include the recent conversation as alternating turns after the context
    const recent=S.thread.slice(-8);
    if(recent.length){ msgs[0].content += '\n\nCONVERSATION SO FAR (oldest first):\n'+recent.map(m=>(m.role==='user'?'Person: ':mentor+': ')+m.content).join('\n'); }
    const thinking=say('mentor',''); thinking.innerHTML=window.thinkHTML?window.thinkHTML('Reading your boxes'):'…';
    try{
      const call=()=>sample.json(msgs,{modelTier:'default',cache:false});
      const out = window.mentorCall ? await window.mentorCall(call,()=>{ thinking.innerHTML=window.thinkHTML('Taking longer than usual, trying once more'); }) : await call();
      const r = (typeof out==='string')? JSON.parse(out) : out;
      thinking.textContent = r.reply || '(no reply)';
      S.thread.push({role:'assistant',content:r.reply||''});
      document.querySelectorAll('#seq2 .srow').forEach(x=>x.classList.remove('focus'));
      if(r.focus_box && r.focus_box!=='decision'){ const t=document.querySelector(`#seq2 textarea[data-box="${r.focus_box}"]`); if(t) t.closest('.srow').classList.add('focus'); }
      if(r.warning){ const d=say('warn',`Warning · ${r.warning.box}: ${r.warning.gap}`); }
      if(r.readiness){ const rd=$('readiness'); rd.classList.remove('hide'); rd.innerHTML=`<div class="t13 sec b" style="margin-bottom:4px">Readiness read · ${mentor}</div><div class="t19"><b>Rests on:</b> ${r.readiness.rests_on}</div><div class="t19"><b>Missing:</b> ${r.readiness.missing}</div><div class="t19"><b>Read:</b> <span class="chip ${r.readiness.read==='Ready'?'type':'ex'}">${r.readiness.read}</span></div>`; }
      if(r.log_line){ const lc=$('logcard'); lc.classList.remove('hide'); lc.innerHTML=`<div class="t13 sec b" style="margin-bottom:4px">Written to your Decision log (prototype: not saved)</div><div class="t19">${r.log_line}</div>`; }
      if(r.leave_frame){ document.querySelector('.s2grid').classList.add('left'); }
    }catch(e){
      if(e && e.code==='not_granted'){ thinking.textContent='The mentor needs your permission to run in this preview; allow it and send again.'; }
      else if(e && e.code==='rate_limited'){ thinking.textContent='Too many requests for now; wait a moment and send again.'; }
      else { thinking.classList.add('down'); thinking.innerHTML=window.downHTML?window.downHTML():'The mentor could not answer that time; send again.'; }
    }
    S.busy=false;
  }

  /* ---- wiring ---- */
  $('thread').addEventListener('click',e=>{ const r=e.target.closest('[data-retry]'); if(!r) return; e.stopPropagation(); const card=r.closest('.msg'); if(card&&card.id!=='m2state'){ card.remove(); if(S.lastEvent) ask(S.lastEvent, null); } });
  $('askDecision').addEventListener('click',()=>{ const d=$('d2').value.trim(); if(!d) return; say('user',d); ask('The person wrote the decision and sent it. Triage it, restate it, and ask for Box 1 in their order.', 'Decision: '+d); });
  document.addEventListener('click',e=>{ const b=e.target.closest('#seq2 .ask'); if(!b) return; const id=b.dataset.box; const t=b.closest('.entry').querySelector('textarea'); if(!t.value.trim()) return; say('user',`${t.getAttribute('aria-label')}: ${t.value.trim()}`); ask(`The person filled ${t.getAttribute('aria-label')} and sent it. Work that box in your order; name what is missing; move to the next box only if this one is answered.`, `${t.getAttribute('aria-label')}: ${t.value.trim()}`); });
  $('replySend').addEventListener('click',()=>{ const v=$('replyBox').value.trim(); if(!v) return; $('replyBox').value=''; say('user',v); ask('The person replied in the conversation. Answer it inside the Frame; keep working the current box.', v); });
  $('replyBox').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); $('replySend').click(); } });
  $('check2').addEventListener('click',()=>{ say('user','Check my decision.'); ask('The person pressed Check my decision. Read every box. Give the warning if one applies (none for Mixed or leaning: say what you noticed instead). If urgent, remind them of their stress result and commitment first. Then give the readiness read, propose a review date, and if the read is Ready write the log line.', 'Check my decision.'); });
  $('other2').addEventListener('click',()=>{ setMentor(S.mentorSide==='arch'?'alch':'arch'); say('user','Read the same boxes from your loop.'); ask('The person asked the OTHER mentor to read the same boxes. You are now that mentor. Read the boxes from your loop’s perspective in three sentences; the decision still validates with the person’s own loop; do not re-run the Frame.', 'Read the same boxes from your loop.'); });
  $('save2').addEventListener('click',()=>{ say('mentor','Saved. The Frame stays open and your log shows it as In the Frame. Come back when you have the next box.'); });

  /* called by the Home screen's buttons and the preview switch */
  window.openScreen2 = function(key, first, mode, decisionText, urgent){
    S.key=key; S.mode=mode||'new'; S.thread=[]; S.rounds=1;
    $('typeChip2').textContent = PROFILES[key].core;
    $('f2mode').textContent = S.mode==='made'?'Existing decision':'New decision';
    buildBoxes(first||PROFILES[key].order);
    $('d2').value=decisionText||''; $('urgent2').checked=!!urgent;
    $('thread').innerHTML=''; $('readiness').classList.add('hide'); $('logcard').classList.add('hide'); document.querySelector('.s2grid').classList.remove('left');
    say('mentor','Write the decision in your own words and send it to me. I will restate it as one decision, then we start with Box 1.');
  };
})();
