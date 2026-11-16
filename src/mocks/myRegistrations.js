import { mockLostItem } from './matchingItems';
import { matchingAssets } from '../components/matching-flow/matchingAssets';
import { chatAssets } from '../components/chat/chatAssets';

// UI models; the supplied API catalog does not define response fields yet.
export const mockMyRegistrations = [
  {
    ...mockLostItem, type: 'lost', status: 'candidates',
    photo: { source: matchingAssets.earbuds, variant: 'earbuds' },
  },
  {
    id: 201, type: 'found', name: '보조 배터리', place: '학생회관',
    status: 'returning', chatId: 'room-power-bank',
    photo: { source: chatAssets.powerBank, variant: 'power-bank' },
  },
];
