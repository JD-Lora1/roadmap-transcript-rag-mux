"use client";

import { motion } from "framer-motion";
import type { RoadmapNode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ActivityCardProps {
  node: RoadmapNode;
  level: number;
  methodologyColor: string;
}

export function ActivityCard({ node, level, methodologyColor }: ActivityCardProps) {
  const whyNode = node.children.find(child => child.Tipo === "Why");
  const detailedActivities = node.children.filter(child => child.Tipo === "Actividad_Detallada");

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const cardStyle = {
    borderLeftColor: methodologyColor
  } as React.CSSProperties;

  return (
    <motion.div
      custom={level}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card
        id={`actividad-${node.ID}`}
        className="overflow-hidden border-l-4 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm w-full"
        style={cardStyle}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-semibold text-foreground">{node.Título}</CardTitle>
            {whyNode && (
               <TooltipProvider>
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                   </TooltipTrigger>
                   <TooltipContent>
                     <p className="max-w-xs">{whyNode.Título}</p>
                   </TooltipContent>
                 </Tooltip>
               </TooltipProvider>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {node.Descripción && (
            <p className="text-sm text-muted-foreground mb-3">{node.Descripción}</p>
          )}

          {detailedActivities.length > 0 && (
             <div className="relative pl-6 mt-4 space-y-4">
                <div className="absolute left-2.5 top-0 h-full w-px bg-border"></div>
                {detailedActivities.map((detailedActivity) => (
                    <div key={detailedActivity.ID} className="relative">
                        <div className="absolute -left-3.5 top-2.5 h-px w-3 bg-border"></div>
                        <ActivityCard
                            node={detailedActivity}
                            level={level + 1}
                            methodologyColor={methodologyColor}
                        />
                    </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
