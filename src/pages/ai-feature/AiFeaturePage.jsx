import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiEnabled } from '../../api/config';
import useFeatureChat from '../../hooks/useFeatureChat';
import LostItemSummary from '../../components/LostItemSummary';
import { createLostItemSummary } from '../../utils/lostItemSummary';
import { createLostRegistrationPreview } from '../../mocks/lostRegistrationStore';
import './AiFeaturePage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import logo from '../../assets/dashboard-new/logo.svg';
import progress from '../../assets/lost-method/progress.svg';
import sendIcon from '../../assets/ai-feature/send.svg';

const materialChoices = ['플라스틱', '금속', '가죽', '잘 모르겠어요'];
const markChoices = ['스티커 있음', '흠집 있음', '잘 모르겠어요'];

export default function AiFeaturePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const lostDraft = state?.lostDraft;
  const goBack = () => lostDraft ? navigate('/lost-item' + (lostDraft.mode === 'text' ? '?mode=text' : ''), { state: { lostDraft } }) : navigate(-1);
  const [answer, setAnswer] = useState('');
  const [mockMaterialAnswer, setMaterialAnswer] = useState('');
  const [mockMarkAnswer, setMarkAnswer] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');
  const contentRef = useRef(null);
  const feature = useFeatureChat(lostDraft);
  const materialAnswer = apiEnabled ? feature.first?.answer : mockMaterialAnswer;
  const markAnswer = apiEnabled ? feature.second?.answer : mockMarkAnswer;
  const isSummary = apiEnabled ? Boolean(feature.chat?.is_finished) : Boolean(finalAnswer);
  const firstQuestion = apiEnabled ? feature.first?.question?.text ?? '' : '물건의 재질은 무엇에 가까운가요?';
  const secondQuestion = apiEnabled ? feature.second?.question?.text ?? '' : '눈에 띄는 스티커나 흠집이 있나요?';
  const firstChoices = apiEnabled ? [...(feature.first?.question?.options ?? []), '잘 모르겠어요'] : materialChoices;
  const secondChoices = apiEnabled ? [...(feature.second?.question?.options ?? []), '잘 모르겠어요'] : markChoices;
  const fields = feature.chat?.features ?? feature.chat?.known ?? {};
  const summary = createLostItemSummary(lostDraft, apiEnabled ? fields : { material: materialAnswer });
  const register = async () => {
    if (!apiEnabled) {
      const lostPreview = createLostRegistrationPreview(lostDraft, { material: materialAnswer });
      navigate('/complete?itemId=' + encodeURIComponent(lostPreview.id), { state: { lostPreview, lostDraft } });
      return;
    }
    const result = await feature.register();
    if (result) navigate('/complete?itemId=' + result.lost_item_id, { state: { lostItemId: result.lost_item_id, lostDraft } });
  };
  useEffect(() => {
    if (!isSummary) return;
    requestAnimationFrame(() => { contentRef.current?.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'auto' }); });
  }, [isSummary]);
  useEffect(() => { if (feature.error) contentRef.current?.scrollTo({ top: 0 }); }, [feature.error]);
  const submit = (value) => {
    if (apiEnabled) { feature.submit(value).then((success) => { if (success) setAnswer(''); }); return; }
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
    {items.map((choice) => <button type="button" onClick={() => submit(choice)} disabled={isSummary || (apiEnabled && (!feature.chat || feature.pending || (className ? !feature.secondActive : !feature.firstActive)))} key={choice}>{choice}</button>)}
  </div>;

  return <main className="ai-chat-page">
    <img className="ai-chat-background" src={pageBackground} alt="" />
    <header className="ai-chat-header">
      <button type="button" onClick={goBack} aria-label="이전 화면"><img src={backSurface} alt="" /><img src={backArrow} alt="" /></button>
      <h1>AI와 특징 정리</h1>
    </header>
    <section ref={contentRef} className={`ai-chat-content${isSummary ? ' summary-mode' : ''}`}>
      <p className="ai-chat-step">{apiEnabled ? '한 번에 하나씩 물어볼게요' : '서버에 저장되지 않는 입력 정보 미리보기'}</p>
      <div className={`ai-chat-progress${materialAnswer ? ' progressed' : ''}${isSummary ? ' complete' : ''}`}><img src={progress} alt="" /><i /></div>
      {isSummary ? <>
        <img className="ai-chat-logo" src={logo} alt="제자리" />
        <div className="ai-message intro">{apiEnabled && (feature.error || feature.isLoading) ? feature.error || '사진과 입력 내용을 확인하고 있어요.' : apiEnabled ? <>좋아요! 입력한 정보를 바탕으로<br />몇 가지만 더 확인할게요.</> : <>입력 정보를 확인할게요.<br />서버 저장 전 미리보기예요.</>}</div>
        <div className="ai-message question">{firstQuestion}</div>
        {choiceButtons(firstChoices)}
        <div className="ai-user-message">{materialAnswer}</div>
        <div className="ai-message next-question">{secondQuestion}</div>
        {choiceButtons(secondChoices, 'next-choices')}
        <div className="ai-user-message second">{markAnswer}</div>
        <LostItemSummary item={summary} isPreview={!apiEnabled} onEdit={goBack} />
      </> : <>
        <img className="ai-chat-logo" src={logo} alt="제자리" />
        <div className="ai-message intro">{apiEnabled && (feature.error || feature.isLoading) ? feature.error || '사진과 입력 내용을 확인하고 있어요.' : apiEnabled ? <>좋아요! 입력한 정보를 바탕으로<br />몇 가지만 더 확인할게요.</> : <>입력 정보를 확인할게요.<br />서버 저장 전 미리보기예요.</>}</div>
        <div className="ai-message question">{firstQuestion}</div>
        {choiceButtons(firstChoices)}
        {materialAnswer && <>
          <div className="ai-user-message">{materialAnswer}</div>
          <div className="ai-message next-question">{secondQuestion}</div>
          {choiceButtons(secondChoices, 'next-choices')}
          {markAnswer && <div className="ai-user-message second">{markAnswer}</div>}
        </>}
      </>}
    </section>
    {isSummary ? <footer className="ai-summary-footer"><button type="button" disabled={apiEnabled && feature.pending} onClick={register}>{feature.pending ? '등록 중이에요' : apiEnabled ? '이 정보로 등록하기' : '이 정보로 미리보기'}</button></footer> : <footer className="ai-chat-footer"><form onSubmit={(event) => { event.preventDefault(); submit(answer); }}><input value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="직접 답변 입력" aria-label="직접 답변 입력" /><button type="submit" aria-label="전송"><img src={sendIcon} alt="" /></button></form></footer>}
  </main>;
}
