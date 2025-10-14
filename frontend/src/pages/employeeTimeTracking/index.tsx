import React, { useState, useEffect } from "react";
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
import { EmployeeProfileModal } from "../../components/employeeTimeTracking/employee-perfil-modal";
import { useAuth } from "../../context/AuthContext";

export default function EmployeeTimeTracking() {
  const { toast } = useToast();
  const { user: loggedUser, role } = useAuth();
  const isRRHH = role === "RRHH";

  const [employees, setEmployees] = useState<UserOut[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<UserOut | null>(null);
  const [timeRecords, setTimeRecords] = useState<TimeTrackingOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "CHECK_IN" | "CHECK_OUT">("all");
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

  const handleEmployeeUpdate = (updatedEmployee: UserOut) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );

    if (selectedEmployee && selectedEmployee.id === updatedEmployee.id) {
      setSelectedEmployee(updatedEmployee);
    }

    if (!updatedEmployee.is_active && selectedEmployee?.id === updatedEmployee.id) {
      setSelectedEmployee(null);
      setTimeRecords([]);
    }
  };

  const handleViewProfile = () => {
    setShowProfileModal(true);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

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
            onClearSelection={() => {
              setSelectedEmployee(null);
              setTimeRecords([]);
            }}
            onViewProfile={handleViewProfile} 
          />

          {showProfileModal && selectedEmployee && (
            <EmployeeProfileModal
              employee={selectedEmployee}
              onClose={() => setShowProfileModal(false)}
              isRRHH={isRRHH}
              onUpdate={handleEmployeeUpdate} 
            />
          )}
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