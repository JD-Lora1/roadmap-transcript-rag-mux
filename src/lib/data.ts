import Papa from 'papaparse';
import type { RoadmapItem, RoadmapNode } from './types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXOTj_wxPP58ILt8SXHLMHojKflBVuUuQGJuouYTH1bdq8Ni4aFMlk0VUZSORKkaiXHyZfpmjkfcnj/pub?gid=825942922&single=true&output=csv';

function buildTree(items: RoadmapItem[]): RoadmapNode[] {
  const itemMap: { [key: string]: RoadmapNode } = {};
  const roots: RoadmapNode[] = [];

  items.forEach(item => {
    itemMap[item.ID] = { ...item, children: [] };
  });

  items.forEach(item => {
    if (item.Parent_ID && itemMap[item.Parent_ID]) {
      itemMap[item.Parent_ID].children.push(itemMap[item.ID]);
    } else {
      roots.push(itemMap[item.ID]);
    }
  });

  return roots;
}

export async function fetchAndParseRoadmapData(): Promise<{ data: RoadmapItem[], tree: RoadmapNode[], error: string | null }> {
  try {
    const response = await fetch(CSV_URL, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    
    return new Promise((resolve) => {
      Papa.parse<RoadmapItem>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error('CSV Parsing Errors:', results.errors);
            resolve({ data: [], tree: [], error: `Error parsing CSV: ${results.errors[0].message}` });
          } else {
            const data = results.data;
            const tree = buildTree(data);
            resolve({ data, tree, error: null });
          }
        },
        error: (error: Error) => {
          console.error('PapaParse Error:', error);
          resolve({ data: [], tree: [], error: error.message });
        },
      });
    });
  } catch (error) {
    console.error('Fetching Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: [], tree: [], error: errorMessage };
  }
}
