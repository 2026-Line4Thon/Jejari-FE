import { Link } from 'react-router-dom';
import { FoundItemHeader } from '../found-item/FoundItemLayout';
import { chatAssets, chatSurfaceStyles } from './chatAssets';
import { chatListPath } from './chatRoutes';
import './Chat.css';

export function ChatLayout({ title = '채팅', onBack, onClose, className = '', children }) {
  return <main className={'found-item-page chat-page ' + className} aria-label={title} style={chatSurfaceStyles}>
    <div className="chat-heading">
      <FoundItemHeader title={title} titleId="chat-page-title" onBack={onBack} />
      {onClose && <button type="button" className="chat-close" onClick={onClose} aria-label="채팅 목록 닫기"><img src={chatAssets.close} alt="" /></button>}
    </div>
    {children}
  </main>;
}

export function ChatPhoto({ photo, large = false }) {
  return <span className={'chat-photo' + (large ? ' is-large' : '')}>
    <span className={'chat-photo-crop' + (photo.variant ? ' is-' + photo.variant : '')}><img src={photo.source} alt="" /></span>
  </span>;
}

export function ChatNavigation() {
  return <nav className="chat-bottom-navigation" aria-label="주 메뉴">
    <Link to="/home"><span><img src={chatAssets.navHome} alt="" /></span>홈</Link>
    <Link to={chatListPath} aria-current="page"><span><img src={chatAssets.navChat} alt="" /></span>채팅</Link>
    <Link to="/mypage"><span><img src={chatAssets.navMy} alt="" /></span>마이</Link>
  </nav>;
}

export function ChatFeedback({ isLoading, error, children }) {
  if (!isLoading && !error) return children;
  return <div className="chat-feedback" role={error ? 'alert' : 'status'}>{error || '채팅을 불러오고 있어요.'}{error && <Link to={chatListPath}>채팅 목록으로 돌아가기</Link>}</div>;
}
