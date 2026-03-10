/* components/admin/ActionButtons.tsx */

import { IoMdCheckmark, IoMdClose } from "react-icons/io";

type ActionButtonProps = {
  onApprove: () => void;
  onReject: () => void;
  isLoading?: boolean;
};

export function ActionButton ({ onApprove, onReject, isLoading }: ActionButtonProps) {
  return (
    <div className="row gap-2">
      <button
        onClick={(e) => { e.stopPropagation(); onApprove(); }}
        disabled={isLoading}
        className="button green"
        title="Aprovar"
      >
        <IoMdCheckmark size={20} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onReject(); }}
        disabled={isLoading}
        className="button red"
        title="Recusar"
      >
        <IoMdClose size={20} />
      </button>
    </div>
  );
};