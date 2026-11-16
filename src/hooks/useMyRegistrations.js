import { useEffect, useRef, useState } from 'react';
import { myRegistrationService } from '../services/myRegistrationService';
import { getRegistrationDestination } from '../utils/myRegistrationNavigation';

export default function useMyRegistrations() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const active = useRef(false);
  const inFlight = useRef(false);
  useEffect(() => {
    active.current = true;
    let cancelled = false;
    myRegistrationService.getOngoing().then((data) => {
      if (!cancelled) setItems(data);
    }).catch((loadError) => {
      if (!cancelled) setError(loadError.message);
    }).finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; active.current = false; };
  }, []);

  const open = async (itemId) => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setPendingId(itemId);
    setError('');
    try {
      // Recheck the selected registration, rather than routing from stale badge text.
      const item = await myRegistrationService.getStatus(itemId);
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
  return { items, isLoading, error, pendingId, open };
}
