/* hooks/useSavedCompanions.ts */

import { useEffect, useState } from "react";
import { SavedCompanion } from "@/types/companion";

type CompanionAPIResponse = {
  name: string;
  document: string;
  birthDate: string;
  identity: string;
  phone: string;
  gender: string;
};

export function useSavedCompanions() {
  const [savedCompanions, setSavedCompanions] = useState<SavedCompanion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedCompanions() {
      try {
        setLoading(true);
        const res = await fetch("/api/companion/me");
        
        if (res.ok) {
          const data: CompanionAPIResponse[] = await res.json();
          
          const formatted: SavedCompanion[] = data.map((c) => {
            const rawDate = c.birthDate ? c.birthDate.split("T")[0] : "";
            const [year, month, day] = rawDate.split("-");
            const formattedDateForInput = rawDate ? `${day}/${month}/${year}` : "";

            return {
              name: c.name,
              document: c.document,
              birthdate: formattedDateForInput,
              phone: c.phone || "",
              identity: c.identity || "",
              gender: c.gender,
            } as SavedCompanion;
          });

          setSavedCompanions(formatted);
        } else {
          setError("Erro ao carregar acompanhantes salvos");
        }
      } catch (err) {
        console.error("Erro ao carregar acompanhantes salvos:", err);
        setError("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      };
    };

    loadSavedCompanions();
  }, []);

  return { savedCompanions, loading, error };
};