import earbudsPhoto from '../assets/found-analysis/earbuds.png';

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
