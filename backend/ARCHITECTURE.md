# ShipEasy Backend - Clean Architecture

## 🏗️ Architecture Overview

This backend follows **Clean Architecture** principles with **Domain-Driven Design (DDD)** patterns, ensuring maintainability, testability, and scalability.

### Layer Structure

```
src/
├── core/                    # DOMAIN LAYER - Business Logic
│   ├── domain/              # Pure domain entities and value objects
│   ├── ports/               # Interfaces (Dependency Inversion)
│   └── use-cases/           # Application business logic
├── infrastructure/          # INFRASTRUCTURE LAYER
│   ├── database/            # Database implementation
│   └── security/            # Security services
├── application/             # APPLICATION LAYER
│   └── dto/                 # Data Transfer Objects
├── presentation/            # PRESENTATION LAYER - API
│   ├── controllers/         # HTTP Controllers
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   └── interceptors/        # Response interceptors
├── shared/                  # SHARED LAYER
│   ├── constants/           # Constants
│   ├── interfaces/          # Shared interfaces
│   └── types/               # Shared types
└── modules/                 # FEATURE MODULES

```

## ✅ SOLID Principles Applied

### Single Responsibility Principle (SRP)
- Each use case handles one specific business operation
- Services are split into focused implementations

### Open/Closed Principle (OCP)
- Extensible through interfaces (ports)
- New features can be added without modifying existing code

### Liskov Substitution Principle (LSP)
- All implementations properly fulfill their interface contracts

### Interface Segregation Principle (ISP)
- Focused interfaces: `IUserRepository`, `IHashService`, `ITokenService`

### Dependency Inversion Principle (DIP)
- Use cases depend on abstractions (interfaces), not concretions
- Infrastructure implements the interfaces

## 🎨 Design Patterns

### Repository Pattern
Abstracts data access behind interfaces:
```typescript
interface IUserRepository {
  findById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
  // ...
}
```

### Use Case Pattern
Each business operation is a dedicated class:
```typescript
class LoginUseCase {
  execute(dto: LoginDto): Promise<AuthResponse>
}
```

### Value Objects
Encapsulate validation in immutable objects:
- `Email` - Email validation
- `Password` - Password strength
- `Phone` - Phone number format

### Dependency Injection
All dependencies are injected via constructors using NestJS DI

## 📦 Module Organization

### Auth Module
- Login, Register, Logout, Get Me use cases
- JWT authentication strategy
- Bcrypt password hashing

### User Module  
- User management use cases
- User repository implementation

### Database Module
- TypeORM configuration
- Repository implementations

## 🔐 Security

- JWT token authentication
- Bcrypt password hashing
- Input validation with class-validator
- Role-based access control ready

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build
npm run build

# Run linter
npm run lint
```

## 📝 Key Files

- `app.module.ts` - Root module with global filters/interceptors
- `main.ts` - Application bootstrap
- `core/use-cases/` - Business logic
- `infrastructure/database/` - Data persistence
- `presentation/controllers/` - HTTP endpoints

## 🧪 Testing

The architecture is designed for testability:
- Use cases can be tested in isolation
- Mock interfaces for unit tests
- Integration tests for repositories

## 📚 References

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [NestJS Documentation](https://docs.nestjs.com/)
