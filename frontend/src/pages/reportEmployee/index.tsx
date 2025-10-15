import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import {
  getMyBalance,
  listAllBalances,
} from "../../services/leaveBalanceServices";
import { LeaveBalance } from "../../services/leaveBalanceServices/leaveBalanceTypes";
import { LeaveBalanceTable } from "../../components/leaveBalance/leave-balance-table";
import { Skeleton } from "../../components/ui/skeleton";

const ReportEmployee: React.FC = () => {
  const { user, role, isLoading: authLoading } = useAuth();

  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user || !role) return;

    const fetchBalances = async () => {
      setLoading(true);
      setError("");
      try {
        //   console.log(" Fetching balances for user:", user);

        let data: LeaveBalance[] = [];

        if (role === "RRHH") {
          data = await listAllBalances();
        } else {
          const myBalance = await getMyBalance();
          console.log("📊 Balance recibido para usuario actual:", myBalance);

          if (myBalance) {
            data = [myBalance];
          }
        }

        //  console.log("Balances finales a mostrar:", data);
        // console.log("Número de balances:", data.length);
        setBalances(data);
      } catch (err: any) {
        //   console.error(" Error fetching balances:", err);
        setError(err?.message || "Error al cargar balances");
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [authLoading, user, role]);

  if (authLoading) {
    return (
      <div className="p-6 space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-red-500 font-medium">
        No hay usuario autenticado
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 font-medium">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Informes de Vacaciones</h1>
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-xl">Balance de Vacaciones</CardTitle>
          <CardDescription className="text-gray-600">
            {role === "RRHH"
              ? `Mostrando ${balances.length} empleados`
              : `Balance de ${user.full_name}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {balances.length > 0 ? (
            <LeaveBalanceTable balances={balances} isRRHH={role === "RRHH"} />
          ) : (
            <div className="text-center text-gray-500 p-8">
              No hay balances disponibles para mostrar
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportEmployee;
