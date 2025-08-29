'use client';

import type { RoadmapNode } from "@/lib/types";
import { ActivityCard } from "./activity-card";
import { methodologyColors } from "@/lib/colors";

interface RoadmapFlowViewProps {
  data: RoadmapNode[];
}

export function RoadmapFlowView({ data: methodologies }: RoadmapFlowViewProps) {

  const renderActivities = (activities: RoadmapNode[], color: string) => {
    return activities.map((generalActivity) => (
      <div key={generalActivity.ID}>
        <ActivityCard
          node={generalActivity}
          level={0}
          methodologyColor={color}
        />
      </div>
    ));
  };
  
  return (
    <div className="relative">
      <div className="space-y-12">
        {methodologies.length > 0 ? (
          methodologies.map((methodology, index) => (
            <div key={methodology.ID} id={`metodologia-${methodology.ID}`} className="space-y-8 relative">
              <h2
                className="text-2xl font-bold pb-3 pt-2 border-b-4 sticky top-14 bg-background/95 z-10 pl-4"
                style={{ borderBottomColor: methodologyColors[index % methodologyColors.length] }}
              >
                {methodology.Título}
              </h2>
              <div className="space-y-6">
                {renderActivities(methodology.children.filter(child => child.Tipo === "Actividad_General"), methodologyColors[index % methodologyColors.length])}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No roadmap methodologies found.
          </div>
        )}
      </div>
    </div>
  );
}
