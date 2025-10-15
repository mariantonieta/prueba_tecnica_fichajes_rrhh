import { useState, useEffect } from "react";
import type { UserOut } from "../../services/users/userTypes";
import type { TimeTrackingOut } from "../../services/timeTrackingServices";
import { Card, CardHeader, CardContent } from "../ui/card";
import { FilterButtons } from "./filter-buttons";
import { PanelHeader } from "./panel-header";
import { PanelContent } from "./panel-content";
import { timeTrackingService } from "../../services/timeTrackingServices";
import { useAuth } from "../../context/AuthContext";

interface PaginatedRecords {
  total: number;
  count: number;
  limit: number;
  offset: number;
  results: TimeTrackingOut[];
}

interface TimeRecordsPanelProps {
  selectedEmployee: UserOut | null;
  recordsLoading: boolean;
  filterType: "all" | "CHECK_IN" | "CHECK_OUT";
  onFilterChange: (type: "all" | "CHECK_IN" | "CHECK_OUT") => void;
  onViewProfile: () => void;
}

export function TimeRecordsPanel({
  selectedEmployee,
  recordsLoading,
  filterType,
  onFilterChange,
  onViewProfile,
}: TimeRecordsPanelProps) {
  const { role } = useAuth();
  const isRRHH = role === "RRHH";

  const [paginatedRecords, setPaginatedRecords] = useState<PaginatedRecords>({
    total: 0,
    count: 0,
    limit: 10,
    offset: 0,
    results: [],
  });

  const fetchRecords = async (offset = 0) => {
    if (!selectedEmployee) return;
    try {
      const data = await timeTrackingService.getEmployeeRecords(
        selectedEmployee.id,
        {
          offset,
          limit: paginatedRecords.limit,
          type: filterType === "all" ? undefined : filterType,
        }
      );
      setPaginatedRecords(data);
    } catch (err) {
      console.error("Error fetching records", err);
    }
  };

  useEffect(() => {
    fetchRecords(0);
  }, [selectedEmployee, filterType]);

  const handlePageChange = (newOffset: number) => {
    fetchRecords(newOffset);
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3 flex justify-between items-center">
        <PanelHeader
          selectedEmployee={selectedEmployee}
          onClearSelection={() => {}}
        />
        {selectedEmployee && (
          <FilterButtons
            filterType={filterType}
            onFilterChange={onFilterChange}
            showViewProfile={true}
            onViewProfile={onViewProfile}
          />
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <PanelContent
          selectedEmployee={selectedEmployee}
          recordsLoading={recordsLoading}
          paginatedRecords={paginatedRecords}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
}
