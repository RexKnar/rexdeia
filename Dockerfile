# Use an official Node 20 image as the base
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

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
RUN pnpm turbo run build

# Change to the apps/web directory
WORKDIR /usr/src/app/apps/web

# Remove the .env file
RUN rm -f .env

# Environment variables
ENV NODE_ENV=production
ENV NEXTAUTH_URL=https://acadx-io-t2n3p6jkhq-el.a.run.app
ENV NEXT_PUBLIC_API_URL=https://acadx-io-t2n3p6jkhq-el.a.run.app
ENV NEXTAUTH_SECRET=2b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cba
ENV DATABASE_URL=postgresql://postgres:^%*f8pKbsnWvGs3!@35.200.189.125:5432/acadx
ENV NEXT_SITE_NAME=acadx.io
ENV NEXT_RAZORPAY_KEY_ID=rzp_test_FgPdhSoHy5q9CO
ENV NEXT_RAZORPAY_KEY_SECRET=xt6nQmfxv4bjKZdC0xEU14ei
ENV NEXT_PUBLIC_ZOHO_SALESIQ_WIDGET_CODE=siq5f54d9690e6a1b3453aa252fa32856e9d676d3ef7876ff962cbdcf05a99278df
ENV SENTRY_DSN=https://f2357e98a997b7d0e86b80c08fc29fe1@o4506321037950976.ingest.sentry.io/4506321044307968
ENV NEXT_PUBLIC_SENTRY_DSN=https://f2357e98a997b7d0e86b80c08fc29fe1@o4506321037950976.ingest.sentry.io/4506321044307968

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["pnpm", "start"]
