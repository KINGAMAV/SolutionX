FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY tsconfig.json .

# Build TypeScript
RUN npm run build

# Generate Prisma client
RUN npm run prisma:generate

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
