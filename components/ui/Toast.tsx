"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

let toastListeners: ((msg: ToastMessage) => void)[] = [];

export function showToast(type: ToastMessage["type"], message: string) {
  const msg: ToastMessage = { id: crypto.randomUUID(), type, message };
  toastListeners.forEach((fn) => fn(msg));
}

const config = {
  success: { bg: "bg-green-600", Icon: CheckCircle },
  error: { bg: "bg-red-600", Icon: XCircle },
  info: { bg: "bg-brand-600", Icon: Info },
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 4000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const { bg, Icon } = config[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[300px] text-white ${bg}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
