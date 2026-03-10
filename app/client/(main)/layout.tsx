/* app/client/(main)/layout.tsx */

import { ReactNode } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import "../client.css";

export default function ClientMainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="background column min-h-screen">
      <Navbar/>

      <div className="grow p-10">
        {children}
      </div>
      <Footer/>
    </div>
  );
};