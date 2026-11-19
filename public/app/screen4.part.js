/* ===== Screen 4: Decision Room (example: an Architect and an Alchemist partner; BS-DI-010 eight steps) ===== */
(function(){
  const $=id=>document.getElementById(id);
  const W={logic:'Logic',feeling:'Feeling'};
  let YOU={}, OTHER={};

  // extra collaborators per room kind, matching the example entries in the Frame
  const EXTRA={
    new:[{name:'Priya Shah',initials:'PS',type:'Alchemist',first:'feeling',mentor:'AI Alchemist',role:'Collaborator · Head of Sales',progress:'Added 2 entries · 2 h ago'},
         {name:'Tom Reid',initials:'TR',type:'Architect',first:'logic',mentor:'AI Architect',role:'Collaborator · Operations',progress:'Added 2 entries · yesterday'}],
    stuck:[{name:'Mo Hassan',initials:'MH',type:'Alchemist',first:'feeling',mentor:'AI Alchemist',role:'Collaborator · Account lead',progress:'Added 2 entries · today'}],
    clash:[]
  };
  let CURKIND='new';
  const cls=p=>p.type.startsWith('Mixed')?('mixed'+(p.type.includes('leaning Architect')?' lean-logic':p.type.includes('leaning Alchemist')?' lean-feeling':'')):p.type==='Architect'?'architect':'alchemist';
  function renderPeople(list){
    const n=list.length, left=6-n;
    $('people').innerHTML = list.map(p=>`<div class="pwrap"><button class="pcircle ${cls(p)}${p.role.startsWith('Decision owner')?' owner':''}" type="button" data-name="${p.name}" aria-label="${p.name} · ${p.role}">${p.photo?`<img src="${p.photo}" alt="">`:(p.initials||'SN')}</button><div class="ptip" role="tooltip"><div class="nm">${p.name} <span class="t13 sec" style="font-weight:500">· ${p.role}</span></div><div><span class="chip loopchip ${p.first==='logic'?'ind':p.type.startsWith('Mixed')?'grey':'red'}" style="padding:1px 8px">${p.type}</span></div><div class="sec" style="margin-top:4px">${W[p.first]} → ${W[p.first==='logic'?'feeling':'logic']} → ${W[p.first]} · ${p.mentor}</div><div class="sec" style="margin-top:4px">${p.progress} · consent given for this decision</div><a href="#" data-name="${p.name}">Open profile ›</a></div></div>`).join('')
      + (left>0?`<div class="pwrap"><button class="pcircle plus" type="button" id="addCircle" aria-label="Invite someone">+</button></div>`:'');
    $('pcap').textContent = `${n} of 6 · ${left>0?left+' more place'+(left===1?'':'s')+'. ':''}Ring: Decision owner. Colour: core type. Hover or tap a circle for details; click for the profile.`;
    const ac=$('addCircle'); if(ac) ac.addEventListener('click',()=>{ $('invitePanel').classList.toggle('hide'); });
  }
  function setPeople(key, solo){
    const oc=$('ownerChip'); if(oc){ oc.className='chip type nowrap'; oc.textContent='Decision owner: you'; }
    const youArch = !(key==='alchemist'||key==='alchlean');
    YOU   = youArch ? {name:'You', initials:'SN', type:'Architect', first:'logic', mentor:'AI Architect', role:'Decision owner', progress:'Your Frame: 4 of 5 boxes filled'} : {name:'You', initials:'SN', type:'Alchemist', first:'feeling', mentor:'AI Alchemist', role:'Decision owner', progress:'Your Frame: 4 of 5 boxes filled'};
    OTHER = youArch ? {name:'Sam', initials:'SA', type:'Alchemist', first:'feeling', mentor:'AI Alchemist', role:'Collaborator · guest, 5 days left', progress:'Sam’s Frame: 5 of 5 boxes filled · added input 2 h ago'} : {name:'Sam', initials:'SA', type:'Architect', first:'logic', mentor:'AI Architect', role:'Collaborator · guest, 5 days left', progress:'Sam’s Frame: 5 of 5 boxes filled · added input 2 h ago'};
    if(solo) YOU.progress='Your Frame: not started';
    if(key==='mixed'||key==='archlean'||key==='alchlean'){ YOU.type = key==='mixed'?'Mixed · using the Architect order':key==='archlean'?'Mixed · leaning Architect':'Mixed · leaning Alchemist'; }
    renderPeople(solo?[YOU]:[YOU,OTHER].concat(EXTRA[CURKIND]||[]));
    if(solo){ $('mAlchRoom').textContent = YOU.first==='feeling'?'Coaches you in your loop. Coaches each Alchemist you invite in theirs.':'Coaches each Alchemist you invite: acknowledge the constraints missed; translate the plan into a storyline, a promise and a working example.'; $('mArchRoom').textContent = YOU.first==='logic'?'Coaches you in your loop. Coaches each Architect you invite in theirs.':'Coaches each Architect you invite: acknowledge the feeling first; translate the story into what must be true, then constraints and criteria.'; return; }
    $('mAlchRoom').textContent = `Coaches ${YOU.first==='feeling'?'you':'Sam'}: acknowledge the constraints missed; translate the plan into a storyline, a promise and a working example.`;
    $('mArchRoom').textContent = `Coaches ${YOU.first==='logic'?'you':'Sam'}: acknowledge the feeling first; translate the story into what must be true, then constraints and criteria.`;
  }

  const A = ()=> YOU.first==='logic'?YOU:OTHER;   // the Architect in the room
  const L = ()=> YOU.first==='logic'?OTHER:YOU;   // the Alchemist in the room
  const nm = p => p.name==='You'?'you':p.name;
  const Nm = p => p.name==='You'?'You':p.name;
  const Pos = p => p.name==='You'?'Your position':p.name+'’s position';
  const Fr = p => p.name==='You'?'Your Frame':p.name+'’s Frame';

  /* ---- the Frame with the room in the sequence, by kind ---- */
  const ent=(loop,by,who,text,extra)=>`<div class="ent ${loop}${extra||''}"><div class="by">${by}${who?' · <span class="chip '+(who==='Architect'?'ind':who==='Alchemist'?'red':'grey')+'" style="padding:1px 8px">'+who+'</span>':''}</div><div class="t19">${text}</div></div>`;
  const row=(loop,label,sub,inner)=>`<div class="inp ${loop}"><div class="tag"><span class="w">${label}</span><span class="n">${sub}</span></div><div>${inner}</div></div>`;
  const KIND={
    new:{ line:'A decision you are making now, with input from the people you invite.', people:'4 of 6 people',
      body:()=>
        row('','The decision','Decision owner only', ent('dec','You · Decision owner · '+YOU.type,null,'Open a second office in Manchester in Q2, or stay in one office and hire remote.',' owner'))
      + row('logic','Logic','Box 1 · Decision owner only', ent('logic','You · Decision owner','Architect','Manchester lease £38k a year; 6 of 22 staff already remote; two clients there worth £140k; travel costs £11k a year.',' owner'))
      + row('feeling','Feeling','Box 2 · collaborators', ent('feeling','Priya · Head of Sales','Alchemist','The Manchester clients feel like the start of something; being there matters to them.')+ent('feeling','Tom · Operations','Architect','Honestly, I feel stretched already; a second site worries me more than remote hires.')+ent('feeling','Aisha · People','Alchemist','The team would read a second office as growth; remote-only reads as cost-cutting.')+'<button class="add" type="button" style="margin-left:0">➕ Add input · Feeling</button>')
      + row('logic','Logic','Box 3 · collaborators', ent('logic','Tom · Operations','Architect','Remote hires cost 18% less fully loaded; onboarding time is 3 weeks longer.')+ent('logic','Priya · Head of Sales','Alchemist','Both Manchester clients said in Q3 they would expand if we had people on site.')+'<button class="add" type="button" style="margin-left:0">➕ Add input · Logic</button>')
      + row('logic','Logic','End with Logic · Decision owner only', ent('logic','You · Decision owner','Architect','Rests on the two clients’ expansion (Priya, Box 3) against the 18% saving and the lease.',' owner'))
      + row('','Your decision','Box 4 · Decision owner only', ent('dec','You · Decision owner',null,'Manchester office in Q2 on a 2-year lease, if both clients confirm expansion in writing by March; otherwise remote hires.',' owner'))
      + `<div class="xcheck"><div class="t13 sec b" style="margin-bottom:4px">Cross-check · AI Architect</div><div class="t19"><b>Rests on:</b> Box 1 and Priya’s Box 3, with Tom’s 18% figure as the alternative.</div><div class="t19"><b>Not answered:</b> Tom’s and Aisha’s Box 2 have no Box 3 data against them.</div><div class="t19"><b>Read:</b> <span class="chip ex">One more round</span> · 3 of 5 inputs came from the Feeling loop; your loop validates with logic. Ask Tom what capacity a second site needs, then decide.</div></div>`
      + `<div class="btnrow" style="margin-top:14px"><button class="btn primary small" type="button">Check my decision with AI Architect</button><button class="btn secondary small" type="button">Ask the room for one more round</button></div>` },
    stuck:{ line:'A decision you began and cannot get clear on. It is written in the past tense: what you began with, what you checked it against, where it stands now. Give the room what you have; the mentor sorts it into your boxes and you confirm each piece.', people:'3 of 6 people',
      body:()=>
        row('','The decision','Decision owner only', ent('dec','You · Decision owner · '+YOU.type,null,'Whether to keep the Leeds contract when it renews in January.',' owner'))
      + row('','What you have so far','Pasted or attached · sorted by your mentor', `<div class="ent"><div class="by">You attached · Q3 margin sheet.xlsx · Tuesday notes.docx · and pasted 14 lines</div><div class="t19">AI Architect sorted them into your order. Confirm, move or drop each piece below.</div></div>`)
      + row('logic','Began with Logic','Box 1 · Decision owner only · sorted from what you have', ent('logic','From Q3 margin sheet','Architect','Leeds margin fell from 31% to 19% over three quarters; scope grew 40% with no price change. <span class="t13 sec">Keep in Box 1 ✓</span>',' owner')+ent('logic','From Tuesday notes','Architect','Renewal is 1 January; 90 days’ notice; £210k a year. <span class="t13 sec">Keep in Box 1 ✓</span>',' owner'))
      + row('feeling','Checked against Feeling','Box 2 · sorted, and collaborators', ent('feeling','From your pasted lines','Architect','“I dread the Monday call. They treat the team badly.” <span class="t13 sec">Moved here by your mentor · confirm</span>')+ent('feeling','Mo · Account lead','Alchemist','The team want to keep it; it is our biggest logo and they are proud of it.')+'<button class="add" type="button" style="margin-left:0">➕ Add input · Feeling</button>')
      + row('logic','Went back to Logic','Box 3 · collaborators', ent('logic','Mo · Account lead','Alchemist','If we re-scope to the original brief the margin returns to about 28%; they have accepted re-scopes before.')+'<button class="add" type="button" style="margin-left:0">➕ Add input · Logic</button>')
      + row('logic','Where it stands','Decision owner only', `<div class="ent logic owner locked"><div class="by">You · Decision owner</div><div class="t19 sec">Not yet written. <span class="lock">Your mentor: “Box 3 answers the margin; it does not answer the Monday call. One more round on that, then end with logic.”</span></div></div>`)
      + row('','Your decision','Box 4 · Decision owner only', `<div class="ent dec owner locked"><div class="by">You · Decision owner</div><div class="t19 sec">Not yet written.</div></div>`)
      + `<div class="xcheck"><div class="t13 sec b" style="margin-bottom:4px">Where you are · AI Architect</div><div class="t19"><b>Clear now:</b> the numbers (Box 1) and the re-scope option (Mo, Box 3).</div><div class="t19"><b>Still unclear:</b> whether the relationship is the problem or the scope is. That is a Feeling entry with no data against it yet.</div><div class="t19"><b>Read:</b> <span class="chip ex">Not yet</span> · one question for Box 3: has the Monday call changed since the scope grew?</div></div>`
      + `<div class="btnrow" style="margin-top:14px"><button class="btn primary small" type="button">Continue with AI Architect</button><button class="btn secondary small" type="button">Save and come back</button></div>` },
    clash:{ line:'Same facts, different decisions. Start with the decision, then the clash (the two decisions reached), then find where in the sequence it split, and work it through from there. Needs at least one other person: invite them, or start from your side with their decision as you read it.', people:'2 of 6 people',
      body:()=>
        row('','The decision','What are you both deciding? · Decision owner only', ent('dec','You · Decision owner · '+YOU.type,null,'Hire a salesperson now, or wait until Q2.',' owner'))
      + row('','The clash','The two decisions reached · past tense', `<div class="clash2">`+ent('logic','You · Decision owner · as you reached it','Architect','Wait until Q2 unless leads reach 15 a month.',' owner')+ent('feeling','Sam · Collaborator · confirmed by Sam','Alchemist','Hire now, on a short contract if cash is the worry.')+`</div>`)
      + row('','What you each began with','Box 1 · each in your own loop', `<div class="clash2"><div><div class="t13 sec b" style="margin-bottom:4px">What are the facts? <span style="font-weight:500">(Logic)</span></div>`+ent('logic','You · Decision owner','Architect','Pipeline 9 leads a month; cash covers 3 months; a hire adds £4.5k a month.',' owner')+`</div><div><div class="t13 sec b" style="margin-bottom:4px">What\u2019s troubling you? <span style="font-weight:500">(Feeling)</span></div>`+ent('feeling','Sam · Collaborator','Alchemist','The market is moving now. First in with a real salesperson; waiting feels like watching the window close.')+`</div></div>`)
      + row('feeling','Where it split','Box 2 · what each of you checked the facts against', `<div class="split"><div class="t13 b" style="margin-bottom:6px">⚑ The split happened here. You checked the facts against the last hire’s break-even; Sam checked them against where the market is going. Same facts, different loop. (AI Architect)</div>`+ent('logic','You · checked against','Architect','Last hire took 4 months to break even at 14 leads a month. At 9 leads, a hire does not pay back.',' owner')+ent('feeling','Sam · checked against','Alchemist','Two competitors hired in October; waiting feels like watching the window close. First in with a real salesperson.')+`</div>`
          + ent('feeling','AI Architect · translation for you','Mentor','Sam’s story in your terms: what must be true is enough leads to feed a hire and cash to cover the ramp; the constraints are 15 leads a month and three months of cash. Acknowledge first: “I can see this does not feel ready to you; tell me what is missing.”')
          + ent('logic','AI Alchemist · translation for Sam','Mentor','Your plan in Sam’s terms: the promise is a salesperson the first month leads reach 15; the working example is a four-week contractor.'))
      + row('logic','Work it through','Box 3 · collaborators · what answers the split', ent('logic','Sam · Collaborator','Alchemist','Close rate is 30%; a contractor for four weeks would show whether the leads convert before a hire.')+ent('logic','You · Decision owner','Architect','A contractor costs £6k for four weeks; cash still covers 3 months after it.',' owner')+'<button class="add" type="button" style="margin-left:0">➕ Add input · Logic</button>')
      + row('logic','Logic','End with Logic · Decision owner only', ent('logic','You · Decision owner','Architect','Rests on leads a month against the break-even figure, tested by the contractor.',' owner'))
      + row('','Your decision','Box 4 · Decision owner writes, Sam confirms', ent('dec','You · Decision owner',null,'Contractor trial for four weeks from January; hire decision on 1 February.',' owner')
          + `<div class="rule" style="margin-top:8px"><div><div class="t13 sec">One measure you trust</div><div class="t19">Leads a month</div></div><div><div class="t13 sec">One measure Sam trusts</div><div class="t19">Close rate on the contractor’s leads</div></div><div><div class="t13 sec">Stop · expand</div><div class="t19">Under 15 leads: pause · over 25 or 30% close: hire a second</div></div><div><div class="t13 sec">Date · who leads</div><div class="t19">1 February · Sam leads the trial, you write the plan</div></div></div><div class="btnrow" style="margin-top:8px"><span class="chip red">Sam: confirmed</span></div>`)
      + `<div class="xcheck"><div class="t13 sec b" style="margin-bottom:4px">Cross-check · AI Architect</div><div class="t19"><b>Where it split:</b> Box 2. You began with the facts, Sam with the feeling; the difference was what each of you checked against, not values.</div><div class="t19"><b>What settled it:</b> a test both loops accept, a rule each loop trusts, and a date. Written to both logs as a room decision.</div><div class="t19"><b>Read:</b> <span class="chip type">Ready</span> · review on 1 February, together.</div></div>`
      + `<div class="btnrow" style="margin-top:14px"><button class="btn primary small" type="button">Check the decision with AI Architect</button><button class="btn secondary small" type="button">Ask Sam for one more round</button></div>` }
  };
  /* ---- a blank room: the owner names the decision and Box 1; the rest waits for the room ---- */
  const blank=()=>
      row('','The decision','Decision owner only', `<textarea class="t19" placeholder="What is the decision you are trying to make?" aria-label="The decision"></textarea>`)
    + row('logic','Logic','Box 1 · Decision owner only', `<textarea class="t19" placeholder="What are the facts? Numbers, dates, constraints. Attach a document if it helps." aria-label="Box 1"></textarea><button class="add" type="button" style="margin-left:0">➕ Attach document</button>`)
    + row('feeling','Feeling','Box 2 · collaborators', `<div class="ent"><div class="t19 sec">Waits for the people you invite. Each adds in their own loop, tagged with their name.</div></div>`)
    + row('logic','Logic','Box 3 · collaborators', `<div class="ent"><div class="t19 sec">Waits for the room.</div></div>`)
    + row('logic','Logic','End with Logic · Decision owner only', `<div class="ent logic owner locked"><div class="by">You · Decision owner</div><div class="t19 sec">Opens when the room has added to Boxes 2 and 3.</div></div>`)
    + row('','Your decision','Box 4 · Decision owner only', `<div class="ent dec owner locked"><div class="by">You · Decision owner</div><div class="t19 sec">Not yet written.</div></div>`)
    + `<div class="btnrow" style="margin-top:14px"><button class="btn primary small" type="button">Save and invite people</button><button class="btn secondary small" type="button">Save for later</button></div>`;

  const ROOMS=[
    {title:'Hire a salesperson now, or in Q2', kind:'clash', people:'2 of 6', when:'Today', status:'Ready · review 1 Feb', chip:'type'},
    {title:'Open a second office in Manchester in Q2', kind:'new', people:'4 of 6', when:'Yesterday', status:'Waiting on you · one more round', chip:'ex'},
    {title:'Keep the Leeds contract at renewal', kind:'stuck', people:'3 of 6', when:'12 Nov', status:'In the Frame', chip:'grey'}
  ];
  const KNAME={new:'New decision',stuck:'Stuck',clash:'Resolve a clash'};
  let KEY='architect', BLANK=false;
  function renderRooms(){
    if(window.BS_ACCT==='new'){ $('rooms').innerHTML=`<div class="empty"><b>No rooms yet.</b> Start one when a decision needs someone else's input. You keep the decision, Box 1 and the final call; they add into the sequence.</div>`; return; }
    $('rooms').innerHTML = ROOMS.map((r,i)=>`<button class="room" type="button" data-room="${i}"><div><div class="t19 b">${r.title}</div><div class="meta t13 sec"><span class="chip grey" style="padding:1px 8px">${KNAME[r.kind]}</span><span>${r.people} people</span><span>·</span><span>${r.when}</span></div><div style="margin-top:6px"><span class="chip ${r.chip}">${r.status}</span></div></div><span class="go" aria-hidden="true">›</span></button>`).join('');
    document.querySelectorAll('#rooms .room').forEach(b=>b.addEventListener('click',()=>openRoom(Number(b.dataset.room))));
  }
  function showList(on){ $('roomList').classList.toggle('hide',!on); $('roomView').classList.toggle('hide',on); }
  function openRoom(i){ const r=ROOMS[i]; BLANK=false; CURKIND=r.kind; $('roomTitle').textContent=r.title; setPeople(KEY,false); $('invitePanel').classList.add('hide'); setKind(r.kind); showList(false); document.getElementById('frame').scrollTop=0; }
  function newRoom(){ BLANK=true; CURKIND='new'; $('roomTitle').textContent='New room'; setPeople(KEY,true); $('invitePanel').classList.add('hide'); setKind('new'); showList(false); document.getElementById('frame').scrollTop=0; }
  $('newRoom').addEventListener('click',newRoom);
  window.showRoomList=()=>showList(true);
  window.openRoomExample=openRoom; window.openRoomNew=newRoom;

  function setKind(k){
    if(k!==CURKIND){ CURKIND=k; setPeople(KEY, BLANK); }
    document.querySelectorAll('input[name="rkind"]').forEach(r=>{ r.checked=r.value===k; r.closest('.mode').classList.toggle('sel',r.value===k); });
    $('kindLine').textContent=BLANK?'A decision you are making now. Name it, write Box 1, then invite the people whose input you want. Change the kind above if the decision is already under way (Stuck) or you and someone else reached different answers (Resolve a clash).':KIND[k].line;
    $('roomCount').textContent=BLANK?'1 of 6 people':KIND[k].people; $('modeABody').innerHTML=BLANK?blank():KIND[k].body();
  }
  document.querySelectorAll('input[name="rkind"]').forEach(r=>r.addEventListener('change',()=>setKind(r.value)));
  window.openScreen4=function(key){ KEY=key; CURKIND='new'; renderRooms(); setPeople(key,false); $('invitePanel').classList.add('hide'); BLANK=false; setKind('new'); showList(true); };
})();
