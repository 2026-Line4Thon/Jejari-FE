import { createMockFoundAnalysis, createMockFoundMatching } from '../mocks/foundItems';
import { createLocalFoundPhotos } from './foundPhotoStore';

function waitForAnalysis(signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Analysis cancelled', 'AbortError'));
      return;
    }
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException('Analysis cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      resolve();
    }, 1800);
    signal?.addEventListener('abort', abort, { once: true });
  });
}

// Analysis and matching use mock responses until FE API endpoints are available.
export const foundItemService = {
  async selectPhotos(origin, files) {
    return createLocalFoundPhotos(files, origin);
  },
  async analyze(foundDraft, { signal } = {}) {
    if (!foundDraft?.photos?.length) throw new Error('분석할 사진을 먼저 선택해 주세요.');
    await waitForAnalysis(signal);
    return { ...createMockFoundAnalysis(), privacyProtected: foundDraft.photos[0].privacyProtected === true };
  },
  async getMatchingResults() {
    return createMockFoundMatching();
  },
};
