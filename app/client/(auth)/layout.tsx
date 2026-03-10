/* app/client/(auth)/layout.tsx */

import { ReactNode } from "react";
import "../client.css";

export default function ClientAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="background">
      {children}
    </div>
  );
};