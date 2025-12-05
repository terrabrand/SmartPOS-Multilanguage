
export const STORAGE_KEYS = {
  PRODUCTS: 'smartpos_products',
  CUSTOMERS: 'smartpos_customers',
  TRANSACTIONS: 'smartpos_transactions',
  SETTINGS: 'smartpos_settings',
  CART: 'smartpos_cart',
  INVENTORY: 'smartpos_inventory',
  TABLES: 'smartpos_tables',
  EMPLOYEES: 'smartpos_employees',
  SHIFTS: 'smartpos_shifts',
  LOCATIONS: 'smartpos_locations',
  TEMPLATE_PRODUCTS: 'smartpos_template_products',
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error loading ${key} from storage`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage`, error);
  }
};

export const clearStorage = () => {
    localStorage.clear();
};