import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { paymentAttemptSchemaValidator } from "./paymentAttemptTypes";

export default defineSchema({
    // Enhanced User management with Clerk integration and age verification
    users: defineTable({
      name: v.string(),
      // This the Clerk ID, stored in the subject JWT field
      externalId: v.string(),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      address: v.optional(v.object({
        street: v.string(),
        city: v.string(),
        region: v.string(),
        postalCode: v.string(),
        country: v.string(),
      })),
      preferences: v.optional(v.object({
        language: v.string(), // "es-CL", "en", etc.
        currency: v.string(), // "CLP", "USD", etc.
        notifications: v.boolean(),
      })),

      // Enhanced role and permission system
      role: v.optional(v.union(
        v.literal("super_admin"),
        v.literal("admin"),
        v.literal("manager"),
        v.literal("customer"),
        v.literal("viewer")
      )),
      permissions: v.optional(v.array(v.string())), // Granular permissions

      // Age verification for alcohol sales (Chilean law requires 18+)
      ageVerification: v.optional(v.object({
        isVerified: v.boolean(),
        verifiedAt: v.optional(v.number()),
        dateOfBirth: v.optional(v.number()),
        verificationMethod: v.optional(v.union(
          v.literal("id_document"),
          v.literal("credit_card"),
          v.literal("third_party")
        )),
        verificationId: v.optional(v.string()), // Document or transaction ID
        expiresAt: v.optional(v.number()), // Verification expiry
      })),

      // Security and compliance
      isActive: v.optional(v.boolean()),
      isEmailVerified: v.optional(v.boolean()),
      isPhoneVerified: v.optional(v.boolean()),
      emailVerifiedAt: v.optional(v.number()),
      phoneVerifiedAt: v.optional(v.number()),

      // Enhanced tracking
      lastLoginAt: v.optional(v.number()),
      lastActiveAt: v.optional(v.number()),
      loginCount: v.optional(v.number()),
      failedLoginAttempts: v.optional(v.number()),
      lastFailedLoginAt: v.optional(v.number()),
      accountLockedUntil: v.optional(v.number()),

      // User metadata and preferences
      metadata: v.optional(v.object({
        timezone: v.optional(v.string()),
        deviceInfo: v.optional(v.object({
          lastDevice: v.string(),
          lastIpAddress: v.string(),
          lastUserAgent: v.string(),
        })),
        marketingOptIn: v.optional(v.boolean()),
        privacySettings: v.optional(v.object({
          shareData: v.boolean(),
          allowTracking: v.boolean(),
          allowPersonalization: v.boolean(),
        })),
      })),

      createdAt: v.optional(v.number()),
      updatedAt: v.optional(v.number()),
    }).index("byExternalId", ["externalId"])
      .index("byEmail", ["email"])
      .index("byRole", ["role", "isActive"])
      .index("byActive", ["isActive", "lastActiveAt"])
      .index("byEmailVerified", ["isEmailVerified", "email"])
      .index("byAgeVerification", ["ageVerification.isVerified", "ageVerification.expiresAt"]),

    // Liquor-specific categories with regulatory classifications
    categories: defineTable({
      name: v.string(),
      nameJA: v.optional(v.string()),
      slug: v.string(),
      description: v.optional(v.string()),
      parentId: v.optional(v.id("categories")),
      sortOrder: v.number(),
      isActive: v.boolean(),
      icon: v.optional(v.string()),
      color: v.optional(v.string()),

      // Alcohol-specific metadata
      alcoholCategory: v.optional(v.union(
        v.literal("wine"),
        v.literal("beer"),
        v.literal("spirits"),
        v.literal("liqueurs"),
        v.literal("aperitifs"),
        v.literal("digestifs"),
        v.literal("cocktail_mixers"),
        v.literal("non_alcoholic")
      )),
      abvRange: v.optional(v.object({ // Alcohol by volume range
        min: v.number(),
        max: v.number(),
      })),
      regulatoryClass: v.optional(v.union(
        v.literal("low_alcohol"), // < 14% ABV
        v.literal("medium_alcohol"), // 14-22% ABV
        v.literal("high_alcohol"), // > 22% ABV
        v.literal("non_alcoholic") // 0% ABV
      )),

      // SEO fields
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      seoScore: v.optional(v.number()),

      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("bySlug", ["slug"])
      .index("byParent", ["parentId"])
      .index("byActive", ["isActive", "sortOrder"])
      .index("byAlcoholCategory", ["alcoholCategory", "isActive"])
      .index("byRegulatoryClass", ["regulatoryClass", "isActive"])
      .searchIndex("search_categories", {
        searchField: "name",
        filterFields: ["isActive"]
      }),

    // Comprehensive products with alcohol-specific fields
    products: defineTable({
      name: v.string(),
      nameJA: v.optional(v.string()),
      slug: v.string(),
      description: v.string(),
      shortDescription: v.optional(v.string()),
      sku: v.string(),
      barcode: v.optional(v.string()),
      categoryId: v.id("categories"),

      // Pricing
      price: v.number(),
      compareAtPrice: v.optional(v.number()),
      cost: v.optional(v.number()),
      taxRate: v.number(), // Chilean IVA (19%)

      // Inventory with age-restricted tracking
      inventory: v.object({
        quantity: v.number(),
        lowStockThreshold: v.number(),
        trackInventory: v.boolean(),
        allowBackorder: v.boolean(),
        reservedQuantity: v.optional(v.number()), // For age verification holds
      }),

      // Alcohol-specific product data
      alcoholData: v.optional(v.object({
        abv: v.number(), // Alcohol by volume percentage
        volume: v.number(), // Volume in ml/L
        volumeUnit: v.union(v.literal("ml"), v.literal("L"), v.literal("cl")),
        origin: v.optional(v.string()), // Country/region of origin
        grapeVariety: v.optional(v.array(v.string())), // For wines
        distillationMethod: v.optional(v.string()), // For spirits
        aging: v.optional(v.object({
          years: v.optional(v.number()),
          caskType: v.optional(v.string()),
          region: v.optional(v.string()),
        })),
        tasteProfile: v.optional(v.object({
          sweetness: v.number(), // 1-5 scale
          acidity: v.number(),
          bitterness: v.number(),
          body: v.number(),
          finish: v.number(),
        })),
      })),

      // Age verification requirements
      ageRequirement: v.object({
        minimumAge: v.number(), // Typically 18 for Chile
        requiresVerification: v.boolean(),
        verificationType: v.optional(v.union(
          v.literal("none"),
          v.literal("basic"), // Just age declaration
          v.literal("document"), // ID verification required
          v.literal("strict") // Enhanced verification
        )),
      }),

      // Regulatory compliance
      regulatoryInfo: v.optional(v.object({
        warnings: v.optional(v.array(v.string())), // Health warnings, pregnancy warnings, etc.
        restrictions: v.optional(v.object({
          maxQuantity: v.optional(v.number()), // Max per order
          maxDaily: v.optional(v.number()), // Max per day
          restrictedRegions: v.optional(v.array(v.string())), // Regions where delivery is restricted
          requiresPrescription: v.boolean(), // For medicinal alcohols
        })),
        certifications: v.optional(v.array(v.string())), // Organic, fair trade, etc.
        batchInfo: v.optional(v.object({
          batchNumber: v.string(),
          productionDate: v.number(),
          expiryDate: v.optional(v.number()),
        })),
      })),

      // Product attributes
      images: v.array(v.object({
        url: v.string(),
        alt: v.string(),
        sortOrder: v.number(),
      })),
      weight: v.optional(v.number()),
      dimensions: v.optional(v.object({
        length: v.number(),
        width: v.number(),
        height: v.number(),
      })),

      // SEO and metadata
      metaTitle: v.optional(v.string()),
      metaDescription: v.optional(v.string()),
      tags: v.array(v.string()),

      // Status flags
      isActive: v.boolean(),
      isFeatured: v.boolean(),
      isDigital: v.boolean(),
      requiresShipping: v.boolean(),

      // Timestamps
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("bySlug", ["slug"])
      .index("bySku", ["sku"])
      .index("byBarcode", ["barcode"])
      .index("byCategory", ["categoryId", "isActive"])
      .index("byActive", ["isActive", "createdAt"])
      .index("byFeatured", ["isFeatured", "isActive"])
      .index("byPrice", ["price", "isActive"])
      .index("byAbv", ["alcoholData.abv", "isActive"])
      .index("byAgeRequirement", ["ageRequirement.minimumAge", "ageRequirement.requiresVerification"])
      .searchIndex("search_products", {
        searchField: "name",
        filterFields: ["categoryId", "isActive", "tags"]
      }),

    // Shopping cart with age verification holds
    carts: defineTable({
      userId: v.optional(v.string()), // Optional for guest carts
      sessionId: v.optional(v.string()), // For guest cart persistence
      items: v.array(v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(), // Price at time of adding
        addedAt: v.number(),
        ageVerified: v.optional(v.boolean()), // Age verification status for this item
        verificationId: v.optional(v.string()), // Reference to verification record
      })),
      subtotal: v.number(),
      tax: v.number(),
      total: v.number(),
      currency: v.string(),
      expiresAt: v.optional(v.number()), // For guest cart cleanup

      // Age verification summary for cart
      ageVerification: v.optional(v.object({
        isVerified: v.boolean(),
        verifiedAt: v.optional(v.number()),
        verificationMethod: v.optional(v.string()),
        restrictions: v.optional(v.object({
          hasRestrictedItems: v.boolean(),
          requiresAdditionalVerification: v.boolean(),
        })),
      })),

      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byUser", ["userId"])
      .index("bySession", ["sessionId"])
      .index("byExpiry", ["expiresAt"])
      .index("byAgeVerification", ["ageVerification.isVerified"]),

    // Orders with Chilean alcohol regulations
    orders: defineTable({
      orderNumber: v.string(),
      userId: v.optional(v.string()), // Optional for guest orders
      customerInfo: v.object({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        dateOfBirth: v.optional(v.number()), // For age verification
      }),

      // Shipping address with delivery restrictions
      shippingAddress: v.object({
        street: v.string(),
        city: v.string(),
        region: v.string(),
        postalCode: v.string(),
        country: v.string(),
        additionalInfo: v.optional(v.string()),
        coordinates: v.optional(v.object({
          latitude: v.number(),
          longitude: v.number(),
        })),
      }),
      billingAddress: v.optional(v.object({
        street: v.string(),
        city: v.string(),
        region: v.string(),
        postalCode: v.string(),
        country: v.string(),
      })),

      // Order items with alcohol-specific data
      items: v.array(v.object({
        productId: v.id("products"),
        name: v.string(),
        sku: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
        alcoholData: v.optional(v.object({
          abv: v.number(),
          volume: v.number(),
          requiresVerification: v.boolean(),
        })),
      })),

      // Pricing breakdown
      subtotal: v.number(),
      taxAmount: v.number(),
      taxRate: v.number(),
      shippingCost: v.number(),
      discountAmount: v.optional(v.number()),
      totalAmount: v.number(),
      currency: v.string(),

      // Age verification for order
      ageVerification: v.object({
        isVerified: v.boolean(),
        verifiedAt: v.number(),
        verificationMethod: v.string(),
        verificationId: v.string(),
        verifiedBy: v.optional(v.string()), // Admin user who verified
        restrictions: v.optional(v.object({
          deliveryDelay: v.optional(v.number()), // Hours delay for verification
          requiresSignature: v.boolean(),
          restrictedItems: v.optional(v.array(v.string())), // SKUs that need extra verification
        })),
      }),

      // Order status
      status: v.union(
        v.literal("pending"),
        v.literal("age_verification"),
        v.literal("verified"),
        v.literal("processing"),
        v.literal("shipped"),
        v.literal("delivered"),
        v.literal("cancelled"),
        v.literal("refunded")
      ),

      // Payment info
      paymentStatus: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("paid"),
        v.literal("failed"),
        v.literal("cancelled"),
        v.literal("refunded")
      ),
      paymentMethod: v.optional(v.string()),
      paymentIntentId: v.optional(v.string()),

      // Shipping info with alcohol restrictions
      shippingMethod: v.optional(v.string()),
      trackingNumber: v.optional(v.string()),
      estimatedDeliveryDate: v.optional(v.number()),
      deliveryRestrictions: v.optional(v.object({
        requiresAdultSignature: v.boolean(),
        deliveryWindow: v.optional(v.string()), // Morning, afternoon, etc.
        specialInstructions: v.optional(v.array(v.string())),
      })),

      // Compliance tracking
      complianceInfo: v.optional(v.object({
        regulatoryApprovals: v.optional(v.array(v.string())),
        exportCompliance: v.optional(v.object({
          isExport: v.boolean(),
          destinationCountry: v.optional(v.string()),
          exportLicenseRequired: v.boolean(),
        })),
        qualityChecks: v.optional(v.array(v.object({
          checkType: v.string(),
          passed: v.boolean(),
          checkedAt: v.number(),
          checkedBy: v.string(),
        }))),
      })),

      // Timestamps
      createdAt: v.number(),
      updatedAt: v.number(),
      verifiedAt: v.optional(v.number()),
      shippedAt: v.optional(v.number()),
      deliveredAt: v.optional(v.number()),
    }).index("byOrderNumber", ["orderNumber"])
      .index("byUser", ["userId"])
      .index("byStatus", ["status", "createdAt"])
      .index("byPaymentStatus", ["paymentStatus"])
      .index("byAgeVerification", ["ageVerification.isVerified", "createdAt"])
      .index("byCreatedAt", ["createdAt"]),

    // Inventory tracking for age-controlled products
    inventoryLogs: defineTable({
      productId: v.id("products"),
      type: v.union(
        v.literal("stock_in"),
        v.literal("stock_out"),
        v.literal("reserved"),
        v.literal("released"),
        v.literal("adjustment"),
        v.literal("age_restricted_hold"),
        v.literal("age_restricted_release")
      ),
      quantity: v.number(), // Positive for in, negative for out
      previousQuantity: v.number(),
      newQuantity: v.number(),
      reason: v.optional(v.string()),
      orderId: v.optional(v.id("orders")),
      userId: v.optional(v.string()),
      ageVerificationId: v.optional(v.string()), // For age-restricted operations
      createdAt: v.number(),
    }).index("byProduct", ["productId", "createdAt"])
      .index("byType", ["type", "createdAt"])
      .index("byOrder", ["orderId"])
      .index("byAgeVerification", ["ageVerificationId"]),

    // Age verification records
    ageVerifications: defineTable({
      userId: v.optional(v.string()),
      orderId: v.optional(v.id("orders")),
      verificationType: v.union(
        v.literal("self_declaration"),
        v.literal("id_document"),
        v.literal("credit_card"),
        v.literal("biometric"),
        v.literal("third_party")
      ),
      status: v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected"),
        v.literal("expired")
      ),
      verificationData: v.optional(v.object({
        dateOfBirth: v.optional(v.number()),
        idNumber: v.optional(v.string()),
        idType: v.optional(v.string()),
        creditCardLast4: v.optional(v.string()),
        biometricHash: v.optional(v.string()),
        thirdPartyReference: v.optional(v.string()),
      })),
      verifiedAge: v.optional(v.number()),
      minimumRequiredAge: v.number(),
      expiresAt: v.number(),
      verifiedAt: v.optional(v.number()),
      verifiedBy: v.optional(v.string()), // Admin user ID
      rejectionReason: v.optional(v.string()),
      metadata: v.optional(v.object({
        ipAddress: v.string(),
        userAgent: v.string(),
        deviceFingerprint: v.optional(v.string()),
      })),
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byUser", ["userId", "createdAt"])
      .index("byOrder", ["orderId"])
      .index("byStatus", ["status", "createdAt"])
      .index("byType", ["verificationType", "status"])
      .index("byExpiry", ["expiresAt"]),

    // Reviews and ratings
    reviews: defineTable({
      productId: v.id("products"),
      userId: v.optional(v.string()),
      orderId: v.optional(v.id("orders")),
      customerName: v.string(),
      rating: v.number(), // 1-5 scale
      title: v.optional(v.string()),
      content: v.optional(v.string()),
      isVerifiedPurchase: v.boolean(),
      isApproved: v.boolean(),
      helpfulVotes: v.number(),
      ageVerified: v.optional(v.boolean()), // Age verification status for reviewer
      createdAt: v.number(),
      updatedAt: v.number(),
    }).index("byProduct", ["productId", "isApproved"])
      .index("byUser", ["userId"])
      .index("byRating", ["rating", "isApproved"]),

    paymentAttempts: defineTable(paymentAttemptSchemaValidator)
      .index("byPaymentId", ["payment_id"])
      .index("byUserId", ["userId"])
      .index("byPayerUserId", ["payer.user_id"]),

    // Wishlist items per user
    wishlists: defineTable({
      userId: v.string(),
      productId: v.id("products"),
      createdAt: v.number(),
    }).index("byUser", ["userId", "createdAt"])
      .index("byUserProduct", ["userId", "productId"]),
  });