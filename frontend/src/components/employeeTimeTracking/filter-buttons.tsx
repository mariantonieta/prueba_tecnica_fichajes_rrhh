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
  const baseBadge =
    "cursor-pointer px-3 py-1.5 text-sm font-medium transition-all rounded-full border";
  const activeBadge = "bg-black text-white border-black";
  const inactiveBadge =
    "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100";

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full items-start sm:items-center">
      <div className="flex flex-wrap gap-2 flex-1">
        <span
          className={`${baseBadge} ${
            filterType === "all" ? activeBadge : inactiveBadge
          }`}
          onClick={() => onFilterChange("all")}
        >
          Todos
        </span>
      </div>

      {showViewProfile && onViewProfile && (
        <button
          onClick={onViewProfile}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto shrink-0 hover:bg-gray-800 transition"
        >
          Ver perfil
        </button>
      )}
    </div>
  );
}
