import { useEffect, useRef, useState } from 'react';
import { myRegistrationService } from '../services/myRegistrationService';
import { getRegistrationDestination } from '../utils/myRegistrationNavigation';
import { authService } from '../services/authService';

export default function useMyRegistrations() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const active = useRef(false);
  const inFlight = useRef(false);
  useEffect(() => {
    active.current = true;
    let cancelled = false;
    Promise.all([myRegistrationService.getOngoing(), authService.profile(), myRegistrationService.summary?.() ?? { lost: 2, found: 1, completed: 3 }]).then(([data, user, summary]) => {
      if (!cancelled) { setItems(data); setProfile(user); setStats(summary); }
    }).catch((loadError) => {
      if (!cancelled) setError(loadError.message);
    }).finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; active.current = false; };
  }, []);

  const open = async (itemId, type) => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setPendingId(itemId);
    setError('');
    try {
      // Recheck the selected registration, rather than routing from stale badge text.
      const item = await myRegistrationService.getStatus(itemId, type);
      const destination = getRegistrationDestination(item);
      if (!destination) throw new Error('이 등록의 연결 정보를 확인할 수 없어요. 잠시 후 다시 확인해 주세요.');
      return active.current ? destination : null;
    } catch (actionError) {
      if (active.current) setError(actionError.message);
      return null;
    } finally {
      inFlight.current = false;
      if (active.current) setPendingId(null);
    }
  };
  return { items, profile, stats, isLoading, error, pendingId, open };
}
