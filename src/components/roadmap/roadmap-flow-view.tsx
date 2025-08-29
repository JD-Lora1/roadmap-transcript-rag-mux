"use client";

import type { RoadmapNode } from "@/lib/types";
import { ActivityCard } from "./activity-card";

interface RoadmapFlowViewProps {
  data: RoadmapNode[];
}

export function RoadmapFlowView({ data }: RoadmapFlowViewProps) {
  const methodologies = data.filter((item) => item.Tipo === "Metodología");

  return (
    <div className="flex overflow-x-auto space-x-8 pb-8">
      {methodologies.length > 0 ? (
        methodologies.map((methodology) => (
          <div key={methodology.ID} className="flex-shrink-0 w-80 md:w-96">
            <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary/50">
              {methodology.Título}
            </h2>
            <div className="space-y-4">
              {methodology.children.map((generalActivity) => (
                <ActivityCard key={generalActivity.ID} node={generalActivity} level={0} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center w-full text-muted-foreground">
          No roadmap methodologies found.
        </div>
      )}
    </div>
  );
}
