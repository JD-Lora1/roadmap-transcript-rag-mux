"use client";

import type { RoadmapNode } from "@/lib/types";
import { ActivityCard } from "./activity-card";
import { methodologyColors } from "@/lib/colors";

interface RoadmapFlowViewProps {
  data: RoadmapNode[];
}

export function RoadmapFlowView({ data: methodologies }: RoadmapFlowViewProps) {
  return (
    <div className="space-y-12">
      {methodologies.length > 0 ? (
        methodologies.map((methodology, index) => (
          <div key={methodology.ID} id={`metodologia-${methodology.ID}`} className="space-y-8">
            <h2
              className="text-2xl font-bold pb-2 border-b-4 sticky top-14 bg-background/95 z-10"
              style={{ borderBottomColor: methodologyColors[index % methodologyColors.length] }}
            >
              {methodology.Título}
            </h2>
            <div className="space-y-6">
              {methodology.children
                .filter(child => child.Tipo === "Actividad_General")
                .map((generalActivity) => (
                <div key={generalActivity.ID} id={`actividad-${generalActivity.ID}`}>
                  <ActivityCard
                    node={generalActivity}
                    level={0}
                    methodologyColor={methodologyColors[index % methodologyColors.length]}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No roadmap methodologies found.
        </div>
      )}
    </div>
  );
}
