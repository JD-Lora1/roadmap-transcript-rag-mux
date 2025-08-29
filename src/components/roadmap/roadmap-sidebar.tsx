'use client';

import type { RoadmapNode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RoadmapSidebarProps {
  methodologies: RoadmapNode[];
  activeMethodologyId: string | null;
}

export function RoadmapSidebar({ methodologies, activeMethodologyId }: RoadmapSidebarProps) {
  
  const scrollToMethodology = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset for sticky header
        behavior: 'smooth',
      });
    }
  };

  return (
    <aside className="sticky top-28 h-screen-minus-header p-4">
      <h3 className="text-lg font-semibold mb-4">Metodologías</h3>
      <nav>
        <ul className="space-y-2">
          {methodologies.map((methodology) => (
            <li key={methodology.ID}>
              <button
                onClick={() => scrollToMethodology(`metodologia-${methodology.ID}`)}
                className={cn(
                  "block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors",
                  {
                    'text-primary font-semibold': activeMethodologyId === `metodologia-${methodology.ID}`,
                  }
                )}
              >
                {methodology.Título}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
