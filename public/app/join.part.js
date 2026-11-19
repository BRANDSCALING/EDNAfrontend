/* ===== Screen 10 (bar: 9 · Join and sign in) and the sign-out pop-up. Example data; no payment is taken in the preview. ===== */
(function(){
  const $=id=>document.getElementById(id);
  let STEP='gate', SITE='uk';
  /* Products: the Advanced Report (BS-DI-003 §9.1; BS-WEB-003 §3) and the membership tiers (BS-WEB-003 §3 prices as cited in BS-AI-007 §2). Credits are proposals. */
  const PRODUCTS={
    report:{ name:'E-DNA Advanced Report', sub:'Seven parts · your three workbooks · 10 decisions with your AI mentor', price:99, kind:'one-off' },
    entry:{ name:'Entry membership', sub:'£497 to join, then £297 a month · 60 decisions a month', price:497, kind:'join', monthly:297 },
    expert:{ name:'Expert membership', sub:'£497 to join, then £497 a month · 120 decisions a month', price:497, kind:'join', monthly:497 },
    topup:{ name:'30 top-up decisions', sub:'£1.20 a decision · do not expire while your membership is active (BS-AI-007 §4, proposed)', price:36, kind:'pack' }
  };
  let PROD='report', COUPON=false;
  window.setTopupPack=function(n,price){ PRODUCTS.topup={ name:n+' top-up decisions', sub:'£'+(price/n).toFixed(2)+' a decision · do not expire while your membership is active (BS-AI-007 §4, proposed)', price:price, kind:'pack' }; };
  const gbp=n=>'£'+n.toFixed(2);
  function order(){
    const p=PRODUCTS[PROD]; const vat=SITE==='uk'?0.2:0;
    const sub=COUPON?0:p.price, tax=Math.round(sub*vat*100)/100, tot=sub+tax;
    $('j5sub').innerHTML=`<b class="ind jbig">£${p.price}</b> ${vat?'+ VAT':''} · ${p.name}`;
    $('jitems').innerHTML=`<tr><td><span class="jradio" aria-hidden="true"></span><b>${p.name}</b></td><td>1</td><td>£${p.price}${vat?' + VAT':''}</td></tr>`;
    let h=`<tr><td>${p.name}</td><td>1</td><td class="ind b">${gbp(p.price)}</td></tr>`;
    if(COUPON) h+=`<tr><td>Coupon EDNATEAM100 · 100% off</td><td></td><td class="ind b">−${gbp(p.price)}</td></tr>`;
    h+=`<tr><td class="b">Order Subtotal</td><td></td><td class="ind b">${gbp(sub)}</td></tr>`;
    if(vat) h+=`<tr><td class="b">General VAT (20%)</td><td></td><td class="ind b">${gbp(tax)}</td></tr>`;
    if(p.kind==='join') h+=`<tr><td class="sec" colspan="3">Then ${gbp(p.monthly)} a month${vat?' plus VAT':''}, from your first billing date. Cancel at any time; the change takes effect at the end of the paid month.</td></tr>`;
    $('jsummary').innerHTML=h;
    $('jtotal').textContent=gbp(tot);
    const co=$('j5co'); if(co) co.value = SITE==='uk'?'United Kingdom':'United Arab Emirates';
    const cw=$('jcurwrap'); if(cw){ cw.classList.toggle('hide',SITE!=='ai'); const cur=$('jcur'); if(SITE==='ai' && cur && cur.value==='aed'){ $('jtotal').textContent='AED —'; $('j5sub').innerHTML=`<b class="ind jbig">AED —</b> · ${p.name} <span class="chip ex">AED amounts to be set</span>`; } }   // brandscalingai.com prices in AED with GBP in a drop-down (Fariza Javed, 19 Nov)   // Country default follows the site (Fariza Javed, 19 Nov)
    $('jsite').innerHTML=(SITE==='uk'?'brandscaling.co.uk · Brand Scaling Limited · VAT 20%':'brandscalingai.com · Brandscaling Ai Ltd · no VAT')+' <span class="chip ex">Preview: site</span>';
    $('j5pay').textContent = PROD==='report' ? 'Get my Advanced Report' : PROD==='topup' ? 'Add my credits' : 'Join '+p.name.replace(' membership','');
    $('j6line').textContent = PROD==='report' ? 'Your Advanced Report, your three workbooks and 10 decisions with your AI mentor are unlocked.' : PROD==='topup' ? 'Your credits have been added. Your balance updates in a moment.' : 'Your membership is active. Your monthly decisions are in your account now.';
  }
  function step(k){
    STEP=k;
    document.querySelectorAll('#main10 [data-jv]').forEach(s=>s.classList.toggle('hide',s.dataset.jv!==(k==='idle'?'gate':k)));
    document.querySelectorAll('#main10 [data-j]').forEach(b=>b.classList.toggle('on',b.dataset.j===k));
    if(k==='order') order();
    $('frame').classList.toggle('auth', k!=='welcome'&&k!=='next');   // welcome: a result exists, so the type colour drives the chrome
    if(k==='idle'){ const m=$('idleModal'); const f=$('frame'); m.style.top = f.classList.contains('phone') ? ((f.scrollTop - m.parentElement.offsetTop)+'px') : ''; m.classList.remove('hide'); } else { const m=$('idleModal'); if(m) m.classList.add('hide'); }
    if(k==='next'){ const T=window.BS_T[window.BS_CUR||'architect']; $('j11line').textContent=T.result+' Your report is saved in your account under My reports.'; const lead=T.mode==='find'?(T.lean==='feeling'?'AI Alchemist leads':T.lean==='logic'?'AI Architect leads':'AI Architect and AI Alchemist both work with you'):(T.primary==='alch'?'AI Alchemist':'AI Architect')+' takes you through it'; $('j11m').textContent='Bring any decision. '+lead+' in your order, one box at a time, and tells you what it rests on. You decide. Your first 3 decisions are free.'; }
    if(k==='welcome'){ const T=window.BS_T[window.BS_CUR||'architect']; $('j10line').textContent=T.result+' Three things to know before you start.'; const m=T.mode==='find'?(T.lean==='feeling'?'AI Alchemist leads':T.lean==='logic'?'AI Architect leads':'AI Architect and AI Alchemist both work with you'):(T.loops[0].first==='logic'?'AI Architect takes you through it':'AI Alchemist takes you through it'); $('j10m').textContent='Bring any decision. '+m+' in your order, one step at a time, and tells you what it rests on. You decide.'; }
    $('frame').scrollTop=0;
  }
  window.openScreen10=function(k, prod){ if(prod){ PROD=prod; COUPON=false; const c=$('j5c'); if(c) c.value=''; } step(k||STEP); };
  document.querySelectorAll('#main10 [data-j]').forEach(b=>b.addEventListener('click',()=>step(b.dataset.j)));
  const jc=document.getElementById('jcur'); if(jc) jc.addEventListener('change',order);
  document.addEventListener('click',e=>{
    const g=e.target.closest('[data-jgo]'); if(g){ e.preventDefault(); const k=g.dataset.jgo;
      if(k==='welcome'){ step('welcome'); return; }
      if(k==='home'){ window.BS_ACCT='new'; document.querySelectorAll('[data-acct]').forEach(x=>x.classList.toggle('on',x.dataset.acct==='new')); window.showScreen(1); return; }
      if(k==='report'){ note('Opens the free report (BS-DI-005; built in the E-DNA assessment preview), then "What comes next" with Get my Advanced Report.'); window.showScreen(7); return; }
      if(k==='reports'){ window.showScreen(7); return; }
      if(k==='sent'){ const e=($('j1e').value||'').trim()||'you@company.com'; $('j7e').textContent=e; step('sent'); return; }
      step(k); return; }
    if(e.target.closest('#j4send')){ $('j4sent').classList.remove('hide'); return; }
    if(e.target.closest('#j5apply')){ const v=($('j5c').value||'').trim().toUpperCase(); COUPON = v==='EDNATEAM100'; order(); if(!COUPON && v) note('Preview: only EDNATEAM100 is recognised here.'); return; }
    if(e.target.closest('[data-site]')){ SITE=e.target.closest('[data-site]').dataset.site; document.querySelectorAll('[data-site]').forEach(x=>x.classList.toggle('on',x.dataset.site===SITE)); if(STEP==='order') order(); return; }
    /* sign-out pop-up, from Settings */
    if(e.target.closest('#s9signout')){ const m=$('signoutModal'); const f=$('frame'); m.style.top = f.classList.contains('phone') ? ((f.scrollTop - m.parentElement.offsetTop)+'px') : ''; m.classList.remove('hide'); $('soStay').focus({preventScroll:true}); return; }
    if(e.target.closest('#idleStay')){ $('idleModal').classList.add('hide'); step('gate'); return; }
    if(e.target.closest('#soStay')){ $('signoutModal').classList.add('hide'); return; }
    if(e.target.closest('#soConfirm')){ $('signoutModal').classList.add('hide'); window.showScreen(10); step('signin'); return; }
    if(e.target===$('signoutModal')){ $('signoutModal').classList.add('hide'); return; }
    if(e.target.closest('#s9delete')){ e.preventDefault(); const m=$('deleteModal'); const f=$('frame'); m.style.top = f.classList.contains('phone') ? ((f.scrollTop - m.parentElement.offsetTop)+'px') : ''; m.classList.remove('hide'); $('delStay').focus({preventScroll:true}); return; }
    if(e.target.closest('#delStay') || e.target===$('deleteModal')){ $('deleteModal').classList.add('hide'); return; }
    if(e.target.closest('#delConfirm')){ $('deleteModal').classList.add('hide'); note('Deletion requested: the account is removed in 14 days unless the person signs in; a confirmation email is sent (design choice).'); return; }
    /* upgrade and top-up from Settings */
    const tile=e.target.closest('.jtile'); if(tile){ document.querySelectorAll('.jtile').forEach(x=>x.classList.toggle('on',x===tile)); }
    const u=e.target.closest('[data-buy]'); if(u){ e.preventDefault(); window.showScreen(10); window.openScreen10('order',u.dataset.buy); return; }
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ $('signoutModal').classList.add('hide'); $('deleteModal').classList.add('hide'); } });
  function note(t){ const el=$('frameNote'); const keep=el.textContent; el.textContent=t; setTimeout(()=>{ el.textContent=keep; },4000); }
})();
