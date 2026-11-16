import backSurface from '../../assets/found-analysis/back-surface.svg';
import backArrow from '../../assets/found-analysis/back-arrow.svg';
import './FoundItem.css';

export function FoundItemHeader({ onBack, titleId }) {
  return (
    <header className="found-item-header">
      <button type="button" onClick={onBack} aria-label="이전 화면">
        <img src={backSurface} alt="" />
        <img src={backArrow} alt="" />
      </button>
      <h1 id={titleId}>습득물 등록</h1>
    </header>
  );
}

export function FoundItemProgress() {
  return (
    <>
      <div className="found-item-step"><span>기본 정보 입력</span><strong>1 / 2</strong></div>
      <div className="found-item-progress" role="progressbar" aria-label="습득물 등록 진행 단계" aria-valuemin={0} aria-valuemax={2} aria-valuenow={1} />
    </>
  );
}
