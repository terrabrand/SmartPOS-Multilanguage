
export interface Organization {
  id: string;
  name: string;
  slug: string; // unique identifier for url or internal logic
  ownerId: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole | 'super_admin';
  organizationId: string; // 'global' for super_admin
  image?: string;
  token?: string; // Mock session token
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  weight: string;
  price: number;
  wholesalePrice: number; // Cost of goods
  image: string;
  category: string;
  recipe?: RecipeItem[]; // Ingredients required to make this product
}

export interface TemplateProduct {
  id: string;
  name: string;
  weight: string;
  price: number;
  wholesalePrice: number;
  image: string;
  category: string; // Used for grouping
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum Category {
  BURGERS = 'Burgers',
  DRINKS = 'Drinks',
  SIDES = 'Sides',
  DESSERTS = 'Desserts',
  COFFEE = 'Coffee', 
  BAKERY = 'Bakery'
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone: string;
  balance: number; // Amount they owe
  image: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  organizationId: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  description: string;
  customerId?: string;
  orderType?: OrderType;
  tableId?: string;
  employeeId?: string; // Who processed the transaction
  locationId: string; // Which branch
}

export type UserRole = 'admin' | 'cashier' | 'waiter';

export const INCOME_CATEGORIES = ['Food Sales', 'Beverage Sales', 'Catering', 'Events', 'Other'];
export const EXPENSE_CATEGORIES = ['Inventory', 'Cost of Goods Sold', 'Rent', 'Utilities', 'Salaries', 'Maintenance', 'Marketing', 'Waste'];

// --- Multi-Location Types ---

export interface Location {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  phone: string;
  type: 'HQ' | 'Branch' | 'Pop-up';
  status: 'active' | 'inactive';
}

// --- Inventory Types ---

export interface Ingredient {
  id: string;
  organizationId: string;
  locationId: string; // Stock is specific to a location
  name: string;
  unit: string;
  quantity: number;
  costPerUnit: number;
  lowStockThreshold: number;
}

// --- Table Management Types ---

export type OrderType = 'dine-in' | 'take-out' | 'delivery';

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'dirty';

export interface Table {
  id: string;
  organizationId: string;
  locationId: string;
  name: string;
  seats: number;
  status: TableStatus;
}

// --- Employee & Staff Management Types ---

export type EmployeeStatus = 'clocked-in' | 'clocked-out';

export type Permission = 'process_refund' | 'void_order' | 'apply_discount' | 'manage_inventory' | 'view_reports';

export interface Employee {
  id: string;
  organizationId: string;
  locationId: string; // Primary branch
  name: string;
  role: UserRole;
  pin: string;
  hourlyRate: number;
  status: EmployeeStatus;
  permissions: Permission[];
  image?: string;
  email?: string; // Added for login linkage
}

export interface Shift {
  id: string;
  organizationId: string;
  employeeId: string;
  startTime: string;
  endTime?: string;
  hoursWorked?: number;
}

// --- i18n and Settings Types ---

export type CurrencyCode = 'TZS' | 'USD' | 'EUR' | 'GBP' | 'KES';

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to base currency (USD)
  decimals: number;
}

export type LanguageCode = 'en' | 'sw';

export interface AppSettings {
  currency: CurrencyCode;
  language: LanguageCode;
}

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    sw: string;
  };
}