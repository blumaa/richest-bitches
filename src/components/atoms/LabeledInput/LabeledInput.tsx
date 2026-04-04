interface LabeledInputProps {
  id: string;
  label: string;
  type: "text" | "number" | "email";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  min?: string;
  step?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function LabeledInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  maxLength,
  min,
  step,
  error,
  required,
  disabled,
}: LabeledInputProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        min={min}
        step={step}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="w-full px-4 py-3 rounded-md bg-surface-raised border border-border text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50"
      />
      {error && (
        <span id={errorId} className="text-error text-sm mt-1 block">
          {error}
        </span>
      )}
    </div>
  );
}
