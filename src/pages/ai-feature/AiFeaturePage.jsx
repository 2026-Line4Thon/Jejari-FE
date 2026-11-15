import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AiFeaturePage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import logo from '../../assets/dashboard-new/logo.svg';
import progress from '../../assets/lost-method/progress.svg';
import sendIcon from '../../assets/ai-feature/send.svg';
import editIcon from '../../assets/ai-feature/edit.svg';

const materialChoices = ['유광 플라스틱', '무광 플라스틱', '실리콘', '잘 모르겠어요'];
const markChoices = ['스티커 있음', '흠집 있음', '잘 모르겠어요'];

export default function AiFeaturePage() {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [materialAnswer, setMaterialAnswer] = useState('');
  const [markAnswer, setMarkAnswer] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');
  const contentRef = useRef(null);
  const isSummary = Boolean(finalAnswer);
  useEffect(() => {
    if (!isSummary) return;
    requestAnimationFrame(() => { contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'auto' }); });
  }, [isSummary]);
  const submit = (value) => {
    const nextAnswer = value.trim();
    if (!nextAnswer) return;
    if (!materialAnswer) setMaterialAnswer(nextAnswer);
    else {
      setMarkAnswer(nextAnswer);
      setFinalAnswer(nextAnswer);
    }
    setAnswer('');
  };

  const choiceButtons = (items, className = '') => <div className={`ai-chat-choices ${className}`}>
    {items.map((choice) => <button type="button" onClick={() => submit(choice)} key={choice}>{choice}</button>)}
  </div>;

  return <main className="ai-chat-page">
    <img className="ai-chat-background" src={pageBackground} alt="" />
    <header className="ai-chat-header">
      <button type="button" onClick={() => navigate(-1)} aria-label="이전 화면"><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
      <h1>AI와 특징 정리</h1>
    </header>
    <section ref={contentRef} className={`ai-chat-content${isSummary ? ' summary-mode' : ''}`}>
      <p className="ai-chat-step">한 번에 하나씩 물어볼게요</p>
      <div className={`ai-chat-progress${materialAnswer ? ' progressed' : ''}${isSummary ? ' complete' : ''}`}><img src={progress} alt="" /><i /></div>
      {isSummary ? <>
        <img className="ai-chat-logo" src={logo} alt="제자리" />
        <div className="ai-message intro">좋아요! 입력한 정보를 바탕으로<br />몇 가지만 더 확인할게요.</div>
        <div className="ai-message question">케이스의 재질은 무엇에 가까운가요?</div>
        {choiceButtons(materialChoices)}
        <div className="ai-user-message">{materialAnswer}</div>
        <div className="ai-message next-question">눈에 띄는 스티커나 흠집이 있나요?</div>
        {choiceButtons(markChoices, 'next-choices')}
        <div className="ai-user-message second">{markAnswer}</div>
        <article className="ai-summary-card">
          <div className="ai-summary-head"><img src={logo} alt="제자리" /><span><small>Jejari 정리 완료</small><strong>무선 이어폰</strong></span><button type="button"><img src={editIcon} alt="" />정보 수정하기</button></div>
          <dl><div><dt>분실 장소</dt><dd>중앙도서관 2층</dd></div><div><dt>색상</dt><dd>검정색</dd></div><div><dt>날짜</dt><dd>3월 18일</dd></div><div><dt>재질</dt><dd>{materialAnswer}</dd></div><div><dt>브랜드</dt><dd>삼성</dd></div></dl>
        </article>
      </> : <>
        <img className="ai-chat-logo" src={logo} alt="제자리" />
        <div className="ai-message intro">좋아요! 입력한 정보를 바탕으로<br />몇 가지만 더 확인할게요.</div>
        <div className="ai-message question">케이스의 재질은 무엇에 가까운가요?</div>
        {choiceButtons(materialChoices)}
        {materialAnswer && <>
          <div className="ai-user-message">{materialAnswer}</div>
          <div className="ai-message next-question">눈에 띄는 스티커나 흠집이 있나요?</div>
          {choiceButtons(markChoices, 'next-choices')}
          {markAnswer && <div className="ai-user-message second">{markAnswer}</div>}
        </>}
      </>}
    </section>
    {isSummary ? <footer className="ai-summary-footer"><button type="button" onClick={() => navigate('/complete')}>이 정보로 등록하기</button></footer> : <footer className="ai-chat-footer"><form onSubmit={(event) => { event.preventDefault(); submit(answer); }}><input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="직접 답변 입력" aria-label="직접 답변 입력" /><button type="submit" aria-label="전송"><img src={sendIcon} alt="" /></button></form></footer>}
  </main>;
}
