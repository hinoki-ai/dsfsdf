import { Doc, Id, TableNames } from "convex/_generated/dataModel";

// Base types
export type ConvexId<T extends TableNames> = Id<T>;

// Category types
export interface Category {
  _id: ConvexId<"categories">;
  _creationTime: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  nameEs?: string;
  nameEn?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: number;
  updatedAt: number;
}

// Product types
export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface AlcoholData {
  abv: number;
  volume: number;
  volumeUnit: string;
  origin?: string;
  producer?: string;
  variety?: string;
  vintage?: number;
  agingProcess?: string;
}

export interface AgeRequirement {
  minimumAge: number;
  requiresVerification: boolean;
  legalNotice?: string;
}

export interface Inventory {
  quantity: number;
  reserved: number;
  lowStockThreshold: number;
  trackInventory: boolean;
}

export interface Product {
  _id: ConvexId<"products">;
  _creationTime: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  images: ProductImage[];
  categoryId: ConvexId<"categories">;
  alcoholData?: AlcoholData;
  ageRequirement: AgeRequirement;
  inventory: Inventory;
  isActive: boolean;
  isFeatured: boolean;
  nameEs?: string;
  nameEn?: string;
  descriptionEs?: string;
  descriptionEn?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: number;
  updatedAt: number;
}

// Cart types
export interface CartItem {
  productId: ConvexId<"products">;
  quantity: number;
  priceAtTime: number;
  addedAt: number;
}

export interface Cart {
  _id: ConvexId<"carts">;
  _creationTime: number;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  ageVerified: boolean;
  ageVerifiedAt?: number;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

// Order types
export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate?: string;
}

export interface OrderItem {
  productId: ConvexId<"products">;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot: {
    name: string;
    image: string;
    sku?: string;
    alcoholData?: {
      abv: number;
      volume: number;
      volumeUnit: string;
    };
  };
}

export interface ShippingAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  deliveryInstructions?: string;
}

export type OrderStatus =
  | "pending_payment"
  | "payment_confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface Order {
  _id: ConvexId<"orders">;
  _creationTime: number;
  orderNumber: string;
  userId?: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentReference?: string;
  ageVerified: boolean;
  ageVerifiedAt?: number;
  ageVerificationMethod?: string;
  deliveryDate?: number;
  deliveryTimeSlot?: string;
  deliveryPersonId?: string;
  customerNotes?: string;
  adminNotes?: string;
  trackingNumber?: string;
  createdAt: number;
  updatedAt: number;
}

// User Profile types
export interface UserAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserPreferences {
  language: string;
  currency: string;
  marketingEmails: boolean;
  ageVerified: boolean;
  ageVerifiedAt?: number;
}

export interface UserProfile {
  _id: ConvexId<"userProfiles">;
  _creationTime: number;
  userId: string;
  preferences: UserPreferences;
  addresses: UserAddress[];
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: number;
  createdAt: number;
  updatedAt: number;
}

// Age Verification types
export interface AgeVerification {
  _id: ConvexId<"ageVerifications">;
  _creationTime: number;
  userId?: string;
  sessionId?: string;
  method: string;
  verified: boolean;
  birthDate?: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: number;
  createdAt: number;
}

// Inventory Log types
export type InventoryLogType =
  | "adjustment"
  | "sale"
  | "return"
  | "damage"
  | "restock";

export interface InventoryLog {
  _id: ConvexId<"inventoryLogs">;
  _creationTime: number;
  productId: ConvexId<"products">;
  type: InventoryLogType;
  previousQuantity: number;
  newQuantity: number;
  changeAmount: number;
  reason?: string;
  orderId?: ConvexId<"orders">;
  adminId?: string;
  createdAt: number;
}

// Filter and search types
export interface ProductFilters {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  } | number[];
  alcoholRange?: {
    min: number;
    max: number;
  } | number[];
  origins?: string[];
  producers?: string[];
  varieties?: string[];
  inStock?: boolean;
  isFeatured?: boolean;
  searchTerm?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SortOption {
  field: "name" | "price" | "createdAt" | "rating";
  direction: "asc" | "desc";
}

// API Response types
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: ConvexId<"products">) => void;
  showQuickView?: boolean;
}

export interface CartItemProps {
  item: CartItem & { product: Product };
  onUpdateQuantity: (productId: ConvexId<"products">, quantity: number) => void;
  onRemove: (productId: ConvexId<"products">) => void;
}