# Project FAQ - Laravel + Next.js Starter Template

## Architektur & Design

### Q: Warum Laravel Octane mit Swoole statt normalem PHP-FPM?
**A:** Laravel Octane mit Swoole bietet deutlich bessere Performance durch:
- Persistent Application State (keine Bootstrap-Zeit pro Request)
- Echte asynchrone Verarbeitung
- WebSocket-Support out of the box
- Bessere Ressourcennutzung in Docker-Containern
- Ideal für moderne APIs mit hohem Durchsatz

**Wichtig:** Code muss stateless sein! Keine globalen Variablen, keine state-behafteten Services.

### Q: Wie soll die Service-Architektur konkret aussehen?
**A:** Strikte Service-Layer-Architektur:
```php
// ❌ FALSCH - Business-Logik im Controller
class UserController {
    public function __invoke(Request $request) {
        $user = User::create($request->all());
        Mail::to($user)->send(new WelcomeMail());
        return response()->json($user);
    }
}

// ✅ RICHTIG - Service-Pattern
class RegisterUserController {
    public function __invoke(
        RegisterUserRequest $request,
        UserRegistrationService $service
    ): JsonResponse {
        $dto = UserRegistrationDTO::fromRequest($request);
        $user = $service->register($dto);
        return response()->json($user);
    }
}
```

### Q: Warum readonly Services und was bedeutet "stateless"?
**A:** Services als Singletons für Octane-Kompatibilität:
```php
// ✅ RICHTIG - Stateless Service
readonly class UserService {
    public function __construct(
        private UserRepository $repository,
        private EventDispatcher $events
    ) {}

    public function findById(int $id): User {
        return $this->repository->find($id);
    }
}

// ❌ FALSCH - Stateful Service
class BadService {
    private array $cache = []; // State zwischen Requests!

    public function process($data) {
        $this->cache[] = $data; // Octane-Problem!
    }
}
```

### Q: Wie sollen DTOs strukturiert sein?
**A:** Typsichere, immutable Datencontainer:
```php
declare(strict_types=1);

namespace App\Data;

readonly class UserRegistrationDTO implements JsonSerializable
{
    public function __construct(
        public string $email,
        public string $name,
        public string $password,
        public ?string $referralCode = null
    ) {}

    public static function fromRequest(RegisterUserRequest $request): self
    {
        /** @var array{email: string, name: string, password: string, referral_code?: string} $validated */
        $validated = $request->validated();

        return new self(
            email: $validated['email'],
            name: $validated['name'],
            password: $validated['password'],
            referralCode: $validated['referral_code'] ?? null
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'email' => $this->email,
            'name' => $this->name,
            'referral_code' => $this->referralCode,
        ];
    }
}
```

## Laravel-Spezifika

### Q: Warum keine Facades verwenden?
**A:** Dependency Injection ist expliziter und testbarer:
```php
// ❌ FALSCH - Facade
class UserService {
    public function notify(User $user): void {
        Log::info('Notifying user: ' . $user->id);
        Mail::to($user)->send(new NotificationMail());
    }
}

// ✅ RICHTIG - Dependency Injection
readonly class UserService {
    public function __construct(
        private Mailer $mailer
    ) {}

    public function notify(User $user): void {
        // logging via Fassade is required
        Log::info('Notifying user: ' . $user->id);

        $this->mailer->to($user)->send(new NotificationMail());
    }
}
```

### Q: Wie sollen FormRequests strukturiert sein?
**A:** Mit Psalm-Types für Typsicherheit:
```php
declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @psalm-type ValidatedData = array{
 *     email: string,
 *     password: string,
 *     name: string,
 *     terms_accepted: bool,
 *     referral_code?: string
 * }
 */
class RegisterUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'min:8', 'confirmed'],
            'name' => ['required', 'string', 'max:255'],
            'terms_accepted' => ['required', 'accepted'],
            'referral_code' => ['nullable', 'string', 'exists:referrals,code'],
        ];
    }

    /**
     * @return ValidatedData
     */
    public function validated($key = null, $default = null): array
    {
        return parent::validated($key, $default);
    }
}
```

### Q: Wie soll die Components-Struktur aussehen?
**A:** Modulare, feature-basierte Organisation:
```
Components/
├── User/
│   ├── Services/
│   │   ├── UserRegistrationService.php
│   │   └── UserAuthenticationService.php
│   ├── Repositories/
│   │   └── UserRepository.php
│   ├── Data/
│   │   ├── UserDTO.php
│   │   └── UserRegistrationDTO.php
│   └── Events/
│       └── UserRegisteredEvent.php
├── Payment/
│   ├── Services/
│   │   ├── Contracts/
│   │   │   └── PaymentGatewayInterface.php
│   │   ├── StripePaymentService.php
│   │   └── PayPalPaymentService.php
│   └── Data/
│       └── PaymentDTO.php
```

### Q: Warum Invokable Controllers?
**A:** Single Responsibility und klare Abhängigkeiten:
```php
// ✅ RICHTIG - Invokable Controller
class GetUserProfileController
{
    public function __invoke(
        int $userId,
        UserService $service
    ): JsonResponse {
        $user = $service->findById($userId);
        return response()->json(UserDTO::fromModel($user));
    }
}

// Route Definition
Route::get('/users/{userId}', GetUserProfileController::class);
```

## Docker & Infrastructure

