FROM node:22.18.0-alpine AS base

WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install 

FROM base AS production

WORKDIR /app
COPY . .

# Load environment variables
COPY .env /app/.env

# Move node_modules from base stage
COPY --from=base /app/node_modules ./node_modules

# Generate Prisma client and build the application
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 3001
CMD [ "npm", "start" ]
