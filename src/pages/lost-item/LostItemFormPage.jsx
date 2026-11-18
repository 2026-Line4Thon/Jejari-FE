import { useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useItemPhotos from '../../hooks/useFoundPhotos';
import { openInputPicker } from '../../utils/openInputPicker';
import { apiEnabled } from '../../api/config';
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
import textModeTextarea from '../../assets/lost-form-new/text-textarea.svg';

function FormInput({ className = '', label, type = 'text', ...props }) {
  const hasPicker = type === 'date' || type === 'time';
  return <label className={`lost-new-input ${className}`}><img src={className.includes('short') ? shortInput : inputSurface} alt="" /><input {...props} type={type} aria-label={label} onInput={hasPicker ? props.onChange : undefined} onClick={hasPicker ? openInputPicker : undefined} /></label>;
}

export default function LostItemFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isTextMode = searchParams.get('mode') === 'text';
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({ kind: '', color: '', brand: '', place: '', date: '', time: '', description: '', photos: [], ...location.state?.lostDraft }));
  const [photoError, setPhotoError] = useState('');
  const cameraInput = useRef(null);
  const galleryInput = useRef(null);
  const photoButton = useRef(null);
  const { photos, cover, isLoading: isReading, error: selectionError, selectPhotos } = useItemPhotos(draft.photos);
  const updateField = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };
  const choosePhotos = (origin) => {
    setIsPhotoPickerOpen(false);
    setPhotoError('');
    (origin === 'camera' ? cameraInput : galleryInput).current?.click();
  };
  const receivePhotos = (event, origin) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;
    setPhotoError('');
    selectPhotos(origin, files);
  };
  const proceed = (event) => {
    event.preventDefault();
    if (!isTextMode && !cover) {
      setPhotoError('사진을 한 장 이상 추가해 주세요.');
      photoButton.current?.focus();
      return;
    }
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const lostDraft = { ...draft, ...fields, photos, mode: isTextMode ? 'text' : 'photo' };
    navigate('/ai-feature', { state: { lostDraft } });
  };
  return <main className="lost-new-page">
    <img className="lost-new-background" src={pageBackground} alt="" />
    <header className="lost-new-header">
      <button type="button" onClick={() => navigate('/register')} aria-label="이전 화면"><img className="lost-new-back-surface" src={backSurface} alt="" /><img className="lost-new-back-arrow" src={backArrow} alt="" /></button>
      <h1>분실물 등록</h1>
    </header>
    <form className={`lost-new-content${isTextMode ? ' text-only' : ''}`} onSubmit={proceed}>
      <div className="lost-new-step"><span>기본 정보 입력</span><strong>2 / 3</strong></div>
      <div className="lost-new-progress"><img src={progress} alt="" /><img src={progressActive} alt="" /></div>
      {!isTextMode && <strong className="lost-new-label photo-label">사진</strong>}
      {!isTextMode && (cover ? (
        <button ref={photoButton} className="lost-new-upload lost-new-upload-complete" type="button" onClick={() => setIsPhotoPickerOpen(true)} disabled={isReading}>
          <span className="lost-new-photo-preview"><img src={cover.source} alt={cover.name || '선택한 분실물 사진'} /></span>
          <span className="lost-new-photo-change"><img src={uploadIcon} alt="" />사진 변경하기</span>
          <span className="lost-new-photo-complete">✓ 사진 {photos.length}장 추가 완료</span>
        </button>
      ) : (
        <button ref={photoButton} className="lost-new-upload" type="button" onClick={() => setIsPhotoPickerOpen(true)} disabled={isReading}><img className="lost-new-upload-box" src={uploadBox} alt="" /><img className="lost-new-upload-icon" src={uploadIcon} alt="" /><b>{isReading ? '사진을 불러오는 중이에요' : '사진 추가하기'}</b><small>최대 3장 등록 가능</small></button>
      ))}
      {!isTextMode && (photoError || selectionError) && <p className="lost-new-photo-error" role="alert">{photoError || selectionError}</p>}
      <div className="lost-new-field kind"><strong>물건 종류</strong><FormInput className="short" label="물건 종류" name="kind" value={draft.kind} onChange={updateField} required /></div>
      <div className="lost-new-field color"><strong>색상</strong><FormInput className="short" label="색상" name="color" value={draft.color} onChange={updateField} required /></div>
      <div className="lost-new-field brand"><strong>브랜드 <em>선택</em></strong><FormInput label="브랜드" name="brand" value={draft.brand} onChange={updateField} /></div>
      <div className="lost-new-field place"><strong>분실 장소</strong><FormInput label="분실 장소" name="place" value={draft.place} onChange={updateField} placeholder="장소를 입력해 주세요" required /></div>
      <div className="lost-new-field date"><strong>마지막 확인 날짜</strong><FormInput className="short" label="마지막 확인 날짜" type="date" name="date" value={draft.date} onChange={updateField} required /></div>
      <div className="lost-new-field time"><strong>시간 <em>{apiEnabled ? '필수' : '선택'}</em></strong><FormInput className="short" label="시간" type="time" name="time" value={draft.time} onChange={updateField} required={apiEnabled} /></div>
      <div className="lost-new-field detail"><strong>특징 및 상세 설명 <em>{isTextMode ? '선택' : ''}</em></strong><label className="lost-new-textarea"><img src={isTextMode ? textModeTextarea : textAreaSurface} alt="" /><input aria-label="특징 및 상세 설명" name="description" value={draft.description} onChange={updateField} placeholder="기억나는 모양, 흠집 등 상세 특징을 적어 주세요." /></label></div>
      <footer className="lost-new-footer"><button type="submit" disabled={isReading}><img src={buttonSurface} alt="" /><span>다음 · AI와 특징 정리하기</span></button></footer>
    </form>
    <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden aria-label="분실물 카메라로 사진 촬영" onChange={(event) => receivePhotos(event, 'camera')} disabled={isReading} />
    <input ref={galleryInput} type="file" accept="image/*" multiple hidden aria-label="분실물 갤러리에서 사진 선택" onChange={(event) => receivePhotos(event, 'gallery')} disabled={isReading} />
    {isPhotoPickerOpen && <div className="photo-picker" role="dialog" aria-modal="true" aria-label="사진 추가 방법 선택"><button className="photo-picker-dim" type="button" aria-label="사진 선택 닫기" onClick={() => setIsPhotoPickerOpen(false)} /><section className="photo-picker-sheet"><button className="photo-picker-close" type="button" aria-label="닫기" onClick={() => setIsPhotoPickerOpen(false)}><img src={closeIcon} alt="" /></button><h2>사진 추가하기</h2><p>사진을 등록할 방법을 선택해 주세요.</p><button className="photo-picker-action camera" type="button" onClick={() => choosePhotos('camera')}><img src={cameraButton} alt="" /><span>카메라로 촬영하기</span></button><button className="photo-picker-action gallery" type="button" onClick={() => choosePhotos('gallery')}><img src={galleryButton} alt="" /><span>갤러리에서 사진 선택하기</span></button></section></div>}
  </main>;
}
