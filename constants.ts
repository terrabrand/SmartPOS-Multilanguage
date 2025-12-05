
import { Currency, CurrencyCode, TranslationDictionary, Ingredient, Table, Employee, Shift, Location, Organization, User, Product, Category, Customer, Transaction, TemplateProduct } from './types';

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  TZS: { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', rate: 2600, decimals: 0 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, decimals: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, decimals: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, decimals: 2 },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 130, decimals: 0 },
};

// --- SAAS MOCKS ---

export const MOCK_ORGS: Organization[] = [
  { id: 'org_1', name: 'Burger King Tz', slug: 'burger-king', ownerId: 'u_admin_1', plan: 'pro', createdAt: new Date().toISOString() },
  { id: 'org_2', name: 'Zanzibar Coffee House', slug: 'zan-coffee', ownerId: 'u_admin_2', plan: 'free', createdAt: new Date().toISOString() },
];

export const MOCK_USERS: User[] = [
  { id: 'u_super', name: 'Super Admin', email: 'super@smartpos.com', role: 'super_admin', organizationId: 'global', image: 'https://ui-avatars.com/api/?name=Super+Admin&background=000&color=fff' },
  { id: 'u_admin_1', name: 'Burger Admin', email: 'admin@burger.com', role: 'admin', organizationId: 'org_1', image: 'https://ui-avatars.com/api/?name=Burger+Admin&background=D9232D&color=fff' },
  { id: 'u_admin_2', name: 'Coffee Admin', email: 'admin@coffee.com', role: 'admin', organizationId: 'org_2', image: 'https://ui-avatars.com/api/?name=Coffee+Admin&background=795548&color=fff' },
];

export const MOCK_LOCATIONS: Location[] = [
  // Org 1
  { id: 'loc1_o1', organizationId: 'org_1', name: 'Posta Branch', address: 'Posta, Dar', phone: '+255 111', type: 'HQ', status: 'active' },
  { id: 'loc2_o1', organizationId: 'org_1', name: 'Mlimani City', address: 'Mlimani, Dar', phone: '+255 222', type: 'Branch', status: 'active' },
  // Org 2
  { id: 'loc1_o2', organizationId: 'org_2', name: 'Stone Town', address: 'Zanzibar', phone: '+255 333', type: 'HQ', status: 'active' },
];

export const MOCK_TEMPLATE_PRODUCTS: TemplateProduct[] = [
  // Starter Kit - Burgers
  { id: 'tp_1', name: 'Classic Burger', weight: '200g', price: 5.00, wholesalePrice: 2.00, image: 'https://picsum.photos/seed/tpl_burger/300/300', category: 'Starter Kit: Burgers' },
  { id: 'tp_2', name: 'Cheeseburger Deluxe', weight: '250g', price: 6.50, wholesalePrice: 2.50, image: 'https://picsum.photos/seed/tpl_chz/300/300', category: 'Starter Kit: Burgers' },
  { id: 'tp_3', name: 'Veggie Burger', weight: '180g', price: 5.50, wholesalePrice: 1.80, image: 'https://picsum.photos/seed/tpl_veg/300/300', category: 'Starter Kit: Burgers' },
  
  // Starter Kit - Cafe
  { id: 'tp_4', name: 'Latte', weight: '300ml', price: 3.50, wholesalePrice: 0.80, image: 'https://picsum.photos/seed/tpl_latte/300/300', category: 'Starter Kit: Cafe' },
  { id: 'tp_5', name: 'Iced Coffee', weight: '400ml', price: 4.00, wholesalePrice: 1.00, image: 'https://picsum.photos/seed/tpl_iced/300/300', category: 'Starter Kit: Cafe' },
  { id: 'tp_6', name: 'Blueberry Muffin', weight: '100g', price: 2.50, wholesalePrice: 0.50, image: 'https://picsum.photos/seed/tpl_muffin/300/300', category: 'Starter Kit: Cafe' },

  // Drinks
  { id: 'tp_7', name: 'Sparkling Water', weight: '500ml', price: 2.00, wholesalePrice: 0.50, image: 'https://picsum.photos/seed/tpl_water/300/300', category: 'Beverages' },
];

