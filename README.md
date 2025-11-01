# Laravel + Next.js Dockerized Starter Template

Ein vollständig dockerisiertes Starter-Template für moderne Web-Applikationen mit separatem Backend und Frontend, inklusive Authentication UI und E-Mail Testing.

## 🚀 Features

- ✅ **Vollständiges Auth-System** mit Login, Registrierung, Passwort-Reset
- ✅ **Modernes UI** mit Tailwind CSS und responsivem Design
- ✅ **E-Mail Testing** mit Inbucket (keine echten E-Mails in Development)
- ✅ **Queue Management** mit Laravel Horizon
- ✅ **Hot-Reload** für Frontend und Backend
- ✅ **SSL/HTTPS** für lokale Entwicklung
- ✅ **Object Storage** mit MinIO (S3-kompatibel)
- ✅ **Docker-basiert** - keine lokale Installation nötig

## Tech Stack

### Backend (Laravel)
- **Laravel 12** mit PHP 8.4
- **Laravel Horizon** für Queue Management
- **Laravel Sanctum** für API Authentication
- **Redis** für Cache & Sessions
- **MySQL 8** als Datenbank

### Frontend (Next.js)
- **Next.js 16** mit App Router
- **TypeScript** für Type Safety
- **Tailwind CSS** für Styling
- **SWR** für Data Fetching
- **Axios** für API Communication

### Infrastructure
- **Docker & Docker Compose**
- **nginx-proxy** für Reverse Proxy
- **Supervisor** für Process Management
- **SSL/HTTPS** für lokale Entwicklung
- **Inbucket** für E-Mail Testing
- **MinIO** für Object Storage (S3-kompatibel)

## URLs nach dem Setup

- Frontend: `https://app.project-name.localhost`
- Backend API: `https://api.project-name.localhost`
- Mail UI (Inbucket): `https://mail.project-name.localhost`
- PHPMyAdmin: `https://phpmyadmin.project-name.localhost`
- RedisInsight: `https://redisinsight.project-name.localhost`
- MinIO API: `https://minio.project-name.localhost`
- MinIO Console: `http://localhost:9001`

## Installation

### 1. Repository vorbereiten

```bash
# Environment-Datei kopieren
cp .env.example .env

# .env bearbeiten und PROJECT_NAME setzen (z.B. "myapp")
# Dies wird verwendet für: myapp.localhost, api.myapp.localhost, etc.
```

### 2. SSL-Zertifikate generieren

```bash
# In createSSL.sh "project-name" mit deinem PROJECT_NAME ersetzen
./createSSL.sh
```

### 3. Docker Container starten

```bash
# Alle Services starten
docker-compose up -d

# Logs überprüfen
docker-compose logs -f
```

### 4. Backend initialisieren

```bash
# Application Key generieren
docker-compose exec backend php artisan key:generate

# Datenbank migrieren
docker-compose exec backend php artisan migrate

# (Optional) Test-Daten einfügen
docker-compose exec backend php artisan db:seed
```

## 🎯 Authentication Boilerplate

Das Template kommt mit einem vollständigen Authentication-System:

### Backend (Laravel Breeze API)
- **Endpoints** für Login, Registrierung, Logout, Password-Reset
- **Email Verification** Support
- **Laravel Sanctum** für sichere Cookie-basierte Authentication
- **CORS** konfiguriert für Frontend-Domain

### Frontend (Next.js)
- **Login/Register Pages** unter `/login` und `/register`
- **Dashboard** mit geschützten Routen
- **useAuth Hook** für einfache Integration:
  ```javascript
  import { useAuth } from '@/hooks/auth'

  const { user, login, logout, register } = useAuth({
    middleware: 'auth', // oder 'guest'
    redirectIfAuthenticated: '/dashboard'
  })
  ```
- **Automatische CSRF-Protection**
- **Session-basierte Authentication**

## 📧 E-Mail Testing mit Inbucket

Alle E-Mails werden in der Entwicklungsumgebung von Inbucket abgefangen:

### Features
- **Keine echten E-Mails** werden versendet
- **Web-Interface** zum Anzeigen aller E-Mails
- **SMTP-Server** auf Port 2500
- **Automatische Konfiguration** für Laravel

