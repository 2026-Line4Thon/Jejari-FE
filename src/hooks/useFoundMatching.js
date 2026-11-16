import { useCallback, useEffect, useState } from 'react';
import { foundItemService } from '../services/foundItemService';

function useFoundMatchingResource(load) {
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(load).then((data) => {
      if (active) setResult({ load, data, error: '' });
    }).catch((error) => {
      if (active) setResult({ load, data: null, error: error.message || '매칭 정보를 불러오지 못했어요.' });
    });
    return () => { active = false; };
  }, [load]);
  const current = result?.load === load ? result : null;
  return { data: current?.data ?? null, error: current?.error ?? '', isLoading: !current };
}

export default function useFoundMatching(foundItem) {
  const load = useCallback(() => foundItemService.getMatchingResults(foundItem), [foundItem]);
  return useFoundMatchingResource(load);
}

export function useFoundMatchCandidate(candidateId) {
  const load = useCallback(() => foundItemService.getMatchingCandidate(candidateId), [candidateId]);
  return useFoundMatchingResource(load);
}
