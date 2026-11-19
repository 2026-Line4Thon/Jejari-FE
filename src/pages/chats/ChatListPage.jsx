import { Link, useNavigate } from 'react-router-dom';
import { ChatLayout, ChatPhoto, ChatFeedback } from '../../components/chat/ChatLayout';
import { chatAssets } from '../../components/chat/chatAssets';
import { chatRoomPath } from '../../components/chat/chatRoutes';
import { useChatList } from '../../hooks/useChat';
import navSurface from '../../assets/dashboard-new/nav.svg';

export function ChatListView({ rooms, filter, onFilter, onBack, isLoading = false, error = '' }) {
  return <ChatLayout className="chat-list-page" onBack={onBack}>
    <style>{'.chat-list-page .chat-heading { margin-top: calc(7.82dvh - max(12px, env(safe-area-inset-top))); } .chat-list-page .home-aligned-navigation { position: relative; z-index: 1; display: flex; flex: 0 0 9.72dvh; height: 9.72dvh; align-items: flex-start; justify-content: space-between; padding: 2.13dvh 40px 0; background: #fafdff; } .chat-list-page .home-aligned-navigation > img { position: absolute; top: 0; left: -2px; z-index: 0; width: 394px; height: 9.72dvh; min-width: 100%; clip-path: inset(0 0 calc(100% - 2px) 0); } .chat-list-page .home-aligned-navigation a { position: relative; z-index: 1; display: flex; flex: 0 0 auto; min-width: 21px; align-items: center; flex-direction: column; gap: 5px; color: #8b8a93; font-size: 11px; font-weight: 600; line-height: 11px; letter-spacing: -.4px; text-decoration: none; white-space: nowrap; word-break: keep-all; } .chat-list-page .home-aligned-navigation a img { display: block; width: 21px; height: 21px; flex: 0 0 21px; } .chat-list-page .home-aligned-navigation a.active { color: #0766ad; font-weight: 700; } .chat-list-page .home-aligned-navigation a span { display: block; height: 11px; line-height: 11px; text-align: center; }'}</style>
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
    <nav className="home-aligned-navigation" aria-label="주 메뉴"><img src={navSurface} alt="" /><Link to="/home"><img src={chatAssets.navHome} alt="" /><span>홈</span></Link><Link to="/chats" className="active" aria-current="page"><img src={chatAssets.navChat} alt="" /><span>채팅</span></Link><Link to="/mypage"><img src={chatAssets.navMy} alt="" /><span>마이</span></Link></nav>
  </ChatLayout>;
}

export default function ChatListPage() {
  const chat = useChatList();
  const navigate = useNavigate();
  return <ChatListView rooms={chat.data} filter={chat.filter} onFilter={chat.setFilter} onBack={() => navigate('/home')} isLoading={chat.isLoading} error={chat.error} />;
}
