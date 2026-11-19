import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChatLayout, ChatPhoto, ChatFeedback } from '../../components/chat/ChatLayout';
import { chatAssets } from '../../components/chat/chatAssets';
import { chatListPath, chatCompletePath } from '../../components/chat/chatRoutes';
import { candidatePath } from '../../components/matching-flow/matchingRoutes';
import { useChatRoom } from '../../hooks/useChat';

function getMessageList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function toChatMessage(message, index) {
  const sender = String(message.sender ?? message.sender_type ?? message.role ?? '').toLowerCase();
  const isMine = message.is_mine === true || message.isMine === true || ['me', 'mine', 'self', 'owner'].includes(sender);
  const isSystem = ['system', 'notice'].includes(sender);
  return {
    id: message.message_id ?? message.id ?? `${index}-${message.created_at ?? ''}`,
    text: message.content ?? message.message ?? message.text ?? '',
    sender: isSystem ? 'system' : isMine ? 'me' : 'other',
  };
}

async function readResponseData(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

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
  const itemSummary = <><ChatPhoto photo={room.item.photo} /><span><strong>{room.item.name}</strong><small>{room.item.place} 습득</small></span>{room.candidateId && <img className="chat-item-chevron" src={chatAssets.chevron} alt="" />}</>;
  return <ChatLayout className="private-chat-page" onBack={onBack}>
    {room.candidateId ? <Link className="chat-item-summary" to={candidatePath(room.candidateId)} aria-label={room.item.name + ' 상세 보기'}>{itemSummary}</Link> : <div className="chat-item-summary">{itemSummary}</div>}
    <section className="chat-timeline" aria-label="채팅 내역">
      <time className="chat-date">{room.dateLabel}</time>
      <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions text">
        {room.messages.map((entry) => <p key={entry.id} className={'chat-message is-' + entry.sender + (entry.sender === 'me' && entry.text.length <= 20 ? ' is-short' : '')}>{entry.sender !== 'system' && <span className="chat-sr-only">{entry.sender === 'me' ? '나: ' : '상대방: '}</span>}{entry.text}</p>)}
      </div>
      {room.meeting && !completed && <ChatMeetingCard meeting={room.meeting} onComplete={onComplete} isPending={isPending} />}
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
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeError, setCompleteError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [apiMessages, setApiMessages] = useState(null);
  const [messageLoadError, setMessageLoadError] = useState('');
  const [messageRefresh, setMessageRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const loadMessages = async () => {
      setApiMessages(null);
      setMessageLoadError('');
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) throw new Error('로그인 후 채팅 메시지를 불러올 수 있어요.');
        const response = await fetch(`https://miseno.store/chats/${roomId}/messages?page=1&size=30`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          signal: controller.signal,
        });
        const data = await readResponseData(response);
        if (!response.ok) throw new Error(data.detail || '채팅 메시지를 불러오지 못했어요.');
        setApiMessages(getMessageList(data).map(toChatMessage));
      } catch (error) {
        if (error.name !== 'AbortError') setMessageLoadError(error.message || '채팅 메시지를 불러오지 못했어요.');
      }
    };
    loadMessages();
    return () => controller.abort();
  }, [roomId, messageRefresh]);
  const room = chat.data && apiMessages !== null ? { ...chat.data, messages: apiMessages } : chat.data;
  const messageCount = room?.messages.length;
  const hasMeeting = Boolean(chat.data?.meeting);
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [messageCount, hasMeeting]);
  const onComplete = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    setCompleteError('');
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('로그인 후 반환 완료 처리를 할 수 있어요.');
      const response = await fetch(`https://miseno.store/chats/${roomId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await readResponseData(response);
      if (!response.ok) throw new Error(data.detail || '반환 완료 처리에 실패했어요.');
      navigate(chatCompletePath(roomId));
    } catch (error) {
      setCompleteError(error.message || '반환 완료 처리에 실패했어요.');
    } finally {
      setIsCompleting(false);
    }
  };
  const onSend = async () => {
    const content = chat.message.trim();
    if (!content || isSending) return;
    setIsSending(true);
    setSendError('');
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('로그인 후 메시지를 보낼 수 있어요.');
      const response = await fetch(`https://miseno.store/chats/${roomId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      const data = await readResponseData(response);
      if (!response.ok) throw new Error(data.detail || '메시지 전송에 실패했어요.');
      chat.setMessage('');
      setMessageRefresh((count) => count + 1);
    } catch (error) {
      setSendError(error.message || '메시지 전송에 실패했어요.');
    } finally {
      setIsSending(false);
    }
  };
  if (chat.isLoading || chat.error) return <ChatLayout className="private-chat-page" onBack={onBack}><ChatFeedback isLoading={chat.isLoading} error={chat.error} /></ChatLayout>;
  return <ChatRoomView room={room} message={chat.message} onMessage={chat.setMessage} onSend={onSend} onComplete={onComplete} onBack={onBack} isPending={chat.isPending || isCompleting || isSending} actionError={chat.actionError || completeError || sendError || messageLoadError} endRef={end} />;
}
