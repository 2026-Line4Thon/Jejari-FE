const mode = import.meta.env.VITE_API_MODE ?? 'mock';
if (!['mock', 'api'].includes(mode)) throw new Error('VITE_API_MODE는 mock 또는 api여야 합니다.');

export const apiEnabled = mode === 'api';
export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '');
