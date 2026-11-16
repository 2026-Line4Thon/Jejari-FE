import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FoundAnalysisPage.css';
import { FoundItemHeader, FoundItemProgress } from '../../components/found-item/FoundItemLayout';
import FoundItemPhoto from '../../components/found-item/FoundItemPhoto';
import useFoundPhotos from '../../hooks/useFoundPhotos';
import { createMockFoundItem } from '../../mocks/foundItems';
import lock from '../../assets/found-analysis/lock.svg';
import edit from '../../assets/found-analysis/edit.svg';

function AnalysisField({ name, label, value, onChange, estimated = false, required = true }) {
  return (
    <label className={`found-analysis-field found-analysis-field-${name}`}>
      <span>{label}{estimated && <em>AI 추정</em>}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        pattern={required ? '.*\\S.*' : undefined}
        title={required ? '공백이 아닌 내용을 입력해 주세요.' : undefined}
        autoComplete="off"
      />
    </label>
  );
}

export default function FoundAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(() => {
    if (location.state?.foundItem) return { ...createMockFoundItem(), ...location.state.foundItem };
    const foundDraft = location.state?.foundDraft;
    return { ...createMockFoundItem(), foundDraft };
  });
  const { error: photoError, isLoading: isReadingPhoto, selectPhotos } = useFoundPhotos();
  const privateInput = useRef(null);

  const updateField = (event) => {
    const { name, value } = event.target;
    setItem((current) => ({ ...current, [name]: value }));
  };

  const changePhoto = async () => {
    const photos = await selectPhotos('gallery');
    if (!photos) return;
    const photo = photos[0];
    setItem((current) => ({
      ...current, photo: photo.source, photoChanged: !photo.isSample, privacyProtected: photo.privacyProtected ?? false,
      foundDraft: current.foundDraft ? { ...current.foundDraft, photos } : undefined,
    }));
  };

  const registerItem = (event) => {
    event.preventDefault();
    const foundItem = { ...item };
    for (const name of ['kind', 'color', 'brand', 'appearance', 'privateFeature']) {
      foundItem[name] = foundItem[name].trim();
    }
    window.scrollTo(0, 0);
    navigate('/complete', { state: { foundItem } });
  };

  return (
    <main className="found-item-page found-analysis-page" aria-labelledby="found-analysis-title">
      <FoundItemHeader titleId="found-analysis-title" onBack={() => navigate(item.foundDraft ? '/found-item' : '/home', { state: { foundDraft: item.foundDraft } })} />
      <FoundItemProgress />

      <section className="found-analysis-intro" aria-labelledby="found-analysis-result">
        <h2 id="found-analysis-result">Jejari 이미지 분석 결과</h2>
        <p>{item.photoChanged ? '사진을 변경했어요. 특징을 확인하고 수정해 주세요.' : 'Jejari AI가 물건의 특징을 자동으로 분석했어요.'}</p>
      </section>

      <form className="found-analysis-form" onSubmit={registerItem}>
        <div className="found-analysis-photo-field">
          <span className="found-analysis-label">사진</span>
          <FoundItemPhoto variant="analysis" source={item.photo} name={item.photoChanged ? '선택한 습득물 사진' : '검정색 무선 이어폰'} isSample={!item.photoChanged} privacyProtected={item.privacyProtected} onChange={changePhoto} disabled={isReadingPhoto} />
          {photoError && <p className="found-analysis-photo-error" role="alert">{photoError}</p>}
        </div>

        <div className="found-analysis-field-row">
          <AnalysisField name="kind" label="물건 종류" value={item.kind} onChange={updateField} />
          <AnalysisField name="color" label="색상" value={item.color} onChange={updateField} />
        </div>
        <AnalysisField name="brand" label="브랜드" value={item.brand} onChange={updateField} estimated={!item.photoChanged} required={false} />
        <AnalysisField name="appearance" label="외형 및 주요 특징" value={item.appearance} onChange={updateField} />

        <div className="found-analysis-private-field">
          <label className="found-analysis-label" htmlFor="found-private-feature">소유권 확인용 비공개 특징</label>
          <div className="found-analysis-private-card">
            <p id="found-private-description"><img src={lock} alt="" />소유권 확인 전에는 공개되지 않아요.</p>
            <button type="button" aria-label="비공개 특징 수정" onClick={() => privateInput.current?.focus()}><img src={edit} alt="" /></button>
            <input ref={privateInput} id="found-private-feature" name="privateFeature" aria-describedby="found-private-description" value={item.privateFeature} onChange={updateField} autoComplete="off" required pattern=".*\S.*" title="소유권 확인에 사용할 비공개 특징을 입력해 주세요." />
          </div>
        </div>

        <button className="found-analysis-submit" type="submit" disabled={isReadingPhoto}>이 정보로 등록하기</button>
      </form>
    </main>
  );
}
