/* app/master/(auth)/layout.tsx */

import { ReactNode } from "react";
import "../master.css";

export default function MasterAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-background">
      {children}
    </div>
  );
};