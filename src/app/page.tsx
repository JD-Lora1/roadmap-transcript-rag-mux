import { fetchAndParseRoadmapData } from '@/lib/data';
import { RoadmapClient } from '@/components/roadmap/roadmap-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/header';

export default async function Home() {
  const { data: roadmapItems, tree, error } = await fetchAndParseRoadmapData();

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load roadmap data. Please check the data source and try again.
            <p className="mt-2 text-xs font-mono">{error}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto">
        <RoadmapClient flatData={roadmapItems} treeData={tree} />
      </div>
    </>
  );
}
