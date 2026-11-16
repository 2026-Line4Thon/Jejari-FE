import { Link, useNavigate } from 'react-router-dom';
import { ChatLayout, ChatPhoto, ChatNavigation, ChatFeedback } from '../../components/chat/ChatLayout';
import { chatRoomPath } from '../../components/chat/chatRoutes';
import { useChatList } from '../../hooks/useChat';

export function ChatListView({ rooms, filter, onFilter, onBack, isLoading = false, error = '' }) {
  return <ChatLayout className="chat-list-page" onBack={onBack} onClose={onBack}>
    <div className="chat-filters" role="group" aria-label="채팅 필터">
      <button type="button" aria-pressed={filter === 'all'} onClick={() => onFilter('all')}>전체</button>
      <button type="button" aria-pressed={filter === 'unread'} onClick={() => onFilter('unread')}>안읽음</button>
    </div>
    <section className="chat-list-content" aria-label="채팅 목록">
      <ChatFeedback isLoading={isLoading} error={error}>
        {rooms?.length ? <ul className="chat-room-list">{rooms.map((room) => <li key={room.id}><Link to={chatRoomPath(room.id)}>
          <ChatPhoto photo={room.item.photo} />
          <span className="chat-room-summary"><strong>{room.item.name}</strong><small>{room.status === 'completed' ? '반환 완료' : room.item.place + ' 습득'}</small></span>
          <time>{room.updatedLabel}</time>
          {room.unread && <span className="chat-sr-only">읽지 않은 메시지 있음</span>}
        </Link></li>)}</ul> : <p className="chat-empty">{filter === 'unread' ? '읽지 않은 채팅이 없어요.' : '아직 시작한 채팅이 없어요.'}</p>}
      </ChatFeedback>
    </section>
    <ChatNavigation />
  </ChatLayout>;
}

export default function ChatListPage() {
  const chat = useChatList();
  const navigate = useNavigate();
  return <ChatListView rooms={chat.data} filter={chat.filter} onFilter={chat.setFilter} onBack={() => navigate('/home')} isLoading={chat.isLoading} error={chat.error} />;
}
