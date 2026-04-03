/* components/list/ListEmpty.tsx */

"use client";

import { ReactNode } from "react";
import "./ListEmpty.css";

type ListEmptyProps = {
  children: ReactNode;
};

export function ListEmpty({ children }: ListEmptyProps) {
  return (
    <div className="center empty-list-styles">
      {children}
    </div>
  );
};