import earbuds from '../assets/found-analysis/earbuds.png';
import { chatAssets } from '../components/chat/chatAssets';

export const mockReturnMeeting = {
  place: '중앙도서관 1층 안내데스크',
  timeLabel: '3월 19일 오후 2:34',
};

export function createMockChatRooms() {
  return [
    {
      id: 'room-1', candidateId: 1, status: 'active', unread: true,
      updatedLabel: '방금 전', dateLabel: '3월 19일 수요일',
      item: { name: '무선 이어폰', place: '중앙도서관 2층', dateLabel: '3월 18일', photo: { source: earbuds, variant: 'earbuds' } },
      messages: [
        { id: 'system-1', sender: 'system', text: '비공개 채팅이 시작됐어요.' },
        { id: 'message-1', sender: 'me', text: '안녕하세요. 찾아주셔서 감사합니다ㅜ\n혹시 이어폰 오늘 오후에 받을 수 있을까요?' },
      ],
      meeting: null,
      mockScenario: 'earbuds-return',
    },
    {
      id: 'room-power-bank', itemId: 201, status: 'active', unread: false,
      updatedLabel: '3월 14일', dateLabel: '3월 14일 금요일',
      item: { name: '보조 배터리', place: '학생회관', dateLabel: '3월 14일', photo: { source: chatAssets.powerBank, variant: 'power-bank' } },
      messages: [{ id: 'system-1', sender: 'system', text: '비공개 채팅이 시작됐어요.' }],
      meeting: null, mockScenario: null,
    },
  ];
}

export function createCandidateChat(candidate) {
  return {
    id: 'room-' + candidate.id, candidateId: candidate.id, status: 'active',
    unread: false, updatedLabel: '방금 전', dateLabel: '오늘',
    item: { name: candidate.name, place: candidate.place, dateLabel: candidate.foundAtLabel || '오늘', photo: candidate.photo },
    messages: [{ id: 'system-1', sender: 'system', text: '비공개 채팅이 시작됐어요.' }],
    meeting: null, mockScenario: null,
  };
}
