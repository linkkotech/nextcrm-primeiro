"use client";

import { Input } from "@/components/ui/input";

interface ColorPickerNativeProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ColorPickerNative({
  value,
  onChange,
  placeholder = "#000000",
}: ColorPickerNativeProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded border border-border cursor-pointer"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-24"
      />
    </div>
  );
}