### E-Mail testen
```bash
# Test-Mail senden
docker-compose exec backend php artisan mail:test

# Oder mit spezifischer E-Mail-Adresse
docker-compose exec backend php artisan mail:test user@example.com
```

### E-Mails anzeigen
Öffnen Sie `https://mail.project-name.localhost` im Browser, um alle gesendeten E-Mails zu sehen.

## Entwicklung

### Backend Befehle

```bash
# Artisan Commands
docker-compose exec backend php artisan <command>

# Composer Packages
docker-compose exec backend composer require <package>

# Tests ausführen
docker-compose exec backend php artisan test

# Horizon Dashboard (Queue Monitoring)
# Browser: https://api.project-name.localhost/horizon

# Cache leeren
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
```

### Frontend Befehle

```bash
# NPM Commands
docker-compose exec frontend npm <command>

# Packages installieren
docker-compose exec frontend npm install <package>

# Development Server (läuft bereits im Container)
docker-compose exec frontend npm run dev

# Build für Production
docker-compose exec frontend npm run build

# Tests
docker-compose exec frontend npm test
```

### MinIO / Storage Befehle

```bash
# Datei hochladen (via Tinker)
docker-compose exec backend php artisan tinker --execute="Storage::put('test.txt', 'Hello MinIO!');"

# Datei lesen
docker-compose exec backend php artisan tinker --execute="echo Storage::get('test.txt');"

# Alle Dateien auflisten
docker-compose exec backend php artisan tinker --execute="print_r(Storage::files());"

# Datei-URL generieren
docker-compose exec backend php artisan tinker --execute="echo Storage::url('test.txt');"

# MinIO Console öffnen
# Browser: http://localhost:9001
# Login: project-name / project-name
```

**Storage in Laravel nutzen:**
```php
use Illuminate\Support\Facades\Storage;

// Datei speichern
Storage::put('documents/file.pdf', $content);

// Datei laden
$content = Storage::get('documents/file.pdf');

// Datei löschen
Storage::delete('documents/file.pdf');

// URL generieren
$url = Storage::url('documents/file.pdf');
```

### Logs anzeigen

```bash
# Alle Services
docker-compose logs -f

# Spezifische Services
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f redis
```

## Projekt-Struktur

```
webhook-proxy/
├── backend/                # Laravel Backend
│   ├── app/                # Application Code
│   │   └── Console/
│   │       └── Commands/   # Artisan Commands
│   │           └── TestMailCommand.php  # E-Mail Test Command
│   ├── config/             # Konfiguration
│   ├── database/           # Migrations & Seeds
│   └── routes/             # API Routes
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router Pages
│   │   │   ├── (app)/      # Authenticated Pages
│   │   │   │   └── dashboard/
│   │   │   ├── (auth)/     # Auth Pages
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   └── layout.tsx  # Root Layout
│   │   ├── components/     # React Components
│   │   │   ├── ApplicationLogo.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Navigation.tsx
│   │   ├── hooks/          # Custom Hooks (auth.ts)
│   │   └── lib/            # Libraries (axios.ts)
├── etc/                    # Docker & Infrastructure Configs
│   ├── backend/            # Backend Docker Configs
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   ├── supervisord.conf
│   │   └── php.ini
│   ├── frontend/           # Frontend Docker Configs
│   │   ├── Dockerfile
│   │   └── Dockerfile.dev  # Development Dockerfile
│   ├── minio/              # MinIO Docker Configs
│   │   └── docker-entrypoint.sh  # Bucket initialization
│   └── nginx/certs/        # SSL Certificates
├── createSSL.sh            # SSL Certificate (local) Generator
├── compose.yaml            # Docker Compose Configuration
├── CLAUDE.md               # AI Assistant Instructions
└── .env                    # Environment Variables
```

## Architektur Details

### Backend Architektur

Das Backend läuft in einem einzelnen Container mit Supervisor, der mehrere Prozesse managed:
- **Nginx**: Reverse Proxy zu Octane
- **Horizon**: Queue Worker für Background Jobs

