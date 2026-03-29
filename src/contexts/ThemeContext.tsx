import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Language = 'ar' | 'en';

interface Translations {
  [key: string]: string;
}

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  ar: {
    appTitle: 'متتبع المصروفات الشخصية',
    appSubtitle: 'تتبع مصروفاتك وحقق أهدافك المالية',
    refresh: 'تحديث',
    totalExpenses: 'إجمالي المصروفات',
    budgetUsage: 'استخدام الميزانية',
    remainingBudget: 'المتبقي من الميزانية',
    addExpense: 'إضافة مصروف جديد',
    category: 'الفئة',
    amount: 'المبلغ',
    date: 'التاريخ',
    description: 'الوصف',
    descriptionOptional: 'الوصف (اختياري)',
    descriptionPlaceholder: 'مثال: غداء في المطعم',
    amountPlaceholder: '0.00',
    currency: 'ج.م',
    addButton: 'إضافة المصروف',
    expensesByCategory: 'المصروفات حسب الفئة',
    recentExpenses: 'آخر المصروفات',
    noExpenses: 'لا توجد مصروفات حتى الآن',
    noExpensesDesc: 'ابدأ بإضافة أول مصروف لك!',
    noData: 'لا توجد بيانات لعرضها',
    noDataDesc: 'أضف بعض المصروفات لرؤية الإحصائيات',
    loading: 'جاري تحميل البيانات...',
    error: 'حدث خطأ',
    retry: 'إعادة المحاولة',
    delete: 'حذف',
    edit: 'تعديل',
    confirmDelete: 'هل أنت متأكد من حذف هذا المصروف؟',
    addedSuccess: 'تم إضافة المصروف بنجاح!',
    deletedSuccess: 'تم حذف المصروف بنجاح!',
    errorOccurred: 'حدث خطأ',
    amountError: 'المبلغ يجب أن يكون أكبر من صفر',
    dateError: 'التاريخ مطلوب',
    noDescription: 'بدون وصف',
    setBudget: 'تحديد الميزانية',
    monthlyBudget: 'الميزانية الشهرية',
    saveBudget: 'حفظ الميزانية',
    budgetSetupTitle: 'حدد ميزانيتك الشهرية',
    budgetSetupDesc: 'كم تخطط للإنفاق هذا الشهر؟',
    addCategory: 'إضافة فئة جديدة',
    categoryName: 'اسم الفئة',
    categoryColor: 'لون الفئة',
    categoryAdded: 'تم إضافة الفئة بنجاح!',
    clearData: 'مسح البيانات',
    clearDataTitle: 'مسح جميع البيانات؟',
    clearDataMessage: 'سيتم حذف جميع المصروفات والفئات وإعادة تعيين الميزانية إلى الصفر بشكل دائم. لا يمكن التراجع عن هذا الإجراء!',
    clearDataConfirm: 'نعم، امسح كل شيء',
    clearDataCancel: 'إلغاء',
    clearDataSuccess: 'تم مسح جميع البيانات بنجاح!',
    export: 'تصدير',
    // الترجمات الجديدة
    noCategoriesYet: 'لا توجد فئات حتى الآن!',
    addFirstCategory: 'يرجى إضافة فئتك الأولى أدناه لبدء تتبع المصروفات',
    addYourFirstCategory: 'أضف فئتك الأولى',
    addNewCategory: 'إضافة فئة جديدة',
    categoryNamePlaceholder: 'اسم الفئة (مثال: طوارئ، طعام، مواصلات)',
    pickColor: 'اختر لوناً',
    preview: 'معاينة',
    action: 'إجراء',
    add: 'إضافة',
    cancel: 'إلغاء',
    receiptImageOptional: 'صورة الإيصال (اختياري)',
    clickToUpload: 'انقر للرفع',
    dragAndDrop: 'أو اسحب وأفلت',
    maxSize: 'الحد الأقصى 5 ميجابايت',
    receipt: 'إيصال',
    editExpense: 'تعديل المصروف',
    save: 'حفظ',
    editedSuccess: 'تم تعديل المصروف بنجاح!',
  },
  en: {
    appTitle: 'Personal Expense Tracker',
    appSubtitle: 'Track your expenses and achieve your financial goals',
    refresh: 'Refresh',
    totalExpenses: 'Total Expenses',
    budgetUsage: 'Budget Usage',
    remainingBudget: 'Remaining Budget',
    addExpense: 'Add New Expense',
    category: 'Category',
    amount: 'Amount',
    date: 'Date',
    description: 'Description',
    descriptionOptional: 'Description (Optional)',
    descriptionPlaceholder: 'e.g., Lunch at restaurant',
    amountPlaceholder: '0.00',
    currency: 'EGP',
    addButton: 'Add Expense',
    expensesByCategory: 'Expenses by Category',
    recentExpenses: 'Recent Expenses',
    noExpenses: 'No expenses yet',
    noExpensesDesc: 'Start by adding your first expense!',
    noData: 'No data to display',
    noDataDesc: 'Add some expenses to see statistics',
    loading: 'Loading data...',
    error: 'An error occurred',
    retry: 'Retry',
    delete: 'Delete',
    edit: 'Edit',
    confirmDelete: 'Are you sure you want to delete this expense?',
    addedSuccess: 'Expense added successfully!',
    deletedSuccess: 'Expense deleted successfully!',
    errorOccurred: 'An error occurred',
    amountError: 'Amount must be greater than zero',
    dateError: 'Date is required',
    noDescription: 'No description',
    setBudget: 'Set Budget',
    monthlyBudget: 'Monthly Budget',
    saveBudget: 'Save Budget',
    budgetSetupTitle: 'Set Your Monthly Budget',
    budgetSetupDesc: 'How much do you plan to spend this month?',
    addCategory: 'Add New Category',
    categoryName: 'Category Name',
    categoryColor: 'Category Color',
    categoryAdded: 'Category added successfully!',
    clearData: 'Clear Data',
    clearDataTitle: 'Clear All Data?',
    clearDataMessage: 'This will permanently delete all your expenses, categories, and reset your budget to zero. This action cannot be undone!',
    clearDataConfirm: 'Yes, Clear Everything',
    clearDataCancel: 'Cancel',
    clearDataSuccess: 'All data cleared successfully!',
    export: 'Export',
    noCategoriesYet: 'No categories yet!',
    addFirstCategory: 'Please add your first category below to start tracking expenses',
    addYourFirstCategory: 'Add Your First Category',
    addNewCategory: 'Add New Category',
    categoryNamePlaceholder: 'Category name (e.g., Emergency, Food, Transport)',
    pickColor: 'Pick a color',
    preview: 'Preview',
    action: 'Action',
    add: 'Add',
    cancel: 'Cancel',
    receiptImageOptional: 'Receipt Image (Optional)',
    clickToUpload: 'Click to upload',
    dragAndDrop: 'or drag and drop',
    maxSize: 'MAX. 5MB',
    receipt: 'Receipt',
    editExpense: 'Edit Expense',
    save: 'Save',
    editedSuccess: 'Expense updated successfully!',
  },
};
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLanguage = localStorage.getItem('language') as Language;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage) setLanguage(savedLanguage);
  }, []);
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('language', language);
  }, [language]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const toggleLanguage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 150);
  };
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <ThemeContext.Provider value={{ theme, language, toggleTheme, toggleLanguage, t, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};