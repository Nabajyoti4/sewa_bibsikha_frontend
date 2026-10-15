import { createContext } from "react";
import type { PersonaId, ServiceCategory } from "../data/siteContent";

export type Interests = Record<ServiceCategory, number>;

export interface PersonaContextValue {
  persona: PersonaId;
  setPersona: (id: PersonaId) => void;
  interests: Interests;
  trackInterest: (category: ServiceCategory) => void;
}

export const PersonaContext = createContext<PersonaContextValue | null>(null);
