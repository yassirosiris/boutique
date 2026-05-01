# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (use package-lock if present)
COPY package.json .
COPY package-lock.json . || true
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Production stage ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: copy custom nginx config if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
