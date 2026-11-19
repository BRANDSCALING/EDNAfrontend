/**
 * Interactive workbooks for the website (18 Nov 2026) — renders the BS-DI-009 workbook
 * engine format (structure.sections[].content[]: headings, body, callouts, lists, questions,
 * tables with columnInputs) with per-field autosave to the shared backend, so iOS and the
 * website read and write the same answers.
 *
 * Action callouts (BS-DI-009.1 §5): "Retake E-DNA" works today (opens /edna); mentor buttons
 * open the AI mentors view; Decision Frame buttons are disabled until BS-AI-001 is released.
 * Table answer keys are deterministic: s<section>-table<n>-r<row>-c<col> — the convention the
 * iOS editable-table work (W3) will share.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchWorkbooks, fetchInstance, saveAnswer, completeWorkbook,
  parseCheckboxValues, encodeCheckboxValues,
  type WorkbookList, type WorkbookListItem, type WorkbookInstancePayload,
} from '../../utils/workbooks';

interface BrandWorkbooksProps {
  onOpenMentors?: () => void;
  onOpenPlan?: () => void;
}

/* ---------- small render helpers ---------- */

function Runs({ runs, text }: { runs?: any[]; text?: string }) {
  if (!runs || !runs.length) return <>{text || ''}</>;
  return (
    <>
      {runs.map((r, i) => {
        let node: any = r.text;
        const marks = (r.marks || []).map((m: any) => (typeof m === 'string' ? m : m.type));
        if (marks.includes('bold')) node = <b>{node}</b>;
        if (marks.includes('italic')) node = <i>{node}</i>;
        if (marks.includes('underline')) node = <u>{node}</u>;
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

const cellText = (c: any): string => (typeof c === 'string' ? c : (c && c.text) || '');

/* ---------- the renderer ---------- */

function WorkbookView({ payload, onBack, onOpenMentors }: {
  payload: WorkbookInstancePayload;
  onBack: () => void;
  onOpenMentors?: () => void;
}) {
  const { instance, workbook } = payload;
  const [answers, setAnswers] = useState<Record<string, string>>(payload.answers);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [completed, setCompleted] = useState(instance.isCompleted);
  const timers = useRef<Record<string, any>>({});

  const setAnswer = (fieldKey: string, value: string, immediate = false) => {
    setAnswers((a) => ({ ...a, [fieldKey]: value }));
    clearTimeout(timers.current[fieldKey]);
    const send = async () => {
      setSaveState('saving');
      const ok = await saveAnswer(instance.id, fieldKey, value).catch(() => false);
      setSaveState(ok ? 'saved' : 'error');
    };
    if (immediate) send();
    else timers.current[fieldKey] = setTimeout(send, 700);
  };

  const sections = (workbook.structure && workbook.structure.sections) || [];
  let tableNo = 0;

  const renderQuestion = (item: any, key: string) => {
    const fieldKey = item.fieldKey || item.id || key;
    const v = answers[fieldKey] || '';
    const q = <p className="bs-wbk-q"><Runs runs={item.questionRuns} text={item.questionText} /></p>;
    switch (item.questionType) {
      case 'single-choice':
        return (
          <div className="bs-wbk-field" key={key}>
            {q}
            <div className="bs-wbk-opts">
              {(item.options || []).map((o: string) => (
                <label key={o} className={v === o ? 'on' : ''}>
                  <input type="radio" name={fieldKey} checked={v === o} onChange={() => setAnswer(fieldKey, o, true)} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'checkboxes': {
        const selected = parseCheckboxValues(v);
        const toggle = (o: string) => {
          const next = selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o];
          setAnswer(fieldKey, encodeCheckboxValues(next), true);
        };
        return (
          <div className="bs-wbk-field" key={key}>
            {q}
            <div className="bs-wbk-opts">
              {(item.options || []).map((o: string) => (
                <label key={o} className={selected.includes(o) ? 'on' : ''}>
                  <input type="checkbox" checked={selected.includes(o)} onChange={() => toggle(o)} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }
      case 'long-text':
        return (
          <div className="bs-wbk-field" key={key}>
            {q}
            <textarea className="bs-input" rows={item.rows || 4} placeholder={item.placeholder || ''}
              value={v} onChange={(e) => setAnswer(fieldKey, e.target.value)} />
          </div>
        );
      default: /* short-text */
        return (
          <div className="bs-wbk-field" key={key}>
            {q}
            <input className="bs-input" type="text" placeholder={item.placeholder || ''}
              value={v} onChange={(e) => setAnswer(fieldKey, e.target.value)} />
          </div>
        );
    }
  };

  const renderCellInput = (spec: any, fieldKey: string) => {
    const v = answers[fieldKey] || '';
    if (spec.type === 'single-choice' && spec.options) {
      return (
        <select className="bs-input bs-wbk-cellin" value={v} onChange={(e) => setAnswer(fieldKey, e.target.value, true)}>
          <option value="">—</option>
          {spec.options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    }
    if (spec.type === 'long-text') {
      return <textarea className="bs-input bs-wbk-cellin" rows={2} placeholder={spec.placeholder || ''}
        value={v} onChange={(e) => setAnswer(fieldKey, e.target.value)} />;
    }
    return <input className="bs-input bs-wbk-cellin" type="text" placeholder={spec.placeholder || ''}
      value={v} onChange={(e) => setAnswer(fieldKey, e.target.value)} />;
  };

  const renderCallout = (item: any, key: string) => {
    const text: string = item.text || '';
    const isAction = /^(Decision Frame|Button)\b/.test(text);
    let action = null;
    if (isAction) {
      if (/Retake E-DNA/i.test(text)) {
        action = <button className="bs-btn bs-btn-energy bs-wbk-act" onClick={() => { window.location.href = '/edna/index.html'; }}>Retake E-DNA</button>;
      } else if (/AI (Architect|Alchemist)|mentor/i.test(text) && !/Decision Frame/.test(text) && onOpenMentors) {
        action = <button className="bs-btn bs-btn-outline bs-wbk-act" onClick={onOpenMentors}>Open your AI mentors</button>;
      } else {
        /* Decision Frame and the WB3 behaviours live in BS-AI-001, not yet released */
        action = <button className="bs-btn bs-btn-outline bs-wbk-act" disabled title="Coming with the AI mentor release">Decision Frame — coming soon</button>;
      }
    }
    return (
      <div key={key} className={`bs-wbk-callout ${item.tone === 'warning' ? 'warn' : ''}`}>
        <p><Runs runs={item.runs} text={text} /></p>
        {action}
      </div>
    );
  };

  const renderItem = (item: any, idx: number, sIdx: number) => {
    const key = `s${sIdx}-i${idx}`;
    switch (item.type) {
      case 'heading_1': return <h2 key={key} className="bs-wbk-h1"><Runs runs={item.runs} text={item.text} /></h2>;
      case 'heading_2': return <h3 key={key} className="bs-wbk-h2"><Runs runs={item.runs} text={item.text} /></h3>;
      case 'heading_3': return <h4 key={key} className="bs-wbk-h3"><Runs runs={item.runs} text={item.text} /></h4>;
      case 'callout': return renderCallout(item, key);
      case 'list': {
        const L = item.style === 'number' ? 'ol' : 'ul';
        const Tag = L as any;
        return (
          <Tag key={key} className="bs-wbk-list">
            {(item.items || []).map((li: any, i: number) => <li key={i}><Runs runs={li.runs} text={li.text} /></li>)}
          </Tag>
        );
      }
      case 'question': return renderQuestion(item, key);
      case 'table': {
        tableNo += 1;
        const tKey = item.fieldKey || item.id || `s${sIdx + 1}-table${tableNo}`;
        const tc = item.tableConfig || {};
        const inputs = tc.columnInputs || {};
        return (
          <div key={key} className="bs-wbk-tablewrap">
            <table className="bs-wbk-table">
              <thead><tr>{(tc.headers || []).map((h: any, i: number) => <th key={i}>{cellText(h)}</th>)}</tr></thead>
              <tbody>
                {(tc.rows || []).map((row: any[], ri: number) => (
                  <tr key={ri}>
                    {row.map((c: any, ci: number) => (
                      <td key={ci}>
                        {inputs[String(ci)]
                          ? renderCellInput(inputs[String(ci)], `${tKey}-r${ri}-c${ci}`)
                          : cellText(c)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      default: /* body, text */
        return <p key={key} className="bs-wbk-body"><Runs runs={item.runs} text={item.text || item.value} /></p>;
    }
  };

  return (
    <div className="bs-wbk">
      <div className="bs-wbk-bar">
        <button className="bs-link-btn" onClick={onBack}>← All workbooks</button>
        <span className={`bs-wbk-save ${saveState}`}>
          {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Not saved — check your connection' : ''}
        </span>
      </div>
      {sections.map((sec: any, sIdx: number) => (
        <div key={sIdx}>{(sec.content || []).map((it: any, i: number) => renderItem(it, i, sIdx))}</div>
      ))}
      <div className="bs-wbk-footer">
        {completed ? (
          <span className="bs-pill bs-pill-done">Workbook complete ✓</span>
        ) : (
          <button className="bs-btn bs-btn-action" onClick={async () => {
            if (await completeWorkbook(instance.id).catch(() => false)) setCompleted(true);
          }}>
            Mark this workbook complete
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- list + container ---------- */

export function BrandWorkbooks({ onOpenMentors, onOpenPlan }: BrandWorkbooksProps) {
  const [list, setList] = useState<WorkbookList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<WorkbookInstancePayload | null>(null);
  const [opening, setOpening] = useState<string | null>(null);

  const load = () => {
    setError(null);
    fetchWorkbooks().then(setList).catch(() => setError('Your workbooks could not be loaded. Try again in a moment.'));
  };
  useEffect(load, []);

  const openWorkbook = async (wb: WorkbookListItem) => {
    setOpening(wb.id);
    try { setOpen(await fetchInstance(wb.id)); }
    catch (e: any) { setError(e.message || 'This workbook could not be opened.'); }
    finally { setOpening(null); }
  };

  const ordered = useMemo(() => {
    const all = list ? [...list.workbooks] : [];
    return all.sort((a, b) => (a.workbook || 9) - (b.workbook || 9));
  }, [list]);

  if (open) return <WorkbookView payload={open} onBack={() => { setOpen(null); load(); }} onOpenMentors={onOpenMentors} />;

  return (
    <div>
      <div className="bs-card-head"><h2>Your workbooks</h2></div>
      <p className="bs-empty-copy">
        Built from your E-DNA answers. Your progress saves as you type, and the iOS app shows
        the same workbooks with the same answers.
      </p>

      {/* The E-DNA plan ('adapt' screen in the approved /edna app), same entry the iOS
          Learning tab has. The /edna gate shows the £99 screen until purchased. */}
      <button className="bs-wbk-plan" onClick={() => { if (onOpenPlan) onOpenPlan(); else window.location.href = '/edna/index.html#plan'; }}>
        <span className="bs-wbk-icon" aria-hidden="true">🗺</span>
        <span className="bs-wbk-plan-text">
          <b>Your E-DNA plan</b>
          <small>Comes with your detailed E-DNA report</small>
        </span>
        <span className="bs-wbk-plan-chev" aria-hidden="true">›</span>
      </button>
      {error && <p className="bs-auth-error">{error}</p>}
      {!list && !error && <p className="bs-empty-copy">Loading…</p>}
      {list && ordered.length === 0 && (list.lockedWorkbooks || []).length === 0 && (
        <p className="bs-empty-copy">No workbooks are available for your result yet.</p>
      )}
      <div className="bs-wbk-cards">
        {ordered.map((wb) => (
          <div key={wb.id} className="bs-wbk-card">
            <p className="bs-wbk-kicker">Workbook {wb.workbook || ''}{wb.subtype ? ` · ${wb.subtype}` : ''}</p>
            <h3>{wb.title}</h3>
            <div className="bs-wbk-cardfoot">
              {wb.isCompleted
                ? <span className="bs-pill bs-pill-done">Complete</span>
                : wb.hasInstance
                  ? <span className="bs-pill bs-pill-progress">In progress</span>
                  : <span className="bs-pill bs-pill-todo">Not started</span>}
              <button className="bs-btn bs-btn-action" disabled={opening === wb.id} onClick={() => openWorkbook(wb)}>
                {opening === wb.id ? 'Opening…' : wb.hasInstance ? 'Continue' : 'Start'}
              </button>
            </div>
          </div>
        ))}
        {(list?.lockedWorkbooks || []).map((wb) => (
          <div key={wb.id} className="bs-wbk-card locked">
            <p className="bs-wbk-kicker">Workbook {wb.workbook || ''}{wb.subtype ? ` · ${wb.subtype}` : ''}</p>
            <h3>{wb.title}</h3>
            <p className="bs-wbk-lockmsg">🔒 {wb.lockedReason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
