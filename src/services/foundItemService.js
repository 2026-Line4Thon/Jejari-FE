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
  // Finder-facing candidate-list endpoint is not in the supplied API catalog.
  // Keep this mock boundary until its request/response contract is defined.
  async getMatchingResults(foundItem) {
    return createMockFoundMatching(foundItem);
  },
  // GET /candidates/:candidateId: map the eventual response into this public UI model.
  async getMatchingCandidate(candidateId) {
    const candidate = createMockFoundMatching().candidates.find((item) => item.id === candidateId);
    if (!candidate) throw new Error('매칭 후보를 찾을 수 없어요. 다른 후보를 확인해 주세요.');
    return candidate;
  },
};
