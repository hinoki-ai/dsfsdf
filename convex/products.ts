import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"
import type { Product } from "../types"

// Get all active products
export const getAll = query({
  args: {
    limit: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()
    
    let filtered = products
    
    if (args.categoryId) {
      filtered = filtered.filter(p => p.categoryId === args.categoryId)
    }
    
    if (args.featured) {
      filtered = filtered.filter(p => p.isFeatured)
    }
    
    // Sort by creation date desc
    filtered.sort((a, b) => b.createdAt - a.createdAt)
    
    if (args.limit) {
      filtered = filtered.slice(0, args.limit)
    }
    
    return filtered
  },
})

// Get product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first()
    
    return product
  },
})

// Get featured products
export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .collect()
    
    // Sort by creation date desc
    products.sort((a: Product, b: Product) => b.createdAt - a.createdAt)
    
    if (args.limit) {
      return products.slice(0, args.limit)
    }
    
    return products
  },
})

// Search products
export const search = query({
  args: { 
    query: v.string(),
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.query.toLowerCase()
    
    let q = ctx.db.query("products").filter((q) => q.eq(q.field("isActive"), true))
    
    if (args.categoryId) {
      q = q.filter((q) => q.eq(q.field("categoryId"), args.categoryId))
    }
    
    const products = await q.collect()
    
    // Filter by search term in name or description
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.nameEs?.toLowerCase().includes(searchTerm) ||
      product.nameEn?.toLowerCase().includes(searchTerm) ||
      product.alcoholData?.producer?.toLowerCase().includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm)
    )
    
    return args.limit ? filtered.slice(0, args.limit) : filtered
  },
})

// Get products by category
export const getByCategory = query({
  args: { 
    categoryId: v.id("categories"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("categoryId"), args.categoryId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect()
    
    // Sort by creation date desc
    products.sort((a: Product, b: Product) => b.createdAt - a.createdAt)
    
    if (args.limit) {
      return products.slice(0, args.limit)
    }
    
    return products
  },
})

// Create a new product (admin only)
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    costPrice: v.optional(v.number()),
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
    categoryId: v.id("categories"),
    images: v.array(v.object({
      url: v.string(),
      alt: v.string(),
      isPrimary: v.boolean(),
    })),
    alcoholData: v.optional(v.object({
      abv: v.number(),
      volume: v.number(),
      volumeUnit: v.string(),
      origin: v.optional(v.string()),
      producer: v.optional(v.string()),
      variety: v.optional(v.string()),
      vintage: v.optional(v.number()),
      agingProcess: v.optional(v.string()),
    })),
    ageRequirement: v.object({
      minimumAge: v.number(),
      requiresVerification: v.boolean(),
      legalNotice: v.optional(v.string()),
    }),
    inventory: v.object({
      quantity: v.number(),
      reserved: v.number(),
      lowStockThreshold: v.number(),
      trackInventory: v.boolean(),
    }),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    // Localized fields
    nameEs: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    descriptionEs: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    // SEO fields
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    
    const productId = await ctx.db.insert("products", {
      ...args,
      isActive: args.isActive ?? true,
      isFeatured: args.isFeatured ?? false,
      createdAt: now,
      updatedAt: now,
    })
    
    return productId
  },
})

// Update product
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    inventory: v.optional(v.object({
      quantity: v.number(),
      reserved: v.number(),
      lowStockThreshold: v.number(),
      trackInventory: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    })
    
    return id
  },
})

// Update inventory
export const updateInventory = mutation({
  args: {
    id: v.id("products"),
    quantity: v.number(),
    type: v.union(
      v.literal("adjustment"),
      v.literal("sale"),
      v.literal("return"),
      v.literal("damage"),
      v.literal("restock")
    ),
    reason: v.optional(v.string()),
    orderId: v.optional(v.id("orders")),
    adminId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id)
    if (!product) {
      throw new Error("Product not found")
    }
    
    const previousQuantity = product.inventory.quantity
    const newQuantity = args.quantity
    const changeAmount = newQuantity - previousQuantity
    
    // Update product inventory
    await ctx.db.patch(args.id, {
      inventory: {
        ...product.inventory,
        quantity: newQuantity,
      },
      updatedAt: Date.now(),
    })
    
    // Log inventory change
    await ctx.db.insert("inventoryLogs", {
      productId: args.id,
      type: args.type,
      previousQuantity,
      newQuantity,
      changeAmount,
      reason: args.reason,
      orderId: args.orderId,
      adminId: args.adminId,
      createdAt: Date.now(),
    })
    
    return args.id
  },
})

// Delete product (soft delete)
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isActive: false,
      updatedAt: Date.now(),
    })
    
    return args.id
  },
})