"use client";

import type { RoadmapItem, RoadmapNode } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadmapFlowView } from "./roadmap-flow-view";
import { TableView } from "./table-view";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

interface RoadmapClientProps {
  flatData: RoadmapItem[];
  treeData: RoadmapNode[];
}

export function RoadmapClient({ flatData, treeData }: RoadmapClientProps) {
  const flowViewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    toast({
      title: "Generating PDF...",
      description: "This may take a moment. Please wait.",
    });

    const element = flowViewRef.current;
    if (!element) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find roadmap content to export.",
      });
      setIsExporting(false);
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor:
          document.documentElement.classList.contains("dark") ? "#18181b" : "#f5f3ff",
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      // Cover Page
      pdf.setFillColor(document.documentElement.classList.contains("dark") ? "#18181b" : "#f5f3ff");
      pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');
      
      pdf.setFontSize(40);
      pdf.setTextColor(document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000");
      pdf.text("Roadmap de Proyecto", pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() / 2 - 60, { align: "center" });

      pdf.setFontSize(20);
      pdf.setTextColor(document.documentElement.classList.contains("dark") ? "#a1a1aa" : "#71717a");
      pdf.text("Juan Diego Lora", pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() / 2, { align: "center" });
      pdf.text("by: Juan Diego Lora", pdf.internal.pageSize.getWidth() / 2, pdf.internal.pageSize.getHeight() / 2 + 30, { align: "center" });

      // Roadmap Content
      pdf.addPage([canvas.width, canvas.height], "landscape");
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

      pdf.save("roadmap-proyecto.pdf");

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
    <div className="container mx-auto">
      <Tabs defaultValue="flow">
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
          <div ref={flowViewRef} className="p-1">
            <RoadmapFlowView data={treeData} />
          </div>
        </TabsContent>
        <TabsContent value="table">
          <TableView data={flatData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
