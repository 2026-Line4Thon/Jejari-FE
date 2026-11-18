import { apiRequest, ApiError } from './client';

export function apiId(value) {
  if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) throw new ApiError('연결할 정보의 ID가 올바르지 않아요. 이전 화면에서 다시 확인해 주세요.');
  return String(value);
}
function itemType(type) {
  if (!['lost', 'found'].includes(type)) throw new ApiError('분실물 또는 습득물 유형을 확인해 주세요.');
  return type;
}
function imageBody(file) {
  if (!(file instanceof Blob) || !['image/jpeg', 'image/png'].includes(file.type) || file.size > 10 * 1024 * 1024 || !file.size) throw new ApiError('jpg, png 형식의 10MB 이하 사진을 선택해 주세요.');
  const form = new FormData();
  form.append('image', file, file.name || 'image.' + (file.type === 'image/png' ? 'png' : 'jpg'));
  return form;
}

// Paths and field names follow the linked Notion specification. No guessed endpoints.
export function createJejariApi(request) {
  return {
    sendEmail: (email) => request('/auth/email/send', { method: 'POST', body: { email }, auth: false }),
    verifyEmail: (email, code) => request('/auth/email/verify', { method: 'POST', body: { email, code }, auth: false }),
    logout: (refreshToken) => request('/auth/logout', { method: 'POST', body: { refresh_token: refreshToken } }),
    home: (options) => request('/home', options),
    profile: (options) => request('/users/me', options),
    myItems: (type, options) => request('/users/me/items', { ...options, query: { type: itemType(type) } }),
    itemStatus: (id, type, options) => request(`/users/me/items/${apiId(id)}/status`, { ...options, query: { type: itemType(type) } }),
    history: (options) => request('/users/me/history', options),
    foundItems: (page = 1, size = 10, options) => request('/items/found', { ...options, query: { page, size } }),
    foundItem: (id, options) => request(`/items/found/${apiId(id)}`, options),
    notifications: (options) => request('/notifications', options),
    readNotification: (id) => request(`/notifications/${apiId(id)}/read`, { method: 'PATCH' }),
    analyzeLost: (file, options) => request('/items/lost/images/analyze', { ...options, method: 'POST', body: imageBody(file), timeout: 60000 }),
    analyzeFound: (file, options) => request('/items/found/images/analyze', { ...options, method: 'POST', body: imageBody(file), timeout: 60000 }),
    startFeatures: (body, options) => request('/items/lost/feature-chats', { ...options, method: 'POST', body, timeout: 60000 }),
    answerFeatures: (id, body) => request(`/items/lost/feature-chats/${apiId(id)}/answers`, { method: 'POST', body, timeout: 60000 }),
    finishFeatures: (id) => request(`/items/lost/feature-chats/${apiId(id)}/finish`, { method: 'POST', timeout: 60000 }),
    registerLost: (body) => request('/items/lost', { method: 'POST', body }),
    registerFound: (body) => request('/items/found', { method: 'POST', body }),
    lostItem: (id, options) => request(`/items/lost/${apiId(id)}`, options),
    candidates: (id, options) => request(`/items/lost/${apiId(id)}/candidates`, options),
    candidate: (id, options) => request(`/candidates/${apiId(id)}`, options),
    rejectCandidate: (id) => request(`/candidates/${apiId(id)}/reject`, { method: 'POST' }),
    createOwnership: (id) => request(`/candidates/${apiId(id)}/ownership-checks`, { method: 'POST', timeout: 60000 }),
    answerOwnership: (id, answers) => request(`/ownership-checks/${apiId(id)}/answers`, { method: 'POST', body: { answers }, timeout: 60000 }),
    ownership: (id, options) => request(`/ownership-checks/${apiId(id)}`, options),
    createChat: (candidateId) => request('/chats', { method: 'POST', body: { candidate_id: Number(apiId(candidateId)) } }),
    messages: (id, page = 1, size = 30, options) => request(`/chats/${apiId(id)}/messages`, { ...options, query: { page, size } }),
    sendMessage: (id, content) => request(`/chats/${apiId(id)}/messages`, { method: 'POST', body: { content } }),
    completeChat: (id) => request(`/chats/${apiId(id)}/complete`, { method: 'POST' }),
  };
}
export const jejariApi = createJejariApi(apiRequest);
