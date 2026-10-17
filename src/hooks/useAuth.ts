import { useMemo, useSyncExternalStore } from "react";
import { getStoredUserRaw, getValidAuthToken, parseStoredUser } from "../services/apiHelpers";

const AUTH_EVENTS = ["auth-changed", "session-expired", "storage"] as const;

const subscribe = (callback: () => void) => {
  AUTH_EVENTS.forEach((event) => window.addEventListener(event, callback));
  return () => AUTH_EVENTS.forEach((event) => window.removeEventListener(event, callback));
};

const useAuth = () => {
  const token = useSyncExternalStore(subscribe, getValidAuthToken);
  const userRaw = useSyncExternalStore(subscribe, getStoredUserRaw);
  const user = useMemo(() => (token ? parseStoredUser(userRaw) : null), [token, userRaw]);

  return { isAuthenticated: token !== null, user };
};

export default useAuth;
