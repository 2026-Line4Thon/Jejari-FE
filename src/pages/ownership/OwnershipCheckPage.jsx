import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOwnershipCheck } from '../../hooks/useMatchingFlow';
import { MatchingLayout, MatchingLoadState } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { candidatePath, matchingListPath, returnConnectionPath } from '../../components/matching-flow/matchingRoutes';

export function OwnershipCheckView({ check, answer, onAnswer, onSubmit, onSkip, onBack, isPending = false, error = '', navigationState }) {
  return <MatchingLayout title="소유권 확인" titleId="ownership-title" onBack={onBack} className="ownership-page">
    <div className="ownership-step"><span>비공개 특징 확인 질문</span><strong>{check.step} / {check.total}</strong></div>
    <div className="ownership-progress" style={{ '--ownership-progress-width': `${(check.step / check.total) * 100}%` }} role="progressbar" aria-label="소유권 확인 질문 진행 단계" aria-valuemin={0} aria-valuemax={check.total} aria-valuenow={check.step} />
    <section className="ownership-intro"><span>비공개 질문</span><h2>본인만 알 수 있는<br />특징을 확인할게요</h2><p>Jejari가 답변의 의미를 분석해 습득물의 비공개 특징과 비교해요.<br />답변은 습득자에게 그대로 공개되지 않아요.</p></section>
    <form className="ownership-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
      <section className="ownership-question"><small>질문 {check.step}</small><h3 id="ownership-question-text">{check.question}</h3><textarea value={answer} onChange={(event) => onAnswer(event.target.value)} aria-labelledby="ownership-question-text" aria-invalid={Boolean(error)} aria-describedby={error ? 'ownership-answer-error' : undefined} placeholder={'기억나는 내용을 구체적으로 입력해 주세요.\n정확한 문장이 아니어도 괜찮아요.'} required={check.status === 'pending'} disabled={isPending || check.status !== 'pending'} /></section>
      {error && <p id="ownership-answer-error" className="found-item-error" role="alert">{error}</p>}
      <aside className="ownership-helper"><img src={matchingAssets.shield} alt="" /><p>기억나는 특징을 답변해 주세요.<br />소유권이 확인되면 채팅으로 연결돼요.</p></aside>
      <footer className="ownership-footer"><div><Link className="matching-muted-button" to={matchingListPath + (navigationState?.lostItemId ? '?itemId=' + navigationState.lostItemId : '')} state={navigationState}>다른 후보 보기</Link><button className="matching-secondary-button" type="button" onClick={onSkip} disabled={isPending || check.status !== 'pending'}>잘 모르겠어요</button></div><button className="matching-primary-button" type="submit" disabled={isPending || check.status === 'locked' || check.status === 'verified'}>{isPending ? '답변을 확인하고 있어요' : check.status === 'unverified' ? '다시 확인하기' : '답변 제출하기'}</button></footer>
    </form>
  </MatchingLayout>;
}

export default function OwnershipCheckPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const check = useOwnershipCheck(candidateId);
  const checkId = check.data?.id;
  const status = check.data?.status;
  useEffect(() => {
    if (status === 'verified') navigate(returnConnectionPath(candidateId, checkId), { replace: true, state: location.state });
  }, [status, candidateId, checkId, navigate, location.state]);
  const onBack = () => navigate(candidatePath(candidateId), { state: location.state });
  if (check.isLoading || check.error) return <MatchingLoadState title="소유권 확인" error={check.error} onBack={() => navigate(matchingListPath)} />;
  return <OwnershipCheckView check={check.data} answer={check.answer} onAnswer={check.setAnswer} onSubmit={check.submit} onSkip={check.skip} onBack={onBack} isPending={check.isPending} error={check.actionError} navigationState={location.state} />;
}
