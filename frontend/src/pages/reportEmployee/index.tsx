import React, { useEffect, useState } from "react";
import {
  getMyBalance,
  listAllBalances,
  accrueMonthly,
  updateBalance,

} from "../../services/leaveBalanceServices";
import { LeaveBalance } from "../../services/leaveBalanceServices/leaveBalanceTypes";
import { useAuth } from "../../context/AuthContext"; 

const ReportEmployee: React.FC = () => {
  const { user } = useAuth(); 
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        if (user.role === "RRHH") {
          const data = await listAllBalances();
          setBalances(data);
        } else {
          const data = await getMyBalance();
          setBalances([data]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, [user]);

  const handleAccrue = async (userId: string) => {
    try {
      const updated = await accrueMonthly(userId);
      setBalances((prev) =>
        prev.map((b) => (b.user_id === userId ? updated : b))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdate = async (balanceId: string) => {
    const newDays = prompt("Introduce los días restantes:");
    if (!newDays) return;

    try {
      const updated = await updateBalance(balanceId, {
        remaining_days: parseFloat(newDays),
      });
      setBalances((prev) =>
        prev.map((b) => (b.id === balanceId ? updated : b))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Informes de Vacaciones</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Usuario</th>
            <th className="py-2 px-4 border">Tipo</th>
            <th className="py-2 px-4 border">Días restantes</th>
            <th className="py-2 px-4 border">Año</th>
            {user.role === "RRHH" && <th className="py-2 px-4 border">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {balances.map((b) => (
            <tr key={b.id} className="text-center">
              <td className="py-2 px-4 border">{b.user_name}</td>
              <td className="py-2 px-4 border">{b.leave_type}</td>
              <td className="py-2 px-4 border">{b.remaining_days.toFixed(2)}</td>
              <td className="py-2 px-4 border">{b.year}</td>
              {user.role === "RRHH" && (
                <td className="py-2 px-4 border space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    onClick={() => handleAccrue(b.user_id)}
                  >
                    Acumular
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleUpdate(b.id)}
                  >
                    Actualizar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportEmployee;
