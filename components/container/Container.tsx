/* components/container/Container.tsx */

import { ReactNode } from "react";
import Image from "next/image";
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
  logo?: boolean;
  title?: string;
  children: ReactNode;
  size?: ContainerSize; 
};

export default function Container({ logo, title, children, size = "2xl" }: ContainerProps) {
  const maxWidthClass = sizeClasses[size];

  return (
    <div className="center w-full md:py-0 py-10">
      <section className={`w-full section-container column ${maxWidthClass}`}>
        {logo && (
          <div className="center">
            <Image 
              src="/logo(1).png" 
              alt="Logo" 
              width={100} 
              height={100} 
              priority 
            />
          </div>
        )}

        {title && (
          <h1 className="title text-center mb-10">
            {title}
          </h1>
        )}

        {children}
      </section>
    </div>
  );
};