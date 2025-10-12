import React from "react";
import { Clock, Calendar, ArrowLeft } from "lucide-react";
import { UserOut } from "../../services/users/userTypes";
import { TimeTrackingOut } from "../../services/timeTrackingServices";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TimeRecordItem } from "./time-record-item";
import { FilterButtons } from "./filter-buttons";

interface TimeRecordsPanelProps {
  selectedEmployee: UserOut | null;
  timeRecords: TimeTrackingOut[];
  recordsLoading: boolean;
  filterType: "all" | "CHECK_IN" | "CHECK_OUT";
  onFilterChange: (type: "all" | "CHECK_IN" | "CHECK_OUT") => void;
  onClearSelection: () => void;
}

export function TimeRecordsPanel({
  selectedEmployee,
  timeRecords,
  recordsLoading,
  filterType,
  onFilterChange,
  onClearSelection,
}: TimeRecordsPanelProps) {
  const filteredRecords =
    filterType === "all"
      ? timeRecords
      : timeRecords.filter((record) => record.record_type === filterType);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <PanelHeader
            selectedEmployee={selectedEmployee}
            onClearSelection={onClearSelection}
          />
          {selectedEmployee && (
            <FilterButtons
              filterType={filterType}
              onFilterChange={onFilterChange}
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
  );
}

interface PanelHeaderProps {
  selectedEmployee: UserOut | null;
  onClearSelection: () => void;
}

function PanelHeader({ selectedEmployee, onClearSelection }: PanelHeaderProps) {
  return (
    <div>
      <CardTitle className="flex items-center gap-2">
        {selectedEmployee ? (
          <>
            <button
              onClick={onClearSelection}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            Historial de{" "}
            {selectedEmployee.full_name || selectedEmployee.username}
          </>
        ) : (
          "Selecciona un empleado"
        )}
      </CardTitle>
      <CardDescription>
        {selectedEmployee
          ? `Registros de fichaje - ${selectedEmployee.email}`
          : "Selecciona un empleado de la lista para ver su historial de fichajes"}
      </CardDescription>
    </div>
  );
}

interface PanelContentProps {
  selectedEmployee: UserOut | null;
  recordsLoading: boolean;
  filteredRecords: TimeTrackingOut[];
  filterType: "all" | "CHECK_IN" | "CHECK_OUT";
}

function PanelContent({
  selectedEmployee,
  recordsLoading,
  filteredRecords,
  filterType,
}: PanelContentProps) {
  if (!selectedEmployee) {
    return <NoEmployeeSelectedState />;
  }

  if (recordsLoading) {
    return <LoadingRecordsState />;
  }

  if (filteredRecords.length === 0) {
    return <EmptyRecordsState filterType={filterType} />;
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {filteredRecords
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .map((record) => (
          <TimeRecordItem key={record.id} record={record} />
        ))}
    </div>
  );
}

function NoEmployeeSelectedState() {
  return (
    <div className="text-center py-12">
      <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">
        Sin empleado seleccionado
      </h3>
      <p className="text-gray-500">
        Selecciona un empleado de la lista para ver su historial de fichajes
      </p>
    </div>
  );
}

function LoadingRecordsState() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

function EmptyRecordsState({ filterType }: { filterType: string }) {
  return (
    <div className="text-center py-12">
      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">
        No hay registros
      </h3>
      <p className="text-gray-500">
        {filterType === "all"
          ? "Este empleado no tiene fichajes registrados"
          : `No hay fichajes de ${
              filterType === "CHECK_IN" ? "entrada" : "salida"
            }`}
      </p>
    </div>
  );
}
