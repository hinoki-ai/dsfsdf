import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { Id } from "./_generated/dataModel"
import type { Cart, CartItem, Product } from "../types"

// Get cart for user or session
export const getCart = query({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId must be provided")
    }
    
    let cart
    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first()
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .first()
    }
    
    if (!cart) {
      return null
    }
    
    // Get product details for each cart item
    const cartWithProducts = {
      ...cart,
      items: await Promise.all(
        cart.items.map(async (item: CartItem) => {
          const product = await ctx.db.get(item.productId as any);
          return {
            ...item,
            product,
          }
        })
      ),
    }
    
    return cartWithProducts
  },
})

// Add item to cart
export const addItem = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId must be provided")
    }
    
    // Get product to check availability and price
    const product = await ctx.db.get(args.productId)
    if (!product || !product.isActive) {
      throw new Error("Product not available")
    }
    
    // Check inventory
    if (product.inventory.trackInventory && 
        product.inventory.quantity < args.quantity) {
      throw new Error("Insufficient inventory")
    }
    
    const now = Date.now()
    
    // Find existing cart
    let cart
    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first()
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .first()
    }
    
    if (cart) {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex(
        (item: CartItem) => item.productId === args.productId
      )

      let updatedItems
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = cart.items.map((item: CartItem, index: number) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + args.quantity }
            : item
        )
      } else {
        // Add new item
        updatedItems = [
          ...cart.items,
          {
            productId: args.productId,
            quantity: args.quantity,
            priceAtTime: product.price,
            addedAt: now,
          },
        ]
      }
      
      await ctx.db.patch(cart._id, {
        items: updatedItems,
        updatedAt: now,
        expiresAt: now + (30 * 24 * 60 * 60 * 1000), // 30 days
      })
      
      return cart._id
    } else {
      // Create new cart
      return await ctx.db.insert("carts", {
        userId: args.userId,
        sessionId: args.sessionId,
        items: [
          {
            productId: args.productId,
            quantity: args.quantity,
            priceAtTime: product.price,
            addedAt: now,
          },
        ],
        ageVerified: false,
        createdAt: now,
        updatedAt: now,
        expiresAt: now + (30 * 24 * 60 * 60 * 1000), // 30 days
      })
    }
  },
})

// Update item quantity in cart
export const updateItemQuantity = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId must be provided")
    }
    
    // Find cart
    let cart
    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first()
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .first()
    }
    
    if (!cart) {
      throw new Error("Cart not found")
    }
    
    const updatedItems = cart.items
      .map((item: CartItem) =>
        item.productId === args.productId
          ? { ...item, quantity: args.quantity }
          : item
      )
      .filter((item: CartItem) => item.quantity > 0) // Remove items with 0 quantity
    
    await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    })
    
    return cart._id
  },
})

// Remove item from cart
export const removeItem = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId must be provided")
    }
    
    // Find cart
    let cart
    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first()
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .first()
    }
    
    if (!cart) {
      throw new Error("Cart not found")
    }
    
    const updatedItems = cart.items.filter(
      (item: CartItem) => item.productId !== args.productId
    )
    
    await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    })
    
    return cart._id
  },
})

// Clear cart
export const clearCart = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId must be provided")
    }
    
    // Find cart
    let cart
    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first()
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .first()
    }
    
    if (!cart) {
      return null
    }
    
    await ctx.db.patch(cart._id, {
      items: [],
      updatedAt: Date.now(),
    })
    
    return cart._id
  },
})

// Verify age for cart
export const verifyAge = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    verified: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.userId && !args.sessionId) {
      throw new Error("Either userId or sessionId must be provided")
    }
    
    // Find cart
    let cart
    if (args.userId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first()
    } else if (args.sessionId) {
      cart = await ctx.db
        .query("carts")
        .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
        .first()
    }
    
    if (!cart) {
      throw new Error("Cart not found")
    }
    
    await ctx.db.patch(cart._id, {
      ageVerified: args.verified,
      ageVerifiedAt: args.verified ? Date.now() : undefined,
      updatedAt: Date.now(),
    })
    
    return cart._id
  },
})

// Cleanup expired carts (scheduled function)
export const cleanupExpiredCarts = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const expiredCarts = await ctx.db
      .query("carts")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect()
    
    for (const cart of expiredCarts) {
      await ctx.db.delete(cart._id)
    }
    
    return { deletedCount: expiredCarts.length }
  },
})