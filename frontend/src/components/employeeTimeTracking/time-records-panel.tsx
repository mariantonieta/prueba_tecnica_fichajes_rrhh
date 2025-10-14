import React, { useState } from "react";
import { UserOut } from "../../services/users/userTypes";
import { TimeTrackingOut } from "../../services/timeTrackingServices";
import { Card, CardHeader, CardContent } from "../ui/card";
import { FilterButtons } from "./filter-buttons";
import { EmployeeProfileModal } from "./employee-perfil-modal";
import { useAuth } from "../../context/AuthContext";
import { PanelHeader } from "./panel-header"
import { PanelContent } from "./panel-content";

interface TimeRecordsPanelProps {
  selectedEmployee: UserOut | null;
  timeRecords: TimeTrackingOut[];
  recordsLoading: boolean;
  filterType: "all" | "CHECK_IN" | "CHECK_OUT";
  onFilterChange: (type: "all" | "CHECK_IN" | "CHECK_OUT") => void;
  onClearSelection: () => void;
  onViewProfile: () => void;
}

export function TimeRecordsPanel({
  selectedEmployee,
  timeRecords,
  recordsLoading,
  filterType,
  onFilterChange,
  onClearSelection,
  onViewProfile, 
}: TimeRecordsPanelProps) {
  const { role } = useAuth();
  const isRRHH = role === "RRHH";
  const [showProfileModal, setShowProfileModal] = useState(false);

  const filteredRecords =
    filterType === "all"
      ? timeRecords
      : timeRecords.filter((record) => record.record_type === filterType);

  return (
    <>
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <PanelHeader
              selectedEmployee={selectedEmployee}
              onClearSelection={onClearSelection}
            />

            {selectedEmployee && (
              <FilterButtons
                filterType={filterType}
                onFilterChange={onFilterChange}
                showViewProfile={true}
                onViewProfile={() => setShowProfileModal(true)}
              />
            )}
          </div>
        </CardHeader>

        <CardContent>
          <PanelContent
            selectedEmployee={selectedEmployee}
            recordsLoading={recordsLoading}
            filteredRecords={filteredRecords}
            filterType={filterType}
          />
        </CardContent>
      </Card>

      {showProfileModal && selectedEmployee && (
        <EmployeeProfileModal
          employee={selectedEmployee}
          onClose={() => setShowProfileModal(false)}
          isRRHH={isRRHH}
          onUpdate={onViewProfile} 
        />
      )}
    </>
  );
}