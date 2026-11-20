import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FoundItemHeader, FoundItemProgress } from '../../components/found-item/FoundItemLayout';
import FoundItemPhoto from '../../components/found-item/FoundItemPhoto';
import PhotoPicker from '../../components/found-item/PhotoPicker';
import useFoundPhotos from '../../hooks/useFoundPhotos';
import PlaceDropdown from '../../components/found-item/PlaceDropdown';
import { openInputPicker } from '../../utils/openInputPicker';
import uploadIcon from '../../assets/found-registration/upload-icon.svg';
import './FoundItemRegistrationPage.css';

export default function FoundItemRegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [draft, setDraft] = useState(() => ({ place: '', date: '', time: '', description: '', photos: [], ...location.state?.foundDraft }));
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const addPhotoButton = useRef(null);
  const cameraInput = useRef(null);
  const galleryInput = useRef(null);
  const { photos, cover, coverIndex, setCoverIndex, isLoading: isReading, error: selectionError, selectPhotos } = useFoundPhotos(draft.photos);

  const updateField = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value, ...(name === 'place' ? { placeId: undefined, locationDetail: '' } : {}) }));
  };

  const choosePhotos = (origin) => {
    setIsPickerOpen(false);
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
    if (!cover) {
      setPhotoError('사진을 한 장 이상 추가해 주세요.');
      addPhotoButton.current?.focus();
      return;
    }
    const orderedPhotos = [cover, ...photos.filter((_, index) => index !== coverIndex)];
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    const foundDraft = { ...draft, ...fields, place: fields.place.trim(), description: fields.description.trim(), photos: orderedPhotos };
    window.scrollTo(0, 0);
    navigate('/found-analyzing', { state: { foundDraft } });
  };

  return (
    <main className="found-item-page found-registration-page" aria-labelledby="found-registration-title">
      <FoundItemHeader titleId="found-registration-title" onBack={() => navigate('/home')} />
      <FoundItemProgress />
      <section className="found-registration-intro">
        <h2>어떤 물건을 주우셨나요?</h2>
        <p>사진을 올리면 AI가 물건의 특징을 자동으로 분석해요.</p>
      </section>
      <form className="found-registration-form" onSubmit={proceed}>
        <div className="found-registration-photo-field">
          <span className="found-registration-label" id="found-registration-photo-label">사진</span>
          {cover ? <FoundItemPhoto source={cover.source} name={cover.name} isSample={cover.isSample} onChange={() => setIsPickerOpen(true)} disabled={isReading} /> : <button ref={addPhotoButton} className="found-registration-upload" type="button" onClick={() => setIsPickerOpen(true)} disabled={isReading} aria-describedby={photoError ? 'found-registration-photo-error' : undefined}><img src={uploadIcon} alt="" /><strong>{isReading ? '사진을 불러오는 중이에요' : '사진 추가하기'}</strong><small>최대 3장 등록 가능</small></button>}
          {photos.length > 1 && <div className="found-registration-thumbnails" aria-label="대표 사진 선택">{photos.map((photo, index) => <button key={photo.id ?? index} type="button" onClick={() => setCoverIndex(index)} aria-label={'사진 ' + (index + 1) + '을 대표 사진으로 선택'} aria-pressed={index === coverIndex}><img src={photo.source} alt="" /></button>)}</div>}
          {(photoError || selectionError) && <p className="found-item-error" id="found-registration-photo-error" role="alert">{photoError || selectionError}</p>}
        </div>
        <div className="found-registration-field found-registration-place"><span>습득 장소</span><PlaceDropdown label="습득 장소" value={draft.place} onChange={(place) => setDraft((current) => ({ ...current, place, placeId: undefined, locationDetail: '' }))} /></div>
        <div className="found-registration-field-row">
          <label className="found-registration-field"><span>습득 날짜</span><input className={draft.date ? 'has-value' : ''} type="date" name="date" value={draft.date} onInput={updateField} onChange={updateField} onClick={openInputPicker} required /></label>
          <label className="found-registration-field"><span>시간 <em>선택</em></span><input className={draft.time ? 'has-value' : ''} type="time" name="time" value={draft.time} onInput={updateField} onChange={updateField} onClick={openInputPicker} /></label>
        </div>
        <label className="found-registration-field found-registration-description"><span>특징 및 상세 설명 <em>선택</em></span><textarea name="description" value={draft.description} onChange={updateField} placeholder="발견 당시 상태나 보관 장소를 적어 주세요." /></label>
        <div className="found-registration-submit-wrap"><button className="found-registration-submit" type="submit" disabled={isReading}>다음 · AI와 특징 정리하기</button></div>
      </form>
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden aria-label="카메라로 사진 촬영" onChange={(event) => receivePhotos(event, 'camera')} disabled={isReading} />
      <input ref={galleryInput} type="file" accept="image/*" multiple hidden aria-label="기기 갤러리에서 사진 선택" onChange={(event) => receivePhotos(event, 'gallery')} disabled={isReading} />
      <PhotoPicker isOpen={isPickerOpen} onClose={() => setIsPickerOpen(false)} onCamera={() => choosePhotos('camera')} onGallery={() => choosePhotos('gallery')} />
    </main>
  );
}
