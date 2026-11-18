import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url)).replace(/\\/g, '/').replace(/\/$/, '');
const require = createRequire(root + '/package.json');
const { createServer } = await import(pathToFileURL(require.resolve('vite')));
const contracts = JSON.parse(fs.readFileSync(new URL('./fixtures/api-contracts.json', import.meta.url)));
function examples(name) { return contracts[name]; }
function sample(name, key) { const value = examples(name).find((data) => Object.hasOwn(data, key)); assert(value, name + ': missing contract sample'); return structuredClone(value); }
const calls = [];
let roomStatus = 'ACTIVE';
let answerCount = 0;
let statusMode = 'CANDIDATE_FOUND';
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, init) => {
  const request = new URL(url);
  assert.equal(request.origin, 'https://example.invalid');
  const path = request.pathname.replace(/^\/api/, '');
  const body = init.body instanceof FormData ? init.body : init.body ? JSON.parse(init.body) : undefined;
  calls.push({ path, method: init.method, body, headers: init.headers, query: request.searchParams });
  const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  if (path === '/auth/email/send') { assert.equal(init.headers.Authorization, undefined); assert.deepEqual(Object.keys(body), ['email']); return response(sample('send', 'expires_in')); }
  if (path === '/auth/email/verify') return response(sample('verify', 'access_token'));
  assert.match(init.headers.Authorization, /^Bearer /);
  if (path === '/auth/logout') return response({ message: '로그아웃되었습니다.' });
  if (path === '/users/me') return response(sample('profile', 'nickname'));
  if (path === '/home') return response(sample('home', 'recent_found_items'));
  if (path === '/users/me/history') return response(sample('내 반환 완료 내역 조회', 'history'));
  if (path === '/users/me/items') return response(request.searchParams.get('type') === 'lost' ? sample('items', 'items') : { type: 'found', total_count: 1, items: [{ id: 21, item_type: 'FOUND', item_name: '보조 배터리', status: 'CHATTING', thumbnail_url: null }] });
  if (path === '/users/me/items/21/status') return response({ ...sample('status', 'item_id'), item_type: request.searchParams.get('type').toUpperCase(), status: request.searchParams.get('type') === 'found' ? 'CHATTING' : statusMode });
  if (path === '/items/found' && init.method === 'GET') return response({ items: [sample('습득물 전체 목록 조회', 'items').items[Number(request.searchParams.get('page')) - 1]], has_next: request.searchParams.get('page') === '1', total_count: 2 });
  if (path === '/items/found/15') return response(sample('습득물 상세 조회', 'category'));
  if (path === '/notifications') return response(sample('알림 목록 조회', 'notifications'));
  if (path === '/notifications/102/read') { assert.equal(init.method, 'PATCH'); assert.equal(body, undefined); return response({ id: 102, is_read: true }); }
  if (path === '/items/lost/21') return response(sample('분실물 등록 결과 조회', 'lost_item_id'));
  if (path === '/items/lost/21/candidates') return response(sample('매칭 후보 목록 조회', 'candidates'));
  if (path === '/candidates/7') return response(sample('매칭 후보 상세 조회', 'found_item'));
  if (path === '/candidates/7/reject') return response(sample('매칭 후보 제외', 'candidate_id'));
  if (path === '/candidates/7/ownership-checks') return response(sample('소유권 확인 질문 생성', 'questions'), 201);
  if (path === '/ownership-checks/5/answers') {
    answerCount += 1;
    assert.equal(body.answers.length, answerCount === 1 ? 2 : 1);
    return response(examples('소유권 확인 답변 제출').find((data) => data.result === (answerCount === 1 ? 'NEED_MORE' : 'MATCHED')));
  }
  if (path === '/ownership-checks/5') return response(sample('소유권 확인 결과 조회', 'result'));
  if (/^\/chats\/(11|108)\/messages$/.test(path)) {
    if (init.method === 'POST') { assert.deepEqual(Object.keys(body), ['content']); return response(sample('채팅 메시지 전송', 'message_id')); }
    return response({ ...sample('채팅 메시지 목록 조회', 'messages'), chat_room_id: Number(path.split('/')[2]), status: roomStatus });
  }
  if (path === '/chats') { assert.deepEqual(body, { candidate_id: 7 }); return response(sample('비공개 채팅방 생성', 'chat_room_id')); }
  if (path === '/chats/108/complete') { roomStatus = 'COMPLETED'; return response(sample('반환 완료 처리', 'completed_at')); }
  if (/^\/items\/(found|lost)\/images\/analyze$/.test(path)) { assert(body instanceof FormData); assert(body.get('image') instanceof Blob); assert.equal(init.headers['Content-Type'], undefined); return response(sample(path.includes('/found/') ? '습득물 사진 분석' : '분실물 사진 분석', 'image_id'), 201); }
  if (path === '/items/lost/feature-chats') return response(sample('AI 특징 구체화 시작', 'chat_id'), 201);
  if (path === '/items/lost/feature-chats/3/answers') return response(examples('특징 질문 답변 제출').find((data) => data.is_finished === true));
  if (path === '/items/lost/feature-chats/3/finish') return response(sample('AI 특징 구체화 종료', 'chat_id'));
  if (path === '/items/found' && init.method === 'POST') { assert.equal(body.place_id, 4); assert.equal(body.image_id, 30); assert.equal(body.private_features, '내부의 개인 특징'); return response(sample('습득물 등록', 'found_item_id'), 201); }
  if (path === '/items/lost' && init.method === 'POST') { assert.equal(body.place_id, 4); assert.equal(body.category, '지갑'); assert(body.lost_from.endsWith('+09:00')); return response(sample('분실물 등록', 'lost_item_id'), 201); }
  throw new Error('Unexpected request: ' + init.method + ' ' + path);
};
const server = await createServer({ root, cacheDir: root + '/node_modules/.cache/jejari-api-tests', server: { middlewareMode: true, hmr: false }, appType: 'custom', define: { 'import.meta.env.VITE_API_MODE': JSON.stringify('api'), 'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://example.invalid/api'), 'import.meta.env.VITE_PLACE_IDS': JSON.stringify('{"중앙도서관":4}') } });
try {
  const load = (name) => server.ssrLoadModule('/src/' + name + '.js');
  const { apiEnabled } = await load('api/config');
  assert.equal(apiEnabled, true);
  const { authSession } = await load('api/session');
  const { authService } = await load('services/authService');
  const { jejariApi, apiId } = await load('api/endpoints');
  const { queryService } = await load('services/queryService');
  const { myRegistrationService } = await load('services/myRegistrationService');
  const { matchingService } = await load('services/matchingService');
  const { chatService } = await load('services/chatService');
  const { foundItemService } = await load('services/foundItemService');
  const { registrationService } = await load('services/registrationService');
  const { createLocalFoundPhotos } = await load('services/foundPhotoStore');
  const { getRegistrationDestination } = await load('utils/myRegistrationNavigation');
  await authService.sendCode('student@university.ac.kr');
  await authService.verify('student@university.ac.kr', '123456');
  assert(authSession.get().accessToken);
  const home = await queryService.home();
  assert.equal(home.matchingPath, '/matches?itemId=21');
  assert.equal(home.items[0].id, 15);
  assert.equal((await queryService.foundItems()).length, 2);
  assert.equal((await queryService.history()).total, 1);
  assert.equal((await myRegistrationService.getOngoing()).length, 3);
  const foundStatus = await myRegistrationService.getStatus(21, 'found');
  assert.equal(getRegistrationDestination(foundStatus).to, '/chats/108');
  const lostStatus = await myRegistrationService.getStatus(21, 'lost');
  assert.equal(getRegistrationDestination(lostStatus).to, '/matches?itemId=21');
  assert.equal((await myRegistrationService.summary()).completed, 1);
  const matches = await matchingService.getCandidates(21);
  assert.equal(matches.lostItem.id, 21);
  assert.equal(matches.candidates[0].id, 7);
  assert(!JSON.stringify(matches).includes('private_features'));
  assert.equal((await matchingService.getCandidate(7)).reasons[0].title, '물건 종류');
  await matchingService.rejectCandidate(7);
  const [check, sameCheck] = await Promise.all([matchingService.createOwnershipCheck(7), matchingService.createOwnershipCheck(7)]);
  assert.equal(check.id, sameCheck.id);
  assert.equal(calls.filter((call) => call.path === '/candidates/7/ownership-checks').length, 1);
  assert.equal((await matchingService.submitOwnershipAnswer(check.id, '고양이')).step, 2);
  assert.equal(answerCount, 0);
  const more = await matchingService.submitOwnershipAnswer(check.id, '디지털소프트웨어공학과');
  assert.equal(more.questionId, 3);
  assert.equal(more.status, 'pending');
  assert.equal((await matchingService.submitOwnershipAnswer(check.id, '모서리 흠집')).status, 'verified');
  assert.equal((await matchingService.createChat(7, check.id)).id, '11');
  assert.equal((await jejariApi.createChat(7)).chat_room_id, 108);
  await assert.rejects(() => matchingService.skipOwnershipAnswer(check.id), /소유권 확인/);
  assert.equal((await chatService.getChats()).length, 1);
  await assert.rejects(() => chatService.getChats({ unreadOnly: true }), /명세/);
  assert.equal((await chatService.sendMessage(108, ' 안녕하세요 ')).messages[0].sender, 'me');
  assert.equal((await chatService.completeChat(108)).status, 'completed');
  assert.equal((await jejariApi.foundItem(15)).id, 15);
  assert.equal((await jejariApi.notifications()).unread_count, 1);
  await jejariApi.readNotification(102);
  const file = new File([new Uint8Array([1, 2, 3])], 'item.png', { type: 'image/png' });
  const photos = createLocalFoundPhotos([file], 'gallery');
  const draft = { photos, place: '중앙도서관 3층 열람실', date: '2026-11-13', time: '15:20' };
  const analysis = await foundItemService.analyze(draft);
  assert.equal(analysis.imageId, 30);
  assert.equal(analysis.privacyProtected, true);
  assert(analysis.photo.includes('30_blur'));
  const registered = await foundItemService.register({ ...analysis, kind: '카드지갑', privateFeature: '내부의 개인 특징', foundDraft: draft });
  assert.equal(registered.id, 35);
  await assert.rejects(() => foundItemService.getMatchingResults(registered), /명세/);
  const lostDraft = { ...draft, mode: 'text', kind: '지갑', color: '검정', description: '학생증이 들어 있어요.' };
  const feature = await registrationService.prepareLost(lostDraft);
  await jejariApi.answerFeatures(feature.chat_id, { step: 'size', answer: '손바닥만 해요', is_skipped: false });
  const finished = await jejariApi.finishFeatures(feature.chat_id);
  assert.equal((await registrationService.registerLost(lostDraft, { ...feature, ...finished })).lost_item_id, 21);
  await registrationService.prepareLost({ ...draft, mode: 'photo' });
  await assert.rejects(() => registrationService.registerLost({ ...lostDraft, place: '알 수 없는 건물' }, feature), /서버 ID/);
  assert.throws(() => apiId('room-1'), /ID/);
  assert.throws(() => jejariApi.analyzeLost(new File(['x'], 'bad.gif', { type: 'image/gif' })), /10MB/);
  const { createApiClient } = await load('api/client');
  const session = { value: { accessToken: 'old' }, get() { return this.value; }, clear() { this.value = null; } };
  const client = createApiClient({ baseUrl: 'https://example.invalid/api', session, fetcher: async () => new Response(JSON.stringify({ color: ['필수 값입니다.'] }), { status: 400 }) });
  await assert.rejects(() => client('/items/lost'), /필수 값/);
  const expired = createApiClient({ baseUrl: 'https://example.invalid/api', session, fetcher: async () => new Response('{"detail":"인증 만료"}', { status: 401 }) });
  await assert.rejects(() => expired('/users/me'), /인증 만료/);
  assert.equal(session.get(), null);
  const missing = createApiClient({ baseUrl: '', session });
  await assert.rejects(() => missing('/home'), /서버 주소/);
  const malformed = createApiClient({ baseUrl: '/api', session, fetcher: async () => new Response('<html>bad</html>') });
  await assert.rejects(() => malformed('/home', { auth: false }), /응답 형식/);
  const timed = createApiClient({ baseUrl: '/api', session, timeoutMs: 5, fetcher: (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))) });
  await assert.rejects(() => timed('/home', { auth: false }), /시간이 초과/);
  await authService.logout();
  assert.equal(authSession.get(), null);
  console.log('PASS: Notion-based request contracts and API-mode services, auth/session, pagination, LOST/FOUND ID collisions, matching, multi-question/NEED_MORE ownership, chat, multipart/blurred image, registrations and missing place IDs, HTTP/401/timeout/invalid JSON. Requests intercepted locally: ' + calls.length);
} finally { globalThis.fetch = originalFetch; await server.close(); }
