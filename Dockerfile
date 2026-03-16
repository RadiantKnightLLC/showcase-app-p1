# Tic-Tac-Toe App - Multi-stage Docker Build
# Optimized for GitOps-FinOps Showcase

# =============================================================================
# BUILD STAGE
# =============================================================================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Run tests during build (fail fast if tests fail)
RUN yarn test

# =============================================================================
# PRODUCTION STAGE
# =============================================================================
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache curl

# Create non-root user for nginx
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create nginx config with health check
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Fix permissions for non-root user
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    mkdir -p /tmp/nginx && \
    chown -R appuser:appgroup /tmp/nginx && \
    touch /tmp/nginx.pid && \
    chown appuser:appgroup /tmp/nginx.pid

# Update nginx.conf to use temp paths for non-root
RUN sed -i 's|/run/nginx.pid|/tmp/nginx.pid|g' /etc/nginx/nginx.conf && \
    sed -i 's|/var/run/nginx.pid|/tmp/nginx.pid|g' /etc/nginx/nginx.conf

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
