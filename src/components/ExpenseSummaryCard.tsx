import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ExpenseSummaryCardProps {
  totalExpenses: number;
  budget: number;
  percentage: number;
}

const ExpenseSummaryCard: React.FC<ExpenseSummaryCardProps> = ({ 
  totalExpenses, 
  budget, 
  percentage 
}) => {
  const { t, language } = useTheme();
  
  const getColorClass = (): string => {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getTextColorClass = (): string => {
    if (percentage < 70) return 'text-green-600 dark:text-green-400';
    if (percentage < 90) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  const remaining = budget - totalExpenses;
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(num);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      {/* القسم العلوي */}
      <div className="mb-6">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          {t('totalExpenses')}
        </p>
        <p className="text-4xl font-bold text-blue-900 dark:text-blue-400">
          <span className="ltr-numbers">{formatNumber(totalExpenses)}</span>
          <span className="text-2xl mx-2">{t('currency')}</span>
        </p>
      </div>
      
      {/* شريط التقدم */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t('budgetUsage')}
          </span>
          <span className={`text-sm font-semibold ${getTextColorClass()}`}>
            <span className="ltr-numbers">{percentage.toFixed(1)}%</span>
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full ${getColorClass()} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      
      {/* القسم السفلي */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
            {t('remainingBudget')}
          </p>
          <p className={`text-xl font-semibold ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <span className="ltr-numbers">{formatNumber(remaining)}</span>
            <span className="mx-1">{t('currency')}</span>
          </p>
        </div>
        
        <div className={`w-12 h-12 rounded-full ${getColorClass()} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
          <svg className={`w-6 h-6 ${getTextColorClass()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummaryCard;