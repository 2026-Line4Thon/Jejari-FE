import { useLocation, useNavigate } from 'react-router-dom';
import './LostItemFormPage.css';
import chevronLeft from '../../assets/icons/chevron-left.svg';
import imageIcon from '../../assets/icons/image-add-placeholder.svg';

function Field({ label, children }) { return <label className="lost-field"><span>{label}</span>{children}</label>; }

export default function LostItemFormPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const isTextOnly = new URLSearchParams(search).get('mode') === 'text';
  return <main className="lost-form-page">
    <header className="lost-form-header"><button type="button" onClick={() => navigate('/register')} aria-label="이전 화면"><img src={chevronLeft} alt="" /></button><h1>분실물 정보 입력</h1></header>
    <section className="lost-form-content">
      <p className="form-kicker">기본 정보 1 / 2</p><h2>어떤 물건을 잃어버렸나요?</h2>
      {!isTextOnly && <div className="lost-field"><span>물건 사진 (선택)</span><button className="photo-placeholder" type="button"><img src={imageIcon} alt="" /><small>+ 사진 추가 · 사진 없이도 괜찮아요</small></button></div>}
      <div className="form-row"><Field label="물건 종류"><select defaultValue="무선 이어폰 케이스"><option>무선 이어폰 케이스</option></select></Field><Field label="색상"><select defaultValue="검정"><option>검정</option></select></Field></div>
      <Field label="브랜드 (선택)"><input placeholder="알고 있다면 입력해 주세요" /></Field>
      <Field label="분실 장소"><input defaultValue="중앙도서관 2층 열람실" /></Field>
      <div className="form-row"><Field label="마지막 확인 날짜"><input defaultValue="2026.11.02" /></Field><Field label="시간"><select defaultValue="14:00"><option>14:00</option></select></Field></div>
      <Field label="상세 특징"><textarea defaultValue="둥근 사각형이고 표면이 무광이에요." /></Field>
      <p className="form-help">정확하지 않은 정보는 다음 대화에서 보완할 수 있어요.</p>
    </section>
    <footer className="lost-form-footer"><button type="button" onClick={() => navigate('/ai-feature')}>다음</button></footer>
  </main>;
}
