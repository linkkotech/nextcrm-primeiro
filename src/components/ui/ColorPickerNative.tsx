"use client";

import { useState, useEffect } from "react";
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
  const [internalColor, setInternalColor] = useState(value);

  useEffect(() => {
    setInternalColor(value);
  }, [value]);

  const handleColorChange = (newValue: string) => {
    setInternalColor(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className="relative w-10 h-10 rounded border border-input cursor-pointer"
        style={{ backgroundColor: internalColor || placeholder }}
      >
        <input
          type="color"
          value={internalColor || placeholder}
          onChange={(e) => handleColorChange(e.target.value)}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <Input
        value={internalColor || ''}
        onChange={(e) => handleColorChange(e.target.value)}
        placeholder={placeholder}
        className="w-24"
      />
    </div>
  );
}

