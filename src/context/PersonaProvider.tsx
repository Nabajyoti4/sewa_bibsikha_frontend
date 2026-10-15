import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PersonaContext } from "./PersonaContext";
import type { Interests } from "./PersonaContext";
import type { PersonaId, ServiceCategory } from "../data/siteContent";

const PERSONA_KEY = "bibsikha.persona";
const INTERESTS_KEY = "bibsikha.interests.v2";

const emptyInterests: Interests = { carbon: 0, energy: 0, consultancy: 0, operations: 0 };

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const [persona, setPersona] = useState<PersonaId>(() => readStorage(PERSONA_KEY, "explorer"));
  const [interests, setInterests] = useState<Interests>(() => ({ ...emptyInterests, ...readStorage(INTERESTS_KEY, {}) }));

  useEffect(() => {
    localStorage.setItem(PERSONA_KEY, JSON.stringify(persona));
  }, [persona]);

  useEffect(() => {
    localStorage.setItem(INTERESTS_KEY, JSON.stringify(interests));
  }, [interests]);

  const trackInterest = useCallback((category: ServiceCategory) => {
    setInterests((prev) => ({ ...prev, [category]: prev[category] + 1 }));
  }, []);

  const value = useMemo(() => ({ persona, setPersona, interests, trackInterest }), [persona, interests, trackInterest]);

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
};

export default PersonaProvider;