export const MOCK_PRODUCTS: Product[] = [
  // ORG 1 (Burgers)
  { id: 'p1_o1', organizationId: 'org_1', name: 'Cheeseburger', weight: '150 g', price: 3.50, wholesalePrice: 1.50, category: Category.BURGERS, image: 'https://picsum.photos/seed/burger1/300/300', recipe: [{ ingredientId: 'i1_o1', quantity: 1 }] },
  { id: 'p2_o1', organizationId: 'org_1', name: 'Fries', weight: '150 g', price: 2.50, wholesalePrice: 0.50, category: Category.SIDES, image: 'https://picsum.photos/seed/fries/300/300' },
  { id: 'p3_o1', organizationId: 'org_1', name: 'Cola', weight: '330 ml', price: 1.50, wholesalePrice: 0.40, category: Category.DRINKS, image: 'https://picsum.photos/seed/cola/300/300' },
  // ORG 2 (Coffee)
  { id: 'p1_o2', organizationId: 'org_2', name: 'Espresso', weight: '30 ml', price: 2.00, wholesalePrice: 0.50, category: Category.COFFEE, image: 'https://picsum.photos/seed/espresso/300/300' },
  { id: 'p2_o2', organizationId: 'org_2', name: 'Cappuccino', weight: '200 ml', price: 3.50, wholesalePrice: 1.00, category: Category.COFFEE, image: 'https://picsum.photos/seed/capp/300/300' },
  { id: 'p3_o2', organizationId: 'org_2', name: 'Croissant', weight: '80 g', price: 2.50, wholesalePrice: 0.80, category: Category.BAKERY, image: 'https://picsum.photos/seed/croissant/300/300' },
];

export const MOCK_INVENTORY: Ingredient[] = [
  // Org 1
  { id: 'i1_o1', organizationId: 'org_1', locationId: 'loc1_o1', name: 'Burger Bun', unit: 'pcs', quantity: 150, costPerUnit: 0.20, lowStockThreshold: 20 },
  { id: 'i2_o1', organizationId: 'org_1', locationId: 'loc1_o1', name: 'Beef Patty', unit: 'pcs', quantity: 80, costPerUnit: 1.00, lowStockThreshold: 15 },
  // Org 2
  { id: 'i1_o2', organizationId: 'org_2', locationId: 'loc1_o2', name: 'Coffee Beans', unit: 'kg', quantity: 10, costPerUnit: 15.00, lowStockThreshold: 2 },
  { id: 'i2_o2', organizationId: 'org_2', locationId: 'loc1_o2', name: 'Milk', unit: 'l', quantity: 20, costPerUnit: 1.20, lowStockThreshold: 5 },
];

