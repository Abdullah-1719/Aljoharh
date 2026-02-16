"use client";

import { useCallback, useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-dismiss
    const duration = toast.duration || 4000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast]);

  const handleDismiss = () => {
    setIsExiting(true);
    setIsVisible(false);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300); // Match animation duration
  };

  const icons = {
    success: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  };

  // Najdi desert theme colors - warm earth tones only
  const colors = {
    success: {
      bg: "bg-najdi-cream",
      border: "border-najdi-palm",
      icon: "text-najdi-palm",
      title: "text-najdi-text",
      message: "text-najdi-muted",
      iconBg: "bg-najdi-palm/10",
    },
    error: {
      bg: "bg-najdi-cream",
      border: "border-najdi-clay",
      icon: "text-najdi-clay",
      title: "text-najdi-text",
      message: "text-najdi-muted",
      iconBg: "bg-najdi-clay/10",
    },
    info: {
      bg: "bg-najdi-cream",
      border: "border-najdi-coffee",
      icon: "text-najdi-coffee",
      title: "text-najdi-text",
      message: "text-najdi-muted",
      iconBg: "bg-najdi-coffee/10",
    },
    warning: {
      bg: "bg-najdi-cream",
      border: "border-najdi-clay-light",
      icon: "text-najdi-clay",
      title: "text-najdi-text",
      message: "text-najdi-muted",
      iconBg: "bg-najdi-clay/10",
    },
  };

  const colorScheme = colors[toast.type];

  return (
    <div
      className={`
        ${colorScheme.bg} ${colorScheme.border}
        border-2 rounded-xl shadow-desert-md p-4 mb-3
        flex items-start gap-3 min-w-[300px] max-w-md
        transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
      `}
    >
      <div
        className={`flex-shrink-0 ${colorScheme.iconBg} ${colorScheme.icon} p-2 rounded-lg`}
      >
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${colorScheme.title}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className={`text-sm mt-1 ${colorScheme.message}`}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className={`flex-shrink-0 ${colorScheme.icon} hover:opacity-70 transition-opacity duration-200 p-1`}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Custom hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      duration?: number,
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastMessage = {
        id,
        type,
        title,
        message,
        duration,
      };
      setToasts((prev) => [...prev, newToast]);
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = (title: string, message?: string) => {
    showToast("success", title, message);
  };

  const error = (title: string, message?: string) => {
    showToast("error", title, message, 5000);
  };

  const info = (title: string, message?: string) => {
    showToast("info", title, message);
  };

  const warning = (title: string, message?: string) => {
    showToast("warning", title, message);
  };

  return {
    toasts,
    showToast,
    dismissToast,
    success,
    error,
    info,
    warning,
  };
}
