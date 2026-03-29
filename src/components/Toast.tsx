import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-green-500/95 text-white' 
          : 'bg-red-500/95 text-white'
      }`}>
        {type === 'success' ? (
          <CheckCircle size={24} className="flex-shrink-0" />
        ) : (
          <XCircle size={24} className="flex-shrink-0" />
        )}
        <p className="font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white/20 p-1 rounded transition-colors flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;