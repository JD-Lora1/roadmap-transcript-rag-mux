"use client";

import type { RoadmapNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { methodologyColors } from "@/lib/colors";

interface HolisticViewProps {
  methodologies: RoadmapNode[];
  activeId: string | null;
}

export function HolisticView({ methodologies, activeId }: HolisticViewProps) {
  
  const scrollToView = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="hidden lg:block w-1/4 sticky top-14 h-[calc(100vh-3.5rem)] py-8 pl-4">
        <div className="h-full overflow-y-auto pr-4 border-l">
            <h3 className="text-lg font-semibold mb-4 pl-4">Vista Holística</h3>
            <nav className="space-y-4">
                {methodologies.map((methodology, index) => {
                    const isActiveMethodology = activeId?.startsWith('metodologia-') && activeId === `metodologia-${methodology.ID}`;
                    const childIsActive = activeId?.startsWith('actividad-') && methodology.children.some(c => `actividad-${c.ID}` === activeId);

                    return (
                        <div key={methodology.ID} className="pl-4">
                        <a
                            href={`#metodologia-${methodology.ID}`}
                            onClick={(e) => { e.preventDefault(); scrollToView(`metodologia-${methodology.ID}`)}}
                            className={cn(
                            "font-semibold text-sm transition-colors",
                            (isActiveMethodology || childIsActive) ? "text-primary" : "text-foreground/80 hover:text-foreground"
                            )}
                            style={{ color: (isActiveMethodology || childIsActive) ? methodologyColors[index % methodologyColors.length] : undefined }}
                        >
                            {methodology.Título}
                        </a>
                        <ul className="mt-2 space-y-1">
                            {methodology.children
                            .filter(child => child.Tipo === "Actividad_General")
                            .map(activity => {
                                const isActiveActivity = activeId === `actividad-${activity.ID}`;
                                return (
                                <li key={activity.ID}>
                                    <a
                                    href={`#actividad-${activity.ID}`}
                                    onClick={(e) => { e.preventDefault(); scrollToView(`actividad-${activity.ID}`)}}
                                    className={cn(
                                        "flex items-start text-xs transition-colors",
                                        isActiveActivity ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                                    )}
                                    >
                                    <span className="mr-2 mt-1">-</span>
                                    <span>{activity.Título}</span>
                                    </a>
                                </li>
                                );
                            })}
                        </ul>
                        </div>
                    );
                })}
            </nav>
        </div>
    </aside>
  );
}
