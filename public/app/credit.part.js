/* ===== Credits: the top-up sheet and the out-of-credits state on every screen that spends a credit (BS-AI-007 §4, §7) ===== */
(function(){
  const $=id=>document.getElementById(id);
  // BS-AI-007 §4 (proposed): 10 for £15, 30 for £36, 100 for £100 (Entry and above). No pack below £1.00 a credit.
  const PACKS=[{n:10,price:15,who:'any paid tier'},{n:30,price:36,who:'any paid tier'},{n:100,price:100,who:'Entry and above'}];
  const BAL={free:[2,3,'free decisions'],di:[6,10,'decisions'],entry:[53,60,'decisions this month'],out:[0,60,'decisions this month']};
  let PICK=1;
  function render(){
    const tier=window.BS_TIER||'di', b=BAL[tier]||BAL.di;
    $('tuBal').textContent = b[0]===0 ? `You have used your ${b[1]} ${b[2]}. Your allowance resets on 1 Dec 2026.` : `You have ${b[0]} of ${b[1]} ${b[2]} left.`;
    $('tuPacks').innerHTML = PACKS.map((p,i)=>{ const ok = !(p.who==='Entry and above' && tier==='di');
      return `<button class="pack${i===PICK?' sel':''}${ok?'':' off'}" type="button" role="radio" aria-checked="${i===PICK}" data-pack="${i}" ${ok?'':'aria-disabled="true"'}><span class="t19 b">${p.n} decisions</span><span class="t13">£${p.price} + VAT · £${(p.price/p.n).toFixed(2)} each</span><span class="t13 sec">${ok?p.who==='Entry and above'?'Entry and above':'':'Entry membership and above'}</span></button>`; }).join('');
    const p=PACKS[PICK]; $('tuGo').textContent=`Continue to payment · £${p.price} + VAT`;
  }
  function open(){
    const tier=window.BS_TIER||'di';
    if(tier==='free'){ window.showScreen(10); window.openScreen10('order','report'); return; }   // Free has no packs: the £99 report is the way on (BS-AI-007 §2, §4)
    if(tier==='di' && PICK===2) PICK=1;
    render();
    const m=$('topupSheet'), f=$('frame'); m.style.top = f.classList.contains('phone') ? ((f.scrollTop - m.parentElement.offsetTop)+'px') : ''; m.classList.remove('hide'); $('tuStay').focus({preventScroll:true});
  }
  function close(){ $('topupSheet').classList.add('hide'); }
  document.addEventListener('click',e=>{
    const t=e.target;
    if(t.closest('[data-buy="topup"]') || t.closest('.credits a') || t.closest('.outbar [data-topup]')){ e.preventDefault(); e.stopImmediatePropagation(); open(); return; }
    const pk=t.closest('#tuPacks .pack'); if(pk){ if(pk.classList.contains('off')) return; PICK=Number(pk.dataset.pack); render(); return; }
    if(t.closest('#tuStay') || t===$('topupSheet')){ close(); return; }
    if(t.closest('#tuGo')){ const p=PACKS[PICK]; close(); if(window.setTopupPack) window.setTopupPack(p.n,p.price); window.showScreen(10); window.openScreen10('order','topup'); return; }
  }, true);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });

  /* out of credits: a notice on every screen where a credit would be spent; the boxes and Check greyed; the log, saved decisions and reviews stay open (BS-AI-007 §7) */
  const LINE='You have used this month’s decisions. Top up, or come back on 1 December. Your log is open.';
  const WHERE={2:'the Frame',5:'Make a decision',4:'Decision rooms'};
  window.applyCredits=function(n){
    const out=(window.BS_TIER||'di')==='out';
    [2,5,4].forEach(k=>{
      const m=$('main'+k); if(!m) return; m.classList.toggle('credit-out',out);
      let bar=m.querySelector('.outbar');
      if(out && !bar){ bar=document.createElement('div'); bar.className='outbar'; bar.setAttribute('role','status');
        bar.innerHTML=`<div><div class="t13 b">You have used your 60 decisions this month</div><div class="t13">${k===4?'You can still read the room and add input in Box 2 and Box 3; Check waits for a credit. ':''}Top up to carry on, or your allowance resets on 1 December 2026. Your log, saved decisions and reviews stay open.</div></div><div class="btnrow" style="margin:0"><button class="btn small primary" type="button" data-topup>Top up</button><button class="btn small secondary" type="button" data-go="3">Open my log</button></div>`;
        const h=m.querySelector('.hdr'); if(h&&h.parentElement===m) h.insertAdjacentElement('afterend',bar); else m.insertBefore(bar,m.firstChild); }
      if(bar) bar.classList.toggle('hide',!out);
    });
    // the mentor's one line, no sales language (BS-AI-007 §7)
    const ml=$('mline0'); if(ml && n===1){ if(out){ ml.dataset.keep=ml.dataset.keep||ml.textContent; ml.textContent=LINE; } else if(ml.dataset.keep){ ml.textContent=ml.dataset.keep; delete ml.dataset.keep; } }
  };
})();
