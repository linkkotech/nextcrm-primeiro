"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChromePicker } from "react-color";

interface ColorPickerChromeProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ColorPickerChrome({
  value,
  onChange,
  placeholder = "#000000",
}: ColorPickerChromeProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded border border-border cursor-pointer"
        style={{ backgroundColor: value }}
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-24"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Escolher
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto p-0">
          <ChromePicker
            color={value}
            onChange={(color) => onChange(color.hex)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
