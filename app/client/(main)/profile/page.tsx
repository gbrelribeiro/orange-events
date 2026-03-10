/* app/client/(main)/profile/page.tsx */

"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LinkButton from "@/components/buttons/LinkButton";
import { TabTitle } from "@/components/tabtitle/TabTitle";

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  document: string;
  identity: string;
  phone: string;
  birthDate: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [client, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  /* FUNCTION TO CATCH USER PROFILE INFORMATIONS */
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile", { credentials: "include" });

        if (!res.ok) {
          router.push("/client/login");
          return;
        }

        const data = await res.json();
        setUser(data.client);
        setFormData({
          firstName: data.client.firstName,
          lastName: data.client.lastName,
          phone: data.client.phone,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      };
    };

    fetchProfile();
  }, [router]);

  /* FUNCTION TO UPDATE PROFILE */
  async function handleUpdateProfile(e: SyntheticEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.client);
        setIsEditing(false);
        alert("Perfil atualizado com sucesso.");
      } else {
        alert("Erro ao tentar atualizar perfil.");
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Erro inesperado ao tentar atualizar perfil.");
    };
  };

  /* LOADING THE PAGE */
  if (loading) {
    return (
      <div className="center min-h-screen">
        <div className="semibold-xl">
          Carregando...
        </div>
      </div>
    );
  };

  /* IF USER PROFILE CAN NOT BE FOUND */
  if (!client) {
    return (
      <div className="center min-h-screen">
        <div className="semibold-xl">
          Usuário não encontrado.
        </div>
      </div>
    );
  };

  /* DATE FORMAT EXIBITION */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  /* DOCUMENT FORMAT EXIBITION */
  const formatDocument = (doc: string) => {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  /* IDENTITY FORMAT EXIBITION */
  const formatIdentity = (identity: string) => {
    const cleaned = identity.replace(/[^0-9X]/gi, "").toUpperCase();
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})([0-9X]{1})/, "$1.$2.$3-$4");
  };

  /* PHONE FORMAT EXIBITION */
  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  /* FUNCTION TO CANCEL CHANGES */
  function handleCancelEdit() {
    setIsEditing(false);
    setFormData({
      firstName: client!.firstName,
      lastName: client!.lastName,
      phone: client!.phone,
    });
  };

  return (
    <div className="column max-w-4xl mx-auto mt-15">

      {/* HOME BUTTON */}
      <LinkButton target="home" />

      <TabTitle tabName="Meu Perfil"/>

      {/* PROFILE HEADER */}
      <div className="column section-container">
        <div>

          {/* CLIENT NAME */}
          <h1 className="bold-xl text-primary">
            {client.firstName} {client.lastName}
          </h1>

          {/* CLIENT EMAIL */}
          <p className="information">
            {client.email}
          </p>

          {/* RESET PASSWORD BUTTON */}
          <button
            onClick={() => router.push("/client/password/reset-password")}
            className="text-sm underlined"
          >
            Redefinir senha
          </button>
        </div>
      </div>

      {/* PROFILE INFORMATION */}
      <div className="column section-container">
        <div className="between">
          <h2 className="bold-xl">
            Informações Pessoais
          </h2>

          {/* EDIT PROFILE BUTTON */}
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="button">
              Editar Perfil
            </button>
          )}
        </div>

        {!isEditing ? (
          <div className="grids">
            <div className="column">
              <label className="information">Nome Completo</label>
              <p className="font-medium">
                {client.firstName} {client.lastName}
              </p>
            </div>

            <div className="column">
              <label className="information">Email</label>
              <p className="font-medium">
                {client.email}
              </p>
            </div>

            <div className="column">
              <label className="information">CPF</label>
              <p className="font-medium">
                {formatDocument(client.document)}
              </p>
            </div>

            <div className="column">
              <label className="information">RG</label>
              <p className="font-medium">
                {formatIdentity(client.identity)}
              </p>
            </div>

            <div className="column">
              <label className="information">Contato</label>
              <p className="font-medium">
                {formatPhone(client.phone)}
              </p>
            </div>

            <div className="column">
              <label className="information">Data de Nascimento</label>
              <p className="font-medium">
                {formatDate(client.birthDate)}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="column">
            <div className="grids">

              <div className="column">
                <label className="information">Nome</label>
                <input
                  type="text"
                  className="input"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>

              <div className="column">
                <label className="information">Sobrenome</label>
                <input
                  type="text"
                  className="input"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>

              <div className="column">
                <label className="information">Contato</label>
                <input
                  type="text"
                  className="input"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button type="submit" className="button default flex-1">
                Salvar alterações
              </button>

              <button
                type="button"
                className="button clean"
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};