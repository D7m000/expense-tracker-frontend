import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, X } from 'lucide-react';
import { exportToPDF, exportToExcel, exportToCSV } from '../utils/exportUtils';
// import { useTheme } from '../contexts/ThemeContext';

interface Expense {
  id: number;
  amount: string;
  description: string;
  expense_date: string;
  category_name: string;
  category_color: string;
}

interface ExportMenuProps {
  expenses: Expense[];
  totalAmount: number;
  budgetAmount: number;
  remainingBudget: number;
  onClose: () => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({
  expenses,
  totalAmount,
  budgetAmount,
  remainingBudget,
  onClose,
}) => {
  // const { t } = useTheme();
  const [exporting, setExporting] = useState(false);
  
  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (expenses.length === 0) {
      alert('No expenses to export!');
      return;
    }
    
    setExporting(true);
    
    try {
      const data = {
        expenses,
        totalAmount,
        budgetAmount,
        remainingBudget,
        month: getCurrentMonth()
      };
      
      switch (format) {
        case 'pdf':
          exportToPDF(data);
          break;
        case 'excel':
          exportToExcel(data);
          break;
        case 'csv':
          exportToCSV(data);
          break;
      }
      
      setTimeout(() => {
        onClose();
      }, 500);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-slide-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Download className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Export Expenses
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {expenses.length} expenses
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Export Options */}
          <div className="space-y-3">
            {/* PDF */}
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting || expenses.length === 0}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="text-white" size={24} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Export as PDF
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Professional report with table
                </p>
              </div>
              <Download size={20} className="text-gray-400" />
            </button>
            
            {/* Excel */}
            <button
              onClick={() => handleExport('excel')}
              disabled={exporting || expenses.length === 0}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="text-white" size={24} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Export as Excel
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Editable spreadsheet (.xlsx)
                </p>
              </div>
              <Download size={20} className="text-gray-400" />
            </button>
            
            {/* CSV */}
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting || expenses.length === 0}
              className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="text-white" size={24} />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Export as CSV
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Simple comma-separated file
                </p>
              </div>
              <Download size={20} className="text-gray-400" />
            </button>
          </div>
          
          {exporting && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preparing your export...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportMenu;