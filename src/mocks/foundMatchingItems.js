import { foundMatchingAssets } from '../components/found-matching/foundMatchingAssets';

// Public UI fixtures for the finder-facing matching flow, not server DTOs.
const commonReasons = [
  { title: '물건 종류와 색상이 같아요', description: '검정색 무선 이어폰으로 분석됐어요.' },
  { title: '외형과 세부 특징이 비슷해요', description: '둥근 사각형 외형과 무광 플라스틱 재질이 유사해요.' },
];

const lostCandidates = [
  {
    id: 'lost-1', name: '무선 이어폰', similarity: 'high', attributes: '종류·색상·외형 일치',
    place: '중앙도서관 2층', lostAtLabel: '3월 18일',
    photo: { source: foundMatchingAssets.earbuds, variant: 'earbuds' },
    reasons: [...commonReasons,
      { title: '장소가 가까워요', description: '습득 장소와 같은 중앙도서관 2층에서 발견됐어요.' },
      { title: '습득 시점과 분실 시점이 비슷해요.', description: '3월 18일에 분실되었어요.' },
    ],
  },
  {
    id: 'lost-2', name: '무선 이어폰', similarity: 'high', attributes: '종류·색상·외형 일치',
    place: '중앙도서관 안내데스크', lostAtLabel: '3월 17일 오후 5:00',
    photo: { source: foundMatchingAssets.samsungEarbuds, variant: 'samsung' },
    reasons: [...commonReasons,
      { title: '장소가 가까워요', description: '습득 장소와 가까운 중앙도서관 안내데스크에서 분실되었어요.' },
      { title: '습득 시점과 분실 시점이 비슷해요.', description: '3월 17일에 분실되었어요.' },
    ],
  },
];

export function createMockLostCandidates() {
  return structuredClone(lostCandidates);
}
