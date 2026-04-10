"use client";

// 속성 편집 공용 필드 컴포넌트

interface PropertyFieldProps {
  label: string;
  children: React.ReactNode;
}

export function PropertyField({ label, children }: PropertyFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] text-white/40 w-20 flex-shrink-0 text-right">
        {label}
      </label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SelectField({ label, value, options, onChange, placeholder }: SelectFieldProps) {
  return (
    <PropertyField label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] text-white/80 focus:border-purple-500/50 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || (placeholder ? `(${placeholder})` : "(none)")}
          </option>
        ))}
      </select>
    </PropertyField>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
}: NumberFieldProps) {
  return (
    <PropertyField label={label}>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? undefined : Number(v));
        }}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] text-white/80 placeholder:text-white/20 focus:border-purple-500/50 focus:outline-none"
      />
    </PropertyField>
  );
}

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextInputField({ label, value, onChange, placeholder }: TextInputFieldProps) {
  return (
    <PropertyField label={label}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-[11px] text-white/80 placeholder:text-white/20 focus:border-purple-500/50 focus:outline-none"
      />
    </PropertyField>
  );
}
