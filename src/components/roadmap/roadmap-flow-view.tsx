"use client";

import React, { useRef, useLayoutEffect, useState } from 'react';
import type { RoadmapNode, RoadmapItem } from "@/lib/types";
import { ActivityCard } from "./activity-card";
import { methodologyColors } from "@/lib/colors";
import { cn } from '@/lib/utils';

interface RoadmapFlowViewProps {
  data: RoadmapNode[];
}

interface Stage {
  name: string;
  top: number;
  height: number;
  level: number;
}

interface StageLine {
    name: string;
    top: number;
    height: number;
    level: number;
}


export function RoadmapFlowView({ data: methodologies }: RoadmapFlowViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageLines, setStageLines] = useState<Record<string, StageLine[]>>({});

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const stages: Record<string, { top: number, bottom: number, element: HTMLElement }[]> = {};
    const elements = Array.from(containerRef.current.querySelectorAll('[data-etapa]')) as HTMLElement[];
    
    elements.forEach(el => {
      const etapa = el.dataset.etapa;
      if (!etapa) return;

      if (!stages[etapa]) {
        stages[etapa] = [];
      }
      stages[etapa].push({
        top: el.offsetTop,
        bottom: el.offsetTop + el.offsetHeight,
        element: el
      });
    });

    const newStageLines: Record<string, StageLine[]> = {};
    const parallelStageCounters: Record<string, number> = {};

    Object.keys(stages).forEach(stageName => {
      const baseName = stageName.replace(/-\d+$/, '');
      if (stageName.match(/-\d+$/)) {
        if (parallelStageCounters[baseName] === undefined) {
          parallelStageCounters[baseName] = 0;
        } else {
          parallelStageCounters[baseName]++;
        }
      }

      const activities = stages[stageName].sort((a, b) => a.top - b.top);
      if (activities.length === 0) return;

      let currentLine: StageLine | null = null;
      activities.forEach((activity, index) => {
        if (!currentLine) {
          currentLine = {
            name: stageName.replace(/-\d+$/, ''),
            top: activity.top,
            height: activity.bottom - activity.top,
            level: parallelStageCounters[baseName] || 0
          };
        } else {
           const prevActivity = activities[index - 1];
           const gap = activity.top - prevActivity.bottom;
           if (gap < 50) { // If gap is small, extend the line
             currentLine.height = activity.bottom - currentLine.top;
           } else { // If gap is large, end current line and start a new one
             if (!newStageLines[baseName]) newStageLines[baseName] = [];
             newStageLines[baseName].push(currentLine);
             currentLine = {
               name: stageName.replace(/-\d+$/, ''),
               top: activity.top,
               height: activity.bottom - activity.top,
               level: parallelStageCounters[baseName] || 0
             };
           }
        }
      });

      if (currentLine) {
        if (!newStageLines[baseName]) newStageLines[baseName] = [];
        newStageLines[baseName].push(currentLine);
      }
    });
    setStageLines(newStageLines);

  }, [methodologies]);

  const renderActivities = (activities: RoadmapNode[], color: string) => {
    return activities.map((generalActivity) => (
      <div key={generalActivity.ID} data-etapa={generalActivity.Etapa || ''} data-etapa2={generalActivity.Etapa2 || ''}>
        <ActivityCard
          node={generalActivity}
          level={0}
          methodologyColor={color}
        />
      </div>
    ));
  };
  
  return (
    <div className="relative" ref={containerRef}>
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

      <div className="absolute top-0 right-0 h-full w-48 z-0 pointer-events-none">
        {Object.entries(stageLines).map(([baseName, lines]) =>
          lines.map((line, index) => {
             const rightPosition = line.level * 30;
             const alignmentClass = line.level % 2 === 0 ? 'text-left' : 'text-right';

            return (
              <React.Fragment key={`${baseName}-${index}`}>
                <div
                  className="absolute w-px bg-gray-300 dark:bg-gray-700"
                  style={{
                    top: line.top,
                    height: line.height,
                    right: `${rightPosition}px`,
                  }}
                />
                <div
                  className={cn(
                    "absolute p-1 rounded-md text-xs font-semibold text-muted-foreground bg-muted/80 w-28 break-words",
                    alignmentClass
                   )}
                  style={{ top: line.top, right: `${rightPosition + 8}px` }}
                >
                  {line.name}
                </div>
              </React.Fragment>
            )
          })
        )}
      </div>
    </div>
  );
}
