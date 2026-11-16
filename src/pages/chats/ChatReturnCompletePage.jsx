import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChatLayout, ChatPhoto, ChatFeedback } from '../../components/chat/ChatLayout';
import { chatAssets } from '../../components/chat/chatAssets';
import { chatRoomPath } from '../../components/chat/chatRoutes';
import { useChatRoom } from '../../hooks/useChat';

export function ChatReturnCompleteView({ room, onBack }) {
  return <ChatLayout title="반환 완료" className="chat-return-complete-page" onBack={onBack}>
    <div className="chat-success-mark" aria-hidden="true"><img src={chatAssets.successGlow} alt="" /><img src={chatAssets.successCheck} alt="" /></div>
    <h2>물건이 주인에게<br />돌아갔어요</h2>
    <section className="chat-success-summary" aria-label="반환 완료 물건">
      <ChatPhoto photo={room.item.photo} large />
      <div><span className="chat-success-badge">반환 완료</span><h3>{room.item.name}</h3><p>{room.item.place} · {room.item.dateLabel}</p></div>
    </section>
    <Link className="chat-home-button" to="/home">홈으로 돌아가기</Link>
  </ChatLayout>;
}

export default function ChatReturnCompletePage() {
  const { roomId } = useParams();
  const chat = useChatRoom(roomId);
  const navigate = useNavigate();
  const onBack = () => navigate(chatRoomPath(roomId));
  const error = chat.error || (!chat.isLoading && chat.data?.status !== 'completed' ? '채팅방에서 물건 수령을 확인한 뒤 완료해 주세요.' : '');
  if (chat.isLoading || error) return <ChatLayout title="반환 완료" onBack={onBack}><ChatFeedback isLoading={chat.isLoading} error={error} /></ChatLayout>;
  return <ChatReturnCompleteView room={chat.data} onBack={onBack} />;
}
