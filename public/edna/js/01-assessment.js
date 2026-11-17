const EITHER = 'Depends on the situation.';
const scenarios = [
  { id: '1A', title: 'Investing money', when: 'Normal conditions. Over several weeks, paused while you compare options.',
    text: 'Imagine you are deciding whether to spend a sum that matters to you on something that should help you earn more: equipment, a course, a tool or stock. You have a few weeks, and the decision pauses while you compare options.',
    q: [
      { id: 'P1-Q01', lead: 'I begin with', ask: 'Where did the decision start?', opts: ['I build the case: what it costs, what it should bring back and how long until it pays for itself.', 'With a sense of whether it is the right next step for me.'] },
      { id: 'P1-Q02', lead: 'Then I turn to', ask: 'When you come back to it after comparing the options, what do you turn to?', opts: ['How it would feel to have it, and what the people around me would think.', 'Whether the prices and the payback numbers support what I first felt.'] },
      { id: 'P1-Q03', lead: 'I end and validate with', ask: 'What finally lets you commit?', opts: ['The numbers add up and it makes sense.', 'It feels right for where I am going.'] } ] },
  { id: '1B', title: 'Investing money', when: 'Under stress: money at risk and time pressure. Decided today.',
    text: 'Imagine the same thing is offered at 40% off, today only. Taking it would use most of what you have put aside for the next two months.',
    q: [
      { id: 'P1-Q04', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I calculate what the saving is worth against two months with nothing in reserve.', 'I read the offer: whether it feels like a real win or a trap, and what I feel about the seller.'] },
      { id: 'P1-Q05', lead: 'Then I turn to', ask: 'What do you check before deciding?', opts: ['How it would feel to run two months with no cushion, and what the people close to me would say.', 'Whether the saving and the money I have really support the move.'] },
      { id: 'P1-Q06', lead: 'I end and validate with', ask: 'What settles it?', opts: ['What the saving and my money add up to.', 'Whether the deal is good for me and feels right.'] } ] },
  { id: '2A', title: 'Pricing', when: 'Normal conditions. Over a week.',
    text: 'Imagine you are putting a price on something you are offering: your work, a product, a service or something you are selling. You know what it costs you, what others charge and what two or three interested people have said. You have a week.',
    q: [
      { id: 'P1-Q07', lead: 'I begin with', ask: 'Where do you start?', opts: ['With what it costs me, what I need to keep and what others charge.', 'With what it is worth to the buyer and what price feels right to me.'] },
      { id: 'P1-Q08', lead: 'Then I turn to', ask: 'During the week, what do you keep coming back to?', opts: ['How buyers will react to the price.', 'Whether the figures back up the price I have in mind.'] },
      { id: 'P1-Q09', lead: 'I end and validate with', ask: 'What finally fixes the price?', opts: ['The figures work: it should be profitable.', 'It feels right: it is the best offering out there.'] } ] },
  { id: '2B', title: 'Pricing', when: 'Under stress: conflict and money. Decided today.',
    text: 'Imagine the buyer who matters most to you says they will walk away unless you drop the price by 15%. They want an answer by the end of the day.',
    q: [
      { id: 'P1-Q10', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I work out what 15% does to what I keep, and what losing them would cost.', 'I get a sense of whether they mean it, and what I want this relationship to be.'] },
      { id: 'P1-Q11', lead: 'Then I turn to', ask: 'What do you check before you answer?', opts: ['How the relationship would feel at the lower price.', 'Whether I can actually carry the cut.'] },
      { id: 'P1-Q12', lead: 'I end and validate with', ask: 'What settles your answer, whichever way it goes?', opts: ['What the figures say: can I afford it?', 'What feels right: is it worth it?'] } ] },
  { id: '3A', title: 'Choosing who to work with', when: 'Normal conditions. Over a month, in several conversations.',
    text: 'Imagine someone you have known for two years proposes doing something together: a venture, a project or a joint piece of work. You have a month and several conversations before you answer.',
    q: [
      { id: 'P1-Q13', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I define what each of us would bring, how the roles and the money would work and what could go wrong.', 'I notice how the idea and the person feel: the energy of the conversations and whether I can see the story working.'] },
      { id: 'P1-Q14', lead: 'Then I turn to', ask: 'Between the conversations, what do you turn to?', opts: ['How working with them every day would feel, and how the people around us would react.', 'Whether the facts support my first response: what they have done before, the market and the numbers.'] },
      { id: 'P1-Q15', lead: 'I end and validate with', ask: 'What finally settles it?', opts: ['The structure adds up: roles, money and risks are clear and I can defend each one.', 'It feels right: the partnership and the vision sit well with me.'] } ] },
  { id: '3B', title: 'Disagreeing with the person you build with', when: 'Under stress: conflict. Decided in minutes.',
    text: 'Imagine a meeting with the person you are building something with: a partner, a collaborator or someone whose backing you need. They argue strongly for a direction you disagree with. Others are watching. The decision has to be made before you leave the room.',
    q: [
      { id: 'P1-Q16', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I go to the facts: which option the numbers and constraints support, and where their argument has gaps.', 'I go to my sense of the room and the direction: what feels right for the work, the relationship and everyone.'] },
      { id: 'P1-Q17', lead: 'Then I turn to', ask: 'Before you speak, what do you check?', opts: ['How each option would feel to them and to the others, and what it would do to trust.', 'Whether the evidence actually supports the option I am drawn to.'] },
      { id: 'P1-Q18', lead: 'I end and validate with', ask: 'What settles the decision for you?', opts: ['The data that adds up, and I explain the reasoning.', 'The story that feels right, and I explain why it matters.'] } ] },
  { id: '4A', title: 'Launching', when: 'Normal conditions. Over a month, in and out of other work.',
    text: 'Imagine you are deciding when to put something out: an offer, a website, a product or an announcement. The decision runs over a month, alongside everything else.',
    q: [
      { id: 'P1-Q19', lead: 'I begin with', ask: 'Where do you start?', opts: ['I set the criteria: what must be ready, tested and measurable before it goes out.', 'I can tell when it and its story will be ready, and what moment the people I want to reach are in.'] },
      { id: 'P1-Q20', lead: 'Then I turn to', ask: 'As the month goes on, what do you keep checking?', opts: ['How it would land with the people I want to reach at each possible date.', 'Whether the checklist and the numbers support the date I have in mind.'] },
      { id: 'P1-Q21', lead: 'I end and validate with', ask: 'What finally sets the date?', opts: ['The criteria are met and the plan adds up.', 'It looks ready and the story is right.'] } ] },
  { id: '4B', title: 'Launching', when: 'Under stress: time pressure. Decided in minutes.',
    text: 'Imagine it is the day. An hour before it goes live, something breaks: a payment page, a link, a file. People have been told the time. Go ahead or delay, needs to be decided in the next few minutes.',
    q: [
      { id: 'P1-Q22', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I size the problem: how many people it affects, what a fix takes and what a delay costs.', 'I read the moment: what going ahead or delaying would feel like for the people waiting and for me.'] },
      { id: 'P1-Q23', lead: 'Then I turn to', ask: 'What do you check next?', opts: ['How the people waiting would feel if we delayed, or went ahead as it is.', 'Whether the fix time and the numbers actually support delaying or going ahead.'] },
      { id: 'P1-Q24', lead: 'I end and validate with', ask: 'What settles it, go or delay?', opts: ['The option that adds up, even if people get upset.', 'The option that feels right, even if it costs us.'] } ] }
  ,
  /* Reserve scenarios 5A to 7B (BS-DI-004 1.7). Shown only when the consistency check fires: 3 or more of the 8 scenarios answered "Depends on the situation", or Part 3 pointing to the other loop (BS-DI-003 4.7 rule 4). */
  { id: '5A', reserve: true, title: 'A personal decision', when: 'Normal conditions. Over two months.',
    text: 'Imagine you are deciding whether to move to another place. It would help what you are building and change daily life for you and the people close to you. The decision runs over two months.',
    q: [
      { id: 'P1-X01', lead: 'I begin with', ask: 'Where do you start?', opts: ['I list the facts: costs, travel, what I gain and what we lose.', 'I notice how the move feels: whether I can see myself there and whether the next few years’ story fits.'] },
      { id: 'P1-X02', lead: 'Then I turn to', ask: 'Over the two months, what do you keep turning to?', opts: ['How the people close to me feel about it, and how daily life would feel there.', 'Whether the costs and the case for moving support what I first felt.'] },
      { id: 'P1-X03', lead: 'I end and validate with', ask: 'What finally decides it?', opts: ['The numbers and the practicalities add up.', 'It just feels right and is the best thing for me.'] } ] },
  { id: '5B', reserve: true, title: 'A personal decision', when: 'Under stress: money and a relationship. Decided in seconds.',
    text: 'Imagine your closest friend rings tonight to ask to borrow money for something really important to them. The only money you have is what you had set aside for what you are building. They need an answer now.',
    q: [
      { id: 'P1-X04', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I work out what I can afford, what that money was for and when I would get it back.', 'I focus on the relationship and what feels right between us.'] },
      { id: 'P1-X05', lead: 'Then I turn to', ask: 'Before you answer, what do you check?', opts: ['How saying yes or no would feel for both of us.', 'Whether the money actually works, whatever I feel.'] },
      { id: 'P1-X06', lead: 'I end and validate with', ask: 'What settles your answer?', opts: ['What adds up and makes sense.', 'What feels like the right thing to do.'] } ] },
  { id: '6A', reserve: true, title: 'Accepting an offer', when: 'Normal conditions. Over three weeks.',
    text: 'Imagine an offer that would change your plans: a contract, a customer, a role or a collaboration. You have three weeks to answer.',
    q: [
      { id: 'P1-X07', lead: 'I begin with', ask: 'Where do you start?', opts: ['I model what it takes: time, money, what I would have to give up and the risk if it falls through.', 'I notice whether this is the opening I have been waiting for and whether it feels like my next chapter.'] },
      { id: 'P1-X08', lead: 'Then I turn to', ask: 'Over the three weeks, what do you turn to?', opts: ['The impact on the people around me: how they would feel about the change, and how I would feel living it.', 'Whether the time and the money numbers support the risk and sacrifice.'] },
      { id: 'P1-X09', lead: 'I end and validate with', ask: 'What finally lets you commit?', opts: ['The case adds up: it is worth it.', 'It feels right: it would benefit me.'] } ] },
  { id: '6B', reserve: true, title: 'Accepting an offer', when: 'Under stress: time pressure and money. Decided within 24 hours.',
    text: 'Imagine the same offer, but they need a yes within 24 hours, and saying yes would stretch your time and your money.',
    q: [
      { id: 'P1-X10', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I run what the stretch costs in time and money and whether I can cover it.', 'I read the opportunity: whether it feels right to stretch for this now.'] },
      { id: 'P1-X11', lead: 'Then I turn to', ask: 'Before you answer, what do you check?', opts: ['How the people around me would feel about the stretch, and how they would feel about a no.', 'Whether the money and the time actually work.'] },
      { id: 'P1-X12', lead: 'I end and validate with', ask: 'What settles it?', opts: ['What adds up: it is profitable.', 'What feels right: it is beneficial.'] } ] },
  { id: '7A', reserve: true, title: 'Ending an arrangement', when: 'Normal conditions. Over a month.',
    text: 'Imagine ending something that no longer works for you: a supplier, a client, a subscription or a commitment. You are deciding over a month.',
    q: [
      { id: 'P1-X13', lead: 'I begin with', ask: 'Where do you start?', opts: ['I lay out the numbers: what it costs me, what it gives me and what I could do instead.', 'I notice how it feels now, how it affects everyone, and what ending it would mean for my story and everyone involved.'] },
      { id: 'P1-X14', lead: 'Then I turn to', ask: 'Over the month, what do you keep coming back to?', opts: ['How the other side and the people around me would feel about ending it.', 'Whether the figures and the alternatives support ending it.'] },
      { id: 'P1-X15', lead: 'I end and validate with', ask: 'What finally decides it?', opts: ['The numbers add up.', 'What is best for everyone.'] } ] },
  { id: '7B', reserve: true, title: 'Ending an arrangement', when: 'Under stress: conflict. Decided in minutes.',
    text: 'Imagine the other side says: drop your condition or we walk, now.',
    q: [
      { id: 'P1-X16', lead: 'I begin with', ask: 'What happens first for you?', opts: ['I work out what dropping the condition costs and what losing them costs.', 'I feel the tension in the room straight away: whether they mean it, and what it does to the relationship.'] },
      { id: 'P1-X17', lead: 'Then I turn to', ask: 'Before you answer, what do you check?', opts: ['How each answer would feel to them and to me.', 'Whether I can actually carry the change.'] },
      { id: 'P1-X18', lead: 'I end and validate with', ask: 'What settles your answer?', opts: ['What the numbers support.', 'What’s the right thing to do.'] } ] }
];

/* Part 2: Subtype Refinement. Text from BS-DI-004 Section 2.3. The option set shown depends on the Part 1 result. */
const SUBTYPES = { MS: 'Master Strategist', SB: 'Systemised Builder', IA: 'Internal Analyser', UA: 'The Ultimate Architect', VO: 'Visionary Oracle', MP: 'Magnetic Perfectionist', EE: 'Energetic Empath', UAl: 'The Ultimate Alchemist' };
const ARCH = ['MS', 'SB', 'IA', 'UA'], ALCH = ['VO', 'MP', 'EE', 'UAl'];
const part2 = [
  { id: 'P2-Q01', ctx: 'Building something new', ask: 'You are building something new and the time you had has just been cut. What do you protect first?',
    o: { MS: 'The plan: the order of the steps and which moves come first.', SB: 'The flow: the routine and the system that keep things running reliably.', IA: 'The accuracy: the data and the assumptions the work rests on.', UA: 'All three at once: the plan, the system and the data, adjusted together.', VO: 'The vision: the story and where this is going.', MP: 'The quality: what it looks and feels like, and the details that matter.', EE: 'The people: the momentum and the relationships around it.', UAl: 'All three at once: the vision, the quality and the people, kept in step.' } },
  { id: 'P2-Q02', ctx: 'Fixing something that has gone wrong', ask: 'Something you depend on has broken and everyone is looking to you. What do you protect first?',
    o: { MS: 'The priorities: what has to happen first, second and third.', SB: 'The routine: keeping the parts that still work running reliably.', IA: 'The facts: finding out exactly what happened before anything changes.', UA: 'All three: the priorities, the routine and the facts, held together.', VO: 'The direction: making sure the setback does not change where we are going.', MP: 'The standard: not letting the fix lower the quality.', EE: 'The people: keeping everyone steady and together.', UAl: 'All three: the direction, the standard and the people, held together.' } },
  { id: 'P2-Q03', ctx: 'Building something new', ask: 'When you build something new, how does your work naturally run?',
    o: { MS: 'In blocks: I set a few moves, run them for a stretch, then review and re-plan.', SB: 'Continuously: a weekly routine that keeps everything moving.', IA: 'In test cycles: run a test, check the results, decide the next one.', UA: 'All three: moves set in blocks, a weekly routine to run them, tests to prove them.', VO: 'In rounds: show a working version, get reactions, show the next.', MP: 'In polish cycles: refine until it is right, with a date to put it out.', EE: 'In conversations: talk with the people involved until we are aligned, then move.', UAl: 'All three: show it, refine it and bring people with it, in step.' } },
  { id: 'P2-Q04', ctx: 'Fixing something that has gone wrong', ask: 'When you are fixing something that has gone wrong, how do you work through it?',
    o: { MS: 'I step back, re-order the priorities and set the next few moves.', SB: 'I put a routine on it: daily checks until it runs smoothly again.', IA: 'I run tests to find the cause before I change anything.', UA: 'All three: re-order the moves, put a routine on it and test the cause.', VO: 'I re-tell where we are going and test the next step towards it.', MP: 'I refine the part that failed until it is right, with a date to put it back out.', EE: 'I get the people involved together and agree the way through.', UAl: 'All three: re-tell the direction, refine what failed and bring people together.' } },
  { id: 'P2-Q05', ctx: 'Building something new', ask: 'A new idea keeps growing. How do you keep it in bounds?',
    o: { MS: 'I tie everything to the moves I chose and cut what does not serve them.', SB: 'I standardise: once something works, it becomes the way we do it.', IA: 'Nothing is added until the analysis says it should be.', UA: 'All three: the chosen moves set the scope, standards hold it, analysis gates it.', VO: 'I let it explore while the pattern becomes clear, then settle it.', MP: 'I set the quality bar and cut everything that falls below it.', EE: 'I agree the scope with the people involved and hold us to it.', UAl: 'All three: explore, then set the bar, with everyone agreed.' } },
  { id: 'P2-Q06', ctx: 'Fixing something that has gone wrong', ask: 'In a crisis, requests pile up. How do you decide what gets done?',
    o: { MS: 'By the plan: what moves the chosen priorities first.', SB: 'By the standard: what keeps the system running comes first.', IA: 'By the numbers: what the data says matters most.', UA: 'All three: the plan, the standard and the numbers together.', VO: 'By the direction: what keeps us on the course we are on.', MP: 'By the quality bar: what keeps the result right.', EE: 'By the people: what keeps everyone moving and together.', UAl: 'All three: the direction, the quality bar and the people together.' } },
  { id: 'P2-Q07', ctx: 'Building something new', ask: 'Pick the one thing you would create first on a new project.',
    o: { MS: 'A roadmap or a map of the options.', SB: 'A checklist or a step-by-step procedure.', IA: 'A dashboard or a test plan.', UA: 'A one-page map that links the roadmap, the procedures and the tests.', VO: 'A story brief or a short video of what it will become.', MP: 'A quality bar: the standard the result must meet.', EE: 'A list of the people involved and what each has committed to.', UAl: 'A one-page vision that links the story, the standard and the people.' } },
  { id: 'P2-Q08', ctx: 'Fixing something that has gone wrong', ask: 'Something has gone wrong. What is the first thing you write down?',
    o: { MS: 'A re-ordered plan: what comes first now.', SB: 'A procedure so it does not happen again.', IA: 'A record of what happened, with the numbers.', UA: 'One page with the new order, the procedure and the record together.', VO: 'The story of where we go from here.', MP: 'The standard the fix must meet.', EE: 'Who is doing what, and who needs to hear from me.', UAl: 'One page with the direction, the standard and the people together.' } },
  { id: 'P2-Q09', ctx: 'Building something new', ask: 'You are building something new and the pressure rises. What do you reach for first?',
    o: { MS: 'I re-plan: step back and re-order the moves.', SB: 'I add process: more structure, more routine.', IA: 'I go deeper into the detail and the data.', UA: 'All three at once: re-plan, tighten the process and check the data.', VO: 'I re-tell the story and test the next step.', MP: 'I hold the quality bar, or raise it.', EE: 'I rally the people around it.', UAl: 'All three at once: re-tell the story, hold the quality and rally people.' } },
  { id: 'P2-Q10', ctx: 'Fixing something that has gone wrong', ask: 'When a project or task starts breaking down (delays, confusion, errors or misalignment), what is your first instinct?',
    o: { MS: 'Zoom out, rethink the overall plan and re-order the steps so everything makes sense again.', SB: 'Tighten or redesign the workflow or routine so things run smoothly again.', IA: 'Analyse what is causing the issue, look at the data, and test logical fixes.', UA: 'Re-align everything at once: the plan, the process and the data behind it.', VO: 'Reframe the story or direction so it feels aligned again.', MP: 'Refine the quality: adjust the detail until it feels right.', EE: 'Reset the energy: clear the tension, reconnect people, restore alignment.', UAl: 'Re-harmonise everything at once: the idea, the quality and the people.' } }
];
/* Consistency check (BS-DI-004 1.5 step 5; BS-DI-003 4.7 rule 4) */
let reserveDone = false, p3Trigger = false; const savedSupp = {};
function eitherCount() { let n = 0; for (let i = 0; i < 8; i++) { const a = saved[i]; if (a && (a.q0 === 'either' || a.q2 === 'either')) n++; } return n; }
function reserveNow(slot) { if (reserveDone) return false; if (slot === 'A') return eitherCount() >= 3; return p3Trigger; }
function scenarioTotal() { return (reserveDone || reserveNow('A') || reserveNow('B')) ? 14 : 8; }

let core = 'architect';   /* preview only: in the app this is the Part 1 result */
const saved2 = {};
function p2keys() { return core === 'architect' ? ARCH : core === 'alchemist' ? ALCH : ARCH.concat(ALCH); }
const MIRROR = [['MS', 'VO'], ['SB', 'EE'], ['IA', 'MP'], ['UA', 'UAl']];   /* mirror pairs, BS-DI-003 3.6; the Ultimates pair with each other */
function p2pairs(qi) { const start = qi % 4; const out = []; for (let i = 0; i < 4; i++) out.push(MIRROR[(start + i) % 4]); return out; }   /* preview: fixed rotation; live app: random pair order and random order within each pair */
function setCore() { const s = screens[at]; const inPart2 = s === 'intro2' || s === 'done2' || s === 'done2b' || s === 'intro3' || s === 'done3' || s === 'done3b' || s === 'intro4' || s === 'done4' || s === 'done4b' || s === 'intro5' || s === 'consent5' || s === 'done5' || s === 'intro6' || s === 'done6' || s === 'intro7' || s === 'done7' || s === 'finish' || s === 'report' || s === 'end' || s === 'detailed' || s === 'adapt' || (typeof s === 'string' && (s[0] === 'p' || s[0] === 't' || s[0] === 'u' || s[0] === 'v' || s[0] === 'w' || s[0] === 'y') && s.length >= 2 && s !== 'profile' && s !== 'welcome'); if (inPart2) document.documentElement.setAttribute('data-core', core); else document.documentElement.removeAttribute('data-core'); }
function p2order(qi, keys) { const n = keys.length; const start = (qi * 3) % n; const out = []; for (let i = 0; i < n; i++) out.push(keys[(start + i) % n]); return out; }   /* preview: fixed rotation; live app: random on every question */
const screens = ['welcome', 'profile', 'intro', 0, 1, 2, 3, 4, 5, 6, 7, 'supp', 8, 9, 10, 11, 12, 13, 'done1', 'intro2', 'p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'done2', 'done2b', 'intro3', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15', 'done3', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'done3b', 'intro4', 'u0', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8', 'u9', 'done4', 'done4b', 'intro5', 'v0', 'v1', 'v2', 'v3', 'consent5', 'done5', 'intro6', 'w0', 'w1', 'w2', 'w3', 'done6', 'intro7', 'y0', 'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8', 'y9', 'y10', 'y11', 'y12', 'y13', 'y14', 'y15', 'y16', 'y17', 'y18', 'y19', 'y20', 'done7', 'finish', 'report', 'end', 'detailed', 'adapt'];

/* Part 7: Meta-Beliefs & Values. Draft for BS-DI-004 Section 7, 13 Nov 2026. 18 trade-offs (3 per belief) + 2 decisions in context + 1 decision that stalls. Scoring: pole A 0, pole B 100, Both 50, Neither / Other not scored. */
const part7 = [
  { id: 'P7-Q01', b: 'Success means', a: 'Success is a business that makes good money.', c: 'Success is a business that makes a real difference.' },
  { id: 'P7-Q02', b: 'Build for', a: 'I would rather launch quickly and improve as I go.', c: 'I would rather launch when it is right.' },
  { id: 'P7-Q03', b: 'Progress means', a: 'Progress is trying things nobody has tried.', c: 'Progress is making what already works better.' },
  { id: 'P7-Q04', b: 'Proof is', a: 'I know it is working when the numbers say so.', c: 'I know it is working when customers say so.' },
  { id: 'P7-Q05', b: 'Others are seen as', a: 'Others in my market are people to work with.', c: 'Others in my market are people to beat.' },
  { id: 'P7-Q06', b: 'Opportunity is', a: 'There is enough opportunity to go round.', c: 'Opportunity has to be won and protected.' },
  { id: 'P7-Q07', b: 'Success means', a: 'I would rather double the profit than double the impact.', c: 'I would rather double the impact than double the profit.' },
  { id: 'P7-Q08', b: 'Build for', a: 'Getting it out there matters more than getting it perfect.', c: 'Getting it right matters more than getting it out there.' },
  { id: 'P7-Q09', b: 'Progress means', a: 'I would rather start a new thing than improve an existing one.', c: 'I would rather improve an existing thing than start a new one.' },
  { id: 'P7-Q10', b: 'Proof is', a: 'A result is real when it can be measured.', c: 'A result is real when people can see and feel it.' },
  { id: 'P7-Q11', b: 'Others are seen as', a: 'A rival’s success is good for the market.', c: 'A rival’s success is a loss for me.' },
  { id: 'P7-Q12', b: 'Opportunity is', a: 'If I miss one chance, another will come.', c: 'A missed chance is gone for good.' },
  { id: 'P7-Q13', b: 'Success means', a: 'The best measure of a year is the return it made.', c: 'The best measure of a year is the difference it made.' },
  { id: 'P7-Q14', b: 'Build for', a: 'I would rather reach many people with a good version.', c: 'I would rather reach fewer people with the best version.' },
  { id: 'P7-Q15', b: 'Progress means', a: 'A business moves forward by adding.', c: 'A business moves forward by refining.' },
  { id: 'P7-Q16', b: 'Proof is', a: 'I trust a figure more than a testimonial.', c: 'I trust a testimonial more than a figure.' },
  { id: 'P7-Q17', b: 'Others are seen as', a: 'I would rather share a market than fight for it.', c: 'I would rather win a market than share it.' },
  { id: 'P7-Q18', b: 'Opportunity is', a: 'I would rather give an opportunity away than hold it back.', c: 'I would rather hold an opportunity than give it away.' },
  { id: 'P7-Q19', b: 'Success means', ctx: 'An unexpected sum of money', text: 'Imagine an unexpected sum, about two months of running costs, lands in the business account.', ask: 'What do you do with it?', a: 'Put it where it will bring the best return.', c: 'Put it into the difference the business makes.', both: 'Both: part of it earns, part of it serves.' },
  { id: 'P7-Q20', b: 'Others are seen as', ctx: 'An offer to work together', text: 'Imagine a business in your market offers to work with you on a shared offer.', ask: 'What do you do?', a: 'Take it: we both win.', c: 'Decline: they would learn too much about how we work.', both: 'It depends on the business and the offer.' },
  { id: 'P7-Q21', b: 'stall', ctx: 'A decision that has stalled', text: 'Imagine that last week you decided to raise your prices. You have not told your customers yet.', ask: 'What is holding you back?', stall: [ { t: 'It would feel like putting money before the people we serve.', k: 'Purpose' }, { t: 'The offer is not good enough yet to charge more.', k: 'Craft' }, { t: 'Someone else in the market could use it against us.', k: 'Competitors' }, { t: 'Nothing. I would raise the price.', k: 'none' } ] }
];
const saved7 = {};


/* Part 6: Mindset & Personality. Draft for BS-DI-004 Section 6, 13 Nov 2026. 20 statements, 4 per domain (BS-DI-003 7.9), five-point scale; rev: true = scored in reverse. High end: Growth, Confident, Patient, Risk-taking, Outward. */
const part6 = [
  { id: 'P6-S01', d: 'Mindset', t: 'When I fail at something, I treat it as information for the next attempt.' },
  { id: 'P6-S02', d: 'Confidence', t: 'Once I have decided, I rarely need someone else to confirm it.' },
  { id: 'P6-S03', d: 'Patience', t: 'I wait until I have enough information before I act on a new idea.' },
  { id: 'P6-S04', d: 'Risk style', t: 'I will commit to an opportunity before every risk is clear.' },
  { id: 'P6-S05', d: 'Energy', t: 'After a day of meetings, I feel energised rather than drained.' },
  { id: 'P6-S06', d: 'Mindset', t: 'I avoid tasks I might not be good at.', rev: true },
  { id: 'P6-S07', d: 'Confidence', t: 'I often second-guess a decision after I have made it.', rev: true },
  { id: 'P6-S08', d: 'Patience', t: 'I act on a new idea the moment it excites me.', rev: true },
  { id: 'P6-S09', d: 'Risk style', t: 'I prefer a smaller, certain gain to a larger, uncertain one.', rev: true },
  { id: 'P6-S10', d: 'Energy', t: 'I recharge by spending time on my own.', rev: true },
  { id: 'P6-S11', d: 'Mindset', t: 'I can get better at almost anything if I work at it.' },
  { id: 'P6-S12', d: 'Confidence', t: 'I trust my own judgement even when others disagree.' },
  { id: 'P6-S13', d: 'Patience', t: 'I can sit with a decision for days without needing to settle it.' },
  { id: 'P6-S14', d: 'Risk style', t: 'Uncertainty is part of the appeal of a new venture for me.' },
  { id: 'P6-S15', d: 'Energy', t: 'I think best when I am talking things through with people.' },
  { id: 'P6-S16', d: 'Mindset', t: 'A mistake in front of other people stays with me for a long time.', rev: true },
  { id: 'P6-S17', d: 'Confidence', t: 'I look for approval before I act on a decision.', rev: true },
  { id: 'P6-S18', d: 'Patience', t: 'Waiting for more information frustrates me.', rev: true },
  { id: 'P6-S19', d: 'Risk style', t: 'I need to see how something could fail before I commit to it.', rev: true },
  { id: 'P6-S20', d: 'Energy', t: 'A full day with other people leaves me needing quiet.', rev: true }
];
const P6_PAGES = [[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19]];
const P6_SCALE = ['Strongly disagree', 'Disagree', 'Neither', 'Agree', 'Strongly agree'];
const saved6 = {};


/* Part 5: Neurodiversity & Accessibility. Draft for BS-DI-004 Section 5, 13 Nov 2026. 26 statements: 4 per domain (BS-DI-003 6.9) + 6 exceptional strengths. Never 0, Sometimes 1, Often 2; rev: true = scored in reverse. */
const part5 = [
  { id: 'P5-S01', d: 'Attention and regulation', t: 'I lose focus during long tasks unless something changes.' },
  { id: 'P5-S02', d: 'Language and processing', t: 'I find dense written text slow or tiring to read.' },
  { id: 'P5-S03', d: 'Structure and routine', t: 'Unexpected changes to a plan unsettle me.' },
  { id: 'P5-S04', d: 'Sensory load', t: 'Noise, bright light or movement around me makes it hard to think.' },
  { id: 'P5-S05', d: 'Body chemistry and diet', t: 'My focus changes depending on what and when I eat or drink.' },
  { id: 'P5-S06', d: 'Strength: depth of focus', t: 'When something interests me, I can work on it for hours without noticing the time.', str: true },
  { id: 'P5-S07', d: 'Attention and regulation', t: 'I lose track of time when I am absorbed in something.' },
  { id: 'P5-S08', d: 'Language and processing', t: 'I understand something faster when I hear it or see it than when I read it.' },
  { id: 'P5-S09', d: 'Structure and routine', t: 'I prefer to know the agenda in advance.' },
  { id: 'P5-S10', d: 'Sensory load', t: 'I need a quiet, settled space to do my best work.' },
  { id: 'P5-S11', d: 'Body chemistry and diet', t: 'I eat at regular times.', rev: true },
  { id: 'P5-S12', d: 'Strength: pattern recognition', t: 'I see connections between things that other people treat as separate.', str: true },
  { id: 'P5-S13', d: 'Attention and regulation', t: 'I can keep my attention on one long task without needing a change.', rev: true },
  { id: 'P5-S14', d: 'Language and processing', t: 'I take in a long report comfortably in one sitting.', rev: true },
  { id: 'P5-S15', d: 'Structure and routine', t: 'I am comfortable when a day has no fixed plan.', rev: true },
  { id: 'P5-S16', d: 'Sensory load', t: 'I can concentrate in a busy, noisy place.', rev: true },
  { id: 'P5-S17', d: 'Body chemistry and diet', t: 'I notice a dip in energy or attention after certain foods or drinks.' },
  { id: 'P5-S18', d: 'Strength: creativity', t: 'Ideas come to me quickly, often several at once.', str: true },
  { id: 'P5-S19', d: 'Attention and regulation', t: 'I jump between tasks before finishing the one I am on.' },
  { id: 'P5-S20', d: 'Language and processing', t: 'I prefer a diagram or a short summary to a page of text.' },
  { id: 'P5-S21', d: 'Structure and routine', t: 'I work best when the same routine is followed each time.' },
  { id: 'P5-S22', d: 'Sensory load', t: 'Background sounds or screens pull my attention away.' },
  { id: 'P5-S23', d: 'Body chemistry and diet', t: 'Skipping a meal makes little difference to how I work.', rev: true },
  { id: 'P5-S24', d: 'Strength: depth of focus', t: 'I notice details in my work that other people miss.', str: true },
  { id: 'P5-S25', d: 'Strength: pattern recognition', t: 'I can tell where a trend is going before the numbers show it.', str: true },
  { id: 'P5-S26', d: 'Strength: creativity', t: 'I find unusual ways to solve problems that others would not think of.', str: true }
];
const P5_PAGES = [[0,1,2,3,4,5,6],[7,8,9,10,11,12,13],[14,15,16,17,18,19],[20,21,22,23,24,25]];
const P5_SCALE = ['Never', 'Sometimes', 'Often'];
const saved5 = {}; let consent5 = null;


/* Part 4: Learning Style Preferences. Draft for BS-DI-004 Section 4, 13 Nov 2026. Two questions per domain (BS-DI-003 5.7); each option maps to one result; when the two answers in a domain differ, the result is Multimodal / Adaptive / Flexible / Adaptive / Versatile. */
const part4 = [
  { id: 'P4-Q01', domain: 'Modality', ctx: 'A new software tool', ask: 'You need to learn a new software tool for your business. What do you do first?',
    opts: [ { t: 'Watch a short demo or look at screenshots of it.', r: 'Visual' }, { t: 'Ask someone to talk me through it.', r: 'Auditory' }, { t: 'Read the guide or the help pages.', r: 'Read/Write' }, { t: 'Open it and try things until it makes sense.', r: 'Kinaesthetic' } ] },
  { id: 'P4-Q02', domain: 'Modality', ctx: 'A mentor explains a pricing method', ask: 'A mentor explains a new pricing method. When does it stick best?',
    opts: [ { t: 'When they draw it as a diagram or a chart.', r: 'Visual' }, { t: 'When they talk it through and I can ask questions.', r: 'Auditory' }, { t: 'When I have it written down to read and make notes on.', r: 'Read/Write' }, { t: 'When I work through a real example with my own numbers.', r: 'Kinaesthetic' } ] },
  { id: 'P4-Q03', domain: 'Approach', ctx: 'Starting a new topic', ask: 'When you start a new topic, what do you prefer?',
    opts: [ { t: 'To go step by step, in order, building it up.', r: 'Structured' }, { t: 'To get the big picture first, then fill in the detail.', r: 'Global' } ] },
  { id: 'P4-Q04', domain: 'Approach', ctx: 'A long guide arrives', ask: 'A 60-page guide lands in your inbox. What do you do?',
    opts: [ { t: 'Start at the beginning and work through it in order.', r: 'Structured' }, { t: 'Skim the whole thing first to see how it fits together.', r: 'Global' } ] },
  { id: 'P4-Q05', domain: 'Concept processing', ctx: 'When an idea makes sense', ask: 'An idea makes sense to you when…',
    opts: [ { t: 'I see the facts, the details and a real example.', r: 'Concrete' }, { t: 'I see the pattern behind it and how it connects to other things.', r: 'Abstract' } ] },
  { id: 'P4-Q06', domain: 'Concept processing', ctx: 'A new way of working is pitched to you', ask: 'Someone pitches you a new way of working. What convinces you?',
    opts: [ { t: 'A worked case, with numbers, from a business like mine.', r: 'Concrete' }, { t: 'The principle: why it works and where else it would apply.', r: 'Abstract' } ] },
  { id: 'P4-Q07', domain: 'Working environment', ctx: 'Learning something difficult', ask: 'You learn something difficult best when…',
    opts: [ { t: 'I work through it alone, at my own rhythm.', r: 'Individual' }, { t: 'I talk it through with other people.', r: 'Collaborative' } ] },
  { id: 'P4-Q08', domain: 'Working environment', ctx: 'A skill to master in a month', ask: 'You have to master a new skill in a month. What do you do?',
    opts: [ { t: 'Block out time to study it on my own.', r: 'Individual' }, { t: 'Find a group, a course with others or a partner to learn it with.', r: 'Collaborative' } ] },
  { id: 'P4-Q09', domain: 'Pace', ctx: 'A week to learn something', ask: 'Given a week to learn something, how do you go about it?',
    opts: [ { t: 'In short, intense bursts to keep the momentum.', r: 'Fast' }, { t: 'Steadily, a bit each day, for depth.', r: 'Slow' } ] },
  { id: 'P4-Q10', domain: 'Pace', ctx: 'A new regulation affects your business', ask: 'A new regulation affects your business. What do you do?',
    opts: [ { t: 'Get the essentials fast and act, then learn more as I need it.', r: 'Fast' }, { t: 'Take the time to understand it fully before I change anything.', r: 'Slow' } ] }
];
const P4_FLAT = { 'Modality': 'Multimodal', 'Approach': 'Adaptive', 'Concept processing': 'Flexible', 'Working environment': 'Adaptive', 'Pace': 'Versatile' };
const saved4 = {};
function p4order(qi, n) { const start = (qi * 3) % n; const out = []; for (let i = 0; i < n; i++) out.push((start + i) % n); return out; }   /* preview: fixed rotation; live app: random on every question */

/* Part 3: Alternate Decision Intelligence Loop Awareness (on screen: Awareness of others). Draft for BS-DI-004 Section 3, 13 Nov 2026. Customer-facing wording: no loop terms. Scores: best 100, acceptable 50 or 25, worse 0; "Other" 0 and the words are stored. */
const part3 = [
  { id: 'P3-Q01', area: 'Self-awareness', ability: 'Dominant-loop understanding', ctx: 'Looking back: investing money', recall: '1A', both: true,
    ask: 'Looking back at how you answered this scenario, how did your decision run?',
    opts: [ { t: 'It began with the numbers and was finally settled by the numbers.', k: 'LL' }, { t: 'It began with a feeling and was finally settled by a feeling.', k: 'FF' }, { t: 'It began with the numbers and was finally settled by a feeling.', k: 'LF' }, { t: 'It began with a feeling and was finally settled by the numbers.', k: 'FL' } ],
    scoring: 'Compared with the stored Part 1 pattern for the scenario shown: both moments match 100; one moment matches 50; neither 0.' },
  { id: 'P3-Q02', area: 'Self-awareness', ability: 'Non-dominant-loop understanding', ctx: 'Investing money, under stress', both: true,
    v: { architect: { text: 'Imagine an entrepreneur who goes with their sense of things first and makes the final call on how it feels. The same offer is in front of them: 40% off, today only, using most of what they have put aside for the next two months.', ask: 'What would they do first?',
          opts: [ { t: 'Read the offer: whether it feels like a real win or a trap, and what they feel about the seller.', s: 100 }, { t: 'Notice how it feels, then go straight to the figures to see if the feeling holds.', s: 50 }, { t: 'Calculate what the saving is worth against two months with nothing in reserve.', s: 0 }, { t: 'Put it off until the feeling and the figures agree.', s: 0 } ] },
         alchemist: { text: 'Imagine an entrepreneur who works it out first and makes the final call on the facts. The same offer is in front of them: 40% off, today only, using most of what they have put aside for the next two months.', ask: 'What would they do first?',
          opts: [ { t: 'Calculate what the saving is worth against two months with nothing in reserve.', s: 100 }, { t: 'Run the figures, then check how it feels to run two months with no cushion.', s: 50 }, { t: 'Read the offer: whether it feels like a real win or a trap, and what they feel about the seller.', s: 0 }, { t: 'Put it off until the feeling and the figures agree.', s: 0 } ] } } },
  { id: 'P3-Q03', area: 'Self-awareness', ability: 'Switch awareness', ctx: 'Looking back: pricing under pressure', recall: '2B',
    ask: 'Under that pressure, how did you decide?',
    v: { architect: { opts: [ { t: 'I stayed in my usual way: it began with the figures and was settled by the figures.', k: 'LL' }, { t: 'I switched: I decided on how it felt and did not come back to the figures.', k: 'FF' }, { t: 'It began with the figures but was settled by how it felt.', k: 'LF' }, { t: 'I am not sure how I decided it.', k: 'NA' } ] },
         alchemist: { opts: [ { t: 'I stayed in my usual way: it began with how it felt and was settled by how it felt.', k: 'FF' }, { t: 'I switched: I decided on the figures and did not come back to how it felt.', k: 'LL' }, { t: 'It began with how it felt but was settled by the figures.', k: 'FL' }, { t: 'I am not sure how I decided it.', k: 'NA' } ] } },
    trigger: { ask: 'What triggered it?', opts: ['The time pressure', 'The money at risk', 'The conflict in the conversation', 'Other (tell us in your own words)'] },
    scoring: 'Compared with the stored Part 1 pattern for the scenario shown: match 100; one moment matches 50; no match or "not sure" 0. The trigger is shown only when the person reports a switch; it is recorded, not scored (BS-DI-003 9.3).' },
  { id: 'P3-Q04', area: 'Self-awareness', ability: 'Recovery after switching', ctx: 'Pricing, a week later', both: false,
    v: { architect: { text: 'Imagine you agreed to the 15% cut on the spot because the conversation felt tense, and did not go back to the figures. A week later the numbers show you cannot carry it.', ask: 'What do you do next?',
          opts: [ { t: 'Go back to the figures, work out what you can carry, and return to the buyer with a revised offer.', s: 100 }, { t: 'Carry it for this one order while you re-cost the next.', s: 50 }, { t: 'Honour it and avoid the subject; the relationship matters more.', s: 0 }, { t: 'Wait a month and see whether it settles.', s: 0 } ] },
         alchemist: { text: 'Imagine you held the price on the spot because the spreadsheet said so, and did not go back to how it felt. A week later the buyer has gone quiet and the reason they chose you has been lost.', ask: 'What do you do next?',
          opts: [ { t: 'Go back to what the relationship means and why they chose you, then find a version of the price that holds both.', s: 100 }, { t: 'Reach out to the buyer now and re-cost the next order once you know where they stand.', s: 50 }, { t: 'Stand by the figures; if they come back, they come back.', s: 0 }, { t: 'Wait a month and see whether they return.', s: 0 } ] } } },
  { id: 'P3-Q05', area: 'Awareness of others', ability: 'Recognition', loop: 'architect', ctx: 'Someone else deciding: launching',
    text: 'Imagine a partner deciding when to launch. In the meeting she says: \u201cBefore we pick a date I want the list: what is built, what is tested and what we will measure. Once that is done, let\u2019s hear how customers are likely to react.\u201d She sets the date when every item on the list is ticked.',
    ask: 'Compared with how you make this kind of decision, how would you describe her?',
    opts: [ { t: 'She decides the way I do.', k: 'same' }, { t: 'She decides differently from me.', k: 'diff' }, { t: 'I cannot tell from this.', k: 'NA' }, { t: 'Other', k: 'other', other: true } ],
    mixedOpts: [ { t: 'She relies on what can be proven, and checks how people feel about it along the way.', s: 100 }, { t: 'She relies on her feel for the right moment, and the list is there to confirm it.', s: 0 }, { t: 'She relies on both equally and lets whichever is stronger on the day set the date.', s: 0 }, { t: 'Other', s: 0, other: true } ],
    scoring: 'Architect: \u201cthe way I do\u201d 100 (same-loop recognition). Alchemist: \u201cdifferently from me\u201d 100 (alternate-loop recognition). Any other answer 0; Other words stored. Mixed: absolute options, best 100.' },
  { id: 'P3-Q06', area: 'Awareness of others', ability: 'Recognition', loop: 'alchemist', ctx: 'Someone else deciding: choosing who to work with',
    text: 'Imagine a partner deciding whether to work with someone. He says: \u201cI can see the two of us building something here, and the timing feels right.\u201d He then asks for the figures to make sure it holds up, and agrees once it still feels right to him.',
    ask: 'Compared with how you make this kind of decision, how would you describe him?',
    opts: [ { t: 'He decides the way I do.', k: 'same' }, { t: 'He decides differently from me.', k: 'diff' }, { t: 'I cannot tell from this.', k: 'NA' }, { t: 'Other', k: 'other', other: true } ],
    mixedOpts: [ { t: 'He relies on his sense of the person and the timing, and the figures are there to confirm it.', s: 100 }, { t: 'He relies on the figures, and the story is what he tells once they hold.', s: 0 }, { t: 'He relies on both equally and lets whichever is stronger on the day decide.', s: 0 }, { t: 'Other', s: 0, other: true } ],
    scoring: 'Alchemist: \u201cthe way I do\u201d 100 (same-loop recognition). Architect: \u201cdifferently from me\u201d 100 (alternate-loop recognition). Any other answer 0; Other words stored. Mixed: absolute options, best 100.' },
  { id: 'P3-Q07', area: 'Awareness of others', ability: 'Translation', ctx: 'Launching, with a partner who thinks differently from you', both: true,
    v: { architect: { text: 'Imagine your partner, who thinks differently from you, says: \u201cThis launch has to feel like an event. People should be talking about it before it even opens.\u201d', ask: 'What are they really asking for, put in a way you could act on?',
          opts: [ { t: 'A target for how many people are signed up or talking about it before the open date, and one moment in the launch built to be talked about.', s: 100 }, { t: 'More marketing: add a promotion to the plan.', s: 25 }, { t: 'They have not thought about the operations; park it until the plan is ready.', s: 0 }, { t: 'A bigger launch.', s: 0 } ] },
         alchemist: { text: 'Imagine your partner, who thinks differently from you, says: \u201cBefore we commit to the date, I need to know how many people we can handle and at what point we would stop.\u201d', ask: 'What are they really asking for, put in a way you could act on?',
          opts: [ { t: 'How many people we can look after well before the excitement outgrows us, and the point at which we would pause to protect that.', s: 100 }, { t: 'They want to slow it down; agree a later date.', s: 25 }, { t: 'They are nervous; reassure them and carry on.', s: 0 }, { t: 'A smaller launch.', s: 0 } ] } } },
  { id: 'P3-Q08', area: 'Awareness of others', ability: 'Working together', loop: 'same', ctx: 'Two people who think alike but work differently',
    text: 'Imagine two people who understand each other well in how they think, launching an offer together. One plans by working out which moves come first; the other makes things run reliably through routines.',
    ask: 'Which order of steps works best?',
    opts: [ { t: 'The planner sets the moves and the stop points; the builder turns them into a procedure and runs it; both review at the checkpoint.', s: 100 }, { t: 'The builder standardises the routine first; the planner fits the moves around it.', s: 25 }, { t: 'Both plan everything together in one document, then split the work.', s: 0 }, { t: 'The planner does both, because planning comes first.', s: 0 } ] },
  { id: 'P3-Q09', area: 'Awareness of others', ability: 'Working together', loop: 'alternate', ctx: 'Two people who think differently',
    text: 'Imagine two entrepreneurs building a new offer together who think and operate differently: one goes with their sense of the right thing and the story; the other works it out from the facts and the plan.',
    ask: 'Which order of steps works best?',
    opts: [ { t: 'The one who goes with the story shows a working example; they decide together; the one who works from the facts writes the detailed plan and scales it.', s: 100 }, { t: 'The one who works from the facts writes the plan; the other tests it, then tells the story so people take it up.', s: 50 }, { t: 'Each builds their own version and they merge at the end.', s: 0 }, { t: 'The one who works from the facts leads throughout, because it is a plan.', s: 0 } ] },
  { id: 'P3-Q10', area: 'Awareness of others', ability: 'Shared decision rules', loop: 'alternate', ctx: 'A joint decision on pricing',
    text: 'Imagine you and a partner who thinks and operates differently from you have 30 days to decide whether to keep a new price.',
    ask: 'Which rule for the decision works best?',
    opts: [ { t: 'One measure each of you trusts (sales figures and customer reaction), agreed points to stop or to expand, and a date to decide.', s: 100 }, { t: 'Agree a date and decide then.', s: 25 }, { t: 'Go with whichever of you feels more strongly on the day.', s: 0 }, { t: 'Use the figures only; a reaction is not evidence.', s: 0 } ] },
  { id: 'P3-Q11', area: 'Awareness of others', ability: 'Conflict repair', loop: 'same', ctx: 'A clash with someone who thinks like you',
    text: 'Imagine someone who thinks like you reaches a different decision from the same figures: you want to re-plan, they want to tighten the routine.',
    ask: 'What is your next move?',
    opts: [ { t: 'Say that you both think alike but work differently, and agree which approach should lead at this stage.', s: 100 }, { t: 'Split it: each runs their own version for a week and compare.', s: 25 }, { t: 'Show them why your approach is the right one.', s: 0 }, { t: 'Let them have it to keep the peace.', s: 0 } ] },
  { id: 'P3-Q12', area: 'Awareness of others', ability: 'Conflict repair', loop: 'alternate', ctx: 'A clash with someone who thinks differently from you', both: true,
    v: { architect: { text: 'Imagine a clash over the launch date with your partner, who thinks differently from you. They say it does not feel ready; you say the criteria are met.', ask: 'What is your next move?',
          opts: [ { t: 'Acknowledge their concern about the story first, then bring the discussion back to the two or three things that must hold.', s: 100 }, { t: 'Pause the launch until you both agree on everything.', s: 25 }, { t: 'Walk them through the plan to show the criteria are met.', s: 0 }, { t: 'Agree with them to end it.', s: 0 } ] },
         alchemist: { text: 'Imagine a clash over the launch date with your partner, who thinks differently from you. They say the criteria are not met; you say it feels ready.', ask: 'What is your next move?',
          opts: [ { t: 'Accept the points you had missed, then keep the heart of the story in a version that can be delivered.', s: 100 }, { t: 'Pause the launch until you both agree on everything.', s: 25 }, { t: 'Re-tell the story until they feel it.', s: 0 }, { t: 'Agree with them to end it.', s: 0 } ] } } }
];

const saved3 = {};
function p3q(id) { return part3.find(q => q.id === id); }
function p3list() {
  /* Screen order: self-awareness first, then every same-loop question, then every alternate-loop question. Mixed: self, then Architects, then Alchemists, then the shared questions. */
  const out = [];
  const one = (id, ver, recall) => out.push({ q: p3q(id), ver, recall });
  if (core === 'mixed') {
    one('P3-Q01', 'architect', '1A'); one('P3-Q01', 'alchemist', '2A'); one('P3-Q02', 'architect'); one('P3-Q02', 'alchemist'); one('P3-Q03', 'architect', '2B'); one('P3-Q04', 'architect');
    one('P3-Q05', 'mixed'); one('P3-Q07', 'alchemist'); one('P3-Q12', 'alchemist');      /* awareness of Architects */
    one('P3-Q06', 'mixed'); one('P3-Q07', 'architect'); one('P3-Q12', 'architect');      /* awareness of Alchemists */
    one('P3-Q08', 'mixed'); one('P3-Q11', 'mixed'); one('P3-Q09', 'mixed'); one('P3-Q10', 'mixed');
    return out;
  }
  const sameRec = core === 'architect' ? 'P3-Q05' : 'P3-Q06', altRec = core === 'architect' ? 'P3-Q06' : 'P3-Q05';
  one('P3-Q01', core, '1A'); one('P3-Q02', core); one('P3-Q03', core, '2B'); one('P3-Q04', core);
  one(sameRec, core); one('P3-Q08', core); one('P3-Q11', core);
  one(altRec, core); one('P3-Q07', core); one('P3-Q09', core); one('P3-Q10', core); one('P3-Q12', core);
  return out;
}
function p3item(i) { const l = p3list(); return i < l.length ? l[i] : null; }
function p3count() { return p3list().length; }

let at = screens.indexOf('report');   /* preview opens at the report screen (13 Nov 2026). Back and the jump buttons reach every earlier screen. */
const saved = {};
let profile = null;
const screen = document.getElementById('screen');
function esc(s) { return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* Settings: applied to the root; remembered in this browser only */
const settings = { font: 'inter', size: 100, spacing: 'standard', motion: 'standard', theme: 'light', transparency: 'standard' };
function loadSettings() { try { Object.assign(settings, JSON.parse(localStorage.getItem('edna-settings') || '{}')); } catch (e) {} }
function storeSettings() { try { localStorage.setItem('edna-settings', JSON.stringify(settings)); } catch (e) {} }
function applySettings() {
  const r = document.documentElement;
  r.classList.toggle('font-verdana', settings.font === 'verdana');
  r.classList.toggle('font-arial', settings.font === 'arial');
  r.style.fontSize = settings.size + '%';
  r.classList.toggle('spacing', settings.spacing === 'extra');
  r.classList.toggle('nomotion', settings.motion === 'reduced');
  r.classList.toggle('hc', settings.theme === 'contrast');
  if (settings.theme === 'dark') r.setAttribute('data-theme', 'dark'); else r.setAttribute('data-theme', 'light');
  r.classList.toggle('notransparency', settings.transparency === 'reduced');
  storeSettings();
}

function seg(name, label, options) {
  let h = '<div class="setting"><span>' + label + '</span><div class="seg">';
  options.forEach(o => { const on = settings[name] === o.v; h += '<label class="' + (on ? 'on' : '') + '"><input type="radio" name="set-' + name + '" value="' + o.v + '"' + (on ? ' checked' : '') + '>' + o.t + '</label>'; });
  return h + '</div></div>';
}

function render() {
  const s = screens[at]; setCore();
  const bar = document.getElementById('bar');
  const crumb = document.getElementById('crumb');
  if (s === 'welcome') {
    crumb.textContent = 'E-DNA assessment · Before you start';
    bar.style.width = '0%';
    screen.innerHTML = '<div class="wrap" style="gap:32px">'
      + '<section class="panel"><h1>Welcome to the <span class="brand">E-DNA Assessment</span></h1>'
      + '<p class="hook">Do you know how you have made every decision?<br>The ones that built your business, and the ones that cost it.</p>'
      + '<p>Brandscaling has found that decision-making is the single biggest factor in whether a business grows and scales fast.</p>'
      + '<p>The E-DNA (Entrepreneurial Decision Network Analysis) has been specifically designed using the Human Decision Intelligence Network Mechanism to improve your Decision Intelligence. It reveals your decision pattern across seven connected parts, so you finish knowing how to make decisions that are quicker, better, and right for you, your team and your business.</p>'
      + '<div class="timing">'
      + '<div class="box-orange"><b>The 7 parts of E-DNA</b><div class="tablewrap"><table class="parts"><thead><tr><th>Part</th><th>What it is</th><th>What it shows</th></tr></thead><tbody>'
      + '<tr><td>Part 1</td><td>Decision Intelligence Loop</td><td>How you make decisions.</td></tr>'
      + '<tr><td>Part 2</td><td>Subtype</td><td>How you execute decisions.</td></tr>'
      + '<tr><td>Part 3</td><td>Awareness of others</td><td>How well you understand your own decisions, and the decisions of others.</td></tr>'
      + '<tr><td>Part 4</td><td>Learning Style Preferences</td><td>How you take in and process information.</td></tr>'
      + '<tr><td>Part 5</td><td>Neurodiversity &amp; Accessibility</td><td>The conditions you work best in.</td></tr>'
      + '<tr><td>Part 6</td><td>Mindset &amp; Personality</td><td>The attitude you bring into a decision.</td></tr>'
      + '<tr><td>Part 7</td><td>Meta-Beliefs &amp; Values</td><td>The beliefs that allow, limit or override your decisions.</td></tr>'
      + '</tbody></table></div></div>'
      + '<div class="box-red"><b>About 30 minutes</b><span class="callout">Thirty minutes is less than most entrepreneurs lose to one decision that stalls, gets reversed, or turns into an argument with a partner.</span><ul class="tips"><li>Take the assessment in one sitting, without distractions.</li><li>Every question is multiple choice: pick the answer closest to what you actually do, not what you think you should do.</li><li>There are no right or wrong answers, and no result is better than another.</li></ul><span hidden></span></div>'
      + '<div class="box-indigo"><b>Access to your free report</b><span class="callout indigo">The reason behind every decision you\u2019ve ever made, in one FREE REPORT.</span><ul class="tips"><li>Your free analysis of all seven parts.</li><li>It shows why you and the people you work with can look at the same facts and reach different decisions.</li><li>The detailed report and workbook take it further, so you can improve and put theory into practice.</li></ul></div>'
      + '</div>'
      + '<p class="small">* E-DNA is Brandscaling’s hypothesis. It is Brandscaling’s own methodology, not a scientifically validated classification.</p></section>'
      + '<section class="panel"><h1>Set up your screen</h1><p class="small">These settings change only how the screen looks, never the questions, the answers or the scoring. You can change them at any time.</p><div class="settings">'
      + seg('font', 'Font', [{v:'inter',t:'Inter'},{v:'verdana',t:'Verdana'},{v:'arial',t:'Arial'}])
      + '<div class="setting"><span>Text size</span><div><input type="range" id="set-size" min="100" max="200" step="10" value="' + settings.size + '" aria-label="Text size"><div class="small" id="size-out">' + settings.size + '%</div></div></div>'
      + seg('spacing', 'Spacing', [{v:'standard',t:'Standard'},{v:'extra',t:'Extra line and letter spacing'}])
      + seg('motion', 'Motion', [{v:'standard',t:'Standard'},{v:'reduced',t:'Reduced'}])
      + seg('theme', 'Theme', [{v:'light',t:'Light'},{v:'dark',t:'Dark'},{v:'contrast',t:'High contrast'}])
      + seg('transparency', 'Transparency', [{v:'standard',t:'Standard'},{v:'reduced',t:'Reduced'}])
      + '</div></section>'
      + '<div class="actions"><button type="button" id="next">Start</button></div></div>';
    screen.querySelectorAll('.seg input').forEach(i => i.addEventListener('change', e => { settings[e.target.name.replace('set-', '')] = e.target.value; applySettings(); screen.querySelectorAll('.seg label').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); }));
    const range = document.getElementById('set-size');
    range.addEventListener('input', () => { settings.size = Number(range.value); document.getElementById('size-out').textContent = settings.size + '%'; applySettings(); });
    document.getElementById('next').addEventListener('click', go(1));
    return;
  }
  if (s === 'profile') {
    crumb.textContent = 'E-DNA assessment · About you';
    bar.style.width = '2%';
    const opts = [
      'I have an idea or a new business, and it is me alone or me with partners. No employees yet.',
      'My business has been running for about 1 to 5 years, with a small team of up to 5 people.',
      'I have 5 to 10 years’ experience, in one or more businesses, and have led a team or employed people.',
      'I have more than 10 years’ experience, one or more businesses, and have led a team or several teams.'];
    let h = '<div class="wrap" style="gap:32px"><section class="panel"><h1>About you</h1><p>One question before Part 1, to help us understand you better.<br>It does not change any result.</p></section>'
      + '<fieldset id="fprofile"><legend>Which describes you best today?<small>P0-Q01 · choose the closest</small></legend>';
    opts.forEach((o, i) => { h += '<label class="opt"><input type="radio" name="profile" id="P0-Q01-' + i + '" value="' + i + '"' + (profile === i ? ' checked' : '') + '><span>' + esc(o) + '</span></label>'; });
    h += '</fieldset><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next"' + (profile === null ? ' disabled' : '') + '>Continue</button></div></div>';
    screen.innerHTML = h;
    const mark = () => screen.querySelectorAll('#fprofile .opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked));
    mark();
    screen.querySelectorAll('input[name=profile]').forEach(r => r.addEventListener('change', e => { profile = Number(e.target.value); document.getElementById('next').disabled = false; mark(); }));
    document.getElementById('back').addEventListener('click', go(-1));
    document.getElementById('next').addEventListener('click', go(1));
    return;
  }
  if (s === 'intro') {
    crumb.textContent = 'E-DNA assessment · Part 1';
    bar.style.width = '4%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel strips"><h1><span class="sub brand">Core Type Decision Intelligence Loop Identity</span></h1>'
      + '<p><b>Identify your Dominant and Non-Dominant Decision Intelligence Loops</b><br>by assessing:</p>'
      + '<div class="moments"><div>Where your decisions begin</div><span aria-hidden="true">\u2192</span><div>What checks them</div><span aria-hidden="true">\u2192</span><div>What finally validates them</div></div>'
      + '<p>You will see 8 short scenarios. Each one asks three questions.</p>'
      + '<ul><li>Pick the answer closest to what you would actually do, not what you think you should do.</li><li>If it depends on the situation, say so and tell us in your own words.</li><li>Each scenario ends with a summary of your answers. Check it, tick it, then move on.</li></ul>'
      + '<p class="small">About 8 minutes.</p></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Start Part 1</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1));
    document.getElementById('next').addEventListener('click', go(1));
    return;
  }
  if (s === 'done1') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 1 complete';
    bar.style.width = '25%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Awesome, that\u2019s <span class="brand">Part 1/7</span> completed</h1><p>Let\u2019s move onto Part 2.</p></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Continue</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1));
    document.getElementById('next').addEventListener('click', go(1));
    return;
  }
  if (s === 'intro2') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 2';
    bar.style.width = '26%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="sub brand">Subtype Refinement</span></h1>'
      + '<p><b>Identify your subtype and how you execute decisions.</b></p>'
      + '<p>You will see 10 questions.</p>'
      + '<p class="small">About 3\u00bd minutes.</p></section>'
      + '<section class="panel"><h1>Preview as</h1><p class="small">Preview only. In the app the option set is chosen by the Part 1 result: Architect subtypes, Alchemist subtypes, or all eight for Mixed.</p><div class="seg" id="coreseg">'
      + [['architect','Architect'],['alchemist','Alchemist'],['mixed','Mixed']].map(c => '<label class="' + (core === c[0] ? 'on' : '') + '"><input type="radio" name="core" value="' + c[0] + '"' + (core === c[0] ? ' checked' : '') + '>' + c[1] + '</label>').join('') + '</div></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Start Part 2</button></div></div>';
    screen.querySelectorAll('#coreseg input').forEach(i => i.addEventListener('change', e => { core = e.target.value; for (const k in saved2) delete saved2[k]; setCore(); screen.querySelectorAll('#coreseg label').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); }));
    document.getElementById('back').addEventListener('click', go(-1));
    document.getElementById('next').addEventListener('click', go(1));
    return;
  }
  if (typeof s === 'string' && s[0] === 'p' && s.length === 2) { renderP2(Number(s[1])); return; }
  if (s === 'done2') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 2 \u00b7 Your answers';
    bar.style.width = '37%';
    let html = '<div class="wrap" style="gap:32px"><section class="summary" aria-live="polite"><h2>Is this right for you?</h2><p class="hint">Your ten answers. Go back to change any of them.</p>';
    part2.forEach((q, qi) => { const a = saved2[qi]; html += '<p class="line"><b>' + (qi + 1) + '. ' + esc(q.ctx) + ':</b> ' + (a ? esc(q.o[a]) : '<span class="blank">not answered yet</span>') + '</p>'; });
    const complete = part2.every((q, qi) => saved2[qi]);
    html += '<label class="approve"><input type="checkbox" id="approve"' + (complete ? '' : ' disabled') + '><span>Yes, this is right for me.</span></label>';
    html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>Continue</button><span class="hint" id="why">' + (complete ? 'Read the summary, then tick the box to continue.' : 'Some questions are not answered yet. Go back to answer them.') + '</span></div></section></div>';
    screen.innerHTML = html;
    document.getElementById('approve').addEventListener('change', e => { document.getElementById('next').disabled = !e.target.checked; document.getElementById('why').textContent = e.target.checked ? 'Approved. Your answers are saved as shown above.' : 'Read the summary, then tick the box to continue.'; });
    document.getElementById('back').addEventListener('click', go(-1));
    document.getElementById('next').addEventListener('click', go(1));
    return;
  }
  if (s === 'done2b') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 2 complete'; bar.style.width = '37%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Awesome, that\u2019s <span class="brand">Part 2/7</span> completed</h1><p>Let\u2019s move onto Part 3.</p></section><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Continue</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'intro3') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 3'; bar.style.width = '37%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="sub brand">Awareness of others</span></h1>'
      + '<p><b>How well you understand your own decisions, and the decisions of others.</b></p>'
      + '<p>You will see ' + p3count() + ' short situations. Some look back at decisions you made in Part 1; others show how someone else is deciding.</p>'
      + '<ul><li>Pick the answer closest to what you would actually do, not what you think you should do.</li><li>These questions have better and worse answers. The better answer is the same for everyone.</li></ul>'
      + '<p class="small">About ' + (core === 'mixed' ? '6\u00bd' : '5') + ' minutes.</p></section>'
      + '<section class="panel"><h1>Preview as</h1><p class="small">Preview only. In the app the questions follow the Part 1 result. Four questions change wording between Architect and Alchemist; Mixed sees both versions (16 questions).</p><div class="seg" id="coreseg">'
      + [['architect','Architect'],['alchemist','Alchemist'],['mixed','Mixed']].map(c => '<label class="' + (core === c[0] ? 'on' : '') + '"><input type="radio" name="core" value="' + c[0] + '"' + (core === c[0] ? ' checked' : '') + '>' + c[1] + '</label>').join('') + '</div></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Start Part 3</button></div></div>';
    screen.querySelectorAll('#coreseg input').forEach(i => i.addEventListener('change', e => { core = e.target.value; for (const k in saved3) delete saved3[k]; setCore(); render(); }));
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (typeof s === 'string' && s[0] === 't' && s.length >= 2) { renderP3(Number(s.slice(1))); return; }
  if (s === 'done3') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 3 \u00b7 Your answers'; bar.style.width = '54%';
    const list = p3list();
    let html = '<div class="wrap" style="gap:32px"><section class="summary" aria-live="polite"><h2>Is this right for you?</h2><p class="hint">Your answers. Go back to change any of them.</p>';
    let complete = true;
    list.forEach((it, i) => { const q = it.q; const v = q.v ? q.v[it.ver] : null; const opts = (it.ver === 'mixed' && q.mixedOpts) ? q.mixedOpts : (v && v.opts ? v.opts : q.opts); const key = q.id + '-' + it.ver + (it.recall || ''); const sv = saved3[key]; if (!sv || sv.a === undefined) complete = false;
      html += '<p class="line"><b>' + (i + 1) + '. ' + esc(it.recall ? 'Looking back: ' + scenarios.find(x => x.id === it.recall).title.toLowerCase() : q.ctx) + ':</b> ' + (sv && sv.a !== undefined ? (opts[sv.a].other ? 'Other: <span class="quote">\u201c' + esc(sv.otherText || '') + '\u201d</span>' : esc(opts[sv.a].t)) : '<span class="blank">not answered yet</span>') + '</p>'; });
    html += '<label class="approve"><input type="checkbox" id="approve"' + (complete ? '' : ' disabled') + '><span>Yes, this is right for me.</span></label>';
    html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>Continue</button><span class="hint" id="why">' + (complete ? 'Read the summary, then tick the box to continue.' : 'Some questions are not answered yet. Go back to answer them.') + '</span></div></section></div>';
    screen.innerHTML = html;
    document.getElementById('approve').addEventListener('change', e => { document.getElementById('next').disabled = !e.target.checked; document.getElementById('why').textContent = e.target.checked ? 'Approved. Your answers are saved as shown above.' : 'Read the summary, then tick the box to continue.'; if (e.target.checked && core !== 'mixed') { const other = core === 'architect' ? 'FF' : 'LL'; const q1 = saved3['P3-Q01-' + core + '1A'] || {}; const q3 = saved3['P3-Q03-' + core + '2B'] || {}; const k1 = q1.a !== undefined ? part3[0].opts[q1.a].k : null; const q3opts = part3[2].v[core].opts; const k3 = q3.a !== undefined ? q3opts[q3.a].k : null; p3Trigger = (k1 === other && k3 === other); } });
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'done3b') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 3 complete'; bar.style.width = '54%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Awesome, that\u2019s <span class="brand">Part 3/7</span> completed</h1><p>Let\u2019s move onto Part 4.</p></section><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Continue</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'intro4') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 4'; bar.style.width = '54%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="sub brand">Learning Style Preferences</span></h1>'
      + '<p><b>How you take in and process information.</b></p>'
      + '<p>You will see 10 short situations, each with one question.</p>'
      + '<ul><li>Pick the answer closest to what you actually do, not what you think you should do.</li><li>There are no right or wrong answers, and no style is better than another.</li></ul>'
      + '<p class="small">About 2\u00bd minutes.</p></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Start Part 4</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (typeof s === 'string' && s[0] === 'u' && s.length === 2) { renderP4(Number(s[1])); return; }
  if (s === 'done4') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 4 \u00b7 Your answers'; bar.style.width = '60%';
    let html = '<div class="wrap" style="gap:32px"><section class="summary" aria-live="polite"><h2>Is this right for you?</h2><p class="hint">Your ten answers. Go back to change any of them.</p>';
    part4.forEach((q, qi) => { const a = saved4[qi]; html += '<p class="line"><b>' + (qi + 1) + '. ' + esc(q.ctx) + ':</b> ' + (a !== undefined ? esc(q.opts[a].t) : '<span class="blank">not answered yet</span>') + '</p>'; });
    const complete = part4.every((q, qi) => saved4[qi] !== undefined);
    html += '<label class="approve"><input type="checkbox" id="approve"' + (complete ? '' : ' disabled') + '><span>Yes, this is right for me.</span></label>';
    html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>Continue</button><span class="hint" id="why">' + (complete ? 'Read the summary, then tick the box to continue.' : 'Some questions are not answered yet. Go back to answer them.') + '</span></div></section></div>';
    screen.innerHTML = html;
    document.getElementById('approve').addEventListener('change', e => { document.getElementById('next').disabled = !e.target.checked; document.getElementById('why').textContent = e.target.checked ? 'Approved. Your answers are saved as shown above.' : 'Read the summary, then tick the box to continue.'; });
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'done4b') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 4 complete'; bar.style.width = '60%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Awesome, that\u2019s <span class="brand">Part 4/7</span> completed</h1><p>Let\u2019s move onto Part 5.</p></section><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Continue</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'intro5') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 5'; bar.style.width = '60%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="sub brand">Neurodiversity &amp; Accessibility</span></h1>'
      + '<p><b>The conditions you work best in.</b></p>'
      + '<p>You will see 26 short statements about your everyday work. For each one, choose Never, Sometimes or Often.</p>'
      + '<ul><li>Describe what you actually experience, not what you think you should.</li><li>This is not a diagnosis. Your answers only change how E-DNA presents things to you.</li></ul>'
      + '<p class="small">About 4 minutes.</p></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Start Part 5</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (typeof s === 'string' && s[0] === 'v' && s.length === 2) { renderP5(Number(s[1])); return; }
  if (s === 'consent5') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 5'; bar.style.width = '73%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Thank you</h1><p>Your Part 5 answers are saved.</p></section></div><div class="modal" id="cmodal">' + '<div class="card" role="dialog" aria-modal="true" aria-labelledby="ct"><h2 id="ct">Before we show this comparison</h2>'
      + '<p>This compares your answers with how neurotypical and neurodivergent people often work. Because this can relate to health, we need your permission first.</p>'
      + '<ul><li>We use it to show you this comparison.</li><li>It is not a diagnosis.</li><li>You can withdraw your permission at any time in your settings.</li><li>Saying no changes nothing else in your report or in E\u2011DNA.</li></ul>'
      + '<label class="approve"><input type="checkbox" id="cagree"><span>I agree that Brandscaling can use my Part 5 answers to show this comparison.</span></label>'
      + '<div class="actions"><button type="button" id="cyes" disabled>Show my comparison</button><button type="button" class="back" id="cno">Not now</button></div></div>' + '</div>';
    const ag = document.getElementById('cagree'); ag.addEventListener('change', () => { document.getElementById('cyes').disabled = !ag.checked; });
    document.getElementById('cyes').addEventListener('click', () => { consent5 = true; go(1)(); });
    document.getElementById('cno').addEventListener('click', () => { consent5 = false; go(1)(); });
    return;
  }
  if (s === 'done5') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 5 complete'; bar.style.width = '73%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Awesome, that\u2019s <span class="brand">Part 5/7</span> completed</h1><p>Let\u2019s move onto Part 6.</p><p class="small">Preview note: permission ' + (consent5 ? 'given' : 'not given (\u201cNot now\u201d)') + '. In the app this is saved and the person moves straight to Part 6 either way.</p></section><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Continue</button></div></div>';
    document.getElementById('back').addEventListener('click', () => { at = screens.indexOf('v3'); render(); }); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'intro6') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 6'; bar.style.width = '73%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="sub brand">Mindset &amp; Personality</span></h1>'
      + '<p><b>The attitude you bring into a decision.</b></p>'
      + '<p>You will see 20 short statements. For each one, choose how far you agree, from Strongly disagree to Strongly agree.</p>'
      + '<ul><li>Answer for how you actually are, not how you would like to be.</li><li>No result is better than another. Each has its own strengths.</li></ul>'
      + '<p class="small">About 3 minutes.</p></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Start Part 6</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (typeof s === 'string' && s[0] === 'w' && s.length === 2) { renderP6(Number(s[1])); return; }
  if (s === 'done6') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 6 complete'; bar.style.width = '83%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Awesome, that\u2019s <span class="brand">Part 6/7</span> completed</h1><p>Let\u2019s move onto Part 7.</p></section><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Continue</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'intro7') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 7'; bar.style.width = '83%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="sub brand">Meta-Beliefs &amp; Values</span></h1>'
      + '<p><b>The beliefs that allow, limit or override your decisions.</b></p>'
      + '<p>You will see 21 questions. Most show two beliefs side by side: pick the one closer to what you believe, or say that you hold both. A few describe a decision and ask what you would do.</p>'
      + '<ul><li>No belief is right or wrong, and no position is better than another.</li><li>If neither fits, choose Neither / Other and tell us in your own words.</li></ul>'
      + '<p class="small">About 4\u00bd minutes.</p></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">Start Part 7</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (typeof s === 'string' && s[0] === 'y' && s.length >= 2) { renderP7(Number(s.slice(1))); return; }
  if (s === 'done7') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 7 \u00b7 Your answers'; bar.style.width = '97%';
    let html = '<div class="wrap" style="gap:32px"><section class="summary" aria-live="polite"><h2>Is this right for you?</h2><p class="hint">Your answers. Go back to change any of them.</p>';
    let complete = true;
    part7.forEach((q, qi) => { const l = p7label(qi); if (!l) complete = false; html += '<p class="line"><b>' + (qi + 1) + '.</b> ' + (l ? esc(l) : '<span class="blank">not answered yet</span>') + '</p>'; });
    html += '<label class="approve"><input type="checkbox" id="approve"' + (complete ? '' : ' disabled') + '><span>Yes, this is right for me.</span></label>';
    html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>Finish</button><span class="hint" id="why">' + (complete ? 'Read the summary, then tick the box to finish.' : 'Some questions are not answered yet. Go back to answer them.') + '</span></div></section></div>';
    screen.innerHTML = html;
    document.getElementById('approve').addEventListener('change', e => { document.getElementById('next').disabled = !e.target.checked; document.getElementById('why').textContent = e.target.checked ? 'Approved. Your answers are saved as shown above.' : 'Read the summary, then tick the box to finish.'; });
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'finish') {
    crumb.textContent = 'E-DNA assessment \u00b7 Complete'; bar.style.width = '100%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1>Congratulations, that\u2019s <span class="brand">Part 7/7</span> completed</h1><p><b>You have finished the E-DNA assessment.</b></p><p>Your free report is being prepared. It covers all seven parts.</p></section><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">See my report</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'report') {
    crumb.textContent = 'E-DNA assessment \u00b7 Your E-DNA report'; bar.style.width = '100%';
    screen.innerHTML = '<div class="wrap" style="gap:32px">' + reportHTML(false) + '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next">What comes next</button></div></div>' + '<div class="modal" id="cmodal" hidden><div class="card" role="dialog" aria-modal="true" aria-labelledby="ct"><h2 id="ct">Before we show this comparison</h2>' + '<p>This compares your answers with how neurotypical and neurodivergent people often work. Because this can relate to health, we need your permission first.</p>' + '<ul><li>We use it to show you this comparison.</li><li>It is not a diagnosis.</li><li>You can withdraw your permission at any time in your settings.</li><li>Saying no changes nothing else in your report or in E\u2011DNA.</li></ul>' + '<label class="approve"><input type="checkbox" id="cagree"><span>I agree that Brandscaling can use my Part 5 answers to show this comparison.</span></label>' + '<div class="actions"><button type="button" id="cyes" disabled>Show my comparison</button><button type="button" class="back" id="cno">Not now</button></div></div></div>';
    const rr = () => { window.scrollTo({ top: 0 }); render(); };
    wireReport(screen, rr, () => { const m = document.getElementById('cmodal'); m.hidden = false; });
    const ag = document.getElementById('cagree'); ag.addEventListener('change', () => { document.getElementById('cyes').disabled = !ag.checked; });
    document.getElementById('cyes').addEventListener('click', () => { consent5 = true; rr(); });
    document.getElementById('cno').addEventListener('click', () => { document.getElementById('cmodal').hidden = true; });
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (s === 'end') {
    crumb.textContent = 'E-DNA assessment \u00b7 What comes next'; bar.style.width = '100%';
    screen.innerHTML = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="brand">What comes next</span></h1><p><b>Your free report is saved in your account.</b> You can open it at any time, and download it as a PDF.</p>'
      + '<p><b>Your detailed report and workbook.</b> The detailed report explains every result: the scores behind it, your strengths and blind spots, the contexts in which you switch, and how E-DNA adapts to you. It comes with a free workbook built from your answers. \u00a399 for each E-DNA taken.</p>'
      + '<p><b>Your AI mentor.</b> ' + (core === 'mixed' ? (lean === 'architect' ? 'AI Architect is your primary AI mentor and will help you strengthen the Architect loop until it is confirmed as your Dominant Decision Intelligence Loop.' : lean === 'alchemist' ? 'AI Alchemist is your primary AI mentor and will help you strengthen the Alchemist loop until it is confirmed as your Dominant Decision Intelligence Loop.' : 'AI Architect and AI Alchemist will both work with you until your Dominant Decision Intelligence Loop is confirmed.') : (core === 'architect' ? 'AI Architect' : 'AI Alchemist') + ' is your primary AI mentor, with the ' + (core === 'architect' ? 'Architect' : 'Alchemist') + ' version of each workbook.') + '</p>'
      + '<p class="small">Preview note: this screen is a proposal. It is not in BS-DI-005 and has not been approved. Prices and rules from BS-DI-003 9.1 (BS-CUST-001).</p></section>'
      + '<div class="actions"><button type="button" class="back" id="back">Back to my report</button><button type="button" id="next">Get my detailed report (\u00a399)</button></div></div>';
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1));
    return;
  }
  if (s === 'detailed') {
    crumb.textContent = 'E-DNA assessment \u00b7 Your detailed E-DNA report'; bar.style.width = '100%';
    screen.innerHTML = '<div class="wrap" style="gap:32px">' + detailedHTML(false) + '<div class="actions"><button type="button" class="back" id="back">Back</button></div></div>';
    wireReport(screen, () => { window.scrollTo({ top: 0 }); render(); }, () => {});
    document.getElementById('back').addEventListener('click', go(-1)); return;
  }
  if (s === 'adapt') {
    crumb.textContent = 'E-DNA assessment \u00b7 What to adapt, and what the app provides'; bar.style.width = '100%';
    screen.innerHTML = '<div class="wrap" style="gap:32px">' + adaptHTML(false) + '<div class="actions"><button type="button" class="back" id="back">Back to my detailed report</button></div></div>';
    wireReport(screen, () => { window.scrollTo({ top: 0 }); render(); }, () => {});
    document.getElementById('back').addEventListener('click', go(-1)); return;
  }
  if (s === 'supp') {
    crumb.textContent = 'E-DNA assessment \u00b7 Part 1 \u00b7 Two more questions'; bar.style.width = '25%';
    const qs = [ { id: 'P1-Q25', ask: 'When you plan the next stage of your business, what do you naturally set?', opts: ['Staged checkpoints over the next few months, each with a clear measure.', 'A long-range vision, with the leaps and the big milestones of the story along the way.'] },
                 { id: 'P1-Q26', ask: 'Think of the last time you were under real pressure on a decision. Which is closest?', opts: ['I set the analysis aside and went with what the moment felt like.', 'I set the feeling aside and went only on the facts and numbers.'] } ];
    let html = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="brand">Two more questions</span></h1><div class="when">About how you plan, and what you do under pressure</div></section>';
    qs.forEach((q, qi) => { const sv = savedSupp[q.id] || {}; html += '<fieldset id="f' + qi + '"><legend>' + esc(q.ask) + '<small>' + q.id + ' \u00b7 choose one</small></legend>';
      q.opts.forEach((t, oi) => { html += '<label class="opt"><input type="radio" name="' + q.id + '" value="' + oi + '" autocomplete="off"' + (sv.a === oi ? ' checked' : '') + '><span>' + esc(t) + '</span></label>'; });
      html += '<label class="opt"><input type="radio" name="' + q.id + '" value="other" autocomplete="off"' + (sv.a === 'other' ? ' checked' : '') + '><span>Other</span></label><div class="explain" id="x' + qi + '" hidden><label for="' + q.id + '-text">Tell us in your own words (required).</label><textarea id="' + q.id + '-text">' + esc(sv.text || '') + '</textarea></div></fieldset>'; });
    html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>Continue</button><span class="hint" id="why"></span></div></div>';
    screen.innerHTML = html;
    const upd = () => { let okAll = true; qs.forEach((q, qi) => { const sv = savedSupp[q.id] || {}; const box = document.getElementById('x' + qi); box.hidden = sv.a !== 'other'; if (sv.a === undefined || (sv.a === 'other' && !(sv.text || '').trim())) okAll = false; }); screen.querySelectorAll('.opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); document.getElementById('next').disabled = !okAll; document.getElementById('why').textContent = okAll ? '' : 'Answer both questions to continue.'; };
    screen.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', e => { const v = e.target.value; savedSupp[e.target.name] = Object.assign(savedSupp[e.target.name] || {}, { a: v === 'other' ? 'other' : Number(v) }); upd(); }));
    screen.querySelectorAll('textarea').forEach(t => t.addEventListener('input', () => { const id = t.id.replace('-text', ''); savedSupp[id] = Object.assign(savedSupp[id] || {}, { text: t.value }); upd(); }));
    upd();
    document.getElementById('back').addEventListener('click', go(-1)); document.getElementById('next').addEventListener('click', go(1)); return;
  }
  if (typeof s === 'string' && /^r\d+$/.test(s)) { renderScenario(Number(s.slice(1))); return; }
  renderScenario(s);
}

function skipScreen(s) { if (typeof s === 'number' && s >= 8) return !reserveNow('A'); if (typeof s === 'string' && /^r\d+$/.test(s)) return !reserveNow('B'); if (typeof s === 'string' && s[0] === 't' && Number(s.slice(1)) >= p3count()) return true; return false; }
function go(step) { return () => { const cur = screens[at]; if (typeof cur === 'number' || (typeof cur === 'string' && /^r\d+$/.test(cur))) { save(); if ((cur === 13 || cur === 'r13') && step > 0) reserveDone = true; } at += step; while (skipScreen(screens[at])) at += step; window.scrollTo({ top: 0 }); render(); }; }




function renderP7(qi) {
  const q = part7[qi]; const n = part7.length; const flip = (qi % 2) === 1;
  document.getElementById('crumb').textContent = 'E-DNA assessment \u00b7 Part 7 \u00b7 Question ' + (qi + 1) + ' of ' + n;
  document.getElementById('bar').style.width = (83 + (qi + 1) / n * 14) + '%';
  let html = '<div class="wrap" style="gap:32px">';
  html += '<section class="panel"><h1><span class="brand">' + esc(q.ctx || 'What I believe') + '</span></h1><div class="when">Question ' + (qi + 1) + ' of ' + n + ' \u00b7 ' + q.id + '</div>' + (q.text ? '<p>' + esc(q.text) + '</p>' : '') + '</section>';
  let opts;
  if (q.stall) opts = q.stall.map(o => ({ t: o.t, k: o.k })).concat([{ t: 'Neither / Other', k: 'other', other: true }]);
  else { const poles = flip ? [{ t: q.c, k: 'B' }, { t: q.a, k: 'A' }] : [{ t: q.a, k: 'A' }, { t: q.c, k: 'B' }]; opts = poles.concat([{ t: q.both || 'Both: which one leads depends on the situation.', k: 'both', both: true }, { t: 'Neither / Other', k: 'other', other: true }]); }
  const sv = saved7[qi] || {};
  html += '<fieldset id="f0"><legend>' + esc(q.ask || 'Which is closer to what you believe?') + '<small>choose one</small></legend>';
  opts.forEach((o, oi) => { html += '<label class="opt"><input type="radio" name="' + q.id + '" id="' + q.id + '-' + oi + '" value="' + o.k + '" autocomplete="off"' + (sv.k === o.k ? ' checked' : '') + '><span>' + esc(o.t) + '</span></label>';
    if (o.k === 'both') html += '<div class="explain" id="xboth" hidden><label for="' + q.id + '-bothtext">Tell us when each one leads, or give an example (required).</label><textarea id="' + q.id + '-bothtext" class="p7text">' + esc(sv.k === 'both' ? (sv.otherText || '') : '') + '</textarea></div>';
    if (o.k === 'other') html += '<div class="explain" id="xother" hidden><label for="' + q.id + '-other">Tell us in your own words (required).</label><textarea id="' + q.id + '-other" class="p7text">' + esc(sv.k === 'other' ? (sv.otherText || '') : '') + '</textarea></div>'; });
  html += '</fieldset>';
  html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>' + (qi === n - 1 ? 'See my answers' : 'Next question') + '</button></div></div>';
  screen.innerHTML = html;
  const mark = () => screen.querySelectorAll('#f0 .opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); mark();
  
  const ok = () => { const s = saved7[qi] || {}; const bb = document.getElementById('xboth'), bo = document.getElementById('xother'); if (bb) bb.hidden = s.k !== 'both'; if (bo) bo.hidden = s.k !== 'other'; if (s.k === 'other' || s.k === 'both') return (s.otherText || '').trim().length > 0; return !!s.k; };
  screen.querySelectorAll('input[name="' + q.id + '"]').forEach(r => r.addEventListener('change', e => { saved7[qi] = Object.assign(saved7[qi] || {}, { k: e.target.value }); mark(); document.getElementById('next').disabled = !ok(); }));
  screen.querySelectorAll('textarea.p7text').forEach(ta => ta.addEventListener('input', () => { saved7[qi] = Object.assign(saved7[qi] || {}, { otherText: ta.value }); document.getElementById('next').disabled = !ok(); }));
  screen.querySelectorAll('input[name="' + q.id + '"]').forEach(r => r.addEventListener('change', () => { saved7[qi].otherText = ''; screen.querySelectorAll('textarea.p7text').forEach(ta => { ta.value = ''; }); document.getElementById('next').disabled = !ok(); }));
  document.getElementById('next').disabled = !ok();
  document.getElementById('next').addEventListener('click', go(1)); document.getElementById('back').addEventListener('click', go(-1));
}
function p7label(qi) { const q = part7[qi]; const s = saved7[qi] || {}; if (!s.k) return null; if (s.k === 'other') return 'Neither / Other: \u201c' + s.otherText + '\u201d'; if (q.stall) return q.stall.find(o => o.k === s.k).t; if (s.k === 'A') return q.a; if (s.k === 'B') return q.c; return (q.both || 'Both: which one leads depends on the situation.') + (s.otherText ? ' \u201c' + s.otherText + '\u201d' : ''); }
function renderP6(pg) {
  const idx = P6_PAGES[pg]; const total = part6.length; const first = idx[0] + 1, last = idx[idx.length - 1] + 1;
  document.getElementById('crumb').textContent = 'E-DNA assessment \u00b7 Part 6 \u00b7 Statements ' + first + ' to ' + last + ' of ' + total;
  document.getElementById('bar').style.width = (73 + (pg + 1) / P6_PAGES.length * 10) + '%';
  let html = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="brand">How I am when I decide</span></h1><div class="when">Statements ' + first + ' to ' + last + ' of ' + total + ' \u00b7 choose how far you agree with each</div></section>';
  html += '<div style="display:grid;gap:12px">';
  idx.forEach(i => { const st = part6[i]; html += '<div class="stmt' + (saved6[i] !== undefined ? ' on' : '') + '" id="sx' + i + '"><div>' + esc(st.t) + '</div><div class="seg">' + P6_SCALE.map((l, v) => '<label class="' + (saved6[i] === v ? 'on' : '') + '"><input type="radio" name="' + st.id + '" value="' + v + '" autocomplete="off"' + (saved6[i] === v ? ' checked' : '') + '>' + l + '</label>').join('') + '</div></div>'; });
  html += '</div>';
  html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>' + (pg === P6_PAGES.length - 1 ? 'Finish Part 6' : 'Next') + '</button><span class="hint" id="why"></span></div></div>';
  screen.innerHTML = html;
  const upd = () => { const missing = idx.filter(i => saved6[i] === undefined).length; document.getElementById('next').disabled = missing > 0; document.getElementById('why').textContent = missing ? 'Still needed: ' + missing + (missing === 1 ? ' statement.' : ' statements.') : 'All answered.'; screen.querySelectorAll('.stmt').forEach(d => { const on = d.querySelector('input:checked'); d.classList.toggle('on', !!on); d.querySelectorAll('.seg label').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); }); };
  screen.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', e => { const i = part6.findIndex(s => s.id === e.target.name); saved6[i] = Number(e.target.value); upd(); }));
  upd();
  document.getElementById('next').addEventListener('click', go(1)); document.getElementById('back').addEventListener('click', go(-1));
}
function renderP5(pg) {
  const idx = P5_PAGES[pg]; const total = part5.length; const first = idx[0] + 1, last = idx[idx.length - 1] + 1;
  document.getElementById('crumb').textContent = 'E-DNA assessment \u00b7 Part 5 \u00b7 Statements ' + first + ' to ' + last + ' of ' + total;
  document.getElementById('bar').style.width = (60 + (pg + 1) / P5_PAGES.length * 13) + '%';
  let html = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="brand">How I work, day to day</span></h1><div class="when">Statements ' + first + ' to ' + last + ' of ' + total + ' \u00b7 choose Never, Sometimes or Often for each</div></section>';
  html += '<div style="display:grid;gap:12px">';
  idx.forEach(i => { const st = part5[i]; html += '<div class="stmt' + (saved5[i] !== undefined ? ' on' : '') + '" id="st' + i + '"><div>' + esc(st.t) + '</div><div class="seg">' + P5_SCALE.map((l, v) => '<label class="' + (saved5[i] === v ? 'on' : '') + '"><input type="radio" name="' + st.id + '" value="' + v + '" autocomplete="off"' + (saved5[i] === v ? ' checked' : '') + '>' + l + '</label>').join('') + '</div></div>'; });
  html += '</div>';
  html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>' + (pg === P5_PAGES.length - 1 ? 'Finish Part 5' : 'Next') + '</button><span class="hint" id="why"></span></div></div>';
  screen.innerHTML = html;
  const upd = () => { const missing = idx.filter(i => saved5[i] === undefined).length; document.getElementById('next').disabled = missing > 0; document.getElementById('why').textContent = missing ? 'Still needed: ' + missing + (missing === 1 ? ' statement.' : ' statements.') : 'All answered.'; screen.querySelectorAll('.stmt').forEach(d => { const on = d.querySelector('input:checked'); d.classList.toggle('on', !!on); d.querySelectorAll('.seg label').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); }); };
  screen.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', e => { const i = part5.findIndex(s => s.id === e.target.name); saved5[i] = Number(e.target.value); upd(); }));
  upd();
  document.getElementById('next').addEventListener('click', go(1)); document.getElementById('back').addEventListener('click', go(-1));
}
function renderP4(qi) {
  const q = part4[qi]; const order = p4order(qi, q.opts.length);
  document.getElementById('crumb').textContent = 'E-DNA assessment \u00b7 Part 4 \u00b7 Question ' + (qi + 1) + ' of 10';
  document.getElementById('bar').style.width = (54 + (qi + 1) / 10 * 6) + '%';
  let html = '<div class="wrap" style="gap:32px"><section class="panel"><h1><span class="brand">' + esc(q.ctx) + '</span></h1><div class="when">Question ' + (qi + 1) + ' of 10 \u00b7 ' + q.id + '</div></section>';
  html += '<fieldset id="f0"><legend>' + esc(q.ask) + '<small>choose one</small></legend>';
  order.forEach(oi => { html += '<label class="opt"><input type="radio" name="' + q.id + '" id="' + q.id + '-' + oi + '" value="' + oi + '" autocomplete="off"' + (saved4[qi] === oi ? ' checked' : '') + '><span>' + esc(q.opts[oi].t) + '</span></label>'; });
  html += '</fieldset><div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next"' + (saved4[qi] !== undefined ? '' : ' disabled') + '>' + (qi === 9 ? 'See my answers' : 'Next question') + '</button></div></div>';
  screen.innerHTML = html;
  const mark = () => screen.querySelectorAll('#f0 .opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); mark();
  screen.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', e => { saved4[qi] = Number(e.target.value); document.getElementById('next').disabled = false; mark(); }));
  document.getElementById('next').addEventListener('click', go(1)); document.getElementById('back').addEventListener('click', go(-1));
}
function renderP3(i) {
  const it = p3item(i); const q = it.q; const ver = it.ver; const n = p3count();
  const v = q.v ? q.v[ver] : null;
  document.getElementById('crumb').textContent = 'E-DNA assessment \u00b7 Part 3 \u00b7 Question ' + (i + 1) + ' of ' + n;
  document.getElementById('bar').style.width = (37 + (i + 1) / n * 17) + '%';
  let html = '<div class="wrap" style="gap:32px">';
  let text = v && v.text ? v.text : (q.text || '');
  let title = q.ctx;
  if (it.recall) { const sc = scenarios.find(s => s.id === it.recall); title = 'Looking back: ' + sc.title.toLowerCase(); text = sc.text; }
  html += '<section class="panel"><h1><span class="brand">' + esc(title) + '</span></h1><div class="when">Question ' + (i + 1) + ' of ' + n + ' \u00b7 ' + q.id + (it.recall ? ' \u00b7 Scenario ' + it.recall + ' as you saw it in Part 1' : '') + '</div>' + (text ? '<p>' + esc(text) + '</p>' : '') + '</section>';
  const ask = v && v.ask ? v.ask : q.ask;
  const opts = (ver === 'mixed' && q.mixedOpts) ? q.mixedOpts : (v && v.opts ? v.opts : q.opts);
  const key = q.id + '-' + ver + (it.recall || '');
  const sv = saved3[key] || {};
  html += '<fieldset id="f0"><legend>' + esc(ask) + '<small>choose one</small></legend>';
  opts.forEach((o, oi) => { html += '<label class="opt"><input type="radio" name="' + key + '" id="' + key + '-' + oi + '" value="' + oi + '" autocomplete="off"' + (sv.a === oi ? ' checked' : '') + '><span>' + esc(o.t) + '</span></label>'; if (o.other) html += '<div class="explain" id="xother" hidden><label for="' + key + '-othertext">Tell us in your own words (required).</label><textarea id="' + key + '-othertext">' + esc(sv.otherText || '') + '</textarea></div>'; });
  html += '</fieldset>';
  if (q.trigger) {
    html += '<fieldset id="ftrig" hidden><legend>' + esc(q.trigger.ask) + '<small>recorded, not scored</small></legend>';
    q.trigger.opts.forEach((t, ti) => { html += '<label class="opt"><input type="radio" name="' + key + '-trig" value="' + ti + '" autocomplete="off"' + (sv.trig === ti ? ' checked' : '') + '><span>' + esc(t) + '</span></label>'; });
    html += '<div class="explain" id="xtrig" hidden><label for="' + key + '-trigtext">Tell us in your own words.</label><textarea id="' + key + '-trigtext">' + esc(sv.trigText || '') + '</textarea></div></fieldset>';
  }
  html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>' + (i === n - 1 ? 'See my answers' : 'Next question') + '</button></div>';
  html += '</div>';
  screen.innerHTML = html;
  const mark = () => screen.querySelectorAll('.opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); mark();
  const ready = () => { const s = saved3[key]; if (!s || s.a === undefined) return false; const o = opts[s.a]; return !(o.other && !(s.otherText || '').trim()); };
  const showOther = () => { const box = document.getElementById('xother'); if (!box) return; const s = saved3[key]; box.hidden = !(s && s.a !== undefined && opts[s.a].other); };
  
  const showTrig = () => { if (!q.trigger) return; const s = saved3[key]; const o = s && s.a !== undefined ? opts[s.a] : null; const sw = o && o.k && o.k !== 'NA' && o.k !== (ver === 'architect' ? 'LL' : 'FF'); document.getElementById('ftrig').hidden = !sw; };
  screen.querySelectorAll('input[name="' + key + '"]').forEach(r => r.addEventListener('change', e => { saved3[key] = Object.assign(saved3[key] || {}, { a: Number(e.target.value) }); mark(); showTrig(); showOther(); document.getElementById('next').disabled = !ready(); }));
  const ot = document.getElementById(key + '-othertext'); if (ot) { ['input','keyup','change','paste'].forEach(ev => ot.addEventListener(ev, () => { saved3[key] = Object.assign(saved3[key] || {}, { otherText: ot.value }); document.getElementById('next').disabled = !ready(); })); showOther(); }
  document.getElementById('next').disabled = !ready();
  if (q.trigger) {
    screen.querySelectorAll('input[name="' + key + '-trig"]').forEach(r => r.addEventListener('change', e => { saved3[key] = Object.assign(saved3[key] || {}, { trig: Number(e.target.value) }); mark(); document.getElementById('xtrig').hidden = Number(e.target.value) !== 3; }));
    const tt = document.getElementById(key + '-trigtext'); tt.addEventListener('input', () => { saved3[key] = Object.assign(saved3[key] || {}, { trigText: tt.value }); });
    showTrig(); if (sv.trig === 3) document.getElementById('xtrig').hidden = false;
  }
  document.getElementById('next').addEventListener('click', go(1)); document.getElementById('back').addEventListener('click', go(-1));
}


function renderP2(qi) {
  const q = part2[qi]; const keys = p2keys(); const order = p2order(qi, keys);
  document.getElementById('crumb').textContent = 'E-DNA assessment \u00b7 Part 2 \u00b7 Question ' + (qi + 1) + ' of 10';
  document.getElementById('bar').style.width = (26 + (qi + 1) / 10 * 11) + '%';
  let html = '<div class="wrap" style="gap:32px">';
  html += '<section class="panel"><h1><span class="brand">' + esc(q.ctx) + '</span></h1><div class="when">Question ' + (qi + 1) + ' of 10 \u00b7 ' + q.id + '</div></section>';
  const opt = k => '<label class="opt"><input type="radio" name="' + q.id + '" id="' + q.id + '-' + k + '" value="' + k + '" autocomplete="off"' + (saved2[qi] === k ? ' checked' : '') + '><span>' + esc(q.o[k]) + '</span></label>';
  if (core === 'mixed') {
    html += '<fieldset id="f0"><legend>' + esc(q.ask) + '<small>Please select only 1 answer.</small></legend><div class="pairs">';
    p2pairs(qi).forEach(pr => { html += '<div class="pair">' + opt(pr[0]) + opt(pr[1]) + '</div>'; });
    html += '</div></fieldset>';
  } else {
    html += '<fieldset id="f0"><legend>' + esc(q.ask) + '<small>choose one</small></legend>';
    order.forEach(k => { html += opt(k); });
    html += '</fieldset>';
  }
  html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next"' + (saved2[qi] ? '' : ' disabled') + '>' + (qi === 9 ? 'See my answers' : 'Next question') + '</button></div></div>';
  screen.innerHTML = html;
  const mark = () => screen.querySelectorAll('#f0 .opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked)); mark();
  screen.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', e => { saved2[qi] = e.target.value; document.getElementById('next').disabled = false; mark(); }));
  document.getElementById('next').addEventListener('click', go(1));
  document.getElementById('back').addEventListener('click', go(-1));
}

function save() {
  let idx = screens[at]; if (typeof idx === 'string' && /^r\d+$/.test(idx)) idx = Number(idx.slice(1)); const sc = scenarios[idx]; if (!sc) return;
  const a = {};
  sc.q.forEach((q, qi) => {
    const chosen = screen.querySelector('input[name="' + sc.id + '-q' + qi + '"]:checked');
    a['q' + qi] = chosen ? chosen.value : null;
    a['t' + qi] = (document.getElementById(q.id + '-text') || {}).value || '';
  });
  const ap = document.getElementById('approve'); a.approved = !!(ap && ap.checked);
  saved[idx] = a;
}
function restore(idx) {
  const sc = scenarios[idx]; const a = saved[idx]; if (!sc || !a) return;
  sc.q.forEach((q, qi) => {
    if (a['q' + qi] !== null) { const r = screen.querySelector('input[name="' + sc.id + '-q' + qi + '"][value="' + a['q' + qi] + '"]'); if (r) r.checked = true; }
    const t = document.getElementById(q.id + '-text'); if (t) t.value = a['t' + qi];
  });
  const ap = document.getElementById('approve'); if (ap) ap.checked = a.approved;
}

function renderScenario(idx) {
  const sc = scenarios[idx];
  const total = scenarioTotal(); document.getElementById('crumb').textContent = 'E-DNA assessment · Part 1 · Scenario ' + (idx + 1) + ' of ' + total + (sc.reserve ? ' · extra scenario' : '');
  document.getElementById('bar').style.width = (4 + (idx + 1) / total * 21) + '%';
  let html = '<div class="wrap" style="gap:32px">';
  html += '<section class="panel"><h1><span class="brand">' + esc(sc.title) + '</span></h1><div class="when">' + esc(sc.when) + '</div><p>' + esc(sc.text) + '</p></section>';
  sc.q.forEach((q, qi) => {
    // Preview: a fixed mixed order so the same option is not always first. Live app: random order on every question.
    const pattern = [[1, 0], [0, 1], [1, 0], [0, 1], [1, 0], [0, 1]];
    const order = pattern[(idx * 3 + qi) % pattern.length];
    html += '<fieldset id="f' + qi + '"><legend>' + esc(q.ask) + '<small>' + esc(q.id) + ' · choose one</small></legend>';
    order.forEach(oi => { html += '<label class="opt"><input type="radio" name="' + sc.id + '-q' + qi + '" id="' + q.id + '-' + oi + '" value="' + oi + '" autocomplete="off"><span>' + esc(q.opts[oi]) + '</span></label>'; });
    html += '<label class="opt"><input type="radio" name="' + sc.id + '-q' + qi + '" id="' + q.id + '-either" value="either" autocomplete="off"><span>' + esc(EITHER) + '</span></label>';
    html += '<div class="explain" id="x' + qi + '" hidden><label for="' + q.id + '-text">Tell us in your own words what you would do (required).</label><textarea id="' + q.id + '-text" placeholder="For example: when it is my own money I start with the figures; when it is for someone else I go on how it feels."></textarea></div>';
    html += '</fieldset>';
  });
  html += '<section class="summary" aria-live="polite"><h2>Is this right for you?</h2><p class="hint">This is what your answers say. Change any answer above and it updates here.</p>';
  sc.q.forEach((q, qi) => { html += '<p class="line" id="s' + qi + '"><b>' + esc(q.lead) + ':</b> <span class="blank">not answered yet</span></p>'; });
  html += '<label class="approve"><input type="checkbox" id="approve" disabled><span>Yes, this is right for me.</span></label>';
  const last = idx === scenarios.length - 1;
  html += '<div class="actions"><button type="button" class="back" id="back">Back</button><button type="button" id="next" disabled>' + 'Next scenario' + '</button><span class="hint" id="why"></span></div>';
  html += '</section></div>';
  screen.innerHTML = html;
  screen.querySelectorAll('input[type=radio], input[type=checkbox]').forEach(i => { i.checked = false; });
  screen.querySelectorAll('textarea').forEach(t => { t.value = ''; });
  restore(idx);
  screen.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', () => update(idx)));
  screen.querySelectorAll('textarea').forEach(t => { ['input', 'keyup', 'change', 'paste'].forEach(ev => t.addEventListener(ev, () => update(idx))); });
  document.getElementById('approve').addEventListener('change', () => update(idx));
  document.getElementById('next').addEventListener('click', go(1));
  document.getElementById('back').addEventListener('click', go(-1));
  update(idx);
}

function update(idx) {
  const sc = scenarios[idx];
  let complete = true; const missing = [];
  sc.q.forEach((q, qi) => {
    const chosen = screen.querySelector('input[name="' + sc.id + '-q' + qi + '"]:checked');
    const box = document.getElementById('x' + qi);
    const line = document.getElementById('s' + qi);
    screen.querySelectorAll('#f' + qi + ' .opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked));
    if (!chosen) { complete = false; missing.push(qi + 1); box.hidden = true; line.innerHTML = '<b>' + esc(q.lead) + ':</b> <span class="blank">not answered yet</span>'; return; }
    if (chosen.value === 'either') {
      box.hidden = false;
      const words = document.getElementById(q.id + '-text').value.trim();
      if (!words) { complete = false; missing.push(qi + 1); line.innerHTML = '<b>' + esc(q.lead) + ':</b> depends on the situation. <span class="blank">Please add your own words above.</span>'; }
      else line.innerHTML = '<b>' + esc(q.lead) + ':</b> depends on the situation: <span class="quote">“' + esc(words) + '”</span>';
    } else { box.hidden = true; line.innerHTML = '<b>' + esc(q.lead) + ':</b> ' + esc(q.opts[Number(chosen.value)]); }
  });
  const approve = document.getElementById('approve'); const next = document.getElementById('next'); const why = document.getElementById('why');
  approve.disabled = !complete; if (!complete) approve.checked = false;
  next.disabled = !(complete && approve.checked);
  why.textContent = !complete ? ('Still needed: question ' + missing.join(', ') + '. Then tick the box.') : (approve.checked ? 'Approved. Your answers are saved as shown above.' : 'Read the summary, then tick the box to continue.');
}








































































