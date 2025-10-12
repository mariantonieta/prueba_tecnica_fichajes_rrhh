import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";

interface ToastType {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "info";
}

interface ToastContextType {
  addToast: (toast: Omit<ToastType, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (toast: Omit<ToastType, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-80 p-4 rounded-lg shadow-lg flex flex-col space-y-1 text-white ${
              t.variant === "destructive"
                ? "bg-red-500"
                : t.variant === "success"
                ? "bg-green-500"
                : t.variant === "info"
                ? "bg-blue-500"
                : "bg-gray-800"
            } animate-slide-in`}
          >
            <div className="flex justify-between items-start">
              <strong className="font-semibold">{t.title}</strong>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-2 hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {t.description && <p className="text-sm">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return { toast: context.addToast };
};
