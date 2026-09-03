"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
const colors = {
  success: "bg-success/10 text-success border-success/20",
  error: "bg-error/10 text-error border-error/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-info/10 text-info border-info/20",
};

export default function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = icons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-right", colors[toast.type])}>
      <Icon size={20} />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="p-1 hover:opacity-70 cursor-pointer"><X size={16} /></button>
    </div>
  );
}
