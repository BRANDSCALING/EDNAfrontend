/* ===== Mentor states: thinking and unavailable (BS-AI-003 §4.6 "Mentor unavailable"; BS-AI-003-R1: a three-dot line under the mentor's name; BS-AI-004 §: 30 s timeout, one retry, then the unavailable state) ===== */
(function(){
  const $=id=>document.getElementById(id);
  window.BS_MENTOR='live';
  const name=()=>{ const k=window.BS_CUR||'architect'; const n=$('m0name'); return n?n.textContent.trim():(k==='alchemist'||k==='alchlean'?'AI Alchemist':'AI Architect'); };
  // the thinking line: the mentor's name, three dots, what it is doing (no "typing")
  window.thinkHTML=function(what){ return `<span class="think" role="status" aria-live="polite"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="t13 sec">${what||'Reading your boxes'}</span></span>`; };
  // the unavailable card: one plain message, the boxes stay open, Check waits; nothing is charged (BS-AI-004 §: the credit is charged at Check)
  window.downHTML=function(kind){ const rv=kind==='review'; return `<div class="mdown" role="alert"><div class="t13 b">Your mentor is not available right now. ${rv?'Your answers are saved.':'Your boxes are saved.'}</div><div class="t13">${rv?'Your review stays open; come back later or try again now.':'Keep writing in the boxes and save; Check waits until your mentor is back.'} Nothing has been charged.</div><div class="btnrow" style="margin:8px 0 0"><button class="btn small primary" type="button" data-retry>Try again</button><button class="btn small secondary" type="button" data-go="3">Save and come back</button></div></div>`; };

  // a call with the backend's timing: 30 s, one retry ("Taking longer than usual, trying once more"), then the unavailable state
  window.mentorCall=async function(fn, onRetry){
    const once=()=>Promise.race([fn(), new Promise((_,rej)=>setTimeout(()=>rej(Object.assign(new Error('timeout'),{code:'timeout'})),30000))]);
    try{ return await once(); }
    catch(e){ if(e&&e.code==='not_granted') throw e; if(onRetry) onRetry(); return await once(); }
  };

  /* preview control: show the two states on whichever Frame is open */
  function apply(){
    const st=window.BS_MENTOR, n=window.BS_SCREEN;
    // launch Frame (Home, one box at a time)
    const m0=$('m0text'); if(m0){ if(st==='live'){ if(m0.dataset.keep!==undefined){ m0.innerHTML=m0.dataset.keep; delete m0.dataset.keep; } } else { if(m0.dataset.keep===undefined) m0.dataset.keep=m0.innerHTML; m0.innerHTML = st==='think' ? window.thinkHTML('Reading your boxes') : window.downHTML(); } }
    // full Frame (screen 2): a message in the thread
    const th=$('thread'); if(th){ let s=$('m2state'); if(st==='live'){ if(s) s.remove(); } else { if(!s){ s=document.createElement('div'); s.id='m2state'; th.appendChild(s); } s.className='msg mentor t19'+(st==='down'?' down':''); s.innerHTML= st==='think'? window.thinkHTML('Reading your boxes') : window.downHTML(); th.scrollTop=th.scrollHeight; } }
    // the room: the two mentor cards
    ['mAlchRoom','mArchRoom'].forEach(id=>{ const e=$(id); if(!e) return; if(st==='live'){ if(e.dataset.keep!==undefined){ e.innerHTML=e.dataset.keep; delete e.dataset.keep; } } else { if(e.dataset.keep===undefined) e.dataset.keep=e.innerHTML; e.innerHTML = st==='think' ? window.thinkHTML('Reading the room') : '<span class="mdown-line">Not available right now. Everyone’s entries are saved; Check waits.</span>'; } });
    // the review (screen 12): the chat
    const rc=$('rvChat'); if(rc){ let s=$('m12state'); if(st==='live'){ if(s) s.remove(); } else { if(!s){ s=document.createElement('div'); s.id='m12state'; rc.appendChild(s); } s.className='rvm'; s.innerHTML= st==='think'? window.thinkHTML('Reading your review') : window.downHTML('review'); } }
    document.querySelectorAll('[data-mentor]').forEach(b=>b.classList.toggle('on',b.dataset.mentor===st));
  }
  window.applyMentorState=apply;
  document.querySelectorAll('[data-mentor]').forEach(b=>b.addEventListener('click',()=>{ window.BS_MENTOR=b.dataset.mentor; apply(); }));
  document.addEventListener('click',e=>{ if(e.target.closest('[data-retry]')){ e.preventDefault(); window.BS_MENTOR='live'; apply(); } });
})();
