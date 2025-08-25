import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all categories
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Get category by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("bySlug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Get active categories
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("byActive", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Create category (for seeding)
export const create = mutation({
  args: {
    name: v.string(),
    nameJA: v.optional(v.string()),
    slug: v.string(),
    description: v.optional(v.string()),
    parentId: v.optional(v.id("categories")),
    sortOrder: v.number(),
    isActive: v.boolean(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
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
    abvRange: v.optional(v.object({ min: v.number(), max: v.number() })),
    regulatoryClass: v.optional(v.union(
      v.literal("low_alcohol"),
      v.literal("medium_alcohol"),
      v.literal("high_alcohol"),
      v.literal("non_alcoholic")
    )),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    seoScore: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", args);
  },
});
