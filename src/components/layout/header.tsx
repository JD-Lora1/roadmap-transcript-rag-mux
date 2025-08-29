import { ThemeToggle } from "./theme-toggle";
import type { RoadmapNode } from "@/lib/types";
import { HolisticViewToggle } from "../roadmap/holistic-view-toggle";

interface HeaderProps {
    isHolisticViewOpen?: boolean;
    setHolisticViewOpen?: (isOpen: boolean) => void;
    methodologies?: RoadmapNode[];
    activeId?: string | null;
}

export function Header({ isHolisticViewOpen, setHolisticViewOpen, methodologies, activeId }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-6 md:px-8">
        {setHolisticViewOpen && (
             <HolisticViewToggle 
                isOpen={isHolisticViewOpen ?? false} 
                setOpen={setHolisticViewOpen}
            />
        )}
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              Roadmap TranscriptRAG - JL
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
