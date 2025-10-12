import React from "react";
import { Button } from "../ui/button";

interface FilterButtonsProps {
  filterType: "all" | "CHECK_IN" | "CHECK_OUT";
  onFilterChange: (type: "all" | "CHECK_IN" | "CHECK_OUT") => void;
}

export function FilterButtons({
  filterType,
  onFilterChange,
}: FilterButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={filterType === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("all")}
      >
        Todos
      </Button>
      <Button
        variant={filterType === "CHECK_IN" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("CHECK_IN")}
      >
        Entradas
      </Button>
      <Button
        variant={filterType === "CHECK_OUT" ? "default" : "outline"}
        size="sm"
        onClick={() => onFilterChange("CHECK_OUT")}
      >
        Salidas
      </Button>
    </div>
  );
}
