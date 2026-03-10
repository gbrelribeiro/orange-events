/* app/client/(main)/checkout/[id]/form/page.tsx */

"use client";

import { Suspense } from "react";
import Image from "next/image";
import CheckoutForm from "@/components/forms/CheckoutForm";

export default function CheckoutFormPage() {
  return (
    <Suspense fallback={
      <div className="center min-h-screen flex-col gap-4">
        <Image src="/logo(1).png" alt="Orange Events" width={100} height={40} className="animate-pulse" />
        <p className="text-neutral-500">Preparando formulário de checkout...</p>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
};