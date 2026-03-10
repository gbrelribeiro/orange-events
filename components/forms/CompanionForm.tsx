/* components/forms/CompanionForm.tsx */

import { CompanionData, GenderValue, CompanionType } from "@/types/companion";
import BirthDate from "../inputs/BirthDate";
import Phone from "../inputs/Phone";

type CompanionFormProps = {
  data: CompanionData;
  onChange: (data: CompanionData) => void;
  title?: string;
  type?: CompanionType;
  isEditing?: boolean;
};

export default function CompanionForm({ data, onChange, title, type, isEditing }: CompanionFormProps) {
  const handleChange = (field: keyof CompanionData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="column section-container">
      {title && <h3 className="passenger-form-title">{title}</h3>}
      
      <div>
        <label>Nome Completo</label>
        <input
          type="text"
          className="input pl-2 pr-2"
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      {!isEditing && (
        <div className="grids-sm">
          <div>
            <label>CPF</label>
            <input
              type="text"
              className="input pl-2 pr-2"
              value={data.document}
              onChange={(e) => handleChange("document", e.target.value)}
            />
          </div>

          <div>
            <label>RG</label>
            <input
              type="text"
              className="input pl-2 pr-2"
              value={data.identity}
              onChange={(e) => handleChange("identity", e.target.value)}
            />
          </div>
        </div>
      )}

      <Phone
        label="Celular (Opcional)"
        value={data.phone || ""}
        onChange={(val) => handleChange("phone", val)}
      />

      <div className="grids-sm">
        <BirthDate
          label="Nascimento"
          value={data.birthdate}
          isAdultOnly={type === "adult"}
          onChange={(val) => handleChange("birthdate", val)}
        />

        <div>
          <label>Gênero</label>
          <select
            className="input"
            value={data.gender}
            onChange={(e) => handleChange("gender", e.target.value as GenderValue)}
          >
            <option value="MALE">Masculino</option>
            <option value="FEMALE">Feminino</option>
            <option value="OTHER">Outro</option>
          </select>
        </div>
      </div>
    </div>
  );
};