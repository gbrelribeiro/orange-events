/* components/list/ListRow.tsx */

"use client";

import { useRef, useState, ReactNode } from "react";
import { SlOptions } from "react-icons/sl";
import Dropdown from "../dropdown/Dropdown";
import "./ListRow.css";

type Column<Type> = {
  key: string;
  render: (item: Type) => ReactNode;
  className?: string;
};

type ListRowProps<Type> = {
  item: Type;
  columns: Column<Type>[];
  actions?: (item: Type) => ReactNode;
  gridTemplateColumns: string;
  onRowClick?: (item: Type) => void;
};

export function ListRow<Type>({ item, columns, actions, gridTemplateColumns, onRowClick }: ListRowProps<Type>) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className={`row-styles ${onRowClick ? "row-clickable" : "row-unclickable"}`}
      style={{ gridTemplateColumns }}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((col, index) => (
        <div 
          key={`${col.key}-${index}`} 
          className={`column-title ${col.className || ""}`}
        >
          {col.render(item)}
        </div>
      ))}

      {actions && (
        <div 
          className="relative end w-12.5" 
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            ref={triggerRef}
            className="button list-action"
            onClick={(e) => {
              e.preventDefault();
              setOpen((prev) => !prev);
            }}
          >
            <SlOptions className="icon-size-sm" />
          </button>

          {open && (
            <div className="dropdown-position">
              <Dropdown isOpen={open} onClose={() => setOpen(false)} triggerRef={triggerRef}>
                {actions(item)}
              </Dropdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};