"use client";

import { useState } from "react";
import { useSavedCompanions } from "@/hooks/useSavedCompanions";
import CompanionForm from "@/components/forms/CompanionForm";
import LinkButton from "@/components/buttons/LinkButton";
import { CompanionData, SavedCompanion } from "@/types/companion";
import { RiEditFill } from "react-icons/ri";
import { FaTrash, FaPlus } from "react-icons/fa";
import { TabTitle } from "@/components/tabtitle/TabTitle";

export default function ManageCompanionsPage() {
  const { savedCompanions, loading } = useSavedCompanions() as { 
    savedCompanions: SavedCompanion[], 
    loading: boolean 
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);

  const initialFormState: CompanionData = {
    name: "",
    document: "",
    identity: "",
    birthdate: "",
    gender: "MALE",
    phone: "",
  };

  const [formData, setFormData] = useState<CompanionData>(initialFormState);

  function handleEditClick(companion: SavedCompanion) {
    const formattedDate = new Date(companion.birthdate).toLocaleDateString("pt-BR");
    
    setFormData({
      name: companion.name,
      document: companion.document,
      identity: companion.identity,
      birthdate: formattedDate,
      gender: companion.gender,
      phone: companion.phone || "",
    });
    setEditingDoc(companion.document);
    setIsFormOpen(true);
  };

  function handleAddNewClick() {
    setFormData(initialFormState);
    setEditingDoc(null);
    setIsFormOpen(true);
  };

  async function handleSave() {
    if (!formData.name || !formData.document || !formData.identity || !formData.birthdate) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    };

    setIsSaving(true);
    try {
      const isEditing = Boolean(editingDoc);
      const method = isEditing ? "PUT" : "POST";
      
      const url = isEditing 
        ? `/api/companion/me?document=${editingDoc}` 
        : "/api/companion/me";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao salvar");
      }
      
      alert(isEditing ? "Acompanhante atualizado!" : "Acompanhante salvo!");
      window.location.reload(); 
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      alert(message);
    } finally {
      setIsSaving(false);
    };
  };

  async function handleDelete(doc: string) {
    if (!confirm("Tem certeza que deseja excluir este acompanhante?")) return;
    try {
      const res = await fetch(`/api/companion/me?document=${doc}`, { method: "DELETE" });
      if (res.ok) window.location.reload();
      else throw new Error();
    } catch {
      alert("Erro ao excluir acompanhante.");
    };
  };

  return (
    <main className="w-full max-w-2xl mx-auto p-4 pb-20">
      <TabTitle tabName="Meus Acompanhantes" />
      
      <LinkButton target="home" />

      <div className="mt-10 column">
        <div className="between items-center mb-5">
          <h1 className="title">
            Gerenciar Acompanhantes
          </h1>
          
          {!isFormOpen && (
            <button 
              onClick={handleAddNewClick} 
              className="button default items-center gap-2"
            >
              <FaPlus size={14} /> Novo
            </button>
          )}
        </div>

        {isFormOpen ? (
          <section className="column section-container">
            <h2 className="semibold-xl text-center">
              {editingDoc ? "Editar Acompanhante" : "Cadastrar Novo Acompanhante"}
            </h2>
            
            <CompanionForm 
              data={formData} 
              onChange={setFormData} 
              isEditing={Boolean(editingDoc)}
            />
            
            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} disabled={isSaving} className="button default flex-1">
                {isSaving ? "Processando..." : editingDoc ? "Salvar Alterações" : "Salvar Acompanhante"}
              </button>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="button clean"
                disabled={isSaving}
              >
                Cancelar
              </button>
            </div>
          </section>
        ) : (
          <section className="column">
            <h2 className="semibold-xl">
              Seus Acompanhantes Salvos
            </h2>

            {loading ? (
              <div className="column">
                <div className="h-20 bg-neutral-100 rounded-lg animate-pulse"/>
                <div className="h-20 bg-neutral-100 rounded-lg animate-pulse"/>
              </div>
            ) : savedCompanions.length === 0 ? (
              <p className="text-center">
                Nenhum acompanhante cadastrado ainda.
              </p>
            ) : (
              <div className="column">
                {savedCompanions.map((c) => (
                  <div key={c.document} className="section-container between items-center">
                    <div className="column-sm">
                      <p className="font-bold md:text-lg text-base">
                        {c.name}
                      </p>
                      <div className="column information">
                        <p>CPF: {c.document}</p>
                        <p>RG: {c.identity}</p>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <button onClick={() => handleEditClick(c)} className="edit-icon">
                        <RiEditFill size={28} />
                      </button>
                      <button onClick={() => handleDelete(c.document)} className="delete-icon">
                        <FaTrash size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};