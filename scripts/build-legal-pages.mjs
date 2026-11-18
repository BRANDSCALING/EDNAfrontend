/**
 * Builds the legal/policy pages (BS-WEB-002 … 011) plus the contact page (from BS-WEB-001
 * Section 3/4, the only publishable sections per its rule 3) into public/home/legal/,
 * using the approved homepage's own style, header and footer (BS-WEB-012 §9: "the same
 * template as the homepage").
 *
 * Faithful to the documents: the frontmatter, document-control table and the
 * "Publishing instructions (not published)" section are stripped; bracketed entity fields
 * are filled from BS-WEB-001 for the UK site, as its publishing instructions direct;
 * where a clause has a "United Kingdom website:" and a "United Arab Emirates website:"
 * version, the UK one is published. Effective-date placeholders stay: BS-WEB-012 §9 says
 * they are filled at launch after legal review (the business's responsibility).
 *
 * Usage: node scripts/build-legal-pages.mjs /path/to/package/docs
 */
import fs from 'node:fs';
import path from 'node:path';

const docsDir = process.argv[2];
if (!docsDir) { console.error('Usage: node scripts/build-legal-pages.mjs <docs dir>'); process.exit(1); }
const home = fs.readFileSync('public/home/index.html', 'utf8');
const outDir = 'public/home/legal';
fs.mkdirSync(outDir, { recursive: true });

