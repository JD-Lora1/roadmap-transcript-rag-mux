"use client";

import { motion } from "framer-motion";
import type { RoadmapNode } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  return (
    <motion.div
      custom={level}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card
        className="overflow-hidden border-l-4 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm w-72"
        style={{ borderLeftColor: methodologyColor }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-foreground">{node.Título}</CardTitle>
        </CardHeader>
        <CardContent>
          {node.Descripción && (
            <p className="text-sm text-muted-foreground mb-3">{node.Descripción}</p>
          )}

          {whyNode && (
            <div className="mb-3 p-3 bg-muted/50 rounded-md border-l-2" style={{ borderLeftColor: methodologyColor }}>
              <p className="text-sm italic text-muted-foreground">
                <span className="font-semibold text-foreground">Why: </span>
                {whyNode.Título}
              </p>
            </div>
          )}
          {detailedActivities.length > 0 && (
            <div className="space-y-3">
              {detailedActivities.map((detailedActivity, index) => (
                <div key={detailedActivity.ID} className="relative pl-6">
                   <div
                    className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-border"
                  ></div>
                  <div
                    className="absolute left-2 top-1/2 h-px w-4 bg-border"
                  ></div>
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