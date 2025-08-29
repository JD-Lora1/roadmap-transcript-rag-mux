"use client";

import type { RoadmapItem, RoadmapNode } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadmapFlowView } from "./roadmap-flow-view";
import { TableView } from "./table-view";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { methodologyColors } from "@/lib/colors";
import { HolisticView } from "./holistic-view";

interface RoadmapClientProps {
  flatData: RoadmapItem[];
  treeData: RoadmapNode[];
}

export function RoadmapClient({ flatData, treeData }: RoadmapClientProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { toast } = useToast();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px", threshold: 0.1 }
    );
  
    const elements = scrollContainerRef.current?.querySelectorAll('[id^="metodologia-"], [id^="actividad-"]');
    elements?.forEach((el) => observer.observe(el));
  
    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, [treeData]);


  const addWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number, options = {}) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, options);
    return lines.length * lineHeight;
  };

  const drawCard = (doc: jsPDF, node: RoadmapNode, x: number, y: number, width: number, color: string) => {
    const cardPadding = 5;
    const textWidth = width - (cardPadding * 2);
    const lineHeight = 5;
    let currentY = y + cardPadding + 5;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const titleHeight = addWrappedText(doc, node.Título, x + cardPadding, currentY, textWidth, lineHeight);
    currentY += titleHeight;

    if (node.Descripción) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      currentY += 2;
      const descHeight = addWrappedText(doc, node.Descripción, x + cardPadding, currentY, textWidth, lineHeight);
      currentY += descHeight;
    }
    
    currentY += cardPadding;
    const cardHeight = currentY - y;

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, width, cardHeight, 3, 3, 'S');
    doc.setDrawColor(color);
    doc.setLineWidth(1.5);
    doc.line(x, y, x, y + cardHeight);

    return cardHeight;
  };

  const handleExport = async () => {
    setIsExporting(true);
    toast({ title: "Generando PDF...", description: "Esto puede tomar un momento." });

    try {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageMargin = 15;
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const contentWidth = pageW - (pageMargin * 2);
        let y = pageMargin;

        // Cover Page
        doc.setFontSize(28);
        doc.text("Roadmap TranscriptRAG - JL", pageW / 2, pageH / 2 - 20, { align: 'center'});
        doc.setFontSize(12);
        doc.text("Resumen de Hoja de Ruta", pageW / 2, pageH / 2, { align: 'center'});
        doc.setTextColor(0, 0, 255);
        doc.textWithLink("https://roadmap-transcript-rag-mux-production.up.railway.app", pageW / 2, pageH / 2 + 10, { url: "https://roadmap-transcript-rag-mux-production.up.railway.app", align: 'center' });
        doc.setTextColor(0, 0, 0);

        doc.addPage();
        y = pageMargin;

        // Holistic View Page
        doc.setFontSize(18);
        doc.text("Vista General", pageMargin, y);
        y += 15;

        treeData.filter(m => m.Tipo === 'Metodología').forEach((methodology, methIndex) => {
          if (y > pageH - 30) {
            doc.addPage();
            y = pageMargin;
          }
          const color = methodologyColors[methIndex % methodologyColors.length];
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(color);
          y += addWrappedText(doc, methodology.Título, pageMargin, y, contentWidth, 6);
          y += 2;

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);

          methodology.children.filter(c => c.Tipo === 'Actividad_General').forEach(activity => {
            if (y > pageH - 20) {
              doc.addPage();
              y = pageMargin;
            }
            const text = `- ${activity.Título}`;
            y += addWrappedText(doc, text, pageMargin + 5, y, contentWidth - 5, 5);
          });
          y += 10;
        });

        // Detailed View Pages
        let pageCount = doc.internal.getNumberOfPages();
        treeData.filter(m => m.Tipo === 'Metodología').forEach((methodology, methIndex) => {
            doc.addPage();
            pageCount++;
            y = pageMargin;
            
            const color = methodologyColors[methIndex % methodologyColors.length];
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(color);
            doc.text(methodology.Título, pageMargin, y);
            y += 10;
            doc.setTextColor(0,0,0);

            methodology.children.filter(c => c.Tipo === 'Actividad_General').forEach(activity => {
                if (y > pageH - pageMargin - 40) { // Check space for at least one card
                    doc.addPage();
                    pageCount++;
                    y = pageMargin;
                }
                const activityCardHeight = drawCard(doc, activity, pageMargin, y, contentWidth, color);
                
                let currentYForSub = y + activityCardHeight + 5;
                let subActivityX = pageMargin + 15;
                let subActivityWidth = contentWidth - 20;

                activity.children.filter(c => c.Tipo === 'Actividad_Detallada').forEach((subActivity) => {
                    if (currentYForSub > pageH - pageMargin - 30) {
                        doc.addPage();
                        pageCount++;
                        currentYForSub = pageMargin;
                    }
                    const subCardHeight = drawCard(doc, subActivity, subActivityX, currentYForSub, subActivityWidth, color);
                    currentYForSub += subCardHeight + 5;
                });
                
                y = currentYForSub;
            });
        });
        
        // Final page count
        const finalPageCount = doc.internal.getNumberOfPages();

        // Page numbering
        for (let i = 1; i <= finalPageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Página ${i} de ${finalPageCount}`, pageW / 2, pageH - 5, { align: 'center' });
        }

        doc.save("Roadmap-TranscriptRAG-JL.pdf");
        toast({ title: "Éxito!", description: "Tu PDF ha sido descargado." });
    } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Exportación Fallida", description: "Ocurrió un error al generar el PDF." });
    } finally {
        setIsExporting(false);
    }
  };

  const methodologies = treeData.filter((item) => item.Tipo === "Metodología");

  return (
    <div className="flex">
      <HolisticView 
        methodologies={methodologies} 
        activeId={activeId} 
      />
      <div className="w-full flex-1 py-8 px-4 sm:px-6 md:px-8">
        <Tabs defaultValue="flow" className="w-full max-w-4xl mx-auto">
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

          <TabsContent value="flow">
              <div ref={scrollContainerRef}>
                <RoadmapFlowView data={methodologies} />
              </div>
          </TabsContent>
          <TabsContent value="table">
            <TableView data={flatData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
