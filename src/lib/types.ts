export interface RoadmapItem {
  ID: string;
  Parent_ID: string;
  Tipo: 'Metodología' | 'Actividad_General' | 'Actividad_Detallada' | 'Why';
  Título: string;
  Descripción: string;
  Why?: string;
}

export interface RoadmapNode extends RoadmapItem {
  children: RoadmapNode[];
}
