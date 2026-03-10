/* components/loading/Loading.tsx */

import "./Loading.css";

export default function Loading() {
  return (
    <div className="center min-h-screen gap-5">
      <div className="spin-loading" />

      <div className="semibold-xl text-neutral-900 dark:text-neutral-100">
        Carregando...
      </div>
    </div>
  );
};