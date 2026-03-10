/* components/event/EventForm.tsx */

"use client";

import { useState } from "react";
import Image from "next/image";
import { EventTag } from "@/types/event";
import { EventTagLabel } from "@/utils/eventLabel";
import EventDate from "./EventDate";
import EventHour from "./EventHour";
import "./EventForm.css";

export type EventFormData = {
  title: string;
  description: string;
  vacancies: number | "";
  tag: EventTag;
  cashPrice: number | "";
  installmentPrice: number | "";
  maxInstallments: number | "";
  initDate: string;
  finalDate: string;
  departureHour: string;
  departureMinute: string;
  returnHour: string;
  returnMinute: string;
};

type EventFormProps = {
  initialData?: EventFormData;
  initialImage?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  loading?: boolean;
};

export default function EventForm({
  initialData = {
    title: "",
    description: "",
    vacancies: "",
    tag: EventTag.PRIVATE,
    cashPrice: "",
    installmentPrice: "",
    maxInstallments: "",
    initDate: "",
    finalDate: "",
    departureHour: "",
    departureMinute: "",
    returnHour: "",
    returnMinute: "",
  },
  initialImage = "/card_image.png",
  onSubmit,
  onCancel,
  submitLabel = "Salvar",
  loading = false,
}: EventFormProps) {
  
  const [form, setForm] = useState<EventFormData>(() => {
    const data = { ...initialData };

    const extractTime = (dateStr: string) => {
      if (dateStr && dateStr.includes("T")) {
        const timePart = dateStr.split("T")[1];
        return timePart.split(":").slice(0, 2); 
      }
      return [null, null];
    };

    const [depH, depM] = extractTime(data.initDate);
    const [retH, retM] = extractTime(data.finalDate);

    return {
      ...data,
      departureHour: depH ?? data.departureHour ?? "",
      departureMinute: depM ?? data.departureMinute ?? "",
      returnHour: retH ?? data.returnHour ?? "",
      returnMinute: retM ?? data.returnMinute ?? "",
    };
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialImage);
  
  const [isInitDateValid, setIsInitDateValid] = useState(!!initialData.initDate);
  const [isFinalDateValid, setIsFinalDateValid] = useState(!!initialData.finalDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? "" : Number(value);

    setForm((prev) => {
      if (name === "mainPrice") {
        return {
          ...prev,
          cashPrice: numValue,
          installmentPrice: numValue,
        };
      }

      return {
        ...prev,
        [name]: ["vacancies", "cashPrice", "installmentPrice", "maxInstallments"].includes(name)
          ? numValue
          : value,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setImageFile(null);
      setImagePreview(initialImage);
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isInitDateValid || !isFinalDateValid) {
      alert("Por favor, corrija os erros nas datas antes de continuar.");
      return;
    }

    const normalizeDate = (dateStr: string) => {
      if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}`;
      }
      return dateStr.split("T")[0];
    };

    const cleanInit = normalizeDate(form.initDate);
    const cleanFinal = normalizeDate(form.finalDate);
    const depH = String(form.departureHour || "00").padStart(2, "0");
    const depM = String(form.departureMinute || "00").padStart(2, "0");
    const retH = String(form.returnHour || "00").padStart(2, "0");
    const retM = String(form.returnMinute || "00").padStart(2, "0");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("vacancies", String(form.vacancies));
    formData.append("tag", form.tag);
    formData.append("cashPrice", String(Math.round(Number(form.cashPrice) * 100)));
    formData.append("installmentPrice", String(Math.round(Number(form.installmentPrice) * 100)));
    formData.append("maxInstallments", String(form.maxInstallments));
    formData.append("initDate", `${cleanInit}T${depH}:${depM}:00Z`);
    formData.append("finalDate", `${cleanFinal}T${retH}:${retM}:00Z`);
    
    if (imageFile) formData.append("image", imageFile);

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="column center">
        <div className="section-image">
          <Image src={imagePreview} alt="Preview" fill className="object-fill" />
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} className="image-input" />
      </div>

      <div>
        <label>Título da Viagem</label>
        <input name="title" className="input pl-2 pr-2" value={form.title} onChange={handleChange} required />
      </div>

      <div>
        <label>Descrição da Viagem</label>
        <textarea name="description" className="input pl-2 pr-2 min-h-30" value={form.description} onChange={handleChange} required />
      </div>

      <div className="grids-sm">
        <div>
          <label>Quantidade de Vagas</label>
          <input name="vacancies" type="number" min={1} className="input pl-2 pr-2" value={form.vacancies} onChange={handleChange} required />
        </div>
        <div>
          <label>Tipo</label>
          <select name="tag" className="input pl-1 pr-1" value={form.tag} onChange={handleChange}>
            {Object.values(EventTag).map((tag) => (
              <option key={tag} value={tag}>{EventTagLabel[tag]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grids-sm">
        <div>
          <label>Preço da Viagem (R$)</label>
          <input 
            name="mainPrice" 
            type="number" 
            step="0.01" 
            className="input pl-2 pr-2" 
            value={form.cashPrice}
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Máximo de Parcelas</label>
          <select 
            name="maxInstallments" 
            className="input pl-1 pr-1" 
            value={form.maxInstallments} 
            onChange={handleChange}
            required
          >
            <option value="" disabled>Selecione...</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}x
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="column-sm gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <EventDate 
            id="initDate" 
            label="Data de Início" 
            value={form.initDate} 
            onChange={(v) => setForm(p => ({...p, initDate: v}))} 
            onValidChange={setIsInitDateValid} 
          />
          
          <EventHour 
            label="Horário de Início" 
            hourName="departureHour" 
            minuteName="departureMinute" 
            hourValue={form.departureHour} 
            minuteValue={form.departureMinute} 
            onHourChange={handleChange} 
            onMinuteChange={handleChange} 
            disabled={loading}
          />
        </div>
      </div>

      <div className="column-sm gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <EventDate 
            id="finalDate" 
            label="Data de Retorno" 
            value={form.finalDate} 
            onChange={(v) => setForm(p => ({...p, finalDate: v}))} 
            onValidChange={setIsFinalDateValid} 
            minDate={form.initDate} 
          />
          
          <EventHour 
            label="Horário de Retorno" 
            hourName="returnHour" 
            minuteName="returnMinute" 
            hourValue={form.returnHour} 
            minuteValue={form.returnMinute} 
            onHourChange={handleChange} 
            onMinuteChange={handleChange} 
            disabled={loading} 
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          type="submit" 
          className="button flex-1" 
          disabled={loading}
        >
            {loading ? "Salvando..." : submitLabel}
        </button>
        
        <button 
          type="button" 
          onClick={onCancel} 
          className="clean-button" 
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}