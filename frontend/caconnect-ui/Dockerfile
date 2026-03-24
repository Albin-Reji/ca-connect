# ── Build stage ──
FROM node:20-alpine AS build
WORKDIR /app

# Accept build arguments
ARG VITE_KEYCLOAK_URL
ARG VITE_API_BASE_URL
ARG VITE_WS_URL
ARG VITE_KEYCLOAK_CLIENT_ID=ca-connect
ARG VITE_FRONTEND_URL

# Set as environment variables for Vite
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Production stage ──
FROM nginx:alpine AS run

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx template (uses envsubst for dynamic proxy targets)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Default proxy targets (Docker Compose hostnames)
ENV GATEWAY_HOST=gateway:8080
ENV KEYCLOAK_HOST=keycloak:8080

# CRITICAL: Only substitute our custom vars — protect nginx's $uri, $host, etc.
ENV NGINX_ENVSUBST_FILTER=GATEWAY_HOST|KEYCLOAK_HOST

EXPOSE 80

# nginx:alpine image automatically runs envsubst on /etc/nginx/templates/*.template
# and outputs to /etc/nginx/conf.d/ before starting nginx
CMD ["nginx", "-g", "daemon off;"]