### Q: Wie soll das Backend Dockerfile aussehen?
**A:** Multi-stage Build mit Octane:
```dockerfile
# Stage 1: Dependencies
FROM composer:2 as vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Stage 2: Application
FROM php:8.4-cli-alpine

# Install Swoole
RUN apk add --no-cache $PHPIZE_DEPS \
    && pecl install swoole \
    && docker-php-ext-enable swoole

# Install Laravel Dependencies
RUN docker-php-ext-install pdo_mysql opcache pcntl

WORKDIR /var/www/html
COPY --from=vendor /app/vendor vendor/
COPY . .

# Octane Configuration
EXPOSE 8000
CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000"]
```

### Q: Wie wird Laravel Horizon integriert?
**A:** Als separater Worker-Container:
```yaml
# docker-compose.yaml
backend-worker:
  build:
    context: ./backend
    target: worker
  command: php artisan horizon
  depends_on:
    - redis
    - db
  volumes:
    - ./backend:/var/www/html
```

### Q: Wie soll die Datenbankstruktur aussehen?
**A:** Migrations mit klaren Konventionen:
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->string('name');
    $table->string('password');
    $table->string('status')->default('active'); // Kein ENUM!
    $table->timestamp('email_verified_at')->nullable();
    $table->timestamps(); // created_at, updated_at

    $table->index('email');
    $table->index('status');
});
```

## Testing & Quality

### Q: Wie soll getestet werden?
**A:** PHPUnit mit klarer Struktur:
```php
class UserRegistrationServiceTest extends TestCase
{
    use RefreshDatabase;

    private UserRegistrationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(UserRegistrationService::class);
    }

    /** @test */
    public function it_registers_user_with_valid_data(): void
    {
        // Arrange
        $dto = new UserRegistrationDTO(
            email: 'test@example.com',
            name: 'Test User',
            password: 'secure-password'
        );

        // Act
        $user = $this->service->register($dto);

        // Assert
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User'
        ]);
        $this->assertInstanceOf(User::class, $user);
    }
}
```

### Q: Welche Code-Quality-Tools und wie konfiguriert?
**A:** GrumPHP mit strikten Regeln:
```yaml
# grumphp.yml
grumphp:
  tasks:
    phpcs:
      standard: PSR12
      triggered_by: [php]
    psalm:
      config: psalm.xml
      show_info: true
      threads: 4
    phpunit:
      always_execute: false
```

## Frontend Integration

### Q: Wie soll die API-Kommunikation aussehen?
**A:** Typsichere API-Clients:
```typescript
// frontend/src/lib/api/user.ts
interface UserDTO {
  id: number;
  email: string;
  name: string;
}

class UserAPI {
  async register(data: RegisterData): Promise<UserDTO> {
    const response = await apiClient.post('/api/register', data);
    return response.data;
  }
}
```

### Q: Wie wird CORS konfiguriert?
**A:** Spezifisch für Frontend-Domain:
```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'https://app.project-name.localhost')
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## Entwicklungs-Workflow

### Q: Wie soll der Git-Workflow aussehen?
**A:** Feature-Branches mit klaren Commits:
```bash
# Feature entwickeln
git checkout -b feature/user-registration
# Atomic commits
git add -A
git commit -m "feat(user): add registration service"
git commit -m "test(user): add registration service tests"
git commit -m "docs(user): update API documentation"
```

### Q: Wie werden Umgebungsvariablen verwaltet?
**A:** Strikte Trennung:
```bash
.env.example    # Template mit allen Variablen
.env            # Lokale Entwicklung (nicht committen!)
.env.testing    # Test-Umgebung
.env.production # Produktion (via CI/CD)
```

## Performance & Optimization

### Q: Welche Caching-Strategien?
**A:** Redis für alles:
```php
// Cache-Strategie
readonly class UserService {
    public function __construct(
        private UserRepository $repository,
        private CacheInterface $cache
    ) {}

    public function findById(int $id): User {
        return $this->cache->remember(
            "user:{$id}",
            3600,
            fn() => $this->repository->find($id)
        );
    }
}
```

### Q: Wie wird mit N+1 Queries umgegangen?
**A:** Eager Loading und Query Optimization:
```php
// Service mit optimierten Queries
public function getUsersWithPosts(): Collection {
    return User::with(['posts' => function ($query) {
        $query->where('published', true)
              ->orderBy('created_at', 'desc')
              ->limit(5);
    }])->paginate(20);
}
```

## Deployment

### Q: Wie soll das Production-Setup aussehen?
**A:** Container-Orchestrierung mit Health Checks:
```yaml
backend:
  healthcheck:
    test: ["CMD", "php", "artisan", "octane:status"]
    interval: 30s
    timeout: 10s
    retries: 3
  deploy:
    replicas: 3
    resources:
      limits:
        cpus: '2'
        memory: 2G
```

## Wichtige Prinzipien

1. **Typsicherheit überall** - Keine Arrays ohne Structure
2. **Services sind stateless** - Octane-Kompatibilität
3. **DTOs für Datentransfer** - Keine rohen Arrays
4. **Dependency Injection** - Keine Facades
5. **Invokable Controllers** - Single Responsibility
6. **Psalm/PHPStan Level Max** - Keine Type-Errors
7. **Tests für alles** - Minimum 80% Coverage
8. **Redis für Caching** - Keine file-based Caches
9. **Queue für Heavy Tasks** - Horizon für Management
10. **Multi-stage Docker Builds** - Optimierte Images

## Häufige Fehler vermeiden

### ❌ Vermeiden:
- Helper-Funktionen wie `app()`, `config()`, `route()`
- Stateful Services
- Business-Logik in Models
- Untyped Arrays
- String-Interpolation in SQL
- MySQL ENUMs
- Synchrone Heavy Operations

### ✅ Stattdessen:
- Dependency Injection
- Stateless Services
- Service Layer Pattern
- DTOs und Value Objects
- Prepared Statements
- VARCHAR mit Validierung
- Queue Jobs für Heavy Tasks
