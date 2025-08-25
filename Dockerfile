# Multi-stage Dockerfile for Liquor Store SaaS
# Stage 1: Dependencies
FROM node:20.18.1-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.mjs ./

# Install dependencies
RUN npm ci --only=production --silent

# Stage 2: Builder
FROM node:20.18.1-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20.18.1-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy dependencies
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy environment template
COPY --chown=nextjs:nodejs .env.example .env.local

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["npm", "start"]