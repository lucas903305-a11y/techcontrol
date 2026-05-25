# TechControl - App para técnicos IT

## Quick Start
```powershell
cd C:\TechControl
npx expo start --tunnel   # QR para Expo Go en celular
npx expo start --web      # para probar en navegador
```

## Stack
- React Native 0.81.5 + Expo SDK 54
- TypeScript 5.9
- Zustand (store global + persistencia AsyncStorage)
- Supabase (backend - sin credenciales reales, usa mock data)
- React Navigation (bottom tabs + native stack)
- expo-haptics, expo-image-picker, expo-location, expo-print, react-native-maps

## Estado del proyecto
- 27 pantallas completas
- Sin errores TypeScript (`tsc --noEmit` limpio)
- Commit en GitHub: https://github.com/lucas903305-a11y/techcontrol.git
- Sin deploy en producción

## Funcionalidad implementada

### Core
- Auth: login, register, WhatsApp login, restore session, persistencia
- Dashboard: stats reales, tickets recientes, próximos trabajos, nombre del usuario
- Clientes: CRUD completo, búsqueda, detalle con mapa/llamar/WhatsApp, editar, eliminar
- Tickets: CRUD completo, cambio de estado, comentarios, prioridad, adjuntos (fotos), compartir, editar, eliminar
- Inventario: CRUD completo, búsqueda, filtro stock bajo, editar
- Equipos: CRUD inline en detalle del cliente (nombre, marca, modelo, serie, garantía)
- Visitas: check-in/check-out con geolocalización, timer en vivo, notas
- Presupuestos: items con IVA, PDF, envío WhatsApp
- Reportes: stats dinámicos desde API, pull-to-refresh

### UX/UI
- Modo oscuro/claro completo (26 pantallas + componentes usan `useTheme()`)
- Tab bar con safe area insets (evita solapamiento con gestos del celular)
- Búsqueda en Clientes, Tickets e Inventario
- Pull-to-refresh en todas las listas
- Auto-refresh al volver (useFocusEffect)
- Estados vacíos inteligentes (sin resultados vs sin datos)
- Toast global para feedback no bloqueante
- Haptic feedback en botones (expo-haptics)
- Caché offline con AsyncStorage + TTL 5min
- Componentes reutilizables: Card, EmptyState, Avatar, SearchBar, FAB, Loading, Toast, AnimatedCard, Badge, StatCard, Input, Button
- i18n español (src/i18n/es.ts)

### Pantallas (27)
- Splash, Login, Register, WhatsAppLogin
- Dashboard (tab), Clientes (tab), Tickets (tab), Mapa (tab), IA (tab)
- TicketDetail, ClientDetail
- NewTicket, NewClient, NewInventory, NewQuote
- Profile, Settings, Admin, Reports, Inventory
- EditProfile, Company, Billing, Notifications, Security, Help, About

## Pendiente para producción
1. Configurar `.env` con credenciales reales de Supabase y OpenAI
2. Reemplazar mock data en `api.ts` por datos reales de Supabase
3. Notificaciones push (expo-notifications ya instalado)
4. Deep linking para recovery de password
5. Animaciones Reanimated en transiciones
6. Testing (no implementado)
7. CI/CD (no implementado)

## Estructura
```
src/
  components/     # UI reutilizable (Button, Input, Badge, Toast, etc.)
  hooks/          # useTheme, useQuery
  i18n/           # Traducciones español
  navigation/     # AppNavigator (tabs + stack)
  screens/        # 27 pantallas
  services/       # api.ts (mock + Supabase), auth.ts, cache.ts, supabase.ts
  store/          # Zustand: useAppStore (user, auth, darkMode, toast, etc.)
  theme/          # Colors (light/dark), spacing, typography
  types/          # Interfaces TypeScript
  utils/          # formatters, validators, whatsapp deep links, haptics
```
