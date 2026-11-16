import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { chatRoomPath } from '../../components/chat/chatRoutes';
import { useReturnConnection } from '../../hooks/useMatchingFlow';
import { MatchingLayout, MatchingLoadState, ReturnPeople, ReturnChatIcon } from '../../components/matching-flow/MatchingLayout';
import { matchingAssets } from '../../components/matching-flow/matchingAssets';
import { matchingListPath, ownershipPath } from '../../components/matching-flow/matchingRoutes';

export function ReturnConnectionView({ data, onBack, onStartChat, isPending = false, children }) {
  const verified = data.verification.status === 'verified';
  return <MatchingLayout title="반환 연결" titleId="return-connection-title" onBack={onBack} className={'return-connection-page' + (verified ? ' is-verified' : '')}>
    <ReturnPeople />
    <section className="return-intro"><span>{verified ? '소유권 확인 완료' : '비공개 채팅 연결'}</span><h2>이제 안전하게<br />반환 일정을 정해 보세요</h2><p>분실자와 습득자가 비공개 채팅으로 연결됐어요.</p></section>
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
  const chat = useReturnConnection(candidateId, searchParams.get('checkId'));
  const onBack = () => navigate(ownershipPath(candidateId));
  const onStartChat = async () => {
    const room = await chat.startChat();
    if (room) navigate(chatRoomPath(room.id));
  };
  if (chat.isLoading || chat.error) return <MatchingLoadState title="반환 연결" error={chat.error} onBack={() => navigate(matchingListPath)} />;
  return <ReturnConnectionView data={chat.data} onBack={onBack} onStartChat={onStartChat} isPending={chat.isPending}>
    {chat.actionError && <p className="found-item-error" role="alert">{chat.actionError}</p>}
  </ReturnConnectionView>;
}
