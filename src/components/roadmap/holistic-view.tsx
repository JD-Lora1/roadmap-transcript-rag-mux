"use client";

import type { RoadmapNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { methodologyColors } from "@/lib/colors";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface HolisticViewProps {
  methodologies: RoadmapNode[];
  activeId: string | null;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export function HolisticView({ methodologies, activeId, isOpen, setOpen }: HolisticViewProps) {
  
  const scrollToView = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-[350px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold mb-4 pl-4 pt-4">Vista General</SheetTitle>
        </SheetHeader>
        <div className="h-full overflow-y-auto pb-16">
            <nav className="space-y-4 pt-4">
                {methodologies.map((methodology, index) => {
                    const color = methodologyColors[index % methodologyColors.length];
                    const isActiveMethodology = activeId === `metodologia-${methodology.ID}`;
                    const childIsActive = activeId?.startsWith('actividad-') && methodology.children.some(c => `actividad-${c.ID}` === activeId);

                    return (
                        <div key={methodology.ID} className="pl-4">
                          <a
                              href={`#metodologia-${methodology.ID}`}
                              onClick={(e) => { e.preventDefault(); scrollToView(`metodologia-${methodology.ID}`)}}
                              className={cn(
                                "font-semibold text-lg transition-colors block p-1 rounded-md -ml-1",
                                (isActiveMethodology || childIsActive) ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:text-foreground"
                              )}
                              style={{ 
                                color: (isActiveMethodology || childIsActive) ? 'white' : color,
                              }}
                          >
                              {methodology.Título}
                          </a>
                          <ul className="mt-3 space-y-2 pl-2 border-l-2 ml-2" style={{borderColor: color}}>
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
                                          "flex items-start text-sm transition-colors relative",
                                          isActiveActivity ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                                      )}
                                      >
                                      <span className="absolute -left-[1.2rem] top-1/2 -translate-y-1/2 transform w-2 h-px bg-border" style={{backgroundColor: color}}></span>
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
      </SheetContent>
    </Sheet>
  );
}
