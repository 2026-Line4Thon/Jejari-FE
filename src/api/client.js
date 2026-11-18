import { apiBaseUrl } from './config';
import { authSession } from './session';

export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function errorMessage(data, fallback) {
  if (typeof data?.detail === 'string') return data.detail;
  if (typeof data?.message === 'string') return data.message;
  if (data && typeof data === 'object') {
    const messages = Object.values(data).flat().filter((value) => typeof value === 'string');
    if (messages.length) return messages.join(' ');
  }
  return fallback;
}

export function createApiClient({ baseUrl, session = authSession, fetcher = (...args) => fetch(...args), timeoutMs = 15000 }) {
  return async function request(path, { method = 'GET', body, query, auth = true, signal, timeout = timeoutMs } = {}) {
    if (!baseUrl) throw new ApiError('API 서버 주소가 설정되지 않았어요. VITE_API_BASE_URL을 확인해 주세요.');
    if (!path.startsWith('/') || path.startsWith('//')) throw new ApiError('올바르지 않은 API 경로입니다.');
    const token = session.get()?.accessToken;
    if (auth && !token) throw new ApiError('학교 이메일 인증 후 이용해 주세요.', { status: 401 });
    const params = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => { if (value != null) params.set(key, String(value)); });
    const url = baseUrl.replace(/\/+$/, '') + path + (params.size ? '?' + params : '');
    const headers = { Accept: 'application/json' };
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json';
    if (auth) headers.Authorization = 'Bearer ' + token;
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeout);
    try {
      const response = await fetcher(url, { method, headers, body: body === undefined ? undefined : isForm ? body : JSON.stringify(body), signal: controller.signal });
      const text = response.status === 204 ? '' : await response.text();
      let data = null;
      if (text) {
        try { data = JSON.parse(text); }
        catch {
          if (response.ok) throw new ApiError('서버 응답 형식을 확인해 주세요.', { status: response.status });
        }
      }
      if (!response.ok) {
        if (auth && response.status === 401 && session.get()?.accessToken === token) session.clear();
        throw new ApiError(errorMessage(data, `요청을 처리하지 못했어요. (${response.status})`), { status: response.status, data });
      }
      return data;
    } catch (error) {
      if (timedOut) throw new ApiError('서버 응답 시간이 초과됐어요. 잠시 후 다시 시도해 주세요.');
      if (error instanceof ApiError || signal?.aborted) throw error;
      throw new ApiError('서버에 연결하지 못했어요. 네트워크와 API 주소를 확인해 주세요.');
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
    }
  };
}

export const apiRequest = createApiClient({ baseUrl: apiBaseUrl });
