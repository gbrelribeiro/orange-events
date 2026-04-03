/* components/linkbutton/LinkButton.tsx */

"use client";

import { useRouter } from "next/navigation";
import "./LinkButton.css";

type ButtonTarget = "home" | "client" | "master" | "client-profile" | "event";

type LinkButtonProps = {
  target?: ButtonTarget;
  color?: "colored" | "white";
  eventId?: string;
};

export default function LinkButton({ target = "home", eventId }: LinkButtonProps) {
  const router = useRouter();
  
  function handleClick() {
    switch(target) {
      case "client":
        router.push("/client/login");
        break;
      
      case "master":
        router.push("/master/login");
        break;

      case "client-profile":
        router.push("/client/profile");
        break;
      
      case "event":
        if (eventId)
          router.push(`/client/event/${eventId}`);
        else
          router.push("/");

      default:
        router.push("/");
    };
  };

  const getLabel = () => {
    switch(target) {
      case "client":
        return "← Log In como Cliente";
      
      case "master":
        return "Log In como Organizador →";

      case "client-profile":
        return "← Voltar para o Meu Perfil";

      default:
        return "← Voltar para a Tela Inicial";
    };
  };

  const positionClass = ["client", "home", "client-profile", "event"].includes(target) ? "md:left-20" : "md:right-20"; 

  return (
    <button type="button" onClick={handleClick} className={`link-button ${positionClass}`}>
      {getLabel()}
    </button>
  );
};