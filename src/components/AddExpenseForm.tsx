import { useState } from 'react';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface AddExpenseFormProps {
  categories: Category[];
  onSubmit: (expense: {
    category_id: number;
    amount: number;
    description: string;
    expense_date: string;
    receipt_image?: File;
  }) => void;
  onAddCategory?: (category: { name: string; color: string }) => void;
  onClose?: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ 
  categories, 
  onSubmit,
  onAddCategory,
  onClose 
}) => {
  const { t } = useTheme();
  
  const [formData, setFormData] = useState({
    category_id: categories[0]?.id || 0,
    amount: '',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
  });
  
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  
  const [showAddCategory, setShowAddCategory] = useState(categories.length === 0);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#667eea',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // التحقق من حجم الملف (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setReceiptImage(file);
      
      // إنشاء معاينة
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setReceiptImage(null);
    setReceiptPreview(null);
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (categories.length === 0) {
      newErrors.category = 'Please add a category first';
      return false;
    }
    
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = t('amountError');
    }
    
    if (!formData.expense_date) {
      newErrors.expense_date = t('dateError');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      category_id: Number(formData.category_id),
      amount: Number(formData.amount),
      description: formData.description,
      expense_date: formData.expense_date,
      receipt_image: receiptImage || undefined,
    });
    
    // إعادة تعيين النموذج
    setFormData({
      category_id: categories[0]?.id || 0,
      amount: '',
      description: '',
      expense_date: new Date().toISOString().split('T')[0],
    });
    setReceiptImage(null);
    setReceiptPreview(null);
  };
  
  const handleAddNewCategory = () => {
    if (newCategory.name.trim() && onAddCategory) {
      onAddCategory(newCategory);
      setNewCategory({ name: '', color: '#667eea' });
      setShowAddCategory(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <style>
        {`
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
          
          input:focus,
          select:focus,
          textarea:focus,
          button:focus {
            outline: none !important;
          }
        `}
      </style>
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Plus className="text-blue-600 dark:text-blue-400" />
          {t('addExpense')}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* رسالة لو مفيش فئات */}
        {categories.length === 0 && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  {t('noCategoriesYet')}
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {t('addFirstCategory')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Category Selection */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('category')}
            </label>
            <div className="flex gap-2">
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {onAddCategory && (
                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Add new category"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Add New Category Section */}
        {showAddCategory && onAddCategory && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg space-y-3 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🏷️</span>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {categories.length === 0 ? t('addYourFirstCategory') : t('addNewCategory')}
              </h3>
            </div>
            
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('categoryNamePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {t('pickColor')}
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
              </div>
              
              <div className="flex-shrink-0">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {t('preview')}
                </label>
                <div 
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
                  style={{ backgroundColor: newCategory.color }}
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 invisible">
                  {t('action')}
                </label>
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  disabled={!newCategory.name.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  ✓ {t('add')}
                </button>
              </div>
            </div>
            
            {categories.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                {t('cancel')}
              </button>
            )}
          </div>
        )}
        
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">⚠️ {errors.category}</p>
        )}
        
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('amount')} ({t('currency')})
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            step="1"
            min="0"
            disabled={categories.length === 0}
            className={`w-full px-4 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ltr-numbers disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>
        
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('date')}
          </label>
          <input
            type="date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            disabled={categories.length === 0}
            className={`w-full px-4 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.expense_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.expense_date && (
            <p className="text-red-500 text-sm mt-1">{errors.expense_date}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('descriptionOptional')}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('descriptionPlaceholder')}
            rows={3}
            disabled={categories.length === 0}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
        
        {/* Receipt Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('receiptImageOptional')}
          </label>
          
          {!receiptPreview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{t('clickToUpload')}</span> {t('dragAndDrop')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, WEBP ({t('maxSize')})
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={categories.length === 0}
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={receiptPreview}
                alt="Receipt preview"
                className="w-full h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                <ImageIcon size={16} />
                {receiptImage?.name}
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={categories.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        >
          <Plus size={20} />
          {t('addButton')}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;