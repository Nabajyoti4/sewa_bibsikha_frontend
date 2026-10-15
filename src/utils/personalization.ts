import type { Interests } from "../context/PersonaContext";
import { personas, services } from "../data/siteContent";
import type { PersonaId, Service } from "../data/siteContent";

export const getPersona = (id: PersonaId) => personas.find((p) => p.id === id) ?? personas[0];

export const scoreService = (service: Service, persona: PersonaId, interests: Interests) => {
  const personaScore = persona !== "explorer" && service.personas.includes(persona) ? 10 - service.personas.indexOf(persona) * 2 : 0;
  return personaScore + interests[service.category] * 1.5;
};

export const rankServices = (persona: PersonaId, interests: Interests) =>
  [...services].sort((a, b) => scoreService(b, persona, interests) - scoreService(a, persona, interests));

export const hasSignals = (persona: PersonaId, interests: Interests) =>
  persona !== "explorer" || Object.values(interests).some((count) => count > 0);
