import logo from '../assets/dashboard-new/logo.svg';
import editIcon from '../assets/ai-feature/edit.svg';

export default function LostItemSummary({ item, isPreview, onEdit }) {
  return <article className="ai-summary-card">
    <div className="ai-summary-head"><img src={logo} alt="제자리" /><span><small>{isPreview ? '입력 정보 미리보기' : 'Jejari 정리 완료'}</small><strong>{item.name}</strong></span><button type="button" onClick={onEdit}><img src={editIcon} alt="" />정보 수정하기</button></div>
    <dl><div><dt>분실 장소</dt><dd>{item.place}</dd></div><div><dt>색상</dt><dd>{item.color}</dd></div><div><dt>날짜</dt><dd>{item.dateLabel}</dd></div><div><dt>재질</dt><dd>{item.material}</dd></div><div><dt>브랜드</dt><dd>{item.brand}</dd></div></dl>
  </article>;
}
