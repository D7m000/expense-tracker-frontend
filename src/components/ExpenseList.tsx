import { Trash2, Edit2, Image as ImageIcon, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

interface Expense {
  id: number;
  amount: string;
  description: string;
  expense_date: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  receipt_image?: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
  onEdit?: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, onEdit }) => {
  const { t, language } = useTheme();
  const [imageModal, setImageModal] = useState<string | null>(null);
  
  const formatNumber = (num: string | number): string => {
    try {
      const numValue = typeof num === 'string' ? parseFloat(num) : num;
      if (isNaN(numValue)) return '0';
      return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(numValue);
    } catch {
      return '0';
    }
  };
  
  const formatDate = (dateString: string | null | undefined): string => {
    try {
      if (!dateString) {
        return language === 'ar' ? 'بدون تاريخ' : 'No date';
      }
      
      let dateObj: Date;
      
      if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        dateObj = new Date(dateString);
      }
      
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date:', dateString);
        return dateString.toString();
      }
      
      return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
      
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString);
      return dateString ? dateString.toString() : '';
    }
  };
  
  const getReceiptImageUrl = (filename: string) => {
    return `http://localhost/expense-tracker/uploads/${filename}`;
  };
  
  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          {t('noExpenses')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {t('noExpensesDesc')}
        </p>
      </div>
    );
  }
  
  return (
    <>
      {/* Image Modal */}
      {imageModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setImageModal(null)}
        >
          <button
            onClick={() => setImageModal(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={imageModal}
            alt="Receipt"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t('recentExpenses')}
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {expenses.map((expense) => (
            <div 
              key={expense.id}
              className="p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
                {/* القسم الأيمن - التفاصيل */}
                <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 w-full md:w-auto">
                  {/* أيقونة الفئة */}
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0"
                    style={{ backgroundColor: expense.category_color || '#6B7280' }}
                  >
                    {expense.category_icon === 'utensils' && '🍽️'}
                    {expense.category_icon === 'car' && '🚗'}
                    {expense.category_icon === 'file-text' && '📄'}
                    {expense.category_icon === 'smile' && '🎉'}
                    {expense.category_icon === 'heart' && '❤️'}
                    {expense.category_icon === 'shopping-bag' && '🛍️'}
                    {expense.category_icon === 'book' && '📚'}
                    {expense.category_icon === 'more-horizontal' && '📌'}
                    {!expense.category_icon && '💰'}
                  </div>
                  
                  {/* التفاصيل */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white">
                        {expense.description || t('noDescription')}
                      </h3>
                      <span 
                        className="px-2 md:px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: expense.category_color || '#6B7280' }}
                      >
                        {expense.category_name || 'Other'}
                      </span>
                      
                      {/* أيقونة الصورة */}
                      {expense.receipt_image && (
                        <button
                          onClick={() => setImageModal(getReceiptImageUrl(expense.receipt_image!))}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <ImageIcon size={14} />
                          {t('receipt')}
                        </button>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(expense.expense_date)}
                    </p>
                  </div>
                </div>
                
                {/* القسم الأيسر - المبلغ والأزرار */}
                <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 w-full md:w-auto">
                  {/* المبلغ */}
                  <div className="text-left md:text-right">
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white ltr-numbers">
                      {formatNumber(expense.amount)}
                      <span className="text-sm md:text-base text-gray-600 dark:text-gray-400 mx-1">
                        {t('currency')}
                      </span>
                    </p>
                  </div>
                  
                  {/* الأزرار */}
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* معاينة صغيرة للصورة */}
              {expense.receipt_image && (
                <div className="mt-3 ml-12 md:ml-16">
                  <button
                    onClick={() => setImageModal(getReceiptImageUrl(expense.receipt_image!))}
                    className="relative group"
                  >
                    <img
                      src={getReceiptImageUrl(expense.receipt_image)}
                      alt="Receipt thumbnail"
                      className="h-20 w-20 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <ImageIcon className="text-white" size={24} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExpenseList;