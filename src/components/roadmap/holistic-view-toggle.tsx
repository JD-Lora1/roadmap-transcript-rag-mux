import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface HolisticViewToggleProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export function HolisticViewToggle({ isOpen, setOpen }: HolisticViewToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpen(!isOpen)}
      className="mr-2"
    >
      {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
      <span className="sr-only">Toggle Holistic View</span>
    </Button>
  );
}
