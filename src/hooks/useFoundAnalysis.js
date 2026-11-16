import { useEffect, useState } from 'react';
import { foundItemService } from '../services/foundItemService';

export default function useFoundAnalysis(foundDraft) {
  const [result, setResult] = useState({ draft: null, data: null, error: null });

  useEffect(() => {
    if (!foundDraft?.photos?.length) return;
    const controller = new AbortController();
    foundItemService.analyze(foundDraft, { signal: controller.signal }).then((data) => {
      if (!controller.signal.aborted) setResult({ draft: foundDraft, data, error: null });
    }).catch((error) => {
      if (!controller.signal.aborted) setResult({ draft: foundDraft, data: null, error: error.message });
    });
    return () => controller.abort();
  }, [foundDraft]);

  const current = result.draft === foundDraft ? result : { data: null, error: null };
  return { data: current.data, error: current.error, isLoading: Boolean(foundDraft?.photos?.length && !current.data && !current.error) };
}
