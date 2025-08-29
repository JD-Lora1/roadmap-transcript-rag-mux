'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface HolisticViewToggleProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function HolisticViewToggle({ isOpen, setOpen }: HolisticViewToggleProps) {
  return (
    <Button variant="ghost" size="sm" onClick={() => setOpen(!isOpen)}>
      {isOpen ? (
        <X className="mr-2 h-4 w-4" />
      ) : (
        <Menu className="mr-2 h-4 w-4" />
      )}
      {isOpen ? "Ocultar Vista General" : "Mostrar Vista General"}
    </Button>
  );
}
