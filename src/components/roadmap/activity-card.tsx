'use client';

import { motion } from 'framer-motion';
import type { RoadmapNode } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getEtapaColor } from '@/lib/etapa-colors';

interface ActivityCardProps {
  node: RoadmapNode;
  level: number;
  methodologyColor: string;
}

export function ActivityCard({ node, level, methodologyColor }: ActivityCardProps) {
  const whyNode = node.children.find(child => child.Tipo === 'Why');
  const detailedActivities = node.children.filter(child => child.Tipo === 'Actividad_Detallada');

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const etapa1Color = node.Etapa ? getEtapaColor(node.Etapa) : null;
  const etapa2Color = node.Etapa2 ? getEtapaColor(node.Etapa2) : null;

  return (
    <motion.div
      id={`actividad-${node.ID}`}
      className='relative'
      variants={cardVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.2 }}
      custom={level}
    >
      <Card
        className='relative overflow-hidden'
        style={{
          marginLeft: `${level * 2}rem`,
          borderLeft: `4px solid ${methodologyColor}`,
        }}
      >
        {etapa1Color && (
            <div className='absolute top-0 right-0 h-full w-1' style={{ backgroundColor: etapa1Color }} />
        )}
        {etapa2Color && (
            <div className='absolute top-0 right-1 h-full w-1' style={{ backgroundColor: etapa2Color }} />
        )}

        <div className='absolute top-2 right-2 flex flex-col gap-1'>
          {node.Etapa && <Badge style={{ backgroundColor: etapa1Color }}>{node.Etapa}</Badge>}
          {node.Etapa2 && <Badge style={{ backgroundColor: etapa2Color }}>{node.Etapa2}</Badge>}
        </div>

        <CardHeader>
          <CardTitle className='text-base font-semibold pr-16'>
            {node.Título}
          </CardTitle>
          {whyNode && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className='absolute top-3 right-3 text-muted-foreground hover:text-foreground'>
                    <Info size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side='top' align='end' className='max-w-xs'>
                  <p className='font-bold text-sm mb-2'>Why?</p>
                  <p className='text-xs'>{whyNode.Descripción}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardHeader>
        <CardContent>
          <div
            className='text-sm text-muted-foreground prose prose-sm max-w-none'
            dangerouslySetInnerHTML={{ __html: node.Descripción }}
          />

          {detailedActivities.length > 0 && (
            <div className='mt-4 space-y-4'>
              {detailedActivities.map((detailedActivity, index) => (
                <ActivityCard
                  key={detailedActivity.ID}
                  node={detailedActivity}
                  level={level + 1}
                  methodologyColor={methodologyColor}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
