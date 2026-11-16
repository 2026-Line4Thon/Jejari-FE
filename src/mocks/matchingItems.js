import { matchingAssets } from '../components/matching-flow/matchingAssets';

export const mockLostItem = { id: 101, name: '무선 이어폰', color: '검정색', place: '중앙도서관 2층', dateLabel: '3월 18일' };

const commonReasons = [
  { title: '물건 종류와 색상이 같아요', description: '검정색 무선 이어폰으로 분석됐어요.' },
  { title: '외형과 세부 특징이 비슷해요', description: '둥근 사각형 외형과 무광 플라스틱 재질이 유사해요.' },
];

// UI-facing fixtures. The supplied API catalog does not define response fields yet.
export const mockMatchingCandidates = [
  {
    id: 1, lostItemId: 101, name: '무선 이어폰', similarity: 'high', attributes: '종류·색상·외형 일치',
    place: '중앙도서관 2층', foundAtLabel: '3월 18일 오후 4:10',
    photo: { source: matchingAssets.earbuds, variant: 'earbuds' },
    reasons: [...commonReasons, { title: '장소가 같아요', description: '분실 장소와 같은 중앙도서관 2층에서 발견됐어요.' }, { title: '분실 시점과 습득 시점이 비슷해요', description: '3월 18일에 습득되었어요.' }],
  },
  {
    id: 2, lostItemId: 101, name: '무선 이어폰', similarity: 'high', attributes: '종류·색상·외형 일치',
    place: '중앙도서관 안내데스크', foundAtLabel: '3월 19일 오후 5:00',
    photo: { source: matchingAssets.samsungEarbuds, variant: 'samsung' },
    reasons: [...commonReasons, { title: '장소가 가까워요', description: '분실 장소와 가까운 중앙도서관 안내데스크에서 발견됐어요.' }, { title: '분실 시점과 습득 시점이 비슷해요', description: '3월 19일에 습득되었어요.' }],
  },
  {
    id: 3, lostItemId: 101, name: '무선 이어폰', similarity: 'low', attributes: '종류·색상 일치',
    place: '학생회관 1층', foundAtLabel: '3월 19일 오후 4:30',
    photo: { source: matchingAssets.loopEarbuds, variant: 'loop' },
    reasons: [commonReasons[0], { title: '물건의 외형을 함께 확인해 주세요', description: '케이스의 모양과 세부 특징이 다를 수 있어요.' }, { title: '발견 장소를 확인해 주세요', description: '학생회관 1층에서 발견됐어요.' }, { title: '발견 시점을 확인해 주세요', description: '3월 19일에 습득되었어요.' }],
  },
];

export function createMockOwnershipCheck(candidateId) {
  return { id: 'check-' + candidateId, candidateId, questionId: 1, question: '이어폰 케이스 뒷면에 어떤 특징이 있었나요?', step: 1, total: 1, status: 'pending' };
}