Alle Services nutzen:
- **Redis** für Cache, Sessions und Queues
- **MySQL** für persistente Datenspeicherung
- **MinIO** für Object Storage (S3-kompatibel)

### Frontend Architektur

- **Standalone Next.js Build** für optimale Performance
- **Server-Side Rendering** Support
- **API Routes** deaktiviert (alles läuft über Laravel Backend)
- **Environment Variables** zur Build-Zeit injiziert

### Storage Architektur

Das Projekt nutzt **MinIO** als S3-kompatiblen Object Storage:

- **Default Filesystem**: Laravel nutzt MinIO als Standard-Storage
- **S3-kompatible API**: Vollständige AWS S3 API Unterstützung
- **Automatische Bucket-Erstellung**: Der Bucket `${PROJECT_NAME}` wird beim Start erstellt
- **Local Development**: MinIO läuft im Docker Container
- **Production-Ready**: Einfacher Wechsel zu AWS S3 durch ENV-Konfiguration

**Konfiguration** (in `.env`):
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=project-name
AWS_SECRET_ACCESS_KEY=project-name
AWS_BUCKET=project-name
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true
```

**Features**:
- Kein lokales Storage Volume mehr benötigt
- Dateien überleben Container-Neustarts
- Web-UI für Bucket-Management auf Port 9001
- Einfache Migration zu AWS S3 für Production

### Docker Setup

**Multi-stage Builds** für optimierte Container:
- Separate Build- und Runtime-Stages
- Minimale finale Images
- Production-ready Konfiguration

**Volume Mounts** für Development:
- Code-Synchronisation ohne Rebuild
- Hot-Reload für Frontend
- Persistente Storage für Backend

## Environment Variables

Zentrale Konfiguration in `compose.yaml`:

```yaml
backend:
  environment:
    APP_NAME: ${PROJECT_NAME}
    APP_URL: https://${BE_URL}
    FRONTEND_URL: https://${FE_URL}
    DB_HOST: db
    DB_DATABASE: ${MYSQL_DB}
    REDIS_HOST: redis
    SESSION_DRIVER: redis
    CACHE_DRIVER: redis
    QUEUE_CONNECTION: redis
    # MinIO / Storage
    FILESYSTEM_DISK: s3
    AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
    AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
    AWS_BUCKET: ${AWS_BUCKET}
    AWS_ENDPOINT: ${AWS_ENDPOINT}
```

## API Authentication

Das Template nutzt Laravel Sanctum für SPA Authentication:

1. **CSRF Protection**: Cookie-basiert
2. **Session Authentication**: Für same-domain Requests
3. **Stateful Domains**: Konfiguriert für Frontend-Domain

## Troubleshooting

### Container neu bauen

```bash
docker-compose build --no-cache backend
docker-compose build --no-cache frontend
docker-compose up -d
```

### Permission Probleme

```bash
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

### Datenbank Reset

```bash
docker-compose exec backend php artisan migrate:fresh --seed
```

### Ports bereits belegt

```bash
# Prüfen welcher Prozess Port 80/443 belegt
sudo lsof -i :80
sudo lsof -i :443

# Docker neu starten
docker-compose down
docker-compose up -d
```

## Production Deployment

Für Production-Deployment beachten:

1. **Environment Variables**:
   - `APP_ENV=production`
   - `APP_DEBUG=false`
   - Sicherer `APP_KEY` generieren

2. **SSL Zertifikate**:
   - Let's Encrypt oder andere CA verwenden
   - Automatische Renewal einrichten

3. **Optimierungen**:
   ```bash
   # Laravel optimieren
   docker-compose exec backend php artisan config:cache
   docker-compose exec backend php artisan route:cache
   docker-compose exec backend php artisan view:cache
   ```

4. **Ressourcen-Limits** in `compose.yaml`:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 2G
   ```

5. **Backup-Strategie**:
   - MySQL Dumps automatisieren
   - Redis Persistence konfigurieren
   - MinIO Data Volume sichern (`minio_data`)
   - Oder AWS S3 für Production verwenden

## Weitere Dokumentation

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel File Storage](https://laravel.com/docs/filesystem)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Octane](https://laravel.com/docs/octane)
- [Laravel Horizon](https://laravel.com/docs/horizon)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