/* ---- template pieces from the approved homepage ---- */
const style = home.match(/<style>[\s\S]*?<\/style>/)[0];
const header = home.match(/<header class="nav wrap">[\s\S]*?<\/header>/)[0]
  .replace(/href="#top"/g, 'href="../"')
  .replace(/href="#([a-z-]+)"/g, 'href="../#$1"')
  .replace(/href="legal\//g, 'href="')
  .replace(/src="assets\//g, 'src="../assets/');
const footer = home.match(/<footer>[\s\S]*?<\/footer>/)[0]
  .replace(/href="#([a-z-]+)"/g, 'href="../#$1"')
  .replace(/href="legal\//g, 'href="')
  .replace(/src="assets\//g, 'src="../assets/');

const themeScript = `<script>(function(){var root=document.documentElement;var saved=null;try{saved=localStorage.getItem('bs-theme')}catch(e){}
root.setAttribute('data-theme',saved==='dark'?'dark':'light');
var t=document.getElementById('theme-toggle');function g(){if(t)t.textContent=root.getAttribute('data-theme')==='dark'?'\\u2600':'\\u263E'}g();
if(t)t.addEventListener('click',function(){var n=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',n);try{localStorage.setItem('bs-theme',n)}catch(e){}g()});
var m=document.getElementById('menu'),b=document.getElementById('navbar');if(m&&b)m.addEventListener('click',function(){var o=b.classList.toggle('open');m.setAttribute('aria-expanded',o?'true':'false')});})();</script>`;

/* UK values from BS-WEB-001 §2.1/§3 (the publishable register) */
const SUBS = {
  '[website]': 'www.brandscaling.co.uk',
  '[company name]': 'Brand Scaling Limited',
  '[trading name]': 'Brandscaling',
  '[general email]': 'info@brandscaling.co.uk',
  '[support email]': 'support@brandscaling.co.uk',
  '[applications email]': 'applications@brandscaling.co.uk',
  '[privacy email]': 'info@brandscaling.co.uk',
  '[complaints email]': 'info@brandscaling.co.uk',
  '[year]': String(new Date().getFullYear()),
  '[Legal footer block from BS-WEB-001, Section 4, for this website.]':
    'Brand Scaling Limited, trading as Brandscaling. Registered in England and Wales, company number 15563510. Registered office: 11 Old Bond Street, London, W1S 4PN. info@brandscaling.co.uk.',
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  s = esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

function mdToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0, list = null;
  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  while (i < lines.length) {
    const l = lines[i];
    if (/^\s*$/.test(l)) { closeList(); i++; continue; }
    if (/^#{1,4} /.test(l)) {
      closeList();
      const level = l.match(/^#+/)[0].length;
      out.push(`<h${level}>${inline(l.replace(/^#+ /, ''))}</h${level}>`);
      i++; continue;
    }
    if (/^\|/.test(l)) { /* table */
      closeList();
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = (r) => r.split('|').slice(1, -1).map((c) => c.trim());
      let t = '<div class="tablewrap"><table>';
      rows.forEach((r, ri) => {
        if (/^\|[\s\-|]+\|$/.test(r)) return; /* separator row */
        const tag = ri === 0 ? 'th' : 'td';
        t += '<tr>' + cells(r).map((c) => `<${tag}>${inline(c)}</${tag}>`).join('') + '</tr>';
      });
      out.push(t + '</table></div>'); continue;
    }
    if (/^> /.test(l)) { closeList(); out.push(`<blockquote><p>${inline(l.slice(2))}</p></blockquote>`); i++; continue; }
    if (/^[-*] /.test(l)) {
      if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; }
      out.push(`<li>${inline(l.replace(/^[-*] /, ''))}</li>`); i++; continue;
    }
    if (/^\d+\. /.test(l)) {
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; }
      out.push(`<li>${inline(l.replace(/^\d+\. /, ''))}</li>`); i++; continue;
    }
    closeList();
    out.push(`<p>${inline(l)}</p>`); i++;
  }
  closeList();
  return out.join('\n');
}

function publishedPortion(raw) {
  /* strip frontmatter + document-control + "Publishing instructions (not published)" */
  const seps = [...raw.matchAll(/^---\s*$/gm)].map((m) => m.index);
  if (raw.includes('## Publishing instructions')) {
    const after = seps.find((ix) => ix > raw.indexOf('## Publishing instructions'));
    if (after === undefined) throw new Error('no separator after publishing instructions');
    return raw.slice(raw.indexOf('\n', after) + 1);
  }
  /* frontmatter only */
  return raw.slice(raw.indexOf('\n', seps[1]) + 1);
}

function applyVariants(md) {
  /* "*United Kingdom website:* text" → text; the UAE paragraph is dropped (UK site) */
  return md.split('\n')
    .filter((l) => !/^\*United Arab Emirates website:\*/.test(l.trim()))
    .map((l) => l.replace(/^\s*\*United Kingdom website:\*\s*/, ''))
    .join('\n');
}

function page(title, bodyHtml) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} | Brandscaling</title>
<meta name="robots" content="index,follow">
${style}
<style>
.doc{max-width:860px;margin:0 auto;padding:48px 20px 72px}
.doc h1{font-size:40px;line-height:1.1;margin:0 0 20px}
.doc h2{font-size:24px;margin:34px 0 10px}
.doc h3{font-size:19px;margin:24px 0 8px}
.doc p,.doc li{font-size:17px;line-height:1.65;color:var(--ink-2,inherit)}
.doc ul,.doc ol{padding-left:24px;margin:0 0 14px}
.doc blockquote{border-left:4px solid var(--indigo,#42047D);margin:14px 0;padding:10px 16px;background:var(--surface,rgba(0,0,0,0.04));border-radius:8px}
.doc .tablewrap{overflow-x:auto;margin:0 0 16px}
.doc table{border-collapse:collapse;width:100%;font-size:15.5px}
.doc th,.doc td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line,rgba(0,0,0,0.12));vertical-align:top}
.doc th{font-weight:700}
</style>
</head>
<body>
<div id="site" class="site-uk">
${header}
<main class="doc">
${bodyHtml}
</main>
${footer}
</div>
${themeScript}
</body>
</html>`;
}

const PAGES = [
  ['BS-WEB-002 Website Terms of Use.md', 'terms-of-use.html', 'Terms of Use'],
  ['BS-WEB-003 Membership Terms and Conditions.md', 'membership-terms.html', 'Membership Terms and Conditions'],
  ['BS-WEB-004 Privacy Policy.md', 'privacy-policy.html', 'Privacy Policy'],
  ['BS-WEB-005 Cookie Policy.md', 'cookie-policy.html', 'Cookie Policy'],
  ['BS-WEB-006 Refund and Cancellation Policy.md', 'refunds-and-cancellation.html', 'Refund and Cancellation Policy'],
  ['BS-WEB-007 Acceptable Use Policy.md', 'acceptable-use.html', 'Acceptable Use Policy'],
  ['BS-WEB-008 AI Disclosure and AI Mentor Policy.md', 'ai-disclosure.html', 'AI Disclosure and AI Mentor Policy'],
  ['BS-WEB-009 Sub-processor and Data Transfer Register.md', 'sub-processors.html', 'Sub-processor and Data Transfer Register'],
  ['BS-WEB-010 Accessibility Statement.md', 'accessibility.html', 'Accessibility Statement'],
  ['BS-WEB-011 Complaints Procedure.md', 'complaints.html', 'Complaints Procedure'],
];

for (const [file, out, title] of PAGES) {
  const raw = fs.readFileSync(path.join(docsDir, file), 'utf8');
  let md = applyVariants(publishedPortion(raw));
  for (const [k, v] of Object.entries(SUBS)) md = md.split(k).join(v);
  fs.writeFileSync(path.join(outDir, out), page(title, mdToHtml(md)));
  console.log('built', out);
}

/* Contact page: ONLY the publishable facts (BS-WEB-001 rule 3: Sections 2 and 3). */
const contactMd = `# Contact

## Brandscaling

Brand Scaling Limited, trading as Brandscaling. Registered in England and Wales (Companies House), company number 15563510. Registered office: 11 Old Bond Street, London, W1S 4PN.

Co-founded by Fariza Javed and Hanif Khan.

## How to reach us

| Channel | Address |
| --- | --- |
| General enquiries | info@brandscaling.co.uk |
| Support | support@brandscaling.co.uk |
| Applications (Elite and Enterprise) | applications@brandscaling.co.uk |
| Privacy and data requests | info@brandscaling.co.uk |
| Complaints | info@brandscaling.co.uk |
| Postal address | 11 Old Bond Street, London, W1S 4PN |

We acknowledge every message within 2 working days (see the Complaints Procedure).`;
fs.writeFileSync(path.join(outDir, 'contact.html'), page('Contact', mdToHtml(contactMd)));
console.log('built contact.html');
console.log('\nAll pages in', outDir);
