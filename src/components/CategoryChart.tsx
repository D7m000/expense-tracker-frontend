import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';

interface CategoryData {
  name: string;
  total: number;
  color: string;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const { t, language } = useTheme();
  
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
          {t('noData')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {t('noDataDesc')}
        </p>
      </div>
    );
  }
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US').format(num);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{payload[0].name}</p>
          <p className="text-gray-600 dark:text-gray-300 ltr-numbers">
            {formatNumber(payload[0].value)} {t('currency')}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom Label مع دعم العربية
  const renderCustomLabel = (entry: any) => {
    const percent = entry.percent || 0;
    const percentage = (percent * 100).toFixed(0);
    
    // عرض النسبة فقط بدون اسم الفئة لتجنب التداخل
    return `${percentage}%`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t('expensesByCategory')}
      </h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend منفصل أسفل الرسم البياني */}
      <div className="mt-6 space-y-3">
        {data.map((category, index) => {
          const totalSum = data.reduce((sum, item) => sum + item.total, 0);
          const percentage = totalSum > 0 ? ((category.total / totalSum) * 100).toFixed(0) : '0';
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {category.name}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  ({percentage}%)
                </span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold ltr-numbers">
                {formatNumber(category.total)} {t('currency')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;