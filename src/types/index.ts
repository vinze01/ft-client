export interface User {
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNo: number;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterInput {
  username: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
  contactNo: string;
  email: string;
  avatar?: File;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseInput {
  description: string;
  amount: number;
  category: string;
  date: string;
}

export type IncomeType = 'monthly' | 'yearly' | 'bi-monthly';
export type HalfMonth = 1 | 2;

export interface Income {
  id: number;
  amount: number;
  month: string | null;
  type: IncomeType;
  year: number;
  halfMonth: HalfMonth | null;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomeInput {
  amount: number;
  month?: string;
  type: IncomeType;
  year: number;
  halfMonth?: HalfMonth;
}

export type BudgetType = 'monthly' | 'yearly' | 'bi-monthly';

export interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string | null;
  type: BudgetType;
  year: number;
  halfMonth: HalfMonth | null;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetInput {
  category: string;
  amount: number;
  month?: string;
  type: BudgetType;
  year: number;
  halfMonth?: HalfMonth;
}

export type BudgetView = 'monthly' | 'yearly' | 'bi-monthly';

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  expensesByCategory: Record<string, number>;
  budgetStatus: BudgetStatus[];
  monthlyData: MonthlyData[];
  yearlyData: YearlyData[];
  biMonthlyData: BiMonthlyData[];
}

export interface BudgetStatus {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  type: BudgetType;
  period: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
}

export interface YearlyData {
  year: number;
  income: number;
  expenses: number;
}

export interface BiMonthlyData {
  halfMonth: number;
  month: string;
  year: number;
  label: string;
  income: number;
  expenses: number;
}