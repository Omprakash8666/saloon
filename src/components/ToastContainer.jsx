import React from 'react';
import { useSalon } from '../context/SalonContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useSalon();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = 'border-[#D4AF37]/40';
        let icon = <Info className="w-5 h-5 text-[#D4AF37] shrink-0" />;

        if (toast.type === 'success') {
          borderColor = 'border-emerald-500/50';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          borderColor = 'border-rose-500/50';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#14161E]/95 backdrop-blur-md shadow-2xl border ${borderColor} transition-all duration-300 animate-in slide-in-from-right-8`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium text-gray-200 leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors p-1 -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
