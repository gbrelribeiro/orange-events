/* app/client/(main)/layout.tsx */

import { ReactNode } from "react";
import "../client.css";

export default async function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <main>
        {children}
      </main>
    </div>
  );
};