import { useEffect, useState } from "react";
import { DEMO_USERS } from "../data/demo";

const KEY = "apbuddy_auth_v1";

function readUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(() => readUser());

  useEffect(() => {
    const onStorage = () => setUser(readUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (email, password) => {
    const match = DEMO_USERS.find(
      (u) =>
        u.email.toLowerCase() === String(email).trim().toLowerCase() &&
        u.password === password
    );
    if (!match) return { ok: false, error: "Invalid email or password" };
    const next = { email: match.email, role: match.role, name: match.name };
    localStorage.setItem(KEY, JSON.stringify(next));
    setUser(next);
    return { ok: true, user: next };
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return { user, login, logout };
}
