import { useApp } from "../context/AppContext";

/** Pastilles des menus calculées pour le compte connecté (au lieu de valeurs fixes). */
export function useNavBadges(): Record<string, number | string | undefined> {
  const { user, unreadNotificationsCount } = useApp();
  return {
    missions: user.isNew ? 3 : 2,
    messages: user.isNew ? undefined : 5,
    notifications: unreadNotificationsCount || undefined,
  };
}
