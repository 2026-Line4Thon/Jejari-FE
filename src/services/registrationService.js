import { jejariApi } from '../api/endpoints';
import { foundRegistrationBody, lostRegistrationBody } from '../api/registration';
import { getFoundPhotoFile } from './foundPhotoStore';
import { authSession } from '../api/session';

let preparations = new WeakMap();
authSession.subscribe(() => { preparations = new WeakMap(); });
export const registrationService = {
  async analyzeFound(draft, options) {
    const photo = draft.photos?.[0];
    const file = getFoundPhotoFile(photo?.id);
    if (!file) throw new Error('사진을 다시 선택해 주세요. 새로고침 후에는 원본 파일을 다시 선택해야 해요.');
    const data = await jejariApi.analyzeFound(file, options);
    return { imageId: data.image_id, analysisPhotoId: photo.id, photo: data.image_url, kind: data.tags.category ?? '', itemName: data.tags.item_name ?? '', color: data.tags.color ?? '', brand: data.tags.brand ?? '', appearance: (data.tags.features ?? []).join(', '), privateFeature: '', privacyProtected: data.is_blurred === true };
  },
  async registerFound(item) {
    let current = item;
    if (!item.imageId || item.analysisPhotoId !== item.foundDraft?.photos?.[0]?.id) {
      const analysis = await this.analyzeFound(item.foundDraft);
      current = { ...analysis, ...item, imageId: analysis.imageId, analysisPhotoId: analysis.analysisPhotoId, photo: analysis.photo, privacyProtected: analysis.privacyProtected };
    }
    const response = await jejariApi.registerFound(foundRegistrationBody(current));
    return { ...current, id: response.found_item_id, status: response.status };
  },
  prepareLost(draft) {
    if (!draft) return Promise.reject(new Error('먼저 분실물 기본 정보를 입력해 주세요.'));
    if (!preparations.has(draft)) preparations.set(draft, (async () => {
      let imageId;
      if (draft.mode !== 'text') {
        const file = getFoundPhotoFile(draft.photos?.[0]?.id);
        if (!file) throw new Error('분실물 사진을 다시 선택해 주세요.');
        imageId = (await jejariApi.analyzeLost(file)).image_id;
      }
      const description = [draft.kind, draft.color, draft.brand, draft.description].filter(Boolean).join(' ');
      const response = await jejariApi.startFeatures({ ...(imageId ? { image_id: imageId } : {}), description });
      return { ...response, imageId };
    })().catch((error) => { preparations.delete(draft); throw error; }));
    return preparations.get(draft);
  },
  async registerLost(draft, feature) {
    const body = lostRegistrationBody(draft, feature);
    const response = await jejariApi.registerLost(body);
    return { ...response, draft, feature };
  },
};
