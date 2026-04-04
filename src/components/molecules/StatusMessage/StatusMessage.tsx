"use client";

interface StatusMessageProps {
  type: "success" | "error" | "loading";
  message: string;
  onDismiss?: () => void;
}

export function StatusMessage({ type, message, onDismiss }: StatusMessageProps) {
  const role = type === "error" ? "alert" : "status";
  const colorClass =
    type === "success"
      ? "text-success"
      : type === "error"
        ? "text-error"
        : "text-brand";

  return (
    <div role={role} aria-live="polite" className="flex items-center justify-center gap-2">
      <p className={`text-center font-semibold ${colorClass}`}>{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-muted hover:text-primary text-sm min-w-[44px] min-h-[44px] inline-flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          aria-label={`Dismiss ${type} message`}
        >
          ✕
        </button>
      )}
    </div>
  );
}
