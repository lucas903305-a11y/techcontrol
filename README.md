# TechControl

App de gestión para técnicos IT e instaladores en Latinoamérica.

## Stack
- **Frontend:** React Native (Expo) with TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **IA:** OpenAI API

## Setup

1. Clonar el repo
2. Copiar `.env.example` a `.env` y completar las credenciales
3. `npm install`
4. `npx expo start`

## Base de datos

Ejecutar `supabase-schema.sql` en el SQL Editor de Supabase.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `EXPO_PUBLIC_OPENAI_API_KEY` | API key de OpenAI |

## Estructura

```
src/
  components/   # Componentes reutilizables
  hooks/        # Custom hooks
  navigation/   # Configuración de navegación
  screens/      # Pantallas de la app
  services/     # API, Auth, OpenAI
  theme/        # Colores, tipografía, spacings
  types/        # Tipos TypeScript
```
