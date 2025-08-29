"use client";

import { useState, useMemo } from "react";
import type { RoadmapItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

interface TableViewProps {
  data: RoadmapItem[];
}

export function TableView({ data }: TableViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lowercasedFilter = searchTerm.toLowerCase();
    return data.filter(
      (item) =>
        item.Título.toLowerCase().includes(lowercasedFilter) ||
        item.Descripción?.toLowerCase().includes(lowercasedFilter) ||
        item.Tipo.toLowerCase().includes(lowercasedFilter)
    );
  }, [data, searchTerm]);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-sm pl-10"
        />
      </div>
      <ScrollArea className="h-[60vh] rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-muted">
            <TableRow>
              <TableHead className="w-[150px]">Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell className="font-medium">{item.Tipo}</TableCell>
                  <TableCell>{item.Título}</TableCell>
                  <TableCell>{item.Descripción}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
