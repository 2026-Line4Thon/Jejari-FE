import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChatLayout, ChatPhoto, ChatFeedback } from '../../components/chat/ChatLayout';
import { chatAssets } from '../../components/chat/chatAssets';
import { chatListPath, chatCompletePath } from '../../components/chat/chatRoutes';
import { candidatePath } from '../../components/matching-flow/matchingRoutes';
import { useChatRoom } from '../../hooks/useChat';

export function ChatMeetingCard({ meeting, onComplete, isPending }) {
  return <section className="chat-meeting-card" aria-label="반환 장소 및 시간">
    <dl>
      <div><span className="chat-meeting-icon"><img src={chatAssets.map} alt="" /></span><dt>장소</dt><dd>{meeting.place}</dd></div>
      <div><span className="chat-meeting-icon"><img src={chatAssets.clock} alt="" /></span><dt>시간</dt><dd>{meeting.timeLabel}</dd></div>
    </dl>
    <button type="button" onClick={onComplete} disabled={isPending}>물건을 찾았어요!</button>
  </section>;
}

export function ChatRoomView({ room, message, onMessage, onSend, onComplete, onBack, isPending = false, actionError = '', endRef }) {
  const completed = room.status === 'completed';
  const itemSummary = <><ChatPhoto photo={room.item.photo} /><span><strong>{room.item.name}</strong><small>{room.item.place ? room.item.place + ' 습득' : '습득물 반환 협의'}</small></span>{room.candidateId && <img className="chat-item-chevron" src={chatAssets.chevron} alt="" />}</>;
  return <ChatLayout className="private-chat-page" onBack={onBack}>
    {room.candidateId ? <Link className="chat-item-summary" to={candidatePath(room.candidateId)} aria-label={room.item.name + ' 상세 보기'}>{itemSummary}</Link> : <div className="chat-item-summary">{itemSummary}</div>}
    <section className="chat-timeline" aria-label="채팅 내역">
      <time className="chat-date">{room.dateLabel}</time>
      <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions text">
        {room.messages.map((entry) => <p key={entry.id} className={'chat-message is-' + entry.sender + (entry.sender === 'me' && entry.text.length <= 20 ? ' is-short' : '')}>{entry.sender !== 'system' && <span className="chat-sr-only">{entry.sender === 'me' ? '나: ' : '상대방: '}</span>}{entry.text}</p>)}
      </div>
      {(room.meeting || room.canComplete) && !completed && <ChatMeetingCard meeting={room.meeting ?? { place: '채팅 내용에서 확인해 주세요', timeLabel: '채팅 내용에서 확인해 주세요' }} onComplete={onComplete} isPending={isPending} />}
      {completed && <p className="chat-completed-note">반환이 완료됐어요. <Link to={chatCompletePath(room.id)}>반환 완료 확인하기</Link></p>}
      {actionError && <p className="chat-action-error" role="alert">{actionError}</p>}
      <div ref={endRef} />
    </section>
    <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); onSend(); }}>
      <input aria-label="메시지 입력" placeholder={completed ? '반환이 완료된 채팅이에요' : '메시지 입력'} value={message} onChange={(event) => onMessage(event.target.value)} disabled={completed || isPending} required />
      <button type="submit" aria-label="메시지 전송" disabled={completed || isPending || !message.trim()}><img src={chatAssets.sendIcon} alt="" /></button>
    </form>
  </ChatLayout>;
}

export default function ChatRoomPage() {
  const { roomId } = useParams();
  const chat = useChatRoom(roomId);
  const navigate = useNavigate();
  const location = useLocation();
  const onBack = () => navigate(location.state?.returnTo === '/mypage' ? '/mypage' : chatListPath);
  const end = useRef(null);
  const messageCount = chat.data?.messages.length;
  const hasMeeting = Boolean(chat.data?.meeting);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [messageCount, hasMeeting]);
  const onComplete = async () => {
    const room = await chat.complete();
    if (room) navigate(chatCompletePath(room.id));
  };
  if (chat.isLoading || chat.error) return <ChatLayout className="private-chat-page" onBack={onBack}><ChatFeedback isLoading={chat.isLoading} error={chat.error} /></ChatLayout>;
  return <ChatRoomView room={chat.data} message={chat.message} onMessage={chat.setMessage} onSend={chat.sendMessage} onComplete={onComplete} onBack={onBack} isPending={chat.isPending} actionError={chat.actionError} endRef={end} />;
}
