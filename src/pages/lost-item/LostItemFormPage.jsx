import { useNavigate } from 'react-router-dom';
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

function FormInput({ className = '', placeholder }) {
  return <label className={`lost-new-input ${className}`}><img src={className.includes('short') ? shortInput : inputSurface} alt="" /><input placeholder={placeholder} /></label>;
}

export default function LostItemFormPage() {
  const navigate = useNavigate();
  return <main className="lost-new-page">
    <img className="lost-new-background" src={pageBackground} alt="" />
    <header className="lost-new-header">
      <button type="button" onClick={() => navigate('/register')} aria-label="이전 화면"><img className="lost-new-back-surface" src={backSurface} alt="" /><img className="lost-new-back-arrow" src={backArrow} alt="" /></button>
      <h1>분실물 등록</h1>
    </header>
    <section className="lost-new-content">
      <div className="lost-new-step"><span>기본 정보 입력</span><strong>2 / 3</strong></div>
      <div className="lost-new-progress"><img src={progress} alt="" /><img src={progressActive} alt="" /></div>
      <strong className="lost-new-label photo-label">사진</strong>
      <button className="lost-new-upload" type="button"><img className="lost-new-upload-box" src={uploadBox} alt="" /><img className="lost-new-upload-icon" src={uploadIcon} alt="" /><b>사진 추가하기</b><small>최대 3장 등록 가능</small></button>
      <div className="lost-new-field kind"><strong>물건 종류</strong><FormInput className="short" placeholder="예: 무선 이어폰" /></div>
      <div className="lost-new-field color"><strong>색상</strong><FormInput className="short" placeholder="예: 검정색" /></div>
      <div className="lost-new-field brand"><strong>브랜드 <em>선택</em></strong><FormInput placeholder="예: 삼성" /></div>
      <div className="lost-new-field place"><strong>분실 장소</strong><FormInput placeholder="장소를 선택해 주세요" /></div>
      <div className="lost-new-field date"><strong>마지막 확인 날짜</strong><FormInput className="short" placeholder="날짜를 선택해 주세요" /></div>
      <div className="lost-new-field time"><strong>시간 <em>선택</em></strong><FormInput className="short" placeholder="시간을 선택해 주세요" /></div>
      <div className="lost-new-field detail"><strong>특징 및 상세 설명</strong><label className="lost-new-textarea"><img src={textAreaSurface} alt="" /><input placeholder="기억나는 모양, 흠집 등 상세 특징을 적어 주세요." /></label></div>
      <footer className="lost-new-footer"><button type="button" onClick={() => navigate('/ai-feature')}><img src={buttonSurface} alt="" /><span>다음 · AI와 특징 정리하기</span></button></footer>
    </section>
  </main>;
}
