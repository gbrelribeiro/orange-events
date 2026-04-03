/* components/container/Container.tsx */

import { ReactNode } from "react";
import "./Container.css";

type ContainerSize = "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";

const sizeClasses: Record<ContainerSize, string> = {
  "lg": "max-w-lg",
  "xl": "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "full": "w-full", 
};

type ContainerProps = {
  title?: string;
  children: ReactNode;
  size?: ContainerSize; 
};

export default function Container({ title, children, size = "2xl" }: ContainerProps) {
  const maxWidthClass = sizeClasses[size];

  return (
    <div className="center w-full md:py-0 py-10">
      <section className={`w-full section-container column ${maxWidthClass}`}>
        {title && ( <h1 className="title text-center mb-10">{title}</h1> )}

        {children}
      </section>
    </div>
  );
};