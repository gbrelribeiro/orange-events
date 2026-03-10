/* components/location/CitySelector.tsx */

import { useState, useEffect } from "react";
import { BrazilianCity, CityOption } from "@/types/city";

type CitySelectorProps = {
  selectedState: string;
  value: string;
  onChange: (value: string) => void;
  className?: string | "";
};

export const CitySelector = ({ selectedState, value, onChange, className }: CitySelectorProps) => {
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      onChange(""); 
      return;
    };

    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`);
        const data: BrazilianCity[] = await response.json();
        const formatted = data.map((city) => ({
          label: city.nome,
          value: city.nome 
        })).sort((a, b) => a.label.localeCompare(b.label));
        
        setCities(formatted);
      } 
      
      catch (error) {
        console.error(error);
      } 
      
      finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [selectedState, onChange]); 

  return (
    <select 
      className={`${className} input`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={!selectedState || loading}
    >
      <option value="">{loading ? "Carregando..." : "Cidade"}</option>
      {cities.map((city) => (
        <option key={`${city.value}-${city.label}`} value={city.value}>
          {city.label}
        </option>
      ))}
    </select>
  );
};