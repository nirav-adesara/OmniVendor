import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2.5 px-4 py-2.5 bg-stone-900 text-white rounded-xl shadow-xl border border-stone-800 text-xs font-bold">
        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
