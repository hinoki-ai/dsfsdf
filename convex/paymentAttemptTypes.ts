import { v } from "convex/values";

export const paymentAttemptSchemaValidator = {
  payment_id: v.string(),
  userId: v.optional(v.string()),
  payer: v.object({
    user_id: v.optional(v.string()),
    email_address: v.optional(v.string()),
    payer_id: v.optional(v.string()),
  }),
  payment_source: v.object({
    card: v.optional(v.object({
      brand: v.string(),
      last_digits: v.string(),
      expiry: v.string(),
      card_type: v.optional(v.string()),
      processing_mode: v.optional(v.string()),
    })),
    bank_transfer: v.optional(v.object({
      account_holder_name: v.string(),
      account_number: v.string(),
      bank_name: v.string(),
      routing_number: v.optional(v.string()),
    })),
  }),
  amount: v.object({
    currency_code: v.string(),
    value: v.string(),
  }),
  status: v.union(
    v.literal("PENDING"),
    v.literal("COMPLETED"),
    v.literal("FAILED"),
    v.literal("CANCELLED"),
    v.literal("EXPIRED"),
    v.literal("DECLINED")
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
  metadata: v.optional(v.object({
    orderId: v.optional(v.string()),
    cartId: v.optional(v.string()),
    description: v.optional(v.string()),
    customFields: v.optional(v.any()),
  })),
  error: v.optional(v.object({
    code: v.string(),
    message: v.string(),
    details: v.optional(v.any()),
  })),
  processing: v.optional(v.object({
    gateway: v.string(),
    transaction_id: v.optional(v.string()),
    fees: v.optional(v.object({
      currency_code: v.string(),
      value: v.string(),
    })),
  })),
};