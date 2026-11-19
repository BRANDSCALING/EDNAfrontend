/* ===== Screen 11 (bar: 10 · Notifications): every message the app sends, where it appears and when. BS-AI-009 §3–§5 plus the events added in the app-design chat (A1–A12, proposed). Example data. ===== */
(function(){
  const $=id=>document.getElementById(id);
  /* [id, group, event (everyday words), trigger, in-app, push (iOS), email subject, email body, source] — null = channel not used */
  const E=[
    ['N1','Decision rooms','Invited to a room','The owner sends an invitation','Needs you row · rooms badge','[Name] invited you to decide: [decision]','[Name] invited you to a decision','[Name] has opened a Decision Room for "[decision]" and asked for your input. Joining shares your name, core type, loop and your entries with the people in that room, for this decision only. → Open the room','BS-AI-009 N1'],
    ['N2','Decision rooms','Your input is needed','The owner opens a round','Needs you row · badge','[Decision]: add your [Feeling]','A decision needs your input','"[Decision]" is waiting for your [Feeling] in Box 2. Add it in your own words; your mentor is there if you want it. → Add your input','BS-AI-009 N2'],
    ['N3','Decision rooms','Your room has new input','A collaborator adds; once per round','Needs you row · badge','[Name] added to [decision]','Your decision has new input','[Name] has added to "[decision]". When everyone has added, your End with and your decision are next. → Open the room','BS-AI-009 N3'],
    ['N4','Decision rooms','Confirm the decision (clash)','The owner writes Box 4 and the rule','Needs you row','[Name] wrote the decision: confirm or reply','A decision is waiting for you to confirm','[Name] has written the decision and the rule for "[decision]". Confirm it, or add what is missing. → Read and confirm','BS-AI-009 N4'],
    ['N5','Decision rooms','Room decision in your log','The owner’s Check','Log row · badge clears','Decided: [decision] · review [date]',null,null,'BS-AI-009 N5'],
    ['N6','Decisions','Review due','The review date on a log row','Needs you row','Review: [decision] · 3 questions with [mentor]','Time to review a decision','On [date] you decided "[decision]". Three questions with [mentor]: did it hold, what did you learn, what would you do differently. Takes five minutes. → Review it','BS-AI-009 N6'],
    ['N7','Decisions','Review still waiting','7 days after N6, once','Needs you row stays','Still to review: [decision]','One decision is still waiting for its review','The review of "[decision]" is open. If the decision has changed, say so there; the log keeps both. → Review it','BS-AI-009 N7'],
    ['N8','Decisions','Saved decision waiting','A Frame saved 7 days','Home line "In the Frame · 8 days"',null,null,null,'BS-AI-009 N8 (shown, never sent)'],
    ['N9','Credits','Credits running low','Balance under 20%','Amber bar on Home and Settings',null,null,null,'BS-AI-009 N9 (in-app only)'],
    ['N10','Credits','Decisions used up','Balance reaches zero','Out-of-credits state',null,'You have used this month’s decisions','Your [n] decisions for this period are used. Your log, saved decisions and reviews stay open. Top up, or your allowance resets on [date]. → Top up','BS-AI-009 N10'],
    ['N11','Payments','Receipt','A payment succeeds (Stripe)','Balance updates · receipt in Settings',null,'Your Brandscaling receipt','Receipt from Stripe with the item, amount, VAT and the Membership Terms. → View receipt','BS-AI-009 N11; BS-WEB-003 §4'],
    ['N12','Guests','Guest days left','Day 5 and day 7 of guest access','"Guest access · 2 days left"','2 days of guest access left · Guest access ends today','Two days left on your guest access · Your guest access ends today','Day 5: you have the Frame and your mentors until [date]; keep them with your Advanced Report (£99) or a membership. Day 7: thank you for deciding with [Name]; your E-DNA result and basic report stay yours. → See the options / Keep the app','BS-AI-009 N12'],
    ['N13','E-DNA','Ready to retake','The log meets the retake rule','Retake button on Home and My E-DNA','Your log says you are ready to retake Parts 1 to 3','You are ready to retake Parts 1 to 3','Your log shows [n] decisions, [m] held in the loop they began with. That is the rule for a retake. → Retake Parts 1 to 3','BS-AI-009 N13'],
    ['N14','Decision rooms','Removed from a room / room closed','The owner removes a person or closes the room','Rooms list updates',null,'A room has closed','The room "[decision]" has closed [or: you were removed from it]. Nothing from the room is included in this email. → Open the app','BS-AI-009 N14'],
    ['N15','Security','Security and legal notices','New-device sign-in · email changed · password changed · terms changed','Notice banner','New sign-in to your account · Your email was changed','New sign-in to your Brandscaling account · Your email address was changed · Your password was changed · Our terms have changed','One paragraph naming the device, place and time, or the change, with one line: if this was not you, secure your account. Sent to both addresses on an email change. Cannot be switched off. → Review my devices','BS-AI-009 N15; BS-WEB-004'],
    ['A1','E-DNA','Carry on where you left off (resume link)','"Save my progress" during the test','Save line under the progress bar',null,'Carry on with your E-DNA','Your E-DNA is saved at Part [n]. This link opens it where you left it, on any device, for 24 hours. → Carry on','App-design chat, 19 Nov (proposed)'],
    ['A2','E-DNA','Unfinished test, one reminder','24 hours after A1 with no finish, once','—',null,'Your E-DNA is waiting','You are [n] parts from your free report. The link below opens the test where you left it. → Finish my E-DNA','App-design chat, 19 Nov (proposed)'],
    ['A3','Account','Set your password','"Take me to my report" or a purchase creates the account','Line above the report',null,'Set your Brandscaling password','Hi [first name], your free E-DNA report is in your account. Set a password so you can sign in from any device. The link works for 24 hours. If this was not you, ignore this email. → Set my password','App-design chat, 19 Nov (proposed)'],
    ['A4','Account','Sign-in link','"Email me a sign-in link" or "Forgotten your password?"','"Sent" note on the sign-in page',null,'Your Brandscaling sign-in link','This link signs you in and lets you set or change your password. It works for one hour and once only. If you did not ask for it, ignore this email. → Sign in','App-design chat, 19 Nov (proposed)'],
    ['A5','Account','Two-step code','A sign-in on a new device with two-step on','Code screen',null,'Your Brandscaling code: [123456]','Enter this code to finish signing in. It works for 10 minutes. If you did not try to sign in, change your password. (no link)','App-design chat, 19 Nov (proposed)'],
    ['A6','Account','Your free report','The report is claimed at the gate','—',null,'Your free E-DNA report','Hi [first name], your report is in your account: [one line of the Part 1 result in everyday words]. Open it any time. → Open my report','App-design chat, 19 Nov (proposed)'],
    ['A7','Payments','Order complete','A purchase unlocks the report, workbooks and credits','Order complete screen',null,'Your Advanced Report is unlocked','Your Advanced Report, your three workbooks and 10 decisions with your AI mentor are ready. Your receipt is attached. → Open my Advanced Report','App-design chat, 19 Nov (proposed; may be merged with N11)'],
    ['A8','Payments','Payment failed','A renewal or top-up card payment fails (Stripe)','Red banner on Home and Settings · Update card','Your payment did not go through','We could not take your payment','Your card for the [tier] membership was declined on [date]. Update your card within 7 days to keep your decisions; your log and reports stay open either way. → Update my card','App-design chat, 19 Nov (proposed)'],
    ['A9','Payments','Renewal coming','7 days before a monthly or yearly charge','—',null,'Your membership renews on [date]','Your [tier] membership renews on [date] for £[amount] + VAT. Nothing to do if you want to continue. To change or cancel, open Settings · Subscription. → Manage my membership','App-design chat, 19 Nov (proposed; the Stripe checklist asks for a reminder before a charge)'],
    ['A10','Payments','Membership cancelled','The person cancels in Settings','Subscription panel shows the end date',null,'Your membership is cancelled','Your [tier] membership ends on [date]. Until then everything stays open, including your decisions this month. Your log, reports and workbooks stay in your account after that. → Open the app','App-design chat, 19 Nov (proposed)'],
    ['A11','Account','Account deletion','Deletion requested; then done after 14 days','Banner: "Deletion on [date] · sign in to cancel"',null,'Your account will be deleted on [date] · Your account has been deleted','First email: what is removed and that signing in before [date] cancels it. Second email: it is done; nothing of yours remains except what the law requires us to keep (receipts). (no link on the second)','App-design chat, 19 Nov (proposed)'],
    ['A12','Session','Idle warning (web)','25 minutes without activity during the test or at the gate','Toast: "Still there? Your answers clear in 5 minutes." with Keep going',null,null,null,'App-design chat, 19 Nov (proposed)'],
    ['A13','Mentor','Mentor unavailable','The mentor service does not answer','Banner on the Frame: "Your mentor is not available right now. Your boxes are saved."',null,null,null,'BS-AI-003 §4.6'],
  ];
  const GROUPS=['Account','Session','E-DNA','Decisions','Decision rooms','Credits','Payments','Guests','Security','Mentor'];
  const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  function render(view){
    document.querySelectorAll('#main11 [data-nv]').forEach(b=>b.classList.toggle('on',b.dataset.nv===view));
    const host=$('nhost'); let h='';
    if(view==='map'){
      h+='<div class="t13 sec" style="margin-bottom:8px">One event, one message, every channel the person has on; never twice on one channel (BS-AI-009 §2). In-app always; push on iOS when allowed; email when the setting is on. Security notices and receipts cannot be switched off.</div>';
      h+='<div class="nmap"><div class="nmh t13 sec b">Event</div><div class="nmh t13 sec b">When</div><div class="nmh t13 sec b">In the app</div><div class="nmh t13 sec b pushcol">Push (iOS)</div><div class="nmh t13 sec b">Email</div>';
      GROUPS.forEach(g=>{ const rows=E.filter(e=>e[1]===g); if(!rows.length) return; h+=`<div class="nmg t13 b">${g}</div>`; rows.forEach(e=>{ h+=`<div class="t13"><b>${e[0]}</b> ${esc(e[2])}</div><div class="t13 sec">${esc(e[3])}</div><div class="t13">${e[4]?esc(e[4]):'<span class="sec">—</span>'}</div><div class="t13 pushcol">${e[5]?esc(e[5]):'<span class="sec">—</span>'}</div><div class="t13">${e[6]?'<b>'+esc(e[6])+'</b>':'<span class="sec">—</span>'}</div>`; }); });
      h+='</div>';
    } else if(view==='bell'){
      h+=`<div class="t13 sec" style="margin-bottom:8px">The bell opens this list on desktop; on the phone it is the Needs you panel on Home. Rows leave when the action is done, never by dismissal (BS-AI-009 §5).</div>
      <div class="nbell glass">
        <div class="lrow" style="margin:0 0 8px"><span class="t19 b">Needs you <span class="chip type">3</span></span><a href="#" class="t13 jlink">Notification settings</a></div>
        ${[['Second office or stay put','Sam added to Box 2 · 2 h ago','Open room'],['Launch date for the spring programme','Waiting on your Feeling in Box 2','Add my input'],['Raise the day rate for new clients','Review due today · 3 questions with AI Architect','Review']].map(r=>`<div class="nrowb"><div><div class="t13 b">${r[0]}</div><div class="t13 sec">${r[1]}</div></div><button class="btn secondary small" type="button">${r[2]}</button></div>`).join('')}
        <div class="t13 sec" style="margin-top:8px">Done lately</div>
        ${[['Decided: Keep the Friday delivery slot','Review 6 Dec'],['New sign-in: Chrome on MacBook, London','Not you? Review my devices']].map(r=>`<div class="nrowb done"><div><div class="t13">${r[0]}</div><div class="t13 sec">${r[1]}</div></div></div>`).join('')}
      </div>
      <div class="t13 sec b" style="margin:16px 0 6px">In-app messages that are not in the bell</div>
      <div class="ntoasts">
        <div class="ntoast"><span class="ntag">Toast · 4 s</span><span class="t13">Saved.</span></div>
        <div class="ntoast warn"><span class="ntag">Toast · stays</span><span class="t13">Still there? Your answers clear in 5 minutes. <b>Keep going</b></span></div>
        <div class="ntoast warn"><span class="ntag">Banner</span><span class="t13">You have used this month’s decisions. Top up, or come back on the 1st. Your log is open. <b>Top up</b></span></div>
        <div class="ntoast err"><span class="ntag">Banner</span><span class="t13">We could not take your payment on 1 Dec. Update your card within 7 days to keep your decisions. <b>Update my card</b></span></div>
        <div class="ntoast"><span class="ntag">Banner</span><span class="t13">Your mentor is not available right now. Your boxes are saved. Check waits.</span></div>
        <div class="ntoast"><span class="ntag">Line above the report</span><span class="t13">We have emailed you a link to set your password. It works for 24 hours.</span></div>
      </div>`;
    } else if(view==='push'){
      h+='<div class="t13 sec" style="margin-bottom:8px">iOS push, under 25 words, no box content (BS-AI-009 §2, §4). Held 21:00–08:00 and delivered at 08:00; more than three in an hour arrive as one. Web push is a later opt-in.</div><div class="npush">';
      E.filter(e=>e[5]).forEach(e=>{ h+=`<div class="nphone"><div class="nph"><span class="ninf" aria-hidden="true"></span><span class="t13 b">Brandscaling</span><span class="t13 sec" style="margin-left:auto">now</span></div><div class="t13">${esc(e[5])}</div><div class="t13 sec">${e[0]} · ${esc(e[2])}</div></div>`; });
      h+='</div>';
    } else {
      h+='<div class="t13 sec" style="margin-bottom:8px">Every email: the brand header, Inter, one paragraph, one button, a plain-text alternative, an unsubscribe link for everything except security, legal and receipts (BS-AI-009 §7). No box content, entries, readiness reads or results in any email, except A6 (one line of the Part 1 result, by design choice, for approval).</div><div class="nmails">';
      E.filter(e=>e[6]).forEach(e=>{ h+=`<div class="nmail"><div class="t13 sec">${e[0]} · ${esc(e[2])} · <i>${esc(e[3])}</i></div><div class="t13"><b>Subject:</b> ${esc(e[6])}</div><div class="t13" style="margin-top:4px">${esc(e[7])}</div></div>`; });
      h+='</div>';
    }
    host.innerHTML=h;
  }
  window.openScreen11=function(){ render(document.querySelector('#main11 [data-nv].on')?.dataset.nv||'map'); };
  document.addEventListener('click',e=>{ const b=e.target.closest('#main11 [data-nv]'); if(b) render(b.dataset.nv); });
})();
