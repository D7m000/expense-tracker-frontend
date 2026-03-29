import { useState } from 'react';
import { DollarSign, Save } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface BudgetSetupProps {
  onSubmit: (budget: number) => void;
  currentBudget?: number;
}

const BudgetSetup: React.FC<BudgetSetupProps> = ({ onSubmit, currentBudget }) => {
  const { t } = useTheme();
  const [budget, setBudget] = useState(currentBudget?.toString() || '');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetNum = Number(budget);
    if (!budget || budgetNum <= 0) {
      setError('Budget must be greater than zero');
      return;
    }
    
    onSubmit(budgetNum);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-slide-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Set Your Monthly Budget
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            How much do you plan to spend this month?
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Budget ({t('currency')})
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                setError('');
              }}
              placeholder="5000"
              step="0.01"
              min="0"
              className={`w-full px-4 py-3 text-2xl font-bold text-center border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ltr-numbers ${
                error 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <Save size={20} />
            Save Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default BudgetSetup;