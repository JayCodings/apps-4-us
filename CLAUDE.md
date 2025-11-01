# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dockerized full-stack starter template for web applications with:
- **Backend**: Laravel with Breeze API authentication (in `backend/` directory)
- **Frontend**: Next.js with TypeScript and Tailwind CSS (in `frontend/` directory)
- **Infrastructure**: Docker configurations and nginx-proxy setup (in `etc/` directory)
  - `etc/backend/`: Backend Docker configuration (Dockerfile, nginx.conf, php.ini, supervisord.conf)
  - `etc/frontend/`: Frontend Docker configuration (Dockerfile)
  - `etc/nginx/certs/`: SSL certificates for local HTTPS

## URLs and Services

The project uses subdomain-based routing through nginx-proxy:
- Backend API: `https://api.project-name.localhost`
- Frontend App: `https://app.project-name.localhost`
- PHPMyAdmin: `https://phpmyadmin.project-name.localhost`
- RedisInsight: `https://redisinsight.project-name.localhost`

## Common Commands

### Initial Setup
```bash
# Generate SSL certificates (required for local HTTPS)
./createSSL.sh

# Copy and configure environment
cp .env.example .env
# Replace "project-name" in createSSL.sh with actual PROJECT_NAME value

# Start infrastructure services
docker compose up -d
```

### Laravel Backend Commands
```bash
# Install Laravel
composer create-project laravel/laravel backend

# Setup Breeze API
cd backend
composer require laravel/breeze --dev
php artisan breeze:install api

# After Docker setup
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
```

### Next.js Frontend Commands
```bash
# Create Next.js app
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir --import-alias "@/*"

# Development
docker-compose exec frontend npm run dev

# Production build
docker-compose exec frontend npm run build
```

### Docker Operations
```bash
# Build and start all services
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in containers
docker-compose exec backend php artisan [command]
docker-compose exec frontend npm [command]
```

## Architecture

### Docker Network Structure
- All services communicate through `project-name-network`
- nginx-proxy handles routing on ports 80/443
- Backend and Frontend services don't expose ports directly
- Database services (MySQL, Redis) are accessible internally

## Environment Variables

ENV configuration is managed via the `.env` file located in the root directory.
- .env.example are used as a template for required variables and has a documentation purpose.
  - ENV values should be set according to the deployment environment, so you can just copy it to .env
- `.env` files in subdirectories (backend/, frontend/) are not used.
  - actual ENV values must be injected via `compose.yaml` in root directory.

## Important Notes

- SSL certificates must be generated before starting services (use `./createSSL.sh`)
- Replace all instances of "project-name" with actual project name before setup
- Backend and frontend directories will be created during installation
- Services use virtual hosts through nginx-proxy, not direct port exposure
- Database migrations must be run after container setup

## Agent Rules

You are an experienced laravel backend developer and NEXT.js frontend developer.
All code suggestions and generations must take our conventions into account.

### Best Practices
- **Code Quality:** Self-explanatory, simple, secure, robust, minimize external dependencies
- **Typing:** Everything is typed - DTOs, Interfaces, Types, Enums (no unstructured arrays)
- **Design Patterns:** Common patterns & best practices with a focus on scalability

### Backend Instructions 
- Refer to the `backend/CLAUDE.md` for detailed backend conventions and rules.
- All changes within `backend`-folder must comply with `backend/CLAUDE.md` instructions.

### Frontend Instructions
- Refer to the `frontend/CLAUDE.md` for detailed backend conventions and rules.
- All changes within `frontend`-folder must comply with `frontend/CLAUDE.md` instructions.

#### Comments
Don't add unnecessary comments like "Do x if y", Comments may only be used:
- if code is not self-explanatory
- if code is complex
- if code handles edge-cases
- for type-hinting
- as documentation comments for public methods / classes / class properties / constants
- explain prerequisites / expectations / future handlings

### Further Instructions
- Main task: Adhere strictly to the architectural rules listed above for all code suggestions, code generations, and refactoring tasks.
- In case of uncertainty: If you are unsure about a task or an architectural aspect, ask first instead of making an assumption.
- Minimal solution: Focus on the most minimalistic solution
- Keep existing code unchanged: Avoid changing existing code, if not necessary.
- Enums should be written in PascalCase and sorted alphabetically
- Enums should use suffix "Enum"
- Avoid using String-Interpolation use String-Concatenation
- keinen fallback für nicht vorhandene ENV Werte. Endweder ENV ist korrekt, oder Error
- Unnötige Requests sollen verhindert werden