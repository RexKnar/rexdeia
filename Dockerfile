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

# Remove the .env file
RUN rm -f .env

# Copy the rest of your application source code
COPY . .

# Install dependencies
RUN pnpm install

# Build
RUN pnpm turbo run build

# Change to the apps/web directory
WORKDIR /usr/src/app/apps/web

# Run Prisma migration
RUN npx prisma migrate deploy

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["pnpm", "start"]
