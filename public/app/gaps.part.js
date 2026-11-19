/* ===== Gap states (app-design chat, v60): payment failed and cancelled, no password yet, email change, terms record, guest after day 7, idle warning, cookie banner, offline and error ===== */
(function(){
  const $=id=>document.getElementById(id);
  window.BS_SUBST='ok'; window.BS_CONN='online';

  /* ---- Subscription states on Settings (preview chips in the panel): ok · failed (A8, dunning) · cancelled (A10) ---- */
  function subState(){
    const st=window.BS_SUBST, tier=window.BS_TIER||'di'; const paid=(tier==='entry'||tier==='out');
    document.querySelectorAll('[data-subst]').forEach(b=>b.classList.toggle('on',b.dataset.subst===st));
    if(!paid || st==='ok') return;
    const chip=$('s9substate'), rows=$('s9subrows'), btns=$('s9subbtns'); if(!chip) return;
    if(st==='failed'){
      chip.textContent='Payment failed'; chip.className='chip ex';
      rows.innerHTML=[['Plan','Entry · £297 a month'],['Payment failed','1 Dec 2026 · £297 + VAT · the card was declined'],['We try again','4 Dec and 8 Dec 2026, on the same card'],['If it still fails','Your membership pauses on 8 Dec. Your log, reports and workbooks stay open; new decisions wait until a payment goes through. Nothing is deleted.']].map(r=>`<div class="crow"><div><div class="t13 b">${r[0]}</div><div class="t13 sec">${r[1]}</div></div></div>`).join('');
      btns.innerHTML='<button class="btn primary small" type="button">Update card</button><button class="btn secondary small" type="button">Try the payment again</button>';
    } else {
      chip.textContent='Ends 30 Nov 2026'; chip.className='chip grey';
      rows.innerHTML=[['Plan','Entry · £297 a month · cancelled on 19 Nov 2026'],['Ends','30 Nov 2026 · no further payments'],['Until then','Your decisions and top-up credits stay usable. After that, your log, reports and basic E-DNA stay open to read; new decisions need the £99 report credits or a membership.'],['Rejoin','Any time. Within 6 months your credits and workbooks are kept as they were (BS-WEB-003 §6).']].map(r=>`<div class="crow"><div><div class="t13 b">${r[0]}</div><div class="t13 sec">${r[1]}</div></div></div>`).join('');
      btns.innerHTML='<button class="btn primary small" type="button">Keep my membership</button>';
    }
  }
  const o9=window.openScreen9; window.openScreen9=function(k){ if(o9) o9(k); subState(); emailBox(false); };
  document.addEventListener('click',e=>{ const b=e.target.closest('[data-subst]'); if(b){ window.BS_SUBST=b.dataset.subst; subState(); banners(window.BS_SCREEN); } });

  /* ---- Email change (Settings · Profile): a link to the new address; the old address is told (N15); password required ---- */
  function emailBox(show){ const b=$('s9emailBox'); if(b) b.classList.toggle('hide',!show); }
  document.addEventListener('click',e=>{ const c=e.target.closest('#s9emailChange'); if(c){ e.preventDefault(); emailBox($('s9emailBox').classList.contains('hide')); } const s=e.target.closest('#s9emailSend'); if(s){ e.preventDefault(); $('s9emailSent').classList.remove('hide'); } });

  /* ---- Banners on Home: payment failed (A8) · set your password (new account, A3) · deletion pending (A11) ---- */
  function banners(n){
    const home=$('main0'); if(!home) return;
    let b=$('homeBanners'); if(!b){ b=document.createElement('div'); b.id='homeBanners'; const h=home.querySelector('.hdr'); h.insertAdjacentElement('afterend',b); }
    const items=[];
    if(window.BS_SUBST==='failed' && (window.BS_TIER==='entry'||window.BS_TIER==='out')) items.push(`<div class="gban warn"><div><div class="t13 b">Your payment did not go through</div><div class="t13">We try your card again on 4 December. Update the card to keep your decisions running.</div></div><div class="btnrow" style="margin:0"><button class="btn small primary" type="button" data-go="settings">Update card</button></div></div>`);
    if(window.BS_ACCT==='new') items.push(`<div class="gban"><div><div class="t13 b">Set your password to sign in from another device</div><div class="t13 sec">We emailed a link to sample@example.com. Until you set one, you stay signed in on this device only, and exporting, joining a room or changing your card waits.</div></div><div class="btnrow" style="margin:0"><button class="btn small secondary" type="button">Send it again</button></div></div>`);
    b.innerHTML=items.join('');
  }
  const o0=window.openLaunch; window.openLaunch=function(k){ if(o0) o0(k); banners(1); };

  /* ---- Connection: offline and error (preview bar · Connection) ---- */
  function conn(n){
    const st=window.BS_CONN; let bar=$('connBar');
    if(st==='online'){ if(bar) bar.remove(); return; }
    if(!bar){ bar=document.createElement('div'); bar.id='connBar'; bar.setAttribute('role','status'); }
    bar.className='gban '+(st==='offline'?'grey':'warn');
    bar.innerHTML = st==='offline'
      ? `<div><div class="t13 b">You are offline</div><div class="t13">What you write is kept on this device and sent when you are back. Your mentor needs a connection; everything else here can be read.</div></div>`
      : `<div><div class="t13 b">Something went wrong on our side</div><div class="t13">Nothing you wrote is lost. Try again, or come back in a few minutes. If it keeps happening, email support@brandscaling.co.uk.</div></div><div class="btnrow" style="margin:0"><button class="btn small primary" type="button" data-conn="online">Try again</button></div>`;
    const m=document.querySelector('.main:not(.hide)'); if(!m) return;
    const h=m.querySelector(':scope > .hdr'); if(h) h.insertAdjacentElement('afterend',bar); else m.insertBefore(bar,m.firstChild);
  }
  document.addEventListener('click',e=>{ const b=e.target.closest('[data-conn]'); if(b){ window.BS_CONN=b.dataset.conn; document.querySelectorAll('.bar [data-conn]').forEach(x=>x.classList.toggle('on',x.dataset.conn===window.BS_CONN)); conn(window.BS_SCREEN); } });

  /* ---- Cookie banner on the website steps (BS-WEB-005): web only, essential cookies run the test and sign-in; analytics only if allowed ---- */
  let COOKIE=false;
  function cookie(){ const c=$('cookieBar'); if(!c) return; const f=$('frame'); const web=!f.classList.contains('ios'); const pre=f.classList.contains('noshell'); c.classList.toggle('hide', COOKIE||!web||!pre); }
  document.addEventListener('click',e=>{ if(e.target.closest('#cookieBar [data-cookie]')){ COOKIE=true; cookie(); } });

  /* rooms open with Entry and above (Fariza Javed, 19 Nov): Free and the £99 report can join a room they are invited to, not open one */
  function roomsGate(n){
    const tier=window.BS_TIER||'di', can=(tier==='entry'||tier==='out');
    const nr=$('newRoom'), inv=$('r4invite'), cta=$('ctaRoom');
    if(nr){ nr.textContent=can?'+ New room':'Rooms open with Entry · Join'; if(can) delete nr.dataset.buy; else nr.dataset.buy='entry'; }
    if(inv){ inv.textContent=can?'Invite · up to 6':'Invite with Entry'; if(can) delete inv.dataset.buy; else inv.dataset.buy='entry'; }
    if(cta){ cta.textContent=can?'Invite someone to a decision':'Decide with others · from Entry'; if(can) delete cta.dataset.buy; else cta.dataset.buy='entry'; }
  }
  document.addEventListener('click',e=>{ const b=e.target.closest('#newRoom,#r4invite,#ctaRoom'); if(b&&b.dataset.buy){ e.preventDefault(); e.stopImmediatePropagation(); window.showScreen(10); window.openScreen10('order',b.dataset.buy); } },true);
  window.applyGaps=function(n){ banners(n); roomsGate(n); setTimeout(()=>{ conn(n); cookie(); },0); };
})();
