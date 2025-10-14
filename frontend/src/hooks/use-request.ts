import { useState, useEffect } from "react"
import { useToast } from "./use-toast" 

export function useRequests<T>(
  fetcher: () => Promise<T[]>,
  userField: keyof T = "user_id"
) {
  const { toast } = useToast()
  const [requests, setRequests] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetcher()
        setRequests(data)
      } catch (error: any) {
        console.error("Error cargando solicitudes:", error)
        toast({
          title: "Error al cargar solicitudes",
          description: error.message || "Intenta nuevamente",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [fetcher, toast])

  const updateStatus = (id: string, newStatus: string, comment?: string) => {
    setRequests((prev) =>
      prev.map((r: any) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              statusLabel: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
            }
          : r
      )
    )
  }

  return { requests, setRequests, loading, updateStatus }
}
