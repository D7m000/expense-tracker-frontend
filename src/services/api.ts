import axios from 'axios';

const API_BASE_URL = 'https://aliceblue-chamois-472576.hostingersite.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Expense {
  id: number;
  amount: string;
  description: string;
  expense_date: string;
  category_name: string;
  category_color: string;
  category_icon: string;
  receipt_image?: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  is_default: number;
}

export interface DashboardData {
  current_month_total: number;
  monthly_budget: number;
  remaining_budget: number;
  budget_percentage: number;
  by_category: {
    name: string;
    color: string;
    icon: string;
    total: string;
  }[];
  recent_expenses: Expense[];
}

export const expenseAPI = {
  
  getExpenses: async (): Promise<Expense[]> => {
    const response = await api.get('/get-expenses.php');
    return response.data.data;
  },

  
  addExpense: async (expense: {
    category_id: number;
    amount: number;
    description: string;
    expense_date: string;
    receipt_image?: string;
  }) => {
    const response = await api.post('/add-expense.php', expense);
    return response.data;
  },
  

  
  updateExpense: async (expense: {
    id: number;
    category_id?: number;
    amount?: number;
    description?: string;
    expense_date?: string;
  }) => {
    const response = await api.post('/update-expense.php', expense);
    return response.data;
  },

  deleteExpense: async (id: number) => {
    const response = await api.post('/delete-expense.php', { id });
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/get-categories.php');
    return response.data.data;
  },

  addCategory: async (category: {
    name: string;
    color: string;
    icon?: string;
  }) => {
    const response = await api.post('/add-category.php', category);
    return response.data;
  },

  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/get-dashboard.php');
    return response.data.data;
  },

  updateBudget: async (budget: number) => {
    const response = await api.post('/update-budget.php', { budget });
    return response.data;
  },

  // ✅ الدالة الجديدة
  clearAllData: async () => {
    const response = await api.post('/clear-data.php');
    return response.data;
  },

  uploadReceipt: async (file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/upload-receipt.php`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};