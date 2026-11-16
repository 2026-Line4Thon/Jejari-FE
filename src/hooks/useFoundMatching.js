import { useState } from 'react';
import { foundItemService } from '../services/foundItemService';

export default function useFoundMatching() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadResults = async () => {
    setIsLoading(true);
    setError('');
    try {
      setData(await foundItemService.getMatchingResults());
    } catch (matchingError) {
      setError(matchingError.message || '매칭 결과를 불러오지 못했어요. 다시 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, loadResults };
}
