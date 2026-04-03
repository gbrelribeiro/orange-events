/* app/client/(auth)/layout.tsx */

import { ReactNode } from "react";
import "../user.css";

export default function ClientAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
};