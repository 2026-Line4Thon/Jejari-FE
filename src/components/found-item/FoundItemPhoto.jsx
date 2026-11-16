import privacyIcon from '../../assets/found-analysis/privacy-icon.svg';
import imageFrame from '../../assets/found-analysis/image-frame.svg';
import imageDot from '../../assets/found-analysis/image-dot.svg';
import imageLandscape from '../../assets/found-analysis/image-landscape.svg';
import check from '../../assets/found-analysis/check.svg';
import './FoundItem.css';

export default function FoundItemPhoto({ source, name = '습득물 사진', isSample = false, privacyProtected = false, onChange, disabled = false, variant = 'registration' }) {
  return (
    <div className={'found-item-photo' + (variant === 'analysis' ? ' is-analysis' : '')}>
      <div className={'found-item-photo-crop' + (isSample ? ' is-sample' : '')}><img src={source} alt={name} /></div>
      {privacyProtected && <span className="found-item-privacy-badge"><img src={privacyIcon} alt="" />민감정보 블러</span>}
      <button className="found-item-photo-change" type="button" onClick={onChange} disabled={disabled}>
        <span className="found-item-image-icon" aria-hidden="true"><img src={imageFrame} alt="" /><img src={imageDot} alt="" /><img src={imageLandscape} alt="" /></span>
        {disabled ? '불러오는 중' : '사진 변경하기'}
      </button>
      <span className="found-item-photo-complete"><img src={check} alt="" />사진 추가 완료</span>
    </div>
  );
}
