import { FoundItemHeader } from '../found-item/FoundItemLayout';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { matchingSurfaceStyles, matchingAssets } from './matchingAssets';
import './MatchingFlow.css';

export function MatchingLayout({ title, titleId, onBack, className = '', children }) {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.key]);
  return <main className={'found-item-page matching-flow-page ' + className} style={matchingSurfaceStyles} aria-labelledby={titleId}><FoundItemHeader title={title} titleId={titleId} onBack={onBack} />{children}</main>;
}

export function MatchingLoadState({ title, error, onBack }) {
  return <MatchingLayout title={title} titleId="matching-loading-title" onBack={onBack}><div className="matching-load-state" role={error ? 'alert' : 'status'}><p>{error || '정보를 불러오고 있어요.'}</p>{error && <button className="matching-primary-button" type="button" onClick={onBack}>이전 화면으로 돌아가기</button>}</div></MatchingLayout>;
}

export function CandidatePhoto({ photo, size = 'card', similarity = 'high' }) {
  return <div className={'matching-photo matching-photo-' + size + (similarity === 'low' ? ' is-low' : '')}><div className={'matching-photo-crop' + (photo.variant ? ' is-' + photo.variant : '')}><img src={photo.source} alt="매칭 후보 물건 사진" /></div></div>;
}

export function SimilarityBadge({ similarity, detail = false }) {
  return <span className={'matching-similarity-badge' + (detail ? ' is-detail' : '')}>{similarity === 'high' ? '높은 유사도' : '낮은 유사도'}</span>;
}

export function ReturnPeople() {
  return <div className="return-people" aria-hidden="true"><img className="return-person-surface left" src={matchingAssets.personSurface} alt="" /><img className="return-person-icon left" src={matchingAssets.personLeft} alt="" /><img className="return-person-line left" src={matchingAssets.personConnector} alt="" /><img className="return-connection-glow" src={matchingAssets.connectionGlow} alt="" /><img className="return-connection-check" src={matchingAssets.connectionCheck} alt="" /><img className="return-person-line right" src={matchingAssets.personConnector} alt="" /><img className="return-person-surface right" src={matchingAssets.personSurface} alt="" /><img className="return-person-icon right" src={matchingAssets.personRight} alt="" /></div>;
}

export function ReturnChatIcon() {
  return <span className="return-chat-icon" aria-hidden="true"><img src={matchingAssets.chatOutline} alt="" /><img src={matchingAssets.chatLines} alt="" /></span>;
}
