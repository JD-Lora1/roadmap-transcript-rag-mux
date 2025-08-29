"use client";

import { motion } from "framer-motion";
import type { RoadmapNode } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  node: RoadmapNode;
  level: number;
}

export function ActivityCard({ node, level }: ActivityCardProps) {
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
      <Card className="overflow-hidden border-l-4 border-primary shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">{node.Título}</CardTitle>
          {node.Descripción && (
            <CardDescription className="text-sm pt-1">{node.Descripción}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {whyNode && (
            <div className="mt-2 mb-4 p-3 bg-muted/50 rounded-md">
              <p className="text-sm italic text-muted-foreground">
                <span className="font-semibold text-foreground">Why: </span>
                {whyNode.Título}
              </p>
            </div>
          )}
          {detailedActivities.length > 0 && (
            <div className={cn("space-y-3", { "ml-4 pl-4 border-l": level === 0 })}>
              {detailedActivities.map((detailedActivity) => (
                <ActivityCard key={detailedActivity.ID} node={detailedActivity} level={level + 1} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
