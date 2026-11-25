# Website build record — for the iOS app

**What this is.** Everything the website does for members, written down so the iOS app can be
built to match. The iOS screens will look different, but the backend, the data, the rules,
the emails and most of the behaviour are the same and must stay the same.

**Keep it current.** Every website change that a member can see, or that changes what the
backend does, gets a line here in the same commit. Newest decisions win; each one is dated.

Last updated: 25 November 2026 (Munawar).

---

## 1 · Where everything lives

| Piece | Where | Deploys by |
|---|---|---|
| Website (React dashboard, sign-in) | `EDNAfrontend/src/` · GitHub `BRANDSCALING/EDNAfrontend` | push to `main` → AWS Amplify app `d2lji6p2f19yvj` |
| Decision Intelligence screens | `EDNAfrontend/public/app/` (Fariza's approved preview + `site.part.js`, the production bridge) | same as above |
| E-DNA assessment and reports | `EDNAfrontend/public/edna/` | same as above |
| Public pages (home, About, DI page, Advanced Report page, legal) | `EDNAfrontend/public/home/`, `public/privacy-policy/` … | same as above |
| Backend (shared with iOS) | `brandscaling_iosapp_nodejsbackend-main` · GitHub `BRANDSCALING/iosapp_nodejsbackend` | push to `main` → App Runner `ios-backend` (`qpbpbpiegm.us-east-1.awsapprunner.com`) |
| Sign-in | Cognito pool `us-east-1_u8tyHoqJi`, app client `7p2sthlo5p654mi99gcr8rjhtd` (same as iOS) | — |
| Emails | GoHighLevel workflows, fed by the backend's outbox | GHL (Fiza Ashraf) |

The website address is **https://www.brandscaling.co.uk**. Without `www`, only the bare homepage
redirects (and to `http://`); deeper links 404. That is a domain-forwarding setting, not code.

The design source for the app screens is Fariza's approved preview (the
"Brandscaling app — Decision Intelligence screens (preview)" artifact, identical to
`public/app/index.html` without `site.part.js`). The written specs are the BS-AI series in the
19 Nov team handover (`BS-AI-001` … `BS-AI-013`).

---

## 2 · How the member area is put together (website)

