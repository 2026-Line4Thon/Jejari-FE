import { useState } from 'react';
import { foundItemService } from '../services/foundItemService';

export default function useFoundPhotos(initialPhotos = []) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [coverIndex, setCoverIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectPhotos = async (origin) => {
    setIsLoading(true);
    setError('');
    try {
      const selected = await foundItemService.selectPhotos(origin);
      if (!selected?.length) return null;
      if (selected.length > 3) throw new Error('사진은 최대 3장까지 등록할 수 있어요.');
      setPhotos(selected);
      setCoverIndex(0);
      return selected;
    } catch (selectionError) {
      setError(selectionError.message || '사진을 불러오지 못했어요. 다시 선택해 주세요.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { photos, coverIndex, setCoverIndex, cover: photos[coverIndex] ?? photos[0], isLoading, error, selectPhotos };
}
