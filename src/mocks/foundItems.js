import earbudsPhoto from '../assets/found-analysis/earbuds.png';
import { createMockLostCandidates } from './foundMatchingItems';

const mockPhoto = {
  id: 'mock-earbuds',
  source: earbudsPhoto,
  name: '검정색 무선 이어폰',
  isSample: true,
  privacyProtected: true,
};

const mockAnalysis = {
  kind: '무선 이어폰',
  color: '검정색',
  brand: '삼성',
  appearance: '둥근 외형, 실리콘 케이스, 무광 플라스틱 재질',
  privateFeature: '이어폰 케이스 뒷면 빨간색 점 3개 표시',
  privacyProtected: true,
};

export function createMockFoundPhotos(origin = 'gallery') {
  return [{ ...mockPhoto, origin }];
}

export function createMockFoundAnalysis() {
  return { ...mockAnalysis };
}

export function createMockFoundItem() {
  return { ...mockAnalysis, photo: mockPhoto.source, photoChanged: false };
}

export function createMockFoundRegistration() {
  return {
    id: 'mock-found-1',
    ...createMockFoundItem(),
    foundDraft: { place: '중앙도서관 2층', date: '2026-03-18', time: '', description: '', photos: createMockFoundPhotos() },
  };
}

export function createMockFoundMatching(item = createMockFoundRegistration()) {
  return {
    status: 'matched',
    foundItem: { id: item.id, name: item.kind, color: item.color, place: item.foundDraft?.place ?? '', date: item.foundDraft?.date ?? '' },
    candidates: createMockLostCandidates(),
  };
}
