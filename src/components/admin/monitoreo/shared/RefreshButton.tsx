import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onRefresh: () => Promise<void> | void;
  loading: boolean;
  label?: string;
  loadingLabel?: string;
}

export function RefreshButton({
  onRefresh,
  loading,
  label = "Actualizar",
  loadingLabel = "Actualizando...",
}: RefreshButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        void onRefresh();
      }}
      disabled={loading}
      aria-busy={loading}
      className="
        inline-flex min-h-10 shrink-0
        items-center justify-center gap-2
        rounded-xl border border-[#0A3D62]
        bg-[#0A3D62] px-4 py-2
        text-xs font-extrabold text-white
        shadow-sm transition-all duration-200
        hover:border-[#061C2E]
        hover:bg-[#061C2E]
        hover:shadow-md
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#FFC300]
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:border-gray-300
        disabled:bg-gray-200
        disabled:text-gray-500
        disabled:shadow-none
      "
    >
      <RefreshCw
        size={16}
        strokeWidth={2.2}
        className={
          loading ? "animate-spin" : ""
        }
        aria-hidden="true"
      />

      <span className="whitespace-nowrap">
        {loading
          ? loadingLabel
          : label}
      </span>
    </button>
  );
}