import { FoundItemHeader } from '../found-item/FoundItemLayout';
import { chatAssets, chatSurfaceStyles } from './chatAssets';
import BottomNavigation from '../navigation/BottomNavigation';
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
  return <BottomNavigation />;
}

export function ChatFeedback({ isLoading, error, children }) {
  if (!isLoading && !error) return children;
  return <div className="chat-feedback" role={error ? 'alert' : 'status'}>{error || '채팅을 불러오고 있어요.'}</div>;
}
