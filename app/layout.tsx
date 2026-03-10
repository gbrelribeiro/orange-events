/* app/layout.tsx */

import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_CONFIG } from "@/utils/constants";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name, 
    template: `${SITE_CONFIG.name} | %s`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
};