import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Expense {
  id: number;
  amount: string;
  description: string;
  expense_date: string;
  category_name: string;
  category_color: string;
}

interface ExportData {
  expenses: Expense[];
  totalAmount: number;
  budgetAmount: number;
  remainingBudget: number;
  month: string;
}

// ✅ تصدير PDF
export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  
  // العنوان
  doc.setFontSize(20);
  doc.text('Expense Report', 105, 20, { align: 'center' });
  
  // معلومات عامة
  doc.setFontSize(12);
  doc.text(`Period: ${data.month}`, 20, 35);
  doc.text(`Total Expenses: ${data.totalAmount.toFixed(2)} EGP`, 20, 45);
  doc.text(`Budget: ${data.budgetAmount.toFixed(2)} EGP`, 20, 55);
  doc.text(`Remaining: ${data.remainingBudget.toFixed(2)} EGP`, 20, 65);
  
  // جدول المصروفات
  const tableData = data.expenses.map((expense, index) => [
    index + 1,
    expense.expense_date,
    expense.category_name,
    expense.description || 'No description',
    `${parseFloat(expense.amount).toFixed(2)} EGP`
  ]);
  
  autoTable(doc, {
    head: [['#', 'Date', 'Category', 'Description', 'Amount']],
    body: tableData,
    startY: 75,
    theme: 'striped',
    headStyles: { 
      fillColor: [59, 130, 246],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 30 },
      2: { cellWidth: 35 },
      3: { cellWidth: 65 },
      4: { cellWidth: 35, halign: 'right' }
    }
  });
  
  // حفظ الملف
  const fileName = `Expenses_${data.month.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

// ✅ تصدير Excel
export const exportToExcel = (data: ExportData) => {
  // ورقة المعلومات العامة
  const summaryData = [
    ['Expense Report'],
    [''],
    ['Period', data.month],
    ['Total Expenses', data.totalAmount.toFixed(2) + ' EGP'],
    ['Budget', data.budgetAmount.toFixed(2) + ' EGP'],
    ['Remaining Budget', data.remainingBudget.toFixed(2) + ' EGP'],
    [''],
    ['#', 'Date', 'Category', 'Description', 'Amount (EGP)']
  ];
  
  // بيانات المصروفات
  const expensesData = data.expenses.map((expense, index) => [
    index + 1,
    expense.expense_date,
    expense.category_name,
    expense.description || 'No description',
    parseFloat(expense.amount).toFixed(2)
  ]);
  
  // دمج البيانات
  const allData = [...summaryData, ...expensesData];
  
  // إنشاء الملف
  const ws = XLSX.utils.aoa_to_sheet(allData);
  
  // تنسيق العرض
  ws['!cols'] = [
    { wch: 5 },  // #
    { wch: 15 }, // Date
    { wch: 20 }, // Category
    { wch: 40 }, // Description
    { wch: 15 }  // Amount
  ];
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses');
  
  // حفظ الملف
  const fileName = `Expenses_${data.month.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};

// ✅ تصدير CSV (بسيط)
export const exportToCSV = (data: ExportData) => {
  const headers = ['#', 'Date', 'Category', 'Description', 'Amount'];
  const rows = data.expenses.map((expense, index) => [
    index + 1,
    expense.expense_date,
    expense.category_name,
    expense.description || 'No description',
    parseFloat(expense.amount).toFixed(2)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const fileName = `Expenses_${data.month.replace(/\s+/g, '_')}.csv`;
  saveAs(blob, fileName);
};