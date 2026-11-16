const localPhotos = new Map();

export function createLocalFoundPhotos(files, origin) {
  const selected = Array.from(files ?? []);
  if (selected.length > 3) throw new Error('사진은 최대 3장까지 등록할 수 있어요.');
  if (selected.some((file) => !file.size || (file.type ? !file.type.startsWith('image/') : !/\.(jpe?g|png|webp|gif|heic|heif|avif|bmp)$/i.test(file.name)))) {
    throw new Error('올바른 이미지 파일을 선택해 주세요.');
  }

  return selected.map((file) => {
    const id = globalThis.crypto?.randomUUID?.() ?? `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const source = URL.createObjectURL(file);
    localPhotos.set(id, { file, source });
    return { id, source, name: file.name, origin, isSample: false, privacyProtected: false };
  });
}

// Keep original files separate from router state for future multipart API uploads.
export function getFoundPhotoFile(id) {
  return localPhotos.get(id)?.file ?? null;
}

function clearLocalPhotos() {
  for (const { source } of localPhotos.values()) URL.revokeObjectURL(source);
  localPhotos.clear();
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) clearLocalPhotos();
  });
}
