/* components/list/List.tsx */

"use client";

import { useState, useEffect, ReactNode, Fragment } from "react";
import { ListRow } from "./ListRow";
import { ListEmpty } from "./ListEmpty";
import "./List.css";

export type Column<Type> = {
  key: string;
  header?: string;
  render: (item: Type) => ReactNode;
  width?: string;
  className?: string;
  hideOnMobile?: boolean;
};

type ListProps<Type> = {
  items: Type[];
  columns: Column<Type>[];
  actions?: (item: Type) => ReactNode;
  showHeaders?: boolean;
  getKey: (item: Type, index: number) => string;
  onRowClick?: (item: Type) => void;
  emptyElement?: ReactNode;
};

export function List<Type>({ items, columns, actions, showHeaders = false, getKey, onRowClick, emptyElement }: ListProps<Type>) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleColumns = isMobile ? columns.filter((col) => !col.hideOnMobile) : columns;
  const gridTemplateColumns = visibleColumns.map((col) => col.width || "1fr").join(" ") + (actions ? " 50px" : "");

  return (
    <div className="list-container">
      {showHeaders && (
        <div 
          className="list-header"
          style={{ gridTemplateColumns }}
        >
          {visibleColumns.map((col, index) => (
            <div key={`${col.key}-${index}`} className={col.className || ""}>
              {col.header || col.key}
            </div>
          ))}
          {actions && <div className="w-12.5" />}
        </div>
      )}

      <div className="column">
        {items.map((item, index) => {
          const key = getKey(item, index);
          const isLast = index === items.length - 1;

          return (
            <Fragment key={key}>
              <ListRow
                item={item}
                columns={visibleColumns}
                actions={actions}
                gridTemplateColumns={gridTemplateColumns}
                onRowClick={onRowClick}
              />
              {!isLast && <hr className="last-item" />}
            </Fragment>
          );
        })}
      </div>

      {items.length === 0 && (
        <ListEmpty>
          {emptyElement || "Nenhum item encontrado"}
        </ListEmpty>
      )}
    </div>
  );
};