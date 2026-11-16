import { Link } from 'react-router-dom';
import { MatchingLayout } from '../matching-flow/MatchingLayout';
import { foundMatchingSurfaceStyles } from './foundMatchingAssets';
import './FoundMatching.css';

export function FoundMatchingLayout({ title, titleId, onBack, detail = false, children }) {
  return <MatchingLayout title={title} titleId={titleId} onBack={onBack} style={foundMatchingSurfaceStyles} className={detail ? 'found-matching-detail-page' : 'found-matching-list-page'}>
    {children}
    <footer className="found-matching-footer"><Link className="matching-primary-button" to="/home">홈으로 이동</Link></footer>
  </MatchingLayout>;
}

export function FoundMatchingFeedback({ isLoading, error, onBack }) {
  return <div className="matching-load-state" role={error ? 'alert' : 'status'}>
    <p>{isLoading ? '매칭 정보를 불러오고 있어요.' : error}</p>
    {error && <button className="matching-primary-button" type="button" onClick={onBack}>이전 화면으로 돌아가기</button>}
  </div>;
}
