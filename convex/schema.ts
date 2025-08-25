import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// Define the database schema for the liquor store
export default defineSchema({
  // Product Categories
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.boolean(),
    sortOrder: v.number(),
    // Localized fields for i18n
    nameEs: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    descriptionEs: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_active", ["isActive"])
    .index("by_sort_order", ["sortOrder"]),

  // Products
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    costPrice: v.optional(v.number()),
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
    
    // Product images
    images: v.array(v.object({
      url: v.string(),
      alt: v.string(),
      isPrimary: v.boolean(),
    })),
    
    // Category relationship
    categoryId: v.id("categories"),
    
    // Alcohol-specific data
    alcoholData: v.optional(v.object({
      abv: v.number(), // Alcohol by volume
      volume: v.number(),
      volumeUnit: v.string(), // ml, cl, l
      origin: v.optional(v.string()),
      producer: v.optional(v.string()),
      variety: v.optional(v.string()), // For wines
      vintage: v.optional(v.number()), // For wines
      agingProcess: v.optional(v.string()),
    })),
    
    // Age verification requirements (Chilean law compliance)
    ageRequirement: v.object({
      minimumAge: v.number(),
      requiresVerification: v.boolean(),
      legalNotice: v.optional(v.string()),
    }),
    
    // Inventory management
    inventory: v.object({
      quantity: v.number(),
      reserved: v.number(),
      lowStockThreshold: v.number(),
      trackInventory: v.boolean(),
    }),
    
    // Product status
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    
    // Localized fields for i18n
    nameEs: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    descriptionEs: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_active", ["isActive"])
    .index("by_featured", ["isFeatured"])
    .index("by_sku", ["sku"]),

  // Shopping Cart
  carts: defineTable({
    userId: v.optional(v.string()), // Clerk user ID
    sessionId: v.optional(v.string()), // For guest users
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      priceAtTime: v.number(), // Price when added to cart
      addedAt: v.number(),
    })),
    // Age verification status for the cart
    ageVerified: v.boolean(),
    ageVerifiedAt: v.optional(v.number()),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    expiresAt: v.number(), // Auto-cleanup old carts
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_expires", ["expiresAt"]),

  // Orders
  orders: defineTable({
    orderNumber: v.string(), // Human-readable order number
    userId: v.optional(v.string()), // Clerk user ID
    customerInfo: v.object({
      email: v.string(),
      firstName: v.string(),
      lastName: v.string(),
      phone: v.string(),
      birthDate: v.optional(v.string()), // For age verification
    }),
    
    // Order items
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      quantity: v.number(),
      unitPrice: v.number(),
      totalPrice: v.number(),
      productSnapshot: v.object({
        name: v.string(),
        image: v.string(),
        sku: v.optional(v.string()),
        alcoholData: v.optional(v.object({
          abv: v.number(),
          volume: v.number(),
          volumeUnit: v.string(),
        })),
      }),
    })),
    
    // Pricing
    subtotal: v.number(),
    shippingCost: v.number(),
    taxAmount: v.number(),
    discount: v.number(),
    totalAmount: v.number(),
    
    // Shipping address
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      region: v.string(), // Chilean regions
      postalCode: v.string(),
      country: v.string(),
      deliveryInstructions: v.optional(v.string()),
    }),
    
    // Order status
    status: v.union(
      v.literal("pending_payment"),
      v.literal("payment_confirmed"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded")
    ),
    
    // Payment information
    paymentMethod: v.optional(v.string()),
    paymentStatus: v.optional(v.string()),
    paymentReference: v.optional(v.string()),
    
    // Age verification
    ageVerified: v.boolean(),
    ageVerifiedAt: v.optional(v.number()),
    ageVerificationMethod: v.optional(v.string()),
    
    // Chilean compliance tracking
    deliveryDate: v.optional(v.number()),
    deliveryTimeSlot: v.optional(v.string()),
    deliveryPersonId: v.optional(v.string()),
    
    // Order notes and tracking
    customerNotes: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_order_number", ["orderNumber"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // User Profiles (extends Clerk user data)
  userProfiles: defineTable({
    userId: v.string(), // Clerk user ID
    preferences: v.object({
      language: v.string(),
      currency: v.string(),
      marketingEmails: v.boolean(),
      ageVerified: v.boolean(),
      ageVerifiedAt: v.optional(v.number()),
    }),
    // Shipping addresses
    addresses: v.array(v.object({
      id: v.string(),
      name: v.string(),
      street: v.string(),
      city: v.string(),
      region: v.string(),
      postalCode: v.string(),
      country: v.string(),
      isDefault: v.boolean(),
    })),
    // Order history stats
    totalOrders: v.number(),
    totalSpent: v.number(),
    lastOrderAt: v.optional(v.number()),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Age Verification Log (Chilean compliance)
  ageVerifications: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    method: v.string(), // "id_card", "passport", "manual"
    verified: v.boolean(),
    birthDate: v.optional(v.string()),
    ipAddress: v.string(),
    userAgent: v.string(),
    // Privacy compliance - auto-delete after verification
    expiresAt: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_expires", ["expiresAt"]),

  // Inventory Logs
  inventoryLogs: defineTable({
    productId: v.id("products"),
    type: v.union(
      v.literal("adjustment"),
      v.literal("sale"),
      v.literal("return"),
      v.literal("damage"),
      v.literal("restock")
    ),
    previousQuantity: v.number(),
    newQuantity: v.number(),
    changeAmount: v.number(),
    reason: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
    adminId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_product", ["productId"])
    .index("by_created", ["createdAt"]),
})