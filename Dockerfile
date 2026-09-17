# Use ultra-lightweight NGINX alpine image
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy website files and assets to Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY admin.html /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

# Copy custom Nginx configuration for high-performance static serving & CORS/MIME handling
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose standard port 80 (or Northflank port)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
