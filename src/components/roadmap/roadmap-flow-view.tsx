"use client";

import type { RoadmapNode } from "@/lib/types";
import { ActivityCard } from "./activity-card";
import { methodologyColors } from "@/lib/colors";
import { Zoom } from "@visx/zoom";
import { localPoint } from "@visx/event";
import { RectClipPath } from '@visx/clip-path';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Maximize } from "lucide-react";

interface RoadmapFlowViewProps {
  data: RoadmapNode[];
}

const width = 2000;
const height = 1000;

export function RoadmapFlowView({ data }: RoadmapFlowViewProps) {
  const methodologies = data.filter((item) => item.Tipo === "Metodología");

  return (
    <Zoom<SVGRectElement>
      width={width}
      height={height}
      scaleXMin={0.2}
      scaleXMax={2}
      scaleYMin={0.2}
      scaleYMax={2}
    >
      {(zoom) => (
        <div className="relative w-full h-[75vh] bg-muted/30 rounded-lg border overflow-hidden">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            className="cursor-move"
            ref={zoom.containerRef}
          >
            <RectClipPath id="zoom-clip" width={width} height={height} />
            <g transform={zoom.toString()}>
              <foreignObject x={0} y={0} width={width} height={height}>
                <div className="flex items-start space-x-8 p-12">
                  {methodologies.length > 0 ? (
                    methodologies.map((methodology, index) => (
                      <div key={methodology.ID} className="flex-shrink-0">
                        <h2
                          className="text-2xl font-bold mb-6 pb-2 border-b-4"
                          style={{ borderBottomColor: methodologyColors[index % methodologyColors.length] }}
                        >
                          {methodology.Título}
                        </h2>
                        <div className="flex items-start space-x-6">
                          {methodology.children.map((generalActivity) => (
                            <div key={generalActivity.ID} className="relative pt-4">
                              <div className="absolute left-1/2 -top-2 h-6 w-px bg-border"></div>
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
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      No roadmap methodologies found.
                    </div>
                  )}
                </div>
              </foreignObject>
            </g>
          </svg>
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
             <Button size="icon" variant="outline" onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}>
               <Plus />
             </Button>
             <Button size="icon" variant="outline" onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}>
               <Minus />
             </Button>
             <Button size="icon" variant="outline" onClick={zoom.reset}>
               <Maximize />
             </Button>
          </div>
        </div>
      )}
    </Zoom>
  );
}