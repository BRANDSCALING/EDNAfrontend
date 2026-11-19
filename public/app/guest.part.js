/* ===== Screen 13 (bar: 12 · Guest and consent): invitation → E-DNA first → consent → first room view (7 days) → collaborator profile (BS-AI-008 §2.3, §5; BS-AI-009 N1 guest) ===== */
(function(){
  const $=id=>document.getElementById(id);
  let STEP='invite', GUEST=false;
  // who a profile can show (same people as the example rooms on screen 4); a collaborator sees name, core type, loop and mentor only (BS-AI-008 §2.3)
  const PEOPLE={
    'Dan Mehta':{ini:'DM',type:'Architect',first:'logic',mentor:'AI Architect',role:'Owner of this room · Managing Director'},
    'Priya Shah':{ini:'PS',type:'Alchemist',first:'feeling',mentor:'AI Alchemist',role:'Collaborator · Head of Sales'},
    'Tom Reid':{ini:'TR',type:'Architect',first:'logic',mentor:'AI Architect',role:'Collaborator · Operations'},
    'Mo Hassan':{ini:'MH',type:'Alchemist',first:'feeling',mentor:'AI Alchemist',role:'Collaborator · Account lead'},
    'Sam':{ini:'SA',type:null,first:null,mentor:null,role:'Collaborator · guest, 5 days left'}
  };
  const W={logic:'Logic',feeling:'Feeling'};
  function profile(name){
    const p=PEOPLE[name]||PEOPLE['Dan Mehta'];
    let type=p.type, first=p.first, mentor=p.mentor;
    if(!type){ const youArch=!(window.BS_CUR==='alchemist'||window.BS_CUR==='alchlean'); type=youArch?'Alchemist':'Architect'; first=youArch?'feeling':'logic'; mentor=youArch?'AI Alchemist':'AI Architect'; }
    $('g5h').textContent=name; $('gpRole').textContent=p.role; $('gpType').textContent=type; $('gpMentor').textContent=mentor;
    $('gpLoop').textContent=`${W[first]} → ${W[first==='logic'?'feeling':'logic']} → ${W[first]}`;
    const c=$('gpCircle'); c.textContent=p.ini; c.className='pcircle big '+(type==='Architect'?'architect':'alchemist');
  }
  function step(k){
    STEP=k;
    document.querySelectorAll('#main13 [data-g]').forEach(b=>b.classList.toggle('on',b.dataset.g===k));
    document.querySelectorAll('#main13 [data-gv]').forEach(s=>s.classList.toggle('hide',s.dataset.gv!==k));
    const f=$('frame');
    f.classList.toggle('noshell', k==='invite'||k==='edna');   // before the E-DNA there is no account and no shell
    f.classList.toggle('auth', k==='invite'||k==='edna');      // and no result, so Indigo drives the chrome
    f.scrollTop=0;
  }
  /* the first room view: screen 4 relabelled for the guest (BS-AI-008 §5: 7 days, 3 decisions; §2.3: a collaborator adds to Boxes 2 and 3 only).
     Preview only: the owner's example room is rendered with an Alchemist owner (Priya), then the labels are swapped so you are the guest. */
  const GCHIP=()=>{ const k=window.BS_CUR; return k==='alchemist'?['red','Alchemist']:k==='architect'?['ind','Architect']:['grey',k==='archlean'?'Mixed · leaning Architect':k==='alchlean'?'Mixed · leaning Alchemist':'Mixed']; };
  function guestRoom(){
    GUEST=true; window.showScreen(4);
    if(o4) o4('architect'); if(window.openRoomExample) window.openRoomExample(1);   // the example Frame is an Architect owner's; here that owner is Dan
    let b=$('guestBanner');
    if(!b){ b=document.createElement('div'); b.id='guestBanner'; b.className='gbanner';
      b.innerHTML='<div><div class="t13 b">Guest access · 7 days left · 3 decisions of your own</div><div class="t13 sec">You are in Dan\'s room with the Frame and your mentor. Add your input in Box 2 or Box 3. Keep the app after day 7 with the Advanced Report or a membership.</div></div><div class="btnrow" style="margin:0"><button class="btn small primary" type="button" data-buy="report">Keep the app · £99</button><button class="btn small secondary" type="button" data-go="13">Back to the invitation</button></div>';
      $('roomView').insertBefore(b,$('roomView').firstChild); }
    b.classList.remove('hide');
    const [gc,gt]=GCHIP();
    const first=(window.BS_CUR==='alchemist'||window.BS_CUR==='alchlean')?'feeling':'logic';
    // the Frame is Dan's: his labels, his actions; a collaborator adds to Boxes 2 and 3 and reads the rest (BS-AI-008 §2.3)
    const body=$('modeABody'); let h=body.innerHTML;
    h=h.replace(/You · Decision owner/g,'Dan · Decision owner').replace(/>Your decision</g,'>Dan’s decision<').replace(/your loop validates/g,'Dan’s loop validates');
    body.innerHTML=h;
    body.querySelectorAll('.btnrow').forEach(r=>{ r.innerHTML='<span class="t13 sec">Only Dan, the decision owner, can check the decision or ask the room for another round.</span>'; });
    const oc=$('ownerChip'); if(oc) oc.textContent='Decision owner: Dan Mehta';
    // the circles: the owner circle becomes Dan; you join as a guest with no entries yet
    const cls=window.BS_CUR==='architect'?'architect':window.BS_CUR==='alchemist'?'alchemist':('mixed'+(window.BS_CUR==='archlean'?' lean-logic':window.BS_CUR==='alchlean'?' lean-feeling':''));
    const you=document.querySelector('#people .pcircle[data-name="You"]');
    if(you){
      you.textContent='DM'; you.dataset.name='Dan Mehta'; you.setAttribute('aria-label','Dan Mehta · Decision owner');
      const t=you.closest('.pwrap').querySelector('.ptip'); t.querySelector('.nm').innerHTML='Dan Mehta <span class="t13 sec" style="font-weight:500">· Decision owner · Managing Director</span>'; t.querySelectorAll('.sec')[1].textContent='His Frame: 4 of 5 boxes filled · consent given for this decision'; t.querySelector('a').dataset.name='Dan Mehta';
      const w=document.createElement('div'); w.className='pwrap';
      w.innerHTML=`<button class="pcircle ${cls}" type="button" data-name="You" aria-label="You · Collaborator · guest, 7 days left">SN</button><div class="ptip" role="tooltip"><div class="nm">You <span class="t13 sec" style="font-weight:500">· Collaborator · guest, 7 days left</span></div><div><span class="chip loopchip ${gc==='ind'?'ind':gc==='red'?'red':'grey'}" style="padding:1px 8px">${gt}</span></div><div class="sec" style="margin-top:4px">${W[first]} → ${W[first==='logic'?'feeling':'logic']} → ${W[first]} · ${first==='logic'?'AI Architect':'AI Alchemist'}</div><div class="sec" style="margin-top:4px">Joined just now · no entries yet · consent given for this decision</div><a href="#" data-name="You">Open profile ›</a></div>`;
      const plus=$('addCircle'); const pw=plus?plus.closest('.pwrap'):null; if(pw) pw.remove();   // a guest cannot invite (design choice)
      $('people').appendChild(w);
    }
    $('roomCount').textContent='5 of 6 people'; $('kindLine').textContent='Dan’s decision, with input from the people he invited. You add in Box 2 or Box 3; the rest is read-only for you.';
    $('mAlchRoom').textContent=`Coaches Priya, Aisha and Sam${first==='feeling'?', and you':''}: acknowledge the constraints missed; translate the plan into a storyline, a promise and a working example.`;
    $('mArchRoom').textContent=`Coaches Dan and Tom${first==='logic'?', and you':''}: acknowledge the feeling first; translate the story into what must be true, then constraints and criteria.`;
    const inv=$('r4invite'); if(inv) inv.classList.add('hide');   // only the owner invites (design choice)
    $('pcap').textContent='5 of 6 · Ring: Decision owner. Colour: core type. Hover or tap a circle for details; click for the profile.';
  }
  // leaving the guest room (any normal open of screen 4) clears the guest line
  const o4=window.openScreen4;
  window.openScreen4=function(k){ if(o4) o4(k); const b=$('guestBanner'); if(b) b.classList.add('hide'); const inv=$('r4invite'); if(inv) inv.classList.remove('hide'); GUEST=false; };
  window.openScreen13=function(k, name){ if(name) profile(name); step(k||STEP); };
  document.querySelectorAll('#main13 [data-g]').forEach(b=>b.addEventListener('click',()=>{ if(b.dataset.g==='room'){ guestRoom(); return; } step(b.dataset.g); }));
  document.addEventListener('click',e=>{
    const g=e.target.closest('#main13 [data-ggo]'); if(!g) return; e.preventDefault(); const k=g.dataset.ggo;
    if(k==='room'){ if(STEP==='consent' && !$('gAgree').checked){ $('gAgree').focus({preventScroll:true}); $('gAgree').closest('.jagree').classList.add('need'); return; } guestRoom(); return; }
    step(k);
  });
  $('gAgree').addEventListener('change',()=>{ $('gAgree').closest('.jagree').classList.remove('need'); });
  profile('Dan Mehta');
})();
