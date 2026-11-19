/* ===== Screen 9 (bar: 8 · Settings): profile, membership and credits, notifications, consent, screen, account (example data) ===== */
(function(){
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

  /* Membership and credits per preview tier (BS-AI-007 §2 proposals, §7 behaviour). Numbers are proposals for approval. */
  const MEM={
    free:{ chip:'Free', total:3, left:2, label:'free decisions to try the Frame', period:'', bar:true,
      grants:[['Free · 3 decisions, once','3','3 Nov 2026','No renewal']],
      note:'Free decisions are in the app only. Your Advanced Report (£99) comes with 10 decisions that do not expire while your account is open.', cancel:false, topup:'Get your Advanced Report · £99' },
    di:{ chip:'£99 · Decision Intelligence', total:10, left:6, label:'decisions left', period:'', bar:true,
      grants:[['Advanced Report · 10 decisions','10','3 Nov 2026','No expiry while your account is open']],
      note:'When these are used, top-up packs carry you on. A membership adds a monthly allowance.', cancel:false, topup:'Top up' },
    entry:{ chip:'Entry', total:60, left:53, label:'decisions left this month', period:' · resets on your billing date, 1 Dec 2026', bar:true,
      grants:[['Entry allowance · 60 a month','60','1 Nov 2026','1 Dec 2026 · unused do not roll over'],['Top-up pack','—','—','Never, while your membership is active']],
      note:'At most 10 decisions a day. If you cancel, your credits stay usable to the end of the paid period.', cancel:true, topup:'Top up' },
    out:{ chip:'Entry', total:60, left:0, label:'decisions left this month', period:' · resets on your billing date, 1 Dec 2026', bar:true,
      grants:[['Entry allowance · 60 a month','60','1 Nov 2026','1 Dec 2026 · unused do not roll over'],['Top-up pack','—','—','Never, while your membership is active']],
      note:'Your log, saved decisions and reviews stay open. Top up, or your allowance resets on 1 Dec 2026.', cancel:true, topup:'Top up' }
  };
  const LEDGER={
    architect:[['14 Nov','Raise the day rate for new clients from January'],['11 Nov','Take on the second office unit'],['6 Nov','Keep the Friday delivery slot'],['3 Nov','Change the invoicing day']],
    alchemist:[['14 Nov','Launch the membership before the course is finished'],['11 Nov','Bring a partner into the events side'],['6 Nov','Cancel the spring workshop'],['3 Nov','Rename the signature programme']],
    archlean:[['14 Nov','Move the shop to the high street unit'],['11 Nov','Hire a part-time bookkeeper'],['6 Nov','Drop the wholesale line'],['3 Nov','Open on Sundays in December']],
    alchlean:[['14 Nov','Move the shop to the high street unit'],['11 Nov','Hire a part-time bookkeeper'],['6 Nov','Drop the wholesale line'],['3 Nov','Open on Sundays in December']],
    mixed:[['14 Nov','Move the shop to the high street unit'],['11 Nov','Hire a part-time bookkeeper'],['6 Nov','Drop the wholesale line'],['3 Nov','Open on Sundays in December']]
  };

  /* Notification rows: [event, label on screen, push, email, locked, note]. true/false = switch and its default; null = that channel is not used for the event (BS-AI-009 §3). */
  const ROWS=[
    ['N1','Someone invites you to a Decision Room',true,true,false,''],
    ['N2','A decision needs your input',true,true,false,''],
    ['N3','Your room has new input',true,true,false,'Once per round, not per entry'],
    ['N4','A decision is waiting for you to confirm',true,true,false,'Resolve a clash only'],
    ['N5','A room decision is written to your log',true,null,false,'The log is in the app'],
    ['N6','A review is due',true,true,false,'Three questions with your mentor'],
    ['N7','A review is still waiting',true,true,false,'One reminder, 7 days later, then no more'],
    ['N8','A saved decision is waiting',null,null,false,'Shown on Home only, after 7 days; never sent'],
    ['N9','Credits running low',null,null,false,'Shown in the app only, below 20%'],
    ['N10','Your decisions for the period are used up',null,true,false,''],
    ['N11','Top-up receipt',null,true,true,'Always, with your payment'],
    ['N13','You are ready to retake Parts 1 to 3',true,true,false,'When your log meets the retake rule'],
    ['N14','You are removed from a room, or a room is closed',null,true,false,''],
    ['N15','Security and legal notices',true,true,true,'New device sign-in, email changed, terms changed. Cannot be switched off']
  ];
  const SCREEN=[['Font',['Inter','Verdana','Arial'],0],['Text size',['100%','125%','150%','200%'],0],['Spacing',['Standard','Extra line and letter spacing'],0],['Motion',['Standard','Reduced'],0],['Theme',['Light','Dark','High contrast'],0],['Transparency',['Standard','Reduced'],0]];

  function sw(on, locked, name, aria){
    if(on===null) return '<span class="t13 sec nouse" aria-label="Not used for this event">—</span>';
    return `<label class="sw"><input type="checkbox" role="switch" ${on?'checked':''} ${locked?'disabled':''} aria-label="${esc(aria)}" data-ev="${name}"><span class="knob" aria-hidden="true"></span></label>`;
  }

  window.openScreen9=function(cur){
    const T=window.BS_T[cur]; const find=T.mode==='find';
    $('typeChip9').textContent=T.chip;
    const first=$('s9first').value.trim(), last=$('s9last').value.trim();
    const ini=((first[0]||'')+(last[0]||'')).toUpperCase()||'?';
    const c=$('s9circle'); if(!c.dataset.photo){ c.textContent=ini; }
    c.className='pcircle big '+(cur==='architect'?'architect':cur==='alchemist'?'alchemist':'mixed');
    /* membership */
    const tier=window.BS_TIER||'di', m=MEM[tier], fresh=window.BS_ACCT==='new';
    const left=fresh?m.total:m.left, pct=Math.round(100*left/m.total);
    $('s9tier').textContent=m.chip;
    const cr=$('s9credits'); cr.className='credits'+(left===0?' out':pct<=20?' low':'');
    cr.innerHTML = left===0
      ? `<span><b>You have used your ${m.total} decisions this month.</b> Top up to carry on, or wait for your billing date. Your log and saved decisions stay open.</span>`
      : `<span><b>${left} of ${m.total}</b> ${m.label}${m.period}</span><span class="bar"><span style="width:${pct}%"></span></span><span class="chip ex">Proposed numbers</span>`;
    $('s9grants').innerHTML=m.grants.map(g=>`<tr><td>${g[0]}</td><td>${g[1]}</td><td>${g[2]}</td><td>${g[3]}</td></tr>`).join('');
    const used=m.total-left; const rows=fresh?[]:LEDGER[cur].slice(0,Math.min(4,used||4));
    let bal=left; const led=[]; rows.forEach(r=>{ led.push([r[0],r[1],'1',bal]); bal+=1; });
    $('s9ledger').innerHTML=led.map(r=>`<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')+(used>4&&!fresh?`<tr><td></td><td class="sec">All ${used} in your Decision log, one per row</td><td></td><td></td></tr>`:'');
    $('s9ledger').closest('table').classList.toggle('hide',led.length===0);
    $('s9ledgerEmpty').classList.toggle('hide',led.length>0);
    $('s9topup').textContent=m.topup; $('s9topup').dataset.buy = tier==='free' ? 'report' : 'topup';
    /* Upgrade rows: BS-WEB-003 §3 prices as cited in BS-AI-007 §2; credits are proposals. The current tier is not listed. */
    const TIERS=[['report','E-DNA Advanced Report','£99 one-off','10 decisions · your three workbooks'],['entry','Entry','£497 to join · £297 a month','60 decisions a month'],['expert','Expert','£497 to join · £497 a month','120 decisions a month'],['elite','Elite','£20,000 a year','300 decisions a month per seat · by application'],['enterprise','Enterprise','£50,000 a year','500 decisions a month per seat · by invitation']];
    const curTier = tier==='free'?'':tier==='di'?'report':'entry';
    $('s9tiers').innerHTML = TIERS.filter(x=>x[0]!==curTier && !(tier==='di'&&x[0]==='report')).map(x=>`<div class="crow"><div><div class="t13 b">${x[1]} <span class="t13 sec" style="font-weight:400">· ${x[2]}</span></div><div class="t13 sec">${x[3]}</div></div>${x[0]==='elite'||x[0]==='enterprise'?'<a href="#" class="t13 jlink">'+(x[0]==='elite'?'Apply':'Contact us')+'</a>':'<button class="btn secondary small" type="button" data-buy="'+x[0]+'">Choose</button>'}</div>`).join('')+'<div class="t13 sec" style="margin-top:6px">Allowances are proposed numbers (BS-AI-007 §2). Upgrading grants the new allowance at once; a downgrade applies at the next billing date.</div>';
    $('s9cancel').classList.toggle('hide',!m.cancel);
    $('s9mnote').textContent=m.note;
    /* subscription */
    const SUB={ free:{state:'No subscription',rows:[['Plan','Free · basic report and 3 decisions, once'],['Renews','Never']],btns:'<button class="btn primary small" type="button" data-buy="entry">Join Entry</button>'},
      di:{state:'No subscription',rows:[['Plan','Decision Intelligence · £99 one-off'],['Renews','Never · your 10 decisions do not expire']],btns:'<button class="btn primary small" type="button" data-buy="entry">Join Entry</button>'},
      entry:{state:'Active',rows:[['Plan','Entry · £297 a month'],['Next payment','1 Dec 2026 · £297 + VAT'],['Member since','1 Nov 2026 · £497 joining fee paid']],btns:'<button class="btn secondary small" type="button" data-buy="expert">Move to Expert</button><a href="#" class="t13 jlink">Cancel membership</a>'},
      out:{state:'Active',rows:[['Plan','Entry · £297 a month'],['Next payment','1 Dec 2026 · £297 + VAT'],['Member since','1 Nov 2026 · £497 joining fee paid']],btns:'<button class="btn secondary small" type="button" data-buy="expert">Move to Expert</button><a href="#" class="t13 jlink">Cancel membership</a>'} }[tier];
    $('s9substate').textContent=SUB.state; $('s9substate').className='chip '+(SUB.state==='Active'?'type':'grey');
    $('s9subrows').innerHTML=SUB.rows.map(r=>`<div class="crow"><div><div class="t13 b">${r[0]}</div><div class="t13 sec">${r[1]}</div></div></div>`).join('')+(SUB.state==='Active'?'<div class="t13 sec" style="margin-top:6px">Cancelling takes effect at the end of the paid month; your credits stay usable until then (BS-WEB-003 §6).</div>':'');
    $('s9subbtns').innerHTML=SUB.btns;
    /* receipts */
    const REC={ free:[], di:[['3 Nov 2026','E-DNA Advanced Report','£118.80']], entry:[['1 Nov 2026','Entry membership · first month','£356.40'],['1 Nov 2026','Entry joining fee','£596.40']], out:[['1 Nov 2026','Entry membership · first month','£356.40'],['1 Nov 2026','Entry joining fee','£596.40']] }[tier];
    const rec=fresh?[]:REC;
    $('s9receipts').innerHTML=rec.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><a href="#" class="jlink">PDF</a></td></tr>`).join('');
    $('s9receipts').closest('table').classList.toggle('hide',rec.length===0); $('s9receiptsEmpty').classList.toggle('hide',rec.length>0);
    $('s9cardline').textContent = tier==='free' ? 'No card on file' : 'Visa ending 4242 · expires 08/28';
    /* devices */
    const DEV=[['This device · Safari on iPhone','Signed in now','this'],['Chrome on MacBook','London · 2 days ago',''],['Brandscaling iOS app','Dubai · 9 Nov 2026','']];
    $('s9devices').innerHTML=DEV.map(d=>`<div class="crow"><div><div class="t13 b">${d[0]}</div><div class="t13 sec">${d[1]}</div></div>${d[2]?'<span class="chip type">Current</span>':'<button class="btn secondary small" type="button">Sign out</button>'}</div>`).join('');
    /* notifications */
    const ios=document.getElementById('frame').classList.contains('ios');
    $('s9chan').textContent = ios ? 'In the app · Push · Email' : 'In the app · Email (push messages come with the iOS app)';
    const head=`<div class="nrow head"><span class="t13 sec b">Event</span><span class="t13 sec b pushcol">Push</span><span class="t13 sec b">Email</span></div>`;
    $('s9rows').innerHTML = head + ROWS.filter(r=>r[0]!=='N13'||find).map(r=>
      `<div class="nrow"><span><span class="t13">${r[1]}</span>${r[5]?`<span class="t13 sec note">${r[5]}</span>`:''}</span><span class="pushcol">${sw(r[2],r[4],r[0]+'-push','Push: '+r[1])}</span><span>${sw(r[3],r[4],r[0]+'-email','Email: '+r[1])}</span></div>`).join('');
    /* consent: Part 5 and rooms */
    const p5=window.BS_P5||{}; const given = p5[cur]!==undefined ? p5[cur] : cur!=='archlean';   // Architect-leaning example has no Part 5 consent, as on My E-DNA
    $('s9p5').textContent = given ? 'Consent given 3 November 2026. Withdrawing deletes the stored comparison; it is not hidden.' : 'No consent given. The comparison is not shown in your report. You can give consent here.';
    $('s9p5btn').textContent = given?'Withdraw':'Give consent';
    const rooms = fresh?[]:[['Second office or stay put','Owner','3 Nov 2026'],['Launch date for the spring programme','Collaborator','9 Nov 2026']];
    $('s9rooms').innerHTML=rooms.map(r=>`<div class="crow"><div><div class="t13 b">${esc(r[0])}</div><div class="t13 sec">${r[1]} · consent given ${r[2]} · for this decision only</div></div>${r[1]==='Owner'?'<span class="t13 sec">Owner</span>':'<button class="btn secondary small" type="button">Leave room</button>'}</div>`).join('');
    $('s9roomsEmpty').classList.toggle('hide',rooms.length>0);
    /* screen settings */
    $('s9screen').innerHTML=SCREEN.map((s,i)=>`<div class="srow9"><span class="t13 b" id="ss${i}">${s[0]}</span><div class="sset" role="radiogroup" aria-labelledby="ss${i}">${s[1].map((o,j)=>`<button type="button" class="${j===s[2]?'on':''}" aria-pressed="${j===s[2]}">${o}</button>`).join('')}</div></div>`).join('');
  };

  document.addEventListener('click',e=>{
    const b=e.target.closest('.sset button'); if(b){ b.parentElement.querySelectorAll('button').forEach(x=>{x.classList.toggle('on',x===b); x.setAttribute('aria-pressed',String(x===b));}); return; }
    if(e.target.closest('#s9upload')){ const c=$('s9circle'); c.dataset.photo='1'; c.innerHTML='<svg viewBox="0 0 72 72" width="72" height="72" aria-hidden="true"><rect width="72" height="72" fill="#F8F4EF"/><circle cx="36" cy="28" r="12" fill="#B7B8BD"/><path d="M12 66c3-14 13-20 24-20s21 6 24 20z" fill="#B7B8BD"/></svg>'; $('s9remove').classList.remove('hide'); return; }
    if(e.target.closest('#s9remove')){ const c=$('s9circle'); delete c.dataset.photo; $('s9remove').classList.add('hide'); window.openScreen9(window.BS_CUR||'architect'); return; }
    if(e.target.closest('#s9p5btn')){ const b=$('s9p5btn'); const cur=window.BS_CUR||'architect'; window.BS_P5=window.BS_P5||{}; const wasGiven=b.textContent==='Withdraw';
      if(wasGiven && !b.dataset.confirm){ b.dataset.confirm='1'; b.textContent='Yes, delete the comparison'; $('s9p5').textContent='This deletes the stored Part 5 comparison from your report. Your Part 5 result stays. Press again to confirm.'; return; }
      delete b.dataset.confirm; window.BS_P5[cur]=!wasGiven; window.openScreen9(cur); return; }
  });
  ['s9first','s9last'].forEach(id=>$(id).addEventListener('input',()=>{ if(!$('s9circle').dataset.photo) window.openScreen9(window.BS_CUR||'architect'); }));
})();