- **One dashboard.** `/` signed in shows the React dashboard (`BrandDashboard.tsx`). Its
  sidebar: **Home** · **Decision Intelligence** (Make a decision, Decision log, Decision rooms,
  My reports, My workbooks, My E-DNA) · **Infinite Scaling** (Soon) · **AI mentors** (Soon) ·
  **Settings** · Log out. *(Fariza's 24 Nov huddle; Home and Settings 25 Nov.)*
- **Home and every DI tab are the approved app design**, drawn by `/app/index.html?embed=1&screen=…`
  in one iframe that stays loaded. Screens: `home, make, log, rooms, reports, workbooks, edna,
  scaling, settings`.
- **The dashboard and the app talk by `postMessage`** (same origin only):
  - dashboard → app: `{ bsShow: '<screen>' }` (a sidebar click);
  - app → dashboard: `{ bsScreen: '<screen>' }` (the app moved; the sidebar follows),
    `{ bsGo: 'overview' }`, `{ bsGo: 'profile', report, hash }` (open a report).
- **Deep links:** `/?di=<screen>` opens a tab; `/?invite=<token>` opens an invitation (kept in
  `localStorage.bs_pending_invite` through sign-in, then Decision rooms opens and the join runs);
  `/app` on its own forwards: `#invite=` → `/?invite=`, `#room=` → `/?di=rooms&room=`,
  anything else → `/?di=make`; `#review=` still runs in `/app`.
- **Reports** open in the dashboard: `/edna/index.html?embed=1` + `''` (basic) · `#detailed` ·
  `#detailed-N` (Advanced Report at part N) · `#plan`. A "‹ My reports" link goes back.

**iOS:** the same screens, the same order of tabs, the same deep-link meanings (an invite link
must open the invitation in the app).

---

## 3 · Features, screen by screen

### 3.1 Sign-up and sign-in
- Sign-up needs a required **"I'm over 18 years old"** tick (19 Nov).
- Registering with an email that already has an account goes to sign-in, never to a code (23 Nov).
- The backend is told the moment a sign-up is confirmed; the **Welcome email** (`account.created`)
  leaves then, signed in or not (23 Nov).
- After sign-in the member lands on **Home**; with a pending invitation, on **Decision rooms**.

### 3.2 E-DNA assessment
- Seven parts, **about 30 minutes** (say 30 everywhere).
- Progress is mirrored to the server after every answer (`edna_progress`), so a fresh device
  resumes at the exact question (23 Nov).
- **Resume email.** One nudge ~10 minutes after sign-up when no result exists
  (`RESUME_NUDGE_MINUTES`), once per account; also on "Save my progress by email" (A1). The
  GHL payload (`event: edna.save_progress`) carries:
  `parts_in, parts_total, parts_left, parts_done_names, parts_left_names, resume_part,
  resume_part_name, resume_question, resume_part_questions, resume_url`, plus contact fields
  and `edna_status` (24–25 Nov; sample in `Brandscaling_NodeJs/ghl-resume-payload-sample.json`).
- No result is ever shown before the test is taken (Mashab, 24 Nov).

### 3.3 Reports
- Basic report free; **Advanced Report £99** (GHL checkout
  `go.brandscaling.co.uk/checkout-page-quiz-report`). Purchase webhook unlocks it and grants
  10 decisions.
- The Advanced Report opens at a part (`#detailed-N`) from My reports' part rows (24 Nov).
- Reports keep their light design in every theme.

### 3.4 Home (25 Nov — the approved design's Home)
Cards, in order: header (Welcome back, name, type chip, bell) · **Make a decision** (decisions
left, Make a decision, Invite someone to a decision) · **Your E-DNA profile** (core type,
assessed date, Dominant and Alternate loop; View your E-DNA report, See my E-DNA; or "Take the
free E-DNA assessment") · **Needs you** · **How you decide** (from `/log/summary`) · **Decision
log** (last rows) · **Your loop** · **My workbooks** (status chips on one line). First-open
accounts also see "Your first decision" (Make your first decision · See my E-DNA).
Every button moves to its tab. The E-DNA profile card is the old Overview's card, kept on
Munawar's request.

### 3.5 Make a decision (the Frame)
- One question first; options "I have already started on this", "There is a deadline, or money
  or conflict at stake"; **Attach document**.
- A core type runs in their own order; **Mixed and leaning** choose Logic first or Feeling first.
- The mentor goes box by box; **Check** gives the readiness read: **Ready · One more round ·
  Not yet: Box X is empty**. The mentor never decides; "decided" in the log is the person's own
  Box 4.
- **Not yet keeps the decision open** (In the Frame, no decided text, no review date) (24 Nov).
- Every date comes from the server; the default review date is today + 3 months.
- Reopen resumes the decision where it was (24 Nov).

### 3.6 Decision log
- Tabs **My decisions / Room decisions**; counts (Decisions, Decided, Still in the Frame, Where
  you switched); filter; a row opens its detail: the boxes as written ("Your decision" = Box 4),
  the mentor's readiness read, the log line.
- "Add a row by hand" (`/log/manual`); reviews (`/log/:id/review`).

### 3.7 Decision rooms
- One room per decision, **up to 6 people**. Owner writes the decision, Box 1, End with and
  Box 4; collaborators add to Boxes 2 and 3.
- Invite by email or link; the invitee sees the **approved consent card** (not a browser pop-up)
  before joining (24 Nov). Invitation details before accepting: `GET /invites/:token`.
- A non-member joining becomes a **guest: 7 days, 3 decisions** (BS-AI-008 §5).
- Rooms open with Entry membership (Fariza, 22 Nov) — gates are open for everyone while
  `DI_OPEN_ALL=true` (event, 24 Nov).
- Leaving: Settings · Consent and sharing → Leave room (`POST /rooms/:id/leave`); entries stay
  with the person's name (25 Nov). Owners close a room instead.

### 3.8 My reports · My workbooks · My E-DNA
- My reports: basic, Advanced (by part), earlier assessments.
- My workbooks: three workbooks, one per part, in the version for the Part 1 result; the
  Workbook 1 commitment is read by the mentor.
- My E-DNA: the result part by part, in words.

### 3.9 Settings (25 Nov — the approved design's nine panels, real data only)
| Panel | Shows | Source |
|---|---|---|
| Profile | photo (upload/remove), first and last name, email (read-only; change through support), phone, country, time zone, business | `/profile`, `PUT /profile`, `PUT /profile/photo` |
| Membership and credits | tier, decisions left of total, grants, credits used, Top up, See memberships | `/profile.membership`, `/credits` |
| Subscription | Active / No subscription, plan, renews | `/profile.membership` |
| Payment details | statement that cards stay with the payment provider; receipts (date, item) | `/purchases` (GHL `order.completed`), falling back to purchase grants |
| Notifications | email switch per event (N1–N7, N10, N13, N14); security and legal always on | `/notification-prefs` |
| Consent and sharing | Part 5 consent; rooms with role, Leave room | `/edna`, `/rooms`, `POST /rooms/:id/leave` |
| Screen | font, text size, spacing, motion, theme, transparency — applies to the E-DNA pages in this browser | `localStorage['edna-settings']` |
| Security | Change password, signed-in devices, Sign out everywhere | Cognito `ChangePassword`, `GlobalSignOut`; `/devices` |
| Account | Terms links, sign out, Delete my account (→ `/delete-account/`), Export CSV, reports PDF, Download my data (one JSON file) | — |

**Hidden on purpose (no real data behind them):** card on file and billing address, two-step
verification (Cognito MFA is off), push quiet hours and grouping (push is iOS-only), "terms
accepted on" dates (`terms_acceptance` has never been written), proposed upgrade prices.
**iOS:** push switches and quiet hours belong in the iOS Settings; the same
`/notification-prefs` rows carry a `push` flag.

### 3.10 Notifications and emails
- In-app: the bell and **Needs you** (`/needs-you`, `/notifications`).
- Emails go through GHL. The backend queues events in `ghl_outbox`; only events in
  `GHL_SENDABLE_EVENTS` are sent (default `account.created, edna.save_progress,
  purchase.completed`). `purchase.completed` goes to its own workflow URL.
- A person's email switch is honoured when an event is queued (`emailPrefOn`).
- Room emails (N1 invited, etc.) are mapped (`GHL_EVENT`) but not yet sendable — they need GHL
  workflows first.

### 3.11 Credits and tiers
- Fariza, 22 Nov: **3 starter decisions** with the assessment, **10** with the £99 report, paid
  credits on iOS go through in-app purchase, **rooms for members**.
- One credit = one decision taken to **Check**. Daily cap 10 checks.
- `DI_OPEN_ALL=true` opens every gate for the event; `/profile.tier` then reads `entry` for
  everyone, so Settings uses `/profile.membership` for what the person really holds.

### 3.12 The AI mentor
- Provider and model by environment: `MODEL_PROVIDER=anthropic`, `DI_MODEL` (live:
  `claude-sonnet-5-5`), `ANTHROPIC_THINKING`; instructions `MENTOR_INSTRUCTION_VERSION`
  (live: BS-AI-005 v1.1).
- The mentor reads the person's real stress result, subtype and workbook commitment (24 Nov).
- Replies are JSON; an invalid reply is retried (up to three attempts) before "mentor not
  available".

### 3.13 Speed and no-flash (25 Nov)
- The app's reads (`/log`, `/log/summary`, `/needs-you`, `/rooms`, `/credits`, `/edna`,
  `/notification-prefs`, `/devices`, `/purchases`) paint at once from the last answer and refresh
  in the background; they are warmed right after sign-in. **Any write clears them**, so a member
  never sees data from before their own action.
- The app stays loaded while a report is open.
- **iOS:** cache the same reads per screen and refresh on appear; never show sample data and
  never blank a list to "Loading…" when you already have the last answer.

### 3.14 Phones (iPhone first — Mashab, 25 Nov)
- Every web change is checked at 320, 375, 390, 430 px in Safari's engine and on the iOS
  Simulator.
- Rules learned: no desktop rule after a phone media query; form fields at least 16px on touch
  screens (iPhone zooms otherwise); icons as SVG, not text symbols (☀ broke on iPhone); wide
  tables scroll inside their box.

### 3.15 Dark mode
- Website pages: the moon/sun toggle (`localStorage['bs-theme']`). E-DNA pages: Screen
  settings (`edna-settings.theme`). The dashboard and app screens are light only; reports keep
  their light design.

---

## 4 · Backend endpoints the website uses (base `/api/di`, Cognito token or legacy `x-user-id`)

| Area | Endpoints |
|---|---|
| Profile | `GET /profile` (adds phone, country, time_zone, business_name, membership — 25 Nov), `PUT /profile` (only the fields sent), `PUT /profile/photo` |
| E-DNA | `GET /edna` |
| Decisions | `POST /decisions`, `GET /decisions`, `GET /decisions/:id`, `PUT /decisions/:id/boxes/:box`, `POST /decisions/:id/rounds`, `/save`, `/reopen`, `/mentor`, `/check`; attachments `POST/GET /decisions/:id/attachments`, `/attachments/:id/confirm`, `DELETE /attachments/:id`, `GET /attachments/:id/file` |
| Log | `GET /log?view=mine|room`, `POST /log/manual`, `GET /log/summary`, `POST /log/:id/review`, `GET /log/reviews/due` |
| Rooms | `POST/GET /rooms`, `GET /rooms/:id`, `/events`, `POST /rooms/:id/invites`, `GET /invites/:token`, `POST /invites/:token/accept`, `PUT /rooms/:id/boxes/:box`, `POST /rooms/:id/entries`, `/rounds`, `/check`, `/confirm`, `/leave`, `/close`, `DELETE /rooms/:id/members/:user` |
| Credits | `GET /credits`, `GET /purchases` (25 Nov) |
| Notifications | `GET /needs-you`, `GET /notifications`, `GET/PUT /notification-prefs` |
| Devices | `POST /devices/seen`, `GET /devices` (25 Nov) |
| Workbooks | `/api/user/workbooks` … |
| GHL in | `POST /api/ghl/di` (`order.completed` grants credits; idempotent on `event_id`) |

## 5 · Database changes (backend `src/migrations/`)
`0002` Decision Intelligence tables · `0003` notifications, attachments, GHL outbox/inbound ·
`0004` credit grant source `assessment` · `0005` `edna_progress` · **`0006` users.phone, country,
time_zone, business_name; auth_device index (25 Nov, applied)**. Migrations are applied through
the secret-gated runners in `diMigrateRoutes.js` because the database is only reachable from AWS.

## 6 · Rulings that shape behaviour (dated)
- 18 Nov · Fariza: three website rulings (DI page), "three problems, not two".
- 19 Nov · Fariza: Home is the dashboard and Make a decision its own page; My E-DNA and My
  reports separate; the E-DNA comes before an account (BS-AI-003 §9.2).
- 22 Nov · Fariza: tiers — 3 starter decisions, £99 = 10, rooms for members, IAP on iOS.
- 24 Nov · Fariza (huddle): one dashboard, DI under it with six tabs; open every gate for the
  event; Infinite Scaling "Soon" only (no launch date).
- 24 Nov · Mashab: no result shown without the assessment.
- 25 Nov · Mashab: mobile first, iPhone first; Tailwind preferred for new work.
- 25 Nov · Munawar: Home = the approved app Home + the E-DNA profile card; Settings = the
  approved nine panels with real data.

## 7 · Open questions and known gaps
- **Fixed 25 Nov (backend `be5da1d`): the request limit was shared by everyone.** The rate
  limiter counted every request against App Runner's proxy address, so all members together
  got 500 requests per 15 minutes and then 429 "Too many requests" (stuck "Loading…",
  "mentor not available"). It now counts per visitor (the last `X-Forwarded-For` entry, which
  App Runner appends; a forged earlier entry is ignored), 2000 per visitor per 15 minutes
  (`RATE_LIMIT_MAX_PER_IP`; the old `RATE_LIMIT_MAX_REQUESTS` is no longer read). Each server
  copy keeps its own count. **iOS** traffic goes through the same limiter.
- **E-DNA before Decision Intelligence?** Asked Fariza on 25 Nov whether Make a decision and
  rooms need the E-DNA first; today someone without a result is treated as Mixed. Waiting.
- After the event: set `DI_OPEN_ALL=false`; remove `MENTOR_INSTRUCTION_VERSION` if no longer
  needed.
- Account deletion on the website goes to `/delete-account/` (request by email). The iOS
  `DELETE /me` removes quiz data and the user row but not the DI tables (decisions, log, rooms,
  credits) — fix before relying on it.
- **Change email (built 25 Nov, switched off).** Settings · Profile follows the design: new
  address + current password (checked through the dashboard's Cognito library) → Cognito
  `UpdateUserAttributes` emails a 6-digit code to the new address → `VerifyUserAttribute` →
  a refreshed ID token carries the verified address → `POST /account/email-sync` copies it to
  `users.email` (verified Cognito ID token only). The account id never changes, so all data
  stays. Switched on by `EMAIL_CHANGE` in `site.part.js` **only after** the user pool's
  "keep original attribute value active when an update is pending" is set for email;
  without it Cognito changes the sign-in email before it is confirmed. Still to do: tell the
  old address (N15) and update the GHL contact's email. **iOS:** same calls (the iOS app uses
  the same pool), same endpoint.
- `terms_acceptance` is never written; the report gate and checkout should record acceptance.
- Room emails (N1–N14) need GHL workflows before they can be added to `GHL_SENDABLE_EVENTS`.
- The apex domain `brandscaling.co.uk/<path>` 404s; needs forwarding fixed at the registrar.

## 8 · iOS port checklist
- [ ] Same tabs and order: Home · Make a decision · Decision log · Decision rooms · My reports ·
      My workbooks · My E-DNA · Infinite Scaling (Soon) · Settings.
- [ ] Home cards as 3.4, including the E-DNA profile card.
- [ ] Readiness read rules (Ready / One more round / Not yet keeps it open).
- [ ] Invitation links open the consent card, then the room; guest 7 days / 3 decisions.
- [ ] Settings: the nine panels from the same endpoints; push switches and quiet hours added.
- [ ] Device report on launch (`POST /devices/seen`, platform `ios`).
- [ ] Resume of an unfinished assessment from `edna_progress`.
- [ ] Cached reads, no sample data, no "Loading…" blanking on return.
- [ ] Credits via in-app purchase; the same grants appear in Settings.
