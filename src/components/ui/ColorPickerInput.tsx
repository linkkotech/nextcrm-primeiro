"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HexColorPicker } from "react-colorful";

interface ColorPickerInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function ColorPickerInput({
  value,
  onChange,
  placeholder = "#000000",
  label,
}: ColorPickerInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border border-border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => setOpen(true)}
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-24"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Escolher
            </Button>
          </DialogTrigger>
          <DialogContent className="w-auto p-6">
            <HexColorPicker color={value} onChange={onChange} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}