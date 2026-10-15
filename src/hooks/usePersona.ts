import { useContext } from "react";
import { PersonaContext } from "../context/PersonaContext";

const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) throw new Error("usePersona must be used within PersonaProvider");
  return context;
};

export default usePersona;
