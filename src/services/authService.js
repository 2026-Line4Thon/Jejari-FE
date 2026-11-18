import { apiEnabled } from '../api/config';
import { jejariApi } from '../api/endpoints';
import { authSession } from '../api/session';

export const authService = {
  async sendCode(email) {
    return apiEnabled ? jejariApi.sendEmail(email) : { message: '미리보기 인증번호가 준비됐어요.', expires_in: 300 };
  },
  async verify(email, code) {
    if (!apiEnabled) return;
    const data = await jejariApi.verifyEmail(email, code);
    if (!data?.access_token || !data?.refresh_token) throw new Error('로그인 응답에 인증 정보가 없어요.');
    authSession.set({ accessToken: data.access_token, refreshToken: data.refresh_token, user: data.user });
    return data.user;
  },
  async profile() {
    return apiEnabled ? jejariApi.profile() : { nickname: '김멋사', email: 'minji@univ.ac.kr', is_university_verified: true };
  },
  async logout() {
    try { if (apiEnabled) await jejariApi.logout(authSession.get()?.refreshToken); }
    finally { authSession.clear(); }
  },
};
