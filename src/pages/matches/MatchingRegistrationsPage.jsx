import { useNavigate } from 'react-router-dom';
import useMyRegistrations from '../../hooks/useMyRegistrations';
import { getMatchedRegistrations, getRegistrationBadge } from '../../utils/myRegistrationNavigation';
import { MatchingLayout } from '../../components/matching-flow/MatchingLayout';
import { matchingOverviewPath } from '../../components/matching-flow/matchingRoutes';
import '../mypage/MyPage.css';
import './MatchingRegistrationsPage.css';

export function MatchingRegistrationsView({ items, onBack, onOpen, isLoading = false, error = '', pendingKey = null }) {
  return <MatchingLayout title="내 매칭 현황" titleId="matching-registrations-title" onBack={onBack} className="matching-registrations-page">
    <section className="matching-list-intro"><h2>매칭 후보가 있는 물건{!isLoading && !error ? ` ${items.length}개` : ''}</h2><p>물건을 선택하면 매칭 후보를 확인할 수 있어요.</p></section>
    {isLoading && <p className="my-registration-feedback" role="status">등록 내역을 불러오고 있어요.</p>}
    {error && <p className="my-registration-feedback" role="alert">{error}</p>}
    {!isLoading && !error && !items.length && <div className="matching-empty" role="status"><h3>아직 매칭 후보가 있는 물건이 없어요.</h3><p>새로운 후보가 생기면 여기에서 확인할 수 있어요.</p></div>}
    <div className="matching-registrations-list">
      {items.map((item) => {
        const badge = getRegistrationBadge(item);
        const key = item.type + ':' + item.id;
        return <button type="button" className="my-item" key={key} onClick={() => onOpen(item.id, item.type)} disabled={pendingKey !== null} aria-busy={pendingKey === key}>
          <span className={'my-item-photo is-' + item.photo.variant}><img src={item.photo.source} alt="" /></span>
          <div><em className={badge.className}>{badge.label}</em><strong>{item.name}</strong><small>{item.type === 'lost' ? '분실' : '습득'} · {item.place}</small></div>
          <b aria-hidden="true">›</b>
        </button>;
      })}
    </div>
  </MatchingLayout>;
}

export default function MatchingRegistrationsPage() {
  const navigate = useNavigate();
  const registrations = useMyRegistrations({ includeStats: false });
  const openRegistration = async (itemId, itemType) => {
    const destination = await registrations.open(itemId, itemType, { returnTo: matchingOverviewPath });
    if (destination) navigate(destination.to, { state: destination.state });
  };
  return <MatchingRegistrationsView items={getMatchedRegistrations(registrations.items)} onBack={() => navigate('/home')} onOpen={openRegistration} isLoading={registrations.isLoading} error={registrations.error} pendingKey={registrations.pendingKey} />;
}
