# Use Node 20 as base
FROM node:20-slim AS builder

# Install required system dependencies
RUN apt-get update && apt-get install -y openssl

# Set working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy only necessary files for monorepo
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
WORKDIR /usr/src/app/apps/web
RUN pnpx prisma generate

# Build only web project
RUN pnpm turbo run build --filter=web...

# Production image
FROM node:20-slim AS runner

# Install required system dependencies
RUN apt-get update && apt-get install -y openssl

WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy necessary files from builder
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/apps/web/package.json ./apps/web/
COPY --from=builder /usr/src/app/apps/web/.next ./apps/web/.next
COPY --from=builder /usr/src/app/apps/web/public ./apps/web/public
COPY --from=builder /usr/src/app/apps/web/prisma ./apps/web/prisma

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production \
    NEXTAUTH_URL=http://localhost:3000 \
    NEXT_PUBLIC_API_URL=http://localhost:3000 \
    NEXTAUTH_SECRET=2b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cba \
    DATABASE_URL=postgresql://postgres:rexCoders123@rexdeia.crug228k820z.us-east-2.rds.amazonaws.com:5432/rexdeia \
    NEXT_SITE_NAME=rexdeia.com \
    NEXT_RAZORPAY_KEY_ID=rzp_test_FgPdhSoHy5q9CO \
    NEXT_RAZORPAY_KEY_SECRET=xt6nQmfxv4bjKZdC0xEU14ei \
    SENTRY_DSN=https://4079002e0c9397054e638dff15dd5a9f@o4507098064486400.ingest.de.sentry.io/4507098068942928 \
    NEXT_PUBLIC_SENTRY_DSN=https://4079002e0c9397054e638dff15dd5a9f@o4507098064486400.ingest.de.sentry.io/4507098068942928 \
    NEXT_GCLOUD_PROJECT_ID=darkcore-blog \
    NEXT_GCLOUD_STORAGE_BUCKET=rexdeia

# Change to web directory
WORKDIR /usr/src/app/apps/web

# Run Prisma migrations
RUN pnpx prisma generate
RUN pnpx prisma migrate deploy

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]