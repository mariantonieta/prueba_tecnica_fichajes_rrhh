import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { UserOut } from "../../services/users/userTypes";
import { userService } from "../../services/users/userService";
import {
  timeTrackingService,
  TimeTrackingOut,
} from "../../services/timeTrackingServices";
import { useToast } from "../../hooks/use-toast";
import { Skeleton } from "../../components/ui/skeleton";
import { EmployeeList } from "../../components/employeeTimeTracking/employee-list";
import { TimeRecordsPanel } from "../../components/employeeTimeTracking/time-records-panel";
import { Header } from "../../components/employeeTimeTracking/header";

export default function EmployeeTimeTracking() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<UserOut[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<UserOut | null>(
    null
  );
  const [timeRecords, setTimeRecords] = useState<TimeTrackingOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [filterType, setFilterType] = useState<
    "all" | "CHECK_IN" | "CHECK_OUT"
  >("all");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const users = await userService.getAllEmployees();
        const employeesOnly = users.filter(
          (user) => user.role === "EMPLOYEE" && user.is_active
        );
        setEmployees(employeesOnly);
      } catch (error: any) {
        toast({
          title: "Error al cargar empleados",
          description: error.message || "No se pudieron cargar los empleados",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const fetchEmployeeRecords = async (employee: UserOut) => {
    try {
      setRecordsLoading(true);
      const records = await timeTrackingService.getEmployeeRecords(employee.id);
      setTimeRecords(records);
      setSelectedEmployee(employee);
    } catch (error: any) {
      toast({
        title: "Error al cargar registros",
        description: error.message || "No se pudieron cargar los fichajes",
        variant: "destructive",
      });
    } finally {
      setRecordsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <EmployeeList
            employees={filteredEmployees}
            selectedEmployee={selectedEmployee}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onEmployeeSelect={fetchEmployeeRecords}
          />

          <TimeRecordsPanel
            selectedEmployee={selectedEmployee}
            timeRecords={timeRecords}
            recordsLoading={recordsLoading}
            filterType={filterType}
            onFilterChange={setFilterType}
            onClearSelection={() => setSelectedEmployee(null)}
          />
        </div>
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="mx-auto max-w-7xl px-6">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-96" />
        <Skeleton className="h-96 lg:col-span-2" />
      </div>
    </div>
  </div>
);
