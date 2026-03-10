/* app/admin/(auth)/layout.tsx */

import { ReactNode } from "react";
import "../admin.css";

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-background">
      {children}
    </div>
  );
};