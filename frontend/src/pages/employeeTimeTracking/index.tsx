import { useState, useEffect } from "react";
import type { UserOut } from "../../services/users/userTypes";
import { userService } from "../../services/users/userService";
import {
  timeTrackingService,
  type TimeTrackingOut,
} from "../../services/timeTrackingServices";
import { useToast } from "../../hooks/use-toast";
import { Skeleton } from "../../components/ui/skeleton";
import { EmployeeList } from "../../components/employeeTimeTracking/employee-list";
import { TimeRecordsPanel } from "../../components/employeeTimeTracking/time-records-panel";
import { Header } from "../../components/employeeTimeTracking/header";
import { EmployeeProfileModal } from "../../components/employeeTimeTracking/employee-perfil-modal";
import { useAuth } from "../../context/AuthContext";

interface PaginatedRecords {
  total: number;
  count: number;
  limit: number;
  offset: number;
  results: TimeTrackingOut[];
}

export default function EmployeeTimeTracking() {
  const { toast } = useToast();
  const { user: loggedUser, role } = useAuth();
  const isRRHH = role === "RRHH";

  const [employees, setEmployees] = useState<UserOut[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<UserOut | null>(
    null
  );
  const [paginatedRecords, setPaginatedRecords] = useState<PaginatedRecords>({
    total: 0,
    count: 0,
    limit: 10,
    offset: 0,
    results: [],
  });
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "CHECK_IN" | "CHECK_OUT"
  >("all");
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  useEffect(() => {
    fetchEmployees();
  }, []);
  useEffect(() => {
    if (selectedEmployee) {
      fetchEmployeeRecords(selectedEmployee, 0);
    }
  }, [filterType]);

  const fetchEmployeeRecords = async (employee: UserOut, offset = 0) => {
    try {
      setRecordsLoading(true);
      const data = await timeTrackingService.getEmployeeRecords(employee.id, {
        offset,
        limit: paginatedRecords.limit,
        type: filterType === "all" ? undefined : filterType,
      });

      if (!selectedEmployee || selectedEmployee.id !== employee.id) {
        setSelectedEmployee(employee);
      }

      setPaginatedRecords(data);
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

  const handlePageChange = (newOffset: number) => {
    if (!selectedEmployee) return;
    fetchEmployeeRecords(selectedEmployee, newOffset);
  };

  const handleEmployeeUpdate = async (updatedEmployee: UserOut) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );

    if (selectedEmployee?.id === updatedEmployee.id) {
      setSelectedEmployee(updatedEmployee);
      try {
        await fetchEmployeeRecords(updatedEmployee, 0);
      } catch (err) {
        console.error("Error refreshing records:", err);
      }
    }

    if (
      !updatedEmployee.is_active &&
      selectedEmployee?.id === updatedEmployee.id
    ) {
      setSelectedEmployee(null);
      setPaginatedRecords({
        total: 0,
        count: 0,
        limit: 10,
        offset: 0,
        results: [],
      });
    }

    await fetchEmployees();
  };

  const handleCloseModal = () => setShowProfileModal(false);

  const filteredEmployees = employees.filter(
    (e) =>
      e.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSkeleton />;

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
            onEmployeeSelect={(emp) => fetchEmployeeRecords(emp, 0)}
          />

          <TimeRecordsPanel
            selectedEmployee={selectedEmployee}
            recordsLoading={recordsLoading}
            filterType={filterType}
            onFilterChange={setFilterType}
            onClearSelection={() => {
              setSelectedEmployee(null);
              setPaginatedRecords({
                total: 0,
                count: 0,
                limit: 10,
                offset: 0,
                results: [],
              });
            }}
            onPageChange={handlePageChange}
            onViewProfile={() => setShowProfileModal(true)}
          />
        </div>
      </div>

      {showProfileModal && selectedEmployee && (
        <EmployeeProfileModal
          open={showProfileModal}
          employee={selectedEmployee}
          isRRHH={isRRHH}
          onUpdate={handleEmployeeUpdate}
          onClose={handleCloseModal}
        />
      )}
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
