import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './LostItemFormPage.css';
import pageBackground from '../../assets/lost-form-new/background.svg';
import progress from '../../assets/lost-method/progress.svg';
import progressActive from '../../assets/lost-form-new/progress-active.svg';
import uploadBox from '../../assets/lost-form-new/upload-box.svg';
import uploadIcon from '../../assets/lost-form-new/upload-icon.svg';
import shortInput from '../../assets/lost-form-new/short-input.svg';
import inputSurface from '../../assets/lost-form-new/input.svg';
import textAreaSurface from '../../assets/lost-form-new/textarea.svg';
import buttonSurface from '../../assets/lost-form-new/button.svg';
import backSurface from '../../assets/recent-found/back.svg';
import backArrow from '../../assets/recent-found/back-arrow.svg';
import cameraButton from '../../assets/photo-picker/camera-button.svg';
import galleryButton from '../../assets/photo-picker/gallery-button.svg';
import closeIcon from '../../assets/photo-picker/close.svg';
import selectedPhoto from '../../assets/photo-result/raw-image-1.png';
import textModeTextarea from '../../assets/lost-form-new/text-textarea.svg';

function FormInput({ className = '', placeholder }) {
  return <label className={`lost-new-input ${className}`}><img src={className.includes('short') ? shortInput : inputSurface} alt="" /><input placeholder={placeholder} /></label>;
}

export default function LostItemFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isTextMode = searchParams.get('mode') === 'text';
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [hasSelectedPhoto, setHasSelectedPhoto] = useState(false);
  const completePhotoSelection = () => {
    setHasSelectedPhoto(true);
    setIsPhotoPickerOpen(false);
  };
  return <main className="lost-new-page">
    <img className="lost-new-background" src={pageBackground} alt="" />
    <header className="lost-new-header">
      <button type="button" onClick={() => navigate('/register')} aria-label="이전 화면"><img className="lost-new-back-surface" src={backSurface} alt="" /><img className="lost-new-back-arrow" src={backArrow} alt="" /></button>
      <h1>분실물 등록</h1>
    </header>
    <section className={`lost-new-content${isTextMode ? ' text-only' : ''}`}>
      <div className="lost-new-step"><span>기본 정보 입력</span><strong>2 / 3</strong></div>
      <div className="lost-new-progress"><img src={progress} alt="" /><img src={progressActive} alt="" /></div>
      {!isTextMode && <strong className="lost-new-label photo-label">사진</strong>}
      {!isTextMode && (hasSelectedPhoto ? (
        <button className="lost-new-upload lost-new-upload-complete" type="button" onClick={() => setIsPhotoPickerOpen(true)}>
          <span className="lost-new-photo-preview"><img src={selectedPhoto} alt="선택된 검은색 무선 이어폰" /></span>
          <span className="lost-new-photo-change"><img src={uploadIcon} alt="" />사진 변경하기</span>
          <span className="lost-new-photo-complete">✓ 사진 추가 완료</span>
        </button>
      ) : (
        <button className="lost-new-upload" type="button" onClick={() => setIsPhotoPickerOpen(true)}><img className="lost-new-upload-box" src={uploadBox} alt="" /><img className="lost-new-upload-icon" src={uploadIcon} alt="" /><b>사진 추가하기</b><small>최대 3장 등록 가능</small></button>
      ))}
      <div className="lost-new-field kind"><strong>물건 종류</strong><FormInput className="short" placeholder="" /></div>
      <div className="lost-new-field color"><strong>색상</strong><FormInput className="short" placeholder="" /></div>
      <div className="lost-new-field brand"><strong>브랜드 <em>선택</em></strong><FormInput placeholder="" /></div>
      <div className="lost-new-field place"><strong>분실 장소</strong><FormInput placeholder="장소를 선택해 주세요" /></div>
      <div className="lost-new-field date"><strong>마지막 확인 날짜</strong><FormInput className="short" placeholder="" /></div>
      <div className="lost-new-field time"><strong>시간 <em>선택</em></strong><FormInput className="short" placeholder="" /></div>
      <div className="lost-new-field detail"><strong>특징 및 상세 설명 <em>{isTextMode ? '선택' : ''}</em></strong><label className="lost-new-textarea"><img src={isTextMode ? textModeTextarea : textAreaSurface} alt="" /><input placeholder="기억나는 모양, 흠집 등 상세 특징을 적어 주세요." /></label></div>
      <footer className="lost-new-footer"><button type="button" onClick={() => navigate('/ai-feature')}><img src={buttonSurface} alt="" /><span>다음 · AI와 특징 정리하기</span></button></footer>
    </section>
    {isPhotoPickerOpen && <div className="photo-picker" role="dialog" aria-modal="true" aria-label="사진 추가 방법 선택"><button className="photo-picker-dim" type="button" aria-label="사진 선택 닫기" onClick={() => setIsPhotoPickerOpen(false)} /><section className="photo-picker-sheet"><button className="photo-picker-close" type="button" aria-label="닫기" onClick={() => setIsPhotoPickerOpen(false)}><img src={closeIcon} alt="" /></button><h2>사진 추가하기</h2><p>사진을 등록할 방법을 선택해 주세요.</p><button className="photo-picker-action camera" type="button" onClick={completePhotoSelection}><img src={cameraButton} alt="" /><span>카메라로 촬영하기</span></button><button className="photo-picker-action gallery" type="button" onClick={completePhotoSelection}><img src={galleryButton} alt="" /><span>갤러리에서 사진 선택하기</span></button></section></div>}
  </main>;
}
