import { useSyncExternalStore } from "react";
import { acctKey, getAccount } from "../data/accounts";

/** Petit état partagé (Amis ↔ Messages), gardé sur l'appareil pour la démo. */
interface SocialState {
  friends: string[];
  sent: string[];
  incoming: string[];
}
const KEY = acctKey("social");
const DEFAULT: SocialState = getAccount()?.isNew
  ? { friends: [], sent: [], incoming: [] }
  : { friends: ["user-karim", "p-ines", "p-rafik"], sent: [], incoming: ["p-leila", "p-amina"] };

let state: SocialState = (() => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
})();
const listeners = new Set<() => void>();
const emit = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
};
const set = (fn: (s: SocialState) => SocialState) => {
  state = fn(state);
  emit();
};

export const social = {
  sendRequest: (id: string) => set((s) => (s.sent.includes(id) ? s : { ...s, sent: [...s.sent, id] })),
  cancelRequest: (id: string) => set((s) => ({ ...s, sent: s.sent.filter((x) => x !== id) })),
  accept: (id: string) => set((s) => ({ ...s, incoming: s.incoming.filter((x) => x !== id), friends: [...s.friends, id] })),
  decline: (id: string) => set((s) => ({ ...s, incoming: s.incoming.filter((x) => x !== id) })),
  remove: (id: string) => set((s) => ({ ...s, friends: s.friends.filter((x) => x !== id) })),
};

export function useSocial(): SocialState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state
  );
}