export const MOCK_TABLES: Table[] = [
  // Org 1
  { id: 't1_o1', organizationId: 'org_1', locationId: 'loc1_o1', name: 'Table 1', seats: 4, status: 'available' },
  { id: 't2_o1', organizationId: 'org_1', locationId: 'loc1_o1', name: 'Table 2', seats: 2, status: 'occupied' },
  // Org 2
  { id: 't1_o2', organizationId: 'org_2', locationId: 'loc1_o2', name: 'Patio 1', seats: 4, status: 'available' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  // Org 1
  { id: 'e1_o1', organizationId: 'org_1', locationId: 'loc1_o1', name: 'Burger Admin', role: 'admin', pin: '1234', hourlyRate: 25.00, status: 'clocked-in', permissions: ['process_refund', 'void_order', 'manage_inventory'], image: 'https://ui-avatars.com/api/?name=Burger+Admin&background=D9232D&color=fff', email: 'admin@burger.com' },
  { id: 'e2_o1', organizationId: 'org_1', locationId: 'loc1_o1', name: 'John Cook', role: 'waiter', pin: '1111', hourlyRate: 15.00, status: 'clocked-out', permissions: [], image: 'https://ui-avatars.com/api/?name=John+Cook&background=random' },
  // Org 2
  { id: 'e1_o2', organizationId: 'org_2', locationId: 'loc1_o2', name: 'Coffee Admin', role: 'admin', pin: '1234', hourlyRate: 20.00, status: 'clocked-in', permissions: ['process_refund'], image: 'https://ui-avatars.com/api/?name=Coffee+Admin&background=795548&color=fff', email: 'admin@coffee.com' },
];

export const MOCK_SHIFTS: Shift[] = [
  { id: 's1', organizationId: 'org_1', employeeId: 'e1_o1', startTime: new Date(Date.now() - 28800000).toISOString(), endTime: new Date(Date.now() - 3600000).toISOString(), hoursWorked: 7 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', organizationId: 'org_1', name: 'Alice Freeman', email: 'alice@example.com', phone: '555-0101', balance: 0, image: 'https://ui-avatars.com/api/?name=Alice+Freeman&background=random' },
  { id: 'c2', organizationId: 'org_2', name: 'Bob CoffeeLover', email: 'bob@example.com', phone: '555-0102', balance: 10, image: 'https://ui-avatars.com/api/?name=Bob+C&background=random' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'tx1', organizationId: 'org_1', locationId: 'loc1_o1', date: new Date().toISOString(), type: 'income', category: 'Food Sales', amount: 50, description: 'Order #1', employeeId: 'e1_o1' },
    { id: 'tx2', organizationId: 'org_2', locationId: 'loc1_o2', date: new Date().toISOString(), type: 'income', category: 'Beverage Sales', amount: 15, description: 'Coffee Order', employeeId: 'e1_o2' },
];

export const TRANSLATIONS: TranslationDictionary = {
  'dashboard': { en: 'Dashboard', sw: 'Dashibodi' },
  'pos': { en: 'POS', sw: 'POS' },
  'menu': { en: 'Menu Management', sw: 'Usimamizi wa Menyu' },
  'customers': { en: 'Customers', sw: 'Wateja' },
  'accounting': { en: 'Accounting', sw: 'Uhasibu' },
  'inventory': { en: 'Inventory', sw: 'Bohari' },
  'tables': { en: 'Tables', sw: 'Meza' },
  'staff': { en: 'Staff & Roles', sw: 'Wafanyakazi' },
  'locations': { en: 'Locations', sw: 'Matawi' },
  'demo_content': { en: 'Demo Content', sw: 'Maudhui ya Demo' },
  'messages': { en: 'Messages', sw: 'Ujumbe' },
  'bills': { en: 'Bills', sw: 'Bili' },
  'settings': { en: 'Settings', sw: 'Mipangilio' },
  'notifications': { en: 'Notifications', sw: 'Arifa' },
  'support': { en: 'Support', sw: 'Msaada' },
  'other': { en: 'Other', sw: 'Nyingine' },
  'logged_in': { en: 'Logged in', sw: 'Umeingia' },
  'logout': { en: 'Logout', sw: 'Ondoka' },

  'search': { en: 'Search...', sw: 'Tafuta...' },
  'add_item': { en: 'Add Item', sw: 'Ongeza Bidhaa' },
  'edit_item': { en: 'Edit Item', sw: 'Hariri Bidhaa' },
  'close': { en: 'Close', sw: 'Funga' },
  'save': { en: 'Save', sw: 'Hifadhi' },
  'cancel': { en: 'Cancel', sw: 'Ghairi' },
  'delete': { en: 'Delete', sw: 'Futa' },
  'edit': { en: 'Edit', sw: 'Hariri' },
  'work_in_progress': { en: 'Work in Progress', sw: 'Inaendelea' },
  'not_implemented': { en: 'This module is not implemented in this demo.', sw: 'Moduli hii haijatekelezwa katika onyesho hili.' },

  'order_number': { en: 'Order', sw: 'Agizo' },
  'table': { en: 'Table', sw: 'Meza' },
  'walk_in_customer': { en: 'Walk-in Customer', sw: 'Mteja wa Kupita' },
  'due': { en: 'Due', sw: 'Inadaiwa' },
  'no_items': { en: 'No items added yet', sw: 'Hakuna bidhaa zilizoongezwa' },
  'subtotal': { en: 'Subtotal', sw: 'Jumla Ndogo' },
  'tax': { en: 'Tax', sw: 'Kodi' },
  'total': { en: 'Total', sw: 'Jumla' },
  'pay_now': { en: 'Pay Now (Cash/Card)', sw: 'Lipa Sasa (Pesa/Kadi)' },
  'charge_account': { en: 'Charge to Account', sw: 'Toza kwenye Akaunti' },
  'transaction_successful': { en: 'Transaction Successful!', sw: 'Muamala Umefaulu!' },
  'transaction_desc': { en: 'The order has been processed.', sw: 'Agizo limeshughulikiwa.' },
  'dine_in': { en: 'Dine In', sw: 'Kulia Hapa' },
  'take_out': { en: 'Take Out', sw: 'Ondoka Nalo' },
  'delivery': { en: 'Delivery', sw: 'Guletea' },
  'select_table': { en: 'Select Table', sw: 'Chagua Meza' },
  'select_location_first': { en: 'Select a location to continue', sw: 'Chagua tawi ili kuendelea' },
  'switch_org': { en: 'Viewing Organization', sw: 'Tazama Shirika' },

  'add_new_item': { en: 'Add New Item', sw: 'Ongeza Bidhaa Mpya' },
  'edit_product': { en: 'Edit Product', sw: 'Hariri Bidhaa' },
  'manage_menu': { en: 'Create, update and delete menu items', sw: 'Unda, sasisha na ufute bidhaa za menyu' },
  'item_name': { en: 'Item Name', sw: 'Jina la Bidhaa' },
  'retail_price': { en: 'Retail Price', sw: 'Bei ya Rejareja' },
  'wholesale_price': { en: 'Wholesale Price', sw: 'Bei ya Jumla' },
  'weight_size': { en: 'Weight/Size', sw: 'Uzito/Ukubwa' },
  'category': { en: 'Category', sw: 'Kategoria' },

  'manage_customers': { en: 'Manage customer details and credit balances', sw: 'Dhibiti maelezo ya wateja na salio' },
  'add_customer': { en: 'Add Customer', sw: 'Ongeza Mteja' },
  'search_customers': { en: 'Search customers...', sw: 'Tafuta wateja...' },
  'balance': { en: 'Balance', sw: 'Salio' },
  'full_name': { en: 'Full Name', sw: 'Jina Kamili' },
  'email': { en: 'Email', sw: 'Barua pepe' },
  'phone': { en: 'Phone', sw: 'Simu' },

  'track_financials': { en: "Track your restaurant's financial health", sw: 'Fuatilia afya ya kifedha ya mgahawa wako' },
  'add_transaction': { en: 'Add Transaction', sw: 'Ongeza Muamala' },
  'total_income': { en: 'Total Income', sw: 'Jumla ya Mapato' },
  'total_expenses': { en: 'Total Expenses', sw: 'Jumla ya Matumizi' },
  'net_profit': { en: 'Net Profit', sw: 'Faida Halisi' },
  'recent_transactions': { en: 'Recent Transactions', sw: 'Miamala ya Hivi Karibuni' },
  'income': { en: 'Income', sw: 'Mapato' },
  'expenses': { en: 'Expenses', sw: 'Matumizi' },
  'description': { en: 'Description', sw: 'Maelezo' },
  'date': { en: 'Date', sw: 'Tarehe' },
  'amount': { en: 'Amount', sw: 'Kiasi' },
  'no_transactions': { en: 'No transactions found.', sw: 'Hakuna miamala iliyopatikana.' },

  'manage_inventory': { en: 'Manage ingredients and stock levels', sw: 'Dhibiti viungo na viwango vya akiba' },
  'add_ingredient': { en: 'Add Ingredient', sw: 'Ongeza Kiungo' },
  'edit_ingredient': { en: 'Edit Ingredient', sw: 'Hariri Kiungo' },
  'stock_levels': { en: 'Stock Levels', sw: 'Viwango vya Akiba' },
  'low_stock': { en: 'Low Stock', sw: 'Akiba Kidogo' },
  'in_stock': { en: 'In Stock', sw: 'Ipo' },
  'restock': { en: 'Restock', sw: 'Jaza Akiba' },
  'waste': { en: 'Waste', sw: 'Uharibifu' },
  'add_stock': { en: 'Add Stock', sw: 'Ongeza Akiba' },
  'current_qty': { en: 'Current Qty', sw: 'Idadi ya Sasa' },
  'cost_per_unit': { en: 'Cost per Unit', sw: 'Gharama kwa Kizio' },
  'low_stock_threshold': { en: 'Low Stock Threshold', sw: 'Kiwango cha Chini cha Akiba' },
  'unit': { en: 'Unit', sw: 'Kizio' },
  'ingredients': { en: 'Ingredients', sw: 'Viungo' },
  'actions': { en: 'Actions', sw: 'Vitendo' },

  'manage_tables': { en: 'Manage restaurant tables and status', sw: 'Dhibiti meza za mgahawa na hali zao' },
  'add_table': { en: 'Add Table', sw: 'Ongeza Meza' },
  'edit_table': { en: 'Edit Table', sw: 'Hariri Meza' },
  'available': { en: 'Available', sw: 'Ipo Wazi' },
  'occupied': { en: 'Occupied', sw: 'Inatumika' },
  'reserved': { en: 'Reserved', sw: 'Imewekwa' },
  'dirty': { en: 'Dirty', sw: 'Chafu' },
  'seats': { en: 'seats', sw: 'viti' },
  'set_status': { en: 'Set Status', sw: 'Weka Hali' },
  'table_name': { en: 'Table Name', sw: 'Jina la Meza' },
  'seat_count': { en: 'Seat Count', sw: 'Idadi ya Viti' },

  'manage_staff': { en: 'Manage employees, roles, and shifts', sw: 'Dhibiti wafanyakazi, majukumu, na zamu' },
  'team_members': { en: 'Team Members', sw: 'Wanakikundi' },
  'shifts': { en: 'Shifts', sw: 'Zamu' },
  'performance': { en: 'Performance', sw: 'Utendaji' },
  'add_employee': { en: 'Add Employee', sw: 'Ongeza Mfanyakazi' },
  'edit_employee': { en: 'Edit Employee', sw: 'Hariri Mfanyakazi' },
  'add_shift': { en: 'Add Shift', sw: 'Ongeza Zamu' },
  'edit_shift': { en: 'Edit Shift', sw: 'Hariri Zamu' },
  'start_time': { en: 'Start Time', sw: 'Muda wa Kuanza' },
  'end_time': { en: 'End Time', sw: 'Muda wa Kumaliza' },
  'select_employee': { en: 'Select Employee', sw: 'Chagua Mfanyakazi' },
  'role': { en: 'Role', sw: 'Jukumu' },
  'clock_in': { en: 'Clock In', sw: 'Ingia Kazini' },
  'clock_out': { en: 'Clock Out', sw: 'Toka Kazini' },
  'hourly_rate': { en: 'Hourly Rate', sw: 'Kiwango kwa Saa' },
  'permissions': { en: 'Permissions', sw: 'Ruhusa' },
  'active_shift': { en: 'Active Shift', sw: 'Zamu Inayoendelea' },
  'completed_shifts': { en: 'Completed Shifts', sw: 'Zamu Zilizokamilika' },
  'total_hours': { en: 'Total Hours', sw: 'Jumla ya Saa' },
  'total_sales': { en: 'Total Sales', sw: 'Jumla ya Mauzo' },

  'manage_locations': { en: 'Manage multi-store locations', sw: 'Dhibiti matawi mengi' },
  'all_locations': { en: 'All Locations', sw: 'Matawi Yote' },
  'add_location': { en: 'Add Location', sw: 'Ongeza Tawi' },
  'edit_location': { en: 'Edit Location', sw: 'Hariri Tawi' },
  'active_staff': { en: 'Active Staff', sw: 'Wafanyakazi Waliopo' },
  'switch_location': { en: 'Switch Location', sw: 'Badili Tawi' },
  'address': { en: 'Address', sw: 'Anwani' },
  'type': { en: 'Type', sw: 'Aina' },
  'delete_location_confirm': { en: 'Are you sure you want to delete this location?', sw: 'Una uhakika unataka kufuta tawi hili?' },
  'confirm': { en: 'Confirm', sw: 'Thibitisha' },

  'demo_content_desc': { en: 'Import ready-made products to your menu', sw: 'Ingiza bidhaa zilizotengenezwa tayari kwenye menyu yako' },
  'add_template': { en: 'Add Template', sw: 'Ongeza Kiolezo' },
  'edit_template': { en: 'Edit Template', sw: 'Hariri Kiolezo' },
  'import': { en: 'Import', sw: 'Ingiza' },
  'import_group': { en: 'Import Group', sw: 'Ingiza Kundi' },
  'group_category': { en: 'Group / Category', sw: 'Kundi / Kategoria' },

  'app_settings': { en: 'App Settings', sw: 'Mipangilio ya Programu' },
  'customize_experience': { en: 'Customize your POS experience', sw: 'Badilisha uzoefu wako wa POS' },
  'general': { en: 'General', sw: 'Jumla' },
  'language': { en: 'Language', sw: 'Lugha' },
  'select_language': { en: 'Select your preferred language', sw: 'Chagua lugha unayopendelea' },
  'currency': { en: 'Currency', sw: 'Sarafu' },
  'select_currency': { en: 'Select default currency for prices', sw: 'Chagua sarafu chaguomsingi kwa bei' },
  'english': { en: 'English', sw: 'Kiingereza' },
  'swahili': { en: 'Swahili', sw: 'Kiswahili' },
  'sign_in': { en: 'Sign In', sw: 'Ingia' },
  'register': { en: 'Register', sw: 'Jisajili' },
  'welcome_back': { en: 'Welcome Back', sw: 'Karibu Tena' },
  'email_address': { en: 'Email Address', sw: 'Barua Pepe' },
  'password': { en: 'Password', sw: 'Nenosiri' },
  'demo_accounts': { en: 'Demo Accounts', sw: 'Akaunti za Demo' },
  'super_admin': { en: 'Super Admin', sw: 'Msimamizi Mkuu' },
  'create_account': { en: 'Create Account', sw: 'Unda Akaunti' },
  'organization_name': { en: 'Organization Name', sw: 'Jina la Shirika' },
};