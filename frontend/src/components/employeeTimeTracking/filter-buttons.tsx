import React from "react";
import { Button } from "../ui/button";

interface FilterButtonsProps {
  filterType: "all" | "CHECK_IN" | "CHECK_OUT";
  onFilterChange: (type: "all" | "CHECK_IN" | "CHECK_OUT") => void;
  onViewProfile?: () => void;
  showViewProfile?: boolean;
}

export function FilterButtons({
  filterType,
  onFilterChange,
  onViewProfile,
  showViewProfile = false,
}: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center w-full">
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

      {showViewProfile && onViewProfile && (
        <div className="ml-auto sm:ml-0 sm:w-full sm:flex sm:justify-end">
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            onClick={onViewProfile}
          >
            Ver perfil
          </Button>
        </div>
      )}
    </div>
  );
}
