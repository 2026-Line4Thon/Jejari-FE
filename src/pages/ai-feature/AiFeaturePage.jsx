import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { foundItemService } from '../../services/foundItemService';
import './AiFeaturePage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import logo from '../../assets/dashboard-new/logo.svg';
import progress from '../../assets/lost-method/progress.svg';
import sendIcon from '../../assets/ai-feature/send.svg';
import editIcon from '../../assets/ai-feature/edit.svg';

export default function AiFeaturePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const lostDraft = state?.lostDraft;
  const [answer, setAnswer] = useState('');
  const [flow, setFlow] = useState(null);
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const contentRef = useRef(null);
  const prepared = useRef(null);
  const busy = useRef(false);
  const active = useRef(false);
  const activeDraft = useRef(lostDraft);
  const current = flow?.draft === lostDraft ? flow : null;
  const chat = current?.chat;
  const history = current?.history || [];
  const isSummary = Boolean(chat?.is_finished);
  const fields = chat?.features || chat?.known || {};
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(lostDraft?.date || '');
  const summaryDate = dateParts ? Number(dateParts[2]) + '월 ' + Number(dateParts[3]) + '일' : '미입력';

  useEffect(() => {
    active.current = true;
    activeDraft.current = lostDraft;
    let cancelled = false;
    if (!prepared.current || prepared.current.draft !== lostDraft) prepared.current = { draft: lostDraft, promise: foundItemService.startFeatures(lostDraft) };
    prepared.current.promise.then((data) => {
      if (!cancelled) { setFlow({ draft: lostDraft, chat: data, history: [] }); setError(''); }
    }).catch((failure) => { if (!cancelled) setError(failure.message); });
    return () => { cancelled = true; active.current = false; };
  }, [lostDraft]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'auto' }));
    return () => cancelAnimationFrame(frame);
  }, [history.length, isSummary, error]);
  const run = async (operation) => {
    if (busy.current) return null;
    busy.current = true; setIsPending(true); setError('');
    try {
      const value = await operation();
      return active.current && activeDraft.current === lostDraft ? value : null;
    } catch (failure) { if (active.current && activeDraft.current === lostDraft) setError(failure.message); return null; }
    finally { busy.current = false; if (active.current) setIsPending(false); }
  };
  const goBack = async () => {
    if (busy.current) return;
    if (chat && !chat.is_finished) {
      const finished = await run(() => foundItemService.finishFeatures(chat.chat_id));
      if (!finished) return;
    }
    navigate('/lost-item' + (lostDraft?.mode === 'text' ? '?mode=text' : ''), { state: { lostDraft } });
  };
  const submit = async (value) => {
    if (!value.trim() || !chat?.question || chat.is_finished) return;
    const data = await run(() => foundItemService.answerFeatures(chat.chat_id, chat.question, value));
    if (!data) return;
    setFlow({ draft: lostDraft, chat: { ...chat, ...data }, history: [...history, { question: chat.question, answer: value.trim() }] });
    setAnswer('');
  };
  const register = async () => {
    if (!chat?.is_finished) return;
    const data = await run(() => foundItemService.registerLost(lostDraft, chat));
    if (data) navigate('/complete?itemId=' + data.lost_item_id, { state: { lostItemId: data.lost_item_id, lostDraft } });
  };
  const choiceButtons = (question, answered = false) => <div className="ai-chat-choices">
    {[...new Set([...(question.options || []), '잘 모르겠어요'])].map((choice) => <button type="button" onClick={() => submit(choice)} disabled={answered || !chat || isPending || isSummary} key={choice}>{choice}</button>)}
  </div>;

  return <main className="ai-chat-page">
    <img className="ai-chat-background" src={pageBackground} alt="" />
    <header className="ai-chat-header">
      <button type="button" onClick={goBack} aria-label="이전 화면"><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
      <h1>AI와 특징 정리</h1>
    </header>
    <section ref={contentRef} className={`ai-chat-content${isSummary ? ' summary-mode' : ''}`}>
      <p className="ai-chat-step">한 번에 하나씩 물어볼게요</p>
      <div className={`ai-chat-progress${history.length ? ' progressed' : ''}${isSummary ? ' complete' : ''}`}><img src={progress} alt="" /><i /></div>
      <img className="ai-chat-logo" src={logo} alt="제자리" />
      <div className="ai-message intro" role="status">{!chat ? '입력한 정보를 확인하고 있어요.' : <>좋아요! 입력한 정보를 바탕으로<br />몇 가지만 더 확인할게요.</>}</div>
      {history.map((entry, index) => <div className="ai-chat-turn" key={`${entry.question.step}-${index}`}>
        <div className="ai-message question">{entry.question.text}</div>
        {choiceButtons(entry.question, true)}
        <div className="ai-user-message">{entry.answer}</div>
      </div>)}
      {!isSummary && chat?.question && <div className="ai-chat-turn">
        <div className="ai-message question">{chat.question.text}</div>
        {choiceButtons(chat.question)}
      </div>}
      {isSummary && <article className="ai-summary-card">
          <div className="ai-summary-head"><img src={logo} alt="제자리" /><span><small>Jejari 정리 완료</small><strong>{lostDraft?.kind || fields.category || '등록할 물건'}</strong></span><button type="button" onClick={goBack} disabled={isPending}><img src={editIcon} alt="" />정보 수정하기</button></div>
          <dl><div><dt>분실 장소</dt><dd>{lostDraft?.place || '미입력'}</dd></div><div><dt>색상</dt><dd>{lostDraft?.color || fields.color || '미입력'}</dd></div><div><dt>날짜</dt><dd>{summaryDate}</dd></div><div><dt>재질</dt><dd>{fields.material || '미입력'}</dd></div><div><dt>브랜드</dt><dd>{lostDraft?.brand || fields.brand || '미입력'}</dd></div></dl>
        </article>}
      {error && <p className="ai-chat-error" role="alert">{error}</p>}
    </section>
    {isSummary ? <footer className="ai-summary-footer"><button type="button" onClick={register} disabled={isPending}>{isPending ? '등록 중이에요' : '이 정보로 등록하기'}</button></footer> : <footer className="ai-chat-footer"><form onSubmit={(event) => { event.preventDefault(); submit(answer); }}><input disabled={!chat || isPending} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="직접 답변 입력" aria-label="직접 답변 입력" /><button type="submit" aria-label="전송" disabled={!chat || isPending}><img src={sendIcon} alt="" /></button></form></footer>}
  </main>;
}
