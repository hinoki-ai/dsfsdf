import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all products
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

// Get product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get products by category
export const getByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("byCategory", (q) =>
        q.eq("categoryId", args.categoryId).eq("isActive", true)
      )
      .collect();
  },
});

// Get featured products
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("byFeatured", (q) =>
        q.eq("isFeatured", true).eq("isActive", true)
      )
      .collect();
  },
});

// Search products
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) =>
        q.search("name", args.query)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .take(20);
  },
});

// Create product (for seeding)
export const create = mutation({
  args: {
    name: v.string(),
    nameJA: v.optional(v.string()),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    sku: v.string(),
    barcode: v.optional(v.string()),
    categoryId: v.id("categories"),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    cost: v.optional(v.number()),
    taxRate: v.number(),
    inventory: v.object({
      quantity: v.number(),
      lowStockThreshold: v.number(),
      trackInventory: v.boolean(),
      allowBackorder: v.boolean(),
      reservedQuantity: v.optional(v.number()),
    }),
    alcoholData: v.optional(v.object({
      abv: v.number(),
      volume: v.number(),
      volumeUnit: v.union(v.literal("ml"), v.literal("L"), v.literal("cl")),
      origin: v.optional(v.string()),
      grapeVariety: v.optional(v.array(v.string())),
      distillationMethod: v.optional(v.string()),
      aging: v.optional(v.object({
        years: v.optional(v.number()),
        caskType: v.optional(v.string()),
        region: v.optional(v.string()),
      })),
      tasteProfile: v.optional(v.object({
        sweetness: v.number(),
        acidity: v.number(),
        bitterness: v.number(),
        body: v.number(),
        finish: v.number(),
      })),
    })),
    ageRequirement: v.object({
      minimumAge: v.number(),
      requiresVerification: v.boolean(),
      verificationType: v.optional(v.union(
        v.literal("none"),
        v.literal("basic"),
        v.literal("document"),
        v.literal("strict")
      )),
    }),
    regulatoryInfo: v.optional(v.object({
      warnings: v.optional(v.array(v.string())),
      restrictions: v.optional(v.object({
        maxQuantity: v.optional(v.number()),
        maxDaily: v.optional(v.number()),
        restrictedRegions: v.optional(v.array(v.string())),
        requiresPrescription: v.boolean(),
      })),
      certifications: v.optional(v.array(v.string())),
      batchInfo: v.optional(v.object({
        batchNumber: v.string(),
        productionDate: v.number(),
        expiryDate: v.optional(v.number()),
      })),
    })),
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
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    tags: v.array(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    isDigital: v.boolean(),
    requiresShipping: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});
