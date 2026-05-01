FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 5000
CMD ["node", "dist/index.js"]
