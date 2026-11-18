const storageKey = 'jejari.auth.session';
const listeners = new Set();
function read() {
  try { return JSON.parse(globalThis.sessionStorage?.getItem(storageKey) ?? 'null'); }
  catch { return null; }
}
let current = read();

export const authSession = {
  get: () => current,
  subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  set(session) {
    current = session;
    try {
      if (session) globalThis.sessionStorage?.setItem(storageKey, JSON.stringify(session));
      else globalThis.sessionStorage?.removeItem(storageKey);
    } catch { /* Memory session still works when browser storage is unavailable. */ }
    listeners.forEach((listener) => listener());
  },
  clear() { this.set(null); },
};
