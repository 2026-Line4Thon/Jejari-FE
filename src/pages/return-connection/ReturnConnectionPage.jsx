import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { chatRoomPath } from '../../components/chat/chatRoutes';
import { useReturnConnection } from '../../hooks/useMatchingFlow';
import { MatchingLayout, MatchingLoadState, ReturnPeople, ReturnChatIcon } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { matchingListPath, ownershipPath } from '../../components/matching-flow/matchingRoutes';

async function readResponseData(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export function ReturnConnectionView({ data, onBack, onStartChat, isPending = false, children }) {
  const verified = data.verification.status === 'verified';
  return <MatchingLayout title="반환 연결" titleId="return-connection-title" onBack={onBack} className={'return-connection-page' + (verified ? ' is-verified' : '')}>
    <ReturnPeople />
    <section className="return-intro"><span>{verified ? '소유권 확인 완료' : '비공개 채팅 연결'}</span><h2>이제 안전하게<br />반환 일정을 정해 보세요</h2><p>{verified ? '분실자와 습득자가 비공개 채팅으로 연결됐어요.' : '물건의 특징과 반환 일정은 채팅에서 확인해 주세요.'}</p></section>
    {verified && <section className="return-verified"><span><img src={matchingAssets.greenCircle} alt="" /><img src={matchingAssets.greenCheck} alt="" /></span><div><h3>AI 소유권 확인</h3><p>답변이 습득자가 등록한 비공개 특징과 일치해요.</p></div></section>}
    <h2 className="return-steps-title"><img src={matchingAssets.jejari} alt="" />{verified ? 'Jejari 채팅을 시작해보세요' : 'Jejari 비공개 채팅을 시작해보세요'}</h2>
    <ol className="return-steps"><li><span className="matching-number">1</span><div><h3>반환 장소 및 시간 협의</h3><p>앱 내 채팅으로 안전하게 조율해 보세요.</p></div></li><li><span className="matching-number">2</span><div><h3>반환 완료</h3><p>물건을 받은 뒤 완료 처리를 해주세요</p></div></li></ol>
    <aside className="return-privacy"><ReturnChatIcon /><p>전화번호나 개인 연락처를 공유하지 않아도<br />Jejari 앱 안에서 대화할 수 있어요.</p></aside>
    <footer className="return-footer"><button className="matching-primary-button" type="button" onClick={onStartChat} disabled={isPending}>채팅 시작하기</button></footer>
    {children}
  </MatchingLayout>;
}

export default function ReturnConnectionPage() {
  const { candidateId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const checkId = searchParams.get('checkId');
  const ownershipSkipped = location.state?.ownershipSkipped === true;
  const chat = useReturnConnection(candidateId, checkId, { ownershipSkipped });
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [createChatError, setCreateChatError] = useState('');
  const [ownershipResult, setOwnershipResult] = useState(null);
  const [ownershipResultError, setOwnershipResultError] = useState('');
  useEffect(() => {
    if (ownershipSkipped) return;
    const numericCheckId = Number(checkId);
    if (!Number.isInteger(numericCheckId) || numericCheckId <= 0) return;
    const controller = new AbortController();
    const loadOwnershipResult = async () => {
      setOwnershipResultError('');
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('로그인 후 소유권 확인 결과를 불러올 수 있어요.');
        const response = await fetch(`https://miseno.store/ownership-checks/${numericCheckId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });
        const data = await readResponseData(response);
        if (!response.ok) throw new Error(data.detail || '소유권 확인 결과를 불러오지 못했어요.');
        setOwnershipResult(data);
      } catch (error) {
        if (error.name !== 'AbortError') setOwnershipResultError(error.message || '소유권 확인 결과를 불러오지 못했어요.');
      }
    };
    loadOwnershipResult();
    return () => controller.abort();
  }, [checkId, ownershipSkipped]);
  const onBack = () => navigate(ownershipPath(candidateId));
  const onStartChat = async () => {
    if (isCreatingChat) return;
    setIsCreatingChat(true);
    setCreateChatError('');
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('로그인 후 채팅을 시작할 수 있어요.');
      const response = await fetch('https://miseno.store/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ candidate_id: Number(candidateId) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || '채팅방을 만들지 못했어요.');
      navigate(chatRoomPath(data.chat_room_id));
    } catch (error) {
      setCreateChatError(error.message || '채팅방을 만들지 못했어요.');
    } finally {
      setIsCreatingChat(false);
    }
  };
  if (chat.isLoading || chat.error) return <MatchingLoadState title="반환 연결" error={chat.error} onBack={() => navigate(matchingListPath)} />;
  const isVerified = ['verified', 'pass', 'passed', 'success', 'matched'].includes(String(ownershipResult?.result ?? '').toLowerCase());
  const data = ownershipResult && !ownershipSkipped ? { ...chat.data, verification: { ...chat.data.verification, status: isVerified ? 'verified' : 'unverified' } } : chat.data;
  return <ReturnConnectionView data={data} onBack={onBack} onStartChat={onStartChat} isPending={chat.isPending || isCreatingChat}>
    {(chat.actionError || createChatError || ownershipResultError) && <p className="found-item-error" role="alert">{chat.actionError || createChatError || ownershipResultError}</p>}
  </ReturnConnectionView>;
}
