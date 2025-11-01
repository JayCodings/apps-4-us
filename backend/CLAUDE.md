# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a dockerized full-stack starter template for web applications with:
- **Backend**: Laravel with Breeze API authentication (this directory)
- **Frontend**: Next.js with TypeScript and Tailwind CSS (in `../frontend/` directory)
- **Infrastructure**: Docker configurations and nginx-proxy setup (in `../etc/` directory)
- Further details in `../CLAUDE.md`

## Tech Stack
- **Framework**: Laravel 12+
- **PHP Version**: 8.4+
- **Server**: Nginx with PHP-FPM
- **Queue Management**: Laravel Horizon
- **Testing**: PHPUnit 12
- **Code Quality**: GrumPHP, Psalm, PHPCS

## Agent Rules
You are an experienced laravel backend developer.
All code suggestions and generations must take these conventions into account.

### Coding Standards
- Follow PSR-12 coding standards
- Use strict types declaration in PHP files
- Maintain type safety (Psalm enforced)
- Write tests for new features
- All code must pass GrumPHP checks before committing

### Architecture Notes
- PSR-4 autoloading for `App\` namespace
- PSR-4 autoloading for `Components\` namespace
- Tests in `Tests\` namespace
- Database factories and seeders in dedicated namespaces
- Octane-compatible code required (stateless, no global state)

To illustrate, here is an excerpt from the correct folder structure (within the backend directory):
```
/app
  ├── Http
  │   └── Controllers
  │       └── UserController.php
  ├── Commands
  │   └── TestCommand.php
  └── ...

/components
  ├── Users
  │   ├── Data
  │   │   ├── CreateUserDto.php
  │   │   └── UpdateUserDto.php
  │   ├── Enums
  │   │   └── UserStatus.php
  │   └── Services
  │       ├── UserServiceInterface.php  // Interface
  │       └── UserService.php   // Service-Implementierung
  ├── Teams
  │   └── Services
  └── ...
```

### Service Conventions
- We use swapable services for every action
- Should use "Service" suffix
- Entrypoints like controllers, commands, etc. should delegate actions to injected service
- Global services: should be located in App\Services directory & don't require Interfaces
- Component Services: should be located in Components\<ComponentName>\Services directory
- Component Services: only require Interfaces if multiple implementations exist. 
  - Simple Services do not require an Interface. 
  - The interface is always defined before the service implementation.
- Services are always designed as singletons and must be stateless.
- They are not allowed to store state variables that change between calls.
- They should be readonly

### Model Conventions
- Models should be lean and only contain relations and scopes
- Business logic must be implemented in services
- Models are unguarded by default
- Models must extend BaseModel and should be located in App\Models directory
- Models must contain phpdocs for properties and relations (see paqato/db package)

### Controller Conventions
- Controllers should be invokable (Single Purpose)
- Dependencies must be injected via __invoke method, Do not use constructor injection
- Controllers should delegate all actions to services
- Controllers should be located in App\Http\Controllers directory
- Validation must be done via FormRequests
- FormRequests validation rules must be an array of rules, no pipe-separated strings
- FormRequests must declare a psalm-type for validated() return value (Overwrite validated() method in order to add psalm-type)
- When creating a new service/interface, Register a new singleton for new Interface/Service in AppServiceProvider

### Laravel Conventions
- Use injected services over facades
- Logging must be done via Log Facade
- Use dependency injection especially Contextual Attributes for services
- Try to avoid helper functions like: `app()`, `now()`, `route()`, `response()`, `abort()`, `redirect()`, 'config()'

#### DTO Conventions
- Use readonly properties
- Use constructor property promotion
- Use strict types declaration
- DTOs must live in "Data"-Namespace
- DTOs may be final classes
- DTOs must implement JsonSerializable

### Further Instructions
- If PHP function is empty, add a "//" in a new line as placeholder (remove "//" if function is implemented)
- avoid mysql enums, use string/varchar instead
- Database tables should use created_at/updated_at timestamps
