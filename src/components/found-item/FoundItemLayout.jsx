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

export function FoundItemProgress({ step = 1 }) {
  const totalSteps = 2;
  const label = step === 2 ? '분석 결과 확인' : '기본 정보 입력';

  return (
    <>
      <div className="found-item-step"><span>{label}</span><strong>{step} / {totalSteps}</strong></div>
      <div className="found-item-progress" style={{ '--found-item-progress-width': `${(step / totalSteps) * 100}%` }} role="progressbar" aria-label="습득물 등록 진행 단계" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={step} />
    </>
  );
}
