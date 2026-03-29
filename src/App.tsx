import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ExpenseSummaryCard from './components/ExpenseSummaryCard';
import ExpenseList from './components/ExpenseList';
import AddExpenseForm from './components/AddExpenseForm';
import CategoryChart from './components/CategoryChart';
import BudgetSetup from './components/BudgetSetup';
import Toast from './components/Toast';
import ConfirmDialog from './components/ConfirmDialog';
import ExportMenu from './components/ExportMenu';
import { expenseAPI, type Expense, type Category, type DashboardData } from './services/api';
import { RefreshCw, Trash2, Download , Wallet } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import EditExpenseModal from './components/EditExpenseModal';

function App() {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { t, isTransitioning } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };
  
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashData, expensesData, categoriesData] = await Promise.all([
        expenseAPI.getDashboard(),
        expenseAPI.getExpenses(),
        expenseAPI.getCategories(),
      ]);
      
      setDashboardData(dashData);
      setExpenses(expensesData);
      setCategories(categoriesData);
      
      // Check if budget is set
      if (!dashData.monthly_budget || dashData.monthly_budget === 0) {
        setShowBudgetSetup(true);
      }
      
    } catch (err: any) {
      setError(err.message || t('errorOccurred'));
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleAddExpense = async (expense: {
    category_id: number;
    amount: number;
    description: string;
    expense_date: string;
    receipt_image?: File;
  }) => {
    try {
      let receipt_image_path = null;
      
      // رفع الصورة أولاً لو موجودة
      if (expense.receipt_image) {
        const uploadResult = await expenseAPI.uploadReceipt(expense.receipt_image);
        if (uploadResult.success) {
          receipt_image_path = uploadResult.filename;
        }
      }
      
      // إضافة المصروف مع مسار الصورة
      await expenseAPI.addExpense({
        category_id: expense.category_id,
        amount: expense.amount,
        description: expense.description,
        expense_date: expense.expense_date,
        receipt_image: receipt_image_path || undefined,
      });
      
      await fetchData();
      showToast(t('addedSuccess'), 'success');
    } catch (err: any) {
      showToast(t('errorOccurred') + ': ' + err.message, 'error');
    }
  };
    
  const handleEditExpense = async (expense: {
  id: number;
  category_id: number;
  amount: number;
  description: string;
  expense_date: string;
}) => {
  try {
    await expenseAPI.updateExpense(expense);
    await fetchData();
    setEditingExpense(null);
    showToast(t('editedSuccess'), 'success');
  } catch (err: any) {
    showToast(t('errorOccurred') + ': ' + err.message, 'error');
  }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await expenseAPI.deleteExpense(id);
      await fetchData();
      showToast(t('deletedSuccess'), 'success');
    } catch (err: any) {
      showToast(t('errorOccurred') + ': ' + err.message, 'error');
    }
  };
  
  const handleAddCategory = async (category: { name: string; color: string }) => {
    try {
      const result = await expenseAPI.addCategory(category);
      if (result.success) {
        await fetchData();
        showToast(t('categoryAdded'), 'success');
      }
    } catch (err: any) {
      showToast(t('errorOccurred') + ': ' + err.message, 'error');
    }
  };
  
  const handleSetBudget = async (budget: number) => {
    try {
      await expenseAPI.updateBudget(budget);
      await fetchData();
      setShowBudgetSetup(false);
      showToast(t('saveBudget') + ' ✓', 'success');
    } catch (err: any) {
      showToast(t('errorOccurred') + ': ' + err.message, 'error');
    }
  };
  
  const handleClearData = async () => {
    try {
      const result = await expenseAPI.clearAllData();
      if (result.success) {
        await fetchData();
        setShowClearConfirm(false);
        showToast(t('clearDataSuccess'), 'success');
      }
    } catch (err: any) {
      showToast(t('errorOccurred') + ': ' + err.message, 'error');
      setShowClearConfirm(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">{t('loading')}</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t('error')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={20} />
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 language-transition ${isTransitioning ? 'transitioning' : ''}`}>
      <Navbar />
      
      {/* Edit Expense Modal */}
      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          categories={categories}
          onSave={handleEditExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
      {/* Budget Setup Modal */}
      {showBudgetSetup && (
        <BudgetSetup
          onSubmit={handleSetBudget}
          currentBudget={dashboardData?.monthly_budget || 0}
        />
      )}
      
      {/* Clear Data Confirm Dialog */}
      {showClearConfirm && (
        <ConfirmDialog
          title={t('clearDataTitle')}
          message={t('clearDataMessage')}
          confirmText={t('clearDataConfirm')}
          cancelText={t('clearDataCancel')}
          onConfirm={handleClearData}
          onCancel={() => setShowClearConfirm(false)}
          isDangerous={true}
        />
      )}
      
      {/* Export Menu Modal */}
      {showExportMenu && dashboardData && (
        <ExportMenu
          expenses={expenses}
          totalAmount={dashboardData.current_month_total}
          budgetAmount={dashboardData.monthly_budget}
          remainingBudget={dashboardData.remaining_budget}
          onClose={() => setShowExportMenu(false)}
        />
      )}
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t('appSubtitle')}
          </p>
          <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowBudgetSetup(true)}
            className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium flex items-center gap-2"
          >
            <Wallet size={16} />
            {t('setBudget')}
          </button>
            
            <button
              onClick={() => setShowExportMenu(true)}
              disabled={expenses.length === 0}
              className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              {t('export')}
            </button>
            
            <button
              onClick={() => setShowClearConfirm(true)}
              className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 text-sm font-medium flex items-center gap-2"
            >
              <Trash2 size={16} />
              {t('clearData')}
            </button>
            
            <button
              onClick={fetchData}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              title={t('refresh')}
            >
              <RefreshCw size={20} />
              <span className="hidden md:inline">{t('refresh')}</span>
            </button>
          </div>
        </div>
        
        {/* Budget Summary Card */}
        {dashboardData && (
          <div className="mb-8">
            <ExpenseSummaryCard
              totalExpenses={dashboardData.current_month_total}
              budget={dashboardData.monthly_budget}
              percentage={dashboardData.budget_percentage}
            />
          </div>
        )}
        
        {/* Add Expense Form + Category Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <AddExpenseForm
            categories={categories}
            onSubmit={handleAddExpense}
            onAddCategory={handleAddCategory}
          />
        {/* ✅ اظهر دايماً حتى لو مفيش بيانات */}
        <CategoryChart
          data={dashboardData?.by_category?.map(cat => ({
            name: cat.name,
            total: Number(cat.total),
            color: cat.color,
          })) || []}
        />
        </div>
        
        {/* Expense List */}
        <ExpenseList
          expenses={expenses.slice(0, 10)}
          onDelete={handleDeleteExpense}
          onEdit={setEditingExpense}
        />
      </div>
    </div>
  );
}

export default App;