# Architecture Frontend

## 📐 Principes

### 1. Simplicité d'abord
- Structure plate et intuitive
- Pas de sur-ingénierie
- Facile à comprendre pour les nouveaux développeurs

### 2. Colocalisation
- Les fichiers liés sont proches
- Imports courts et clairs
- Organisation par type (composants, hooks, etc.)

### 3. Séparation des responsabilités
- **app/** : Routing et pages Next.js
- **components/** : Composants React réutilisables
- **hooks/** : Logique réutilisable
- **lib/** : Utilitaires et configuration
- **services/** : Appels API
- **types/** : Définitions TypeScript

## 📂 Structure Détaillée

### `app/` - Next.js App Router
```
app/
├── (public)/      → Routes publiques (/, /search, etc.)
├── (auth)/        → Auth pages (/login, /register)
├── (dashboard)/   → Dashboards protégés
├── layout.tsx     → Layout racine
└── globals.css    → Styles globaux
```

**Pourquoi** : Structure standard Next.js 16 avec route groups.

### `components/` - Composants React

```
components/
├── ui/            → shadcn/ui (Button, Input, Card...)
├── layouts/       → Navbar, Sidebar, layouts
├── auth/          → AuthProvider
└── guards/        → AuthGuard, RoleGuard, GuestGuard
```

**Pourquoi** :
- `ui/` : Composants de base shadcn (NE PAS MODIFIER)
- `layouts/` : Structure des pages
- `auth/` : Tout l'authentification
- `guards/` : Protection des routes

### `hooks/` - Custom Hooks

```
hooks/
├── useAuth.ts         → Hook pour accéder au contexte auth
├── useLogin.ts        → Hook pour la connexion
├── useRegister.ts     → Hook pour l'inscription
└── use-mobile.ts      → Détection mobile
```

**Pattern** :
```typescript
// Hook simple et réutilisable
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Must be within AuthProvider');
  return context;
}
```

### `lib/` - Utilitaires

```
lib/
├── api.ts         → Client HTTP (axios configuré)
├── utils.ts       → Fonctions utilitaires (cn, formatDate...)
└── constants.ts   → Routes, messages, config
```

**Client API** :
```typescript
// Simple et efficace
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
```

### `services/` - Services API

```
services/
├── auth.service.ts    → login, register, logout, getMe
└── http.service.ts    → Client HTTP basique
```

**Pattern** :
```typescript
// Service = ensemble de fonctions pour un domaine
export function login(data: LoginModel) {
  return http<ApiResponse<User>, LoginModel>('/auth/login', {
    method: 'POST',
    body: data,
  });
}
```

### `types/` - Types TypeScript

```
types/
├── common.types.ts    → ApiResponse
├── role.types.ts      → Role enum
├── user.types.ts      → User, AuthUser, CreateUserDto
├── auth.types.ts      → LoginModel, AuthContextType
├── nav.types.ts       → NavItem
└── index.ts           → Exports
```

## 🔄 Flux de Données

### Authentification

```
1. Utilisateur → LoginForm (page)
2. LoginForm → useLogin hook
3. useLogin → authService.login()
4. authService → API backend
5. Réponse → AuthContext (state global)
6. Context → Tous les composants via useAuth()
```

### Protection des Routes

```
Page → Guard → Vérification auth → Rendu OU Redirection
```

## 🎨 Conventions de Code

### Imports
```typescript
// Ordre des imports
import React from 'react';              // 1. Libraries externes
import { Button } from '@/components';  // 2. Composants internes
import { useAuth } from '@/hooks';      // 3. Hooks
import { api } from '@/lib/api';        // 4. Utilitaires
import type { User } from '@/types';    // 5. Types
```

### Composants
```typescript
// Composant fonctionnel avec props typées
interface Props {
  title: string;
  onSubmit: () => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  return <div>{title}</div>;
}
```

### Hooks
```typescript
// Hook custom réutilisable
export function useMyFeature() {
  const [state, setState] = useState();
  
  // Logique...
  
  return { state, actions };
}
```

## 🚀 Bonnes Pratiques

1. **Composants petits** : Max 200 lignes, sinon découper
2. **Hooks custom** : Extraire la logique réutilisable
3. **Types partout** : Pas de `any`
4. **Imports absolus** : Utiliser `@/` alias
5. **Colocalisation** : Fichiers liés proches
6. **Nommage clair** : `useAuth`, `LoginForm`, `authService`

## 🔍 Exemples

### Créer un nouveau composant
```typescript
// components/MyFeature.tsx
interface MyFeatureProps {
  title: string;
}

export function MyFeature({ title }: MyFeatureProps) {
  return <div>{title}</div>;
}
```

### Créer un hook custom
```typescript
// hooks/useMyFeature.ts
export function useMyFeature() {
  const [data, setData] = useState();
  
  useEffect(() => {
    // logic
  }, []);
  
  return { data };
}
```

### Ajouter un service
```typescript
// services/myFeature.service.ts
import { http } from './http.service';

export function getAll() {
  return http<MyData[], undefined>('/my-feature', {
    method: 'GET',
  });
}
```

## 📖 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
