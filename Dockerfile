# Use an official Node 20 image as the base
FROM node:20

# Set the working directory
WORKDIR /usr/src/app/apps/web

# Install pnpm
RUN npm install -g pnpm

# Copy package files needed for dependencies
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./

# Copy the rest of your application source code
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
RUN node --max-old-space-size=1536 pnpm  run build

# RUN pnpm turbo run build

# Change to the apps/web directory
WORKDIR /usr/src/app/apps/web

# Remove the .env file
RUN rm -f .env

# Environment variables
ENV NODE_ENV=production
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=2b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cba
ENV DATABASE_URL=postgresql://postgres:rexCoders123@rexdeia.crug228k820z.us-east-2.rds.amazonaws.com:5432/rexdeia
ENV NEXT_SITE_NAME=rexdeia.com
ENV NEXT_RAZORPAY_KEY_ID=rzp_test_FgPdhSoHy5q9CO
ENV NEXT_RAZORPAY_KEY_SECRET=xt6nQmfxv4bjKZdC0xEU14ei
# ENV NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE=siq5f54d9690e6a1b3453aa252fa32856e9d676d3ef7876ff962cbdcf05a99278df
ENV SENTRY_DSN=https://4079002e0c9397054e638dff15dd5a9f@o4507098064486400.ingest.de.sentry.io/4507098068942928
ENV NEXT_PUBLIC_SENTRY_DSN=https://4079002e0c9397054e638dff15dd5a9f@o4507098064486400.ingest.de.sentry.io/4507098068942928
ENV NEXT_GCLOUD_PROJECT_ID=darkcore-blog
ENV NEXT_GCLOUD_STORAGE_BUCKET=rexdeia

# Deploy Database migrations
RUN pnpx prisma migrate deploy
RUN pnpx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["pnpm", "start"]
