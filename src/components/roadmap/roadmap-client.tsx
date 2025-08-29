"use client";

import type { RoadmapItem, RoadmapNode } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadmapFlowView } from "./roadmap-flow-view";
import { TableView } from "./table-view";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { methodologyColors } from "@/lib/colors";

interface RoadmapClientProps {
  flatData: RoadmapItem[];
  treeData: RoadmapNode[];
}

export function RoadmapClient({ flatData, treeData }: RoadmapClientProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const addWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number, options = {}) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, options);
    return lines.length * lineHeight;
  };

  const drawCard = (doc: jsPDF, node: RoadmapNode, x: number, y: number, level: number, color: string) => {
    const cardWidth = 80;
    const cardPadding = 3;
    const textWidth = cardWidth - (cardPadding * 2);
    const lineHeight = 4.5;
    let currentY = y + cardPadding + 5;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const titleHeight = addWrappedText(doc, node.Título, x + cardPadding, currentY, textWidth, lineHeight);
    currentY += titleHeight;

    if (node.Descripción) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      currentY += 2;
      const descHeight = addWrappedText(doc, node.Descripción, x + cardPadding, currentY, textWidth, lineHeight);
      currentY += descHeight;
    }

    const whyNode = node.children.find(c => c.Tipo === 'Why');
    if (whyNode) {
        currentY += 2;
        doc.setFillColor(240, 240, 240);
        doc.setDrawColor(220, 220, 220);
        
        let whyY = currentY;
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        const whyText = `Why: ${whyNode.Título}`;
        const whyHeight = addWrappedText(doc, whyText, x + cardPadding + 2, whyY + cardPadding, textWidth - 4, lineHeight);
        
        doc.rect(x + cardPadding, whyY, textWidth, whyHeight + cardPadding, 'FD');
        currentY += whyHeight + cardPadding + 2;
    }
    
    currentY += cardPadding;
    doc.setDrawColor(color);
    doc.setLineWidth(1);
    doc.line(x, y, x, y + currentY - y);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(x, y, cardWidth, currentY - y, 'S');

    return { cardHeight: currentY - y, cardWidth };
  };

  const handleExport = async () => {
    setIsExporting(true);
    toast({
      title: "Generating PDF...",
      description: "This may take a moment. Please wait.",
    });

    try {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        doc.setFont("helvetica", "normal");
        const pageMargin = 15;
        const pageWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
        let x = pageMargin;
        let y = pageMargin;
        let pageNumber = 1;
        const methodologies = treeData.filter((item) => item.Tipo === "Metodología");

        doc.setFontSize(24);
        doc.text("Roadmap TranscriptRAG - JL", doc.internal.pageSize.getWidth() / 2, y, { align: 'center'});
        y += 20;

        methodologies.forEach((methodology, methIndex) => {
            const color = methodologyColors[methIndex % methodologyColors.length];
            const hexColor = doc.colors.colorNameToHex(color);

            if (y > doc.internal.pageSize.getHeight() - 40) {
              doc.addPage();
              pageNumber++;
              y = pageMargin;
            }

            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(hexColor);
            doc.text(methodology.Título, x, y);
            y += 8;
            doc.setTextColor(0,0,0);

            let currentX = x;
            let maxColHeight = 0;
            let currentYInCol = y;
            
            methodology.children.forEach(activity => {
                if (currentX > pageWidth - 80) {
                    currentX = x;
                    currentYInCol += maxColHeight + 10;
                    maxColHeight = 0;
                }

                if (currentYInCol > doc.internal.pageSize.getHeight() - 40) {
                    doc.addPage();
                    pageNumber++;
                    currentX = x;
                    currentYInCol = pageMargin;
                    maxColHeight = 0;
                }

                const { cardHeight, cardWidth } = drawCard(doc, activity, currentX, currentYInCol, 0, hexColor);
                maxColHeight = Math.max(maxColHeight, cardHeight);

                let subX = currentX + cardWidth + 10;
                let subY = currentYInCol;

                activity.children.filter(c => c.Tipo === 'Actividad_Detallada').forEach(subActivity => {
                    if (subX > pageWidth - 80) {
                        subX = currentX + cardWidth + 10;
                        subY += maxColHeight + 5; 
                        maxColHeight = 0;
                    }

                    if (subY > doc.internal.pageSize.getHeight() - 40) {
                        doc.addPage();
                        pageNumber++;
                        subY = pageMargin;
                        subX = x;
                    }
                    
                    const { cardHeight: subCardHeight } = drawCard(doc, subActivity, subX, subY, 1, hexColor);
                    maxColHeight = Math.max(maxColHeight, subY - currentYInCol + subCardHeight);
                    subX += cardWidth + 10;
                });
                
                currentX = subX;
            });

            y = currentYInCol + maxColHeight + 15;
        });

      for (let i = 1; i <= pageNumber; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Página ${i} de ${pageNumber}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 5,
          { align: 'center' }
        );
      }


      doc.save("Roadmap-TranscriptRAG-JL.pdf");

      toast({
        title: "Success!",
        description: "Your PDF has been downloaded.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "An error occurred while generating the PDF.",
      });
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="flow" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="flow">Flujo</TabsTrigger>
            <TabsTrigger value="table">Tabla</TabsTrigger>
          </TabsList>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Generando..." : "Descargar PDF"}
          </Button>
        </div>

        <TabsContent value="flow" className=" -mx-4 sm:-mx-6 lg:-mx-8">
            <RoadmapFlowView data={treeData} />
        </TabsContent>
        <TabsContent value="table">
          <TableView data={flatData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}