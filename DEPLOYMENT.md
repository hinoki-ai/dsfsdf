# 🚀 Deployment Guide for Liquor Store SaaS

## Overview

This guide provides comprehensive instructions for deploying the Liquor Store SaaS application in various environments.

## 📋 Prerequisites

- Docker and Docker Compose
- Git
- Node.js 20.18.1+ (for local development)
- Access to production server (Ubuntu 20.04+ recommended)

## 🚀 Quick Start

### Development Environment

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd liquor-store-saas
   ```

2. **Set up environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start development environment**

   ```bash
   # Using Docker Compose (recommended)
   docker-compose -f docker-compose.dev.yml up -d

   # Or using npm
   npm install
   npm run dev
   ```

4. **Access the application**
   - Main app: [http://localhost:3000](http://localhost:3000)
   - Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
   - MailHog (email testing): [http://localhost:8025](http://localhost:8025)
   - Adminer (database): [http://localhost:8080](http://localhost:8080)

### Production Environment

1. **Configure production environment**

   ```bash
   cp env.example .env.local
   # Fill in production values
   ```

2. **Deploy with Docker Compose**

   ```bash
   docker-compose up -d --build
   ```

3. **Set up SSL certificates**

   ```bash
   # Using Let's Encrypt
   certbot --nginx -d liquor.aramac.dev -d www.liquor.aramac.dev
   ```

## 🐳 Docker Deployment

### Production Setup

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f liquor-store

# Scale services (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale liquor-store=3

# Update application
docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d --build
```

### Development Setup

```bash
# Start development stack
docker-compose -f docker-compose.dev.yml up -d

# View development logs
docker-compose -f docker-compose.dev.yml logs -f liquor-store-dev

# Or use npm scripts for simpler development
npm run convex:dev      # Start Convex development server
npm run dev:port3000    # Start Next.js development server

# Access development database (if using Docker)
docker-compose -f docker-compose.dev.yml exec postgres-dev psql -U liquor_dev -d liquor_store_dev
```

## 🚀 CI/CD Pipeline

The application includes a comprehensive GitHub Actions pipeline that handles:

- **Code Quality**: ESLint, TypeScript checks, Prettier
- **Security**: npm audit, Trivy vulnerability scanning
- **Testing**: Build verification, Lighthouse performance tests
- **Deployment**: Automated Docker builds and production deployment

### Required Secrets

Set these in your GitHub repository secrets:

```bash
# Docker Registry
GITHUB_TOKEN=your_github_token

# Production Server
PRODUCTION_HOST=your_server_ip
PRODUCTION_USER=your_ssh_username
PRODUCTION_SSH_KEY=your_private_ssh_key
PRODUCTION_PORT=22

# Environment Variables
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Monitoring
SLACK_WEBHOOK_URL=your_slack_webhook
GRAFANA_PASSWORD=your_grafana_password
POSTGRES_PASSWORD=your_postgres_password
```

## 📊 Monitoring and Analytics

### Prometheus & Grafana

```bash
# Access Grafana
open http://localhost:3001

# Default credentials
Username: admin
Password: ${GRAFANA_PASSWORD}
```

### Application Metrics

The application exposes metrics on `/api/metrics` for:

- Response times
- Error rates
- User activity
- Sales performance
- Inventory levels

### Health Checks

```bash
# Application health
curl https://liquor.aramac.dev/health

# Database health
docker-compose exec postgres pg_isready -U liquor_user -d liquor_store

# Redis health
docker-compose exec redis redis-cli ping
```

## 🔒 Security Configuration

### SSL/TLS Setup

```bash
# Using Certbot with Nginx
sudo certbot --nginx -d liquor.aramac.dev -d www.liquor.aramac.dev

# Automatic renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Configuration

```bash
# UFW configuration
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 9090/tcp  # Prometheus
sudo ufw allow 3001/tcp  # Grafana
sudo ufw --force enable
```

### Security Headers

The application includes comprehensive security headers:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

## 📈 Performance Optimization

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_products_category ON products(categoryId);
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Optimize queries
VACUUM ANALYZE;
REINDEX DATABASE liquor_store;
```

### Caching Strategy

- **Static Assets**: 1-year cache with immutable headers
- **API Responses**: 5-minute cache for product listings
- **User Sessions**: Redis-backed sessions with 24h TTL
- **Database Queries**: Application-level caching with 10-minute TTL

### CDN Configuration

```nginx
# CDN configuration example
location /_next/static/ {
    proxy_pass https://cdn.liquor.aramac.dev;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Application won't start**

   ```bash
   # Check logs
   docker-compose logs liquor-store

   # Verify environment variables
   docker-compose exec liquor-store env

   # Check disk space
   df -h
   ```

2. **Database connection issues**

   ```bash
   # Test database connection
   docker-compose exec postgres pg_isready -U liquor_user -d liquor_store

   # Check database logs
   docker-compose logs postgres
   ```

3. **SSL certificate issues**

   ```bash
   # Renew certificates manually
   sudo certbot renew

   # Check certificate status
   sudo certbot certificates
   ```

### Log Analysis

```bash
# Application logs
docker-compose logs -f liquor-store

# Nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Database logs
docker-compose exec postgres tail -f /var/log/postgresql/postgresql-15-main.log
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## 🤝 Support

For deployment issues or questions:

- Check the logs: `docker-compose logs`
- Verify configuration files
- Test with development setup first
- Review the CI/CD pipeline for errors

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Environment**: Production Ready
