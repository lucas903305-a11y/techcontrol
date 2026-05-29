# TechControl - App para técnicos IT

## Quick Start
```powershell
cd C:\TechControl
npx expo start --lan       # QR en red local
npx expo start --web       # navegador
npx jest                   # tests (425 tests, 58 suites)
npx tsc --noEmit           # type check (0 errores)
```

## Stack
- React Native 0.81.5 + Expo SDK 54
- TypeScript 5.9
- Zustand (store global + persistencia AsyncStorage)
- Supabase (backend — usa mock data, `EXPO_PUBLIC_SUPABASE_ENABLED=false`)
- React Navigation (bottom tabs + native stack)
- react-native-reanimated (animaciones: Button press, StatCard entrada, tab icons, screen transitions)
- @react-native-community/netinfo (indicador offline)
- expo-haptics, expo-image-picker, expo-location, expo-print, react-native-maps
- expo-notifications (configurado, requiere build nativa)

## Estado del proyecto
- 30+ pantallas completas, modo oscuro/claro en todas
- `tsc --noEmit` 0 errores, `jest` 425 tests / 58 suites
- i18n Español/Inglés completo con toggle persistente en Settings
- GitHub: https://github.com/lucas903305-a11y/techcontrol.git
- CI: GitHub Actions (push/PR → tsc + tests)
- CD: EAS Build configurado (development/preview/production)

## Funcionalidad implementada

### Core
- Auth: login, register, WhatsApp login, restore session, persistencia, deep linking, reset password
- Dashboard: stats reales, tickets recientes, próximos trabajos, quick actions
- Clientes: CRUD completo, búsqueda, detalle con mapa/llamar/WhatsApp, editar, eliminar, selector de ubicación en mapa
- Tickets: CRUD completo, cambio de estado, comentarios, prioridad, adjuntos (fotos), compartir, selector de cliente
- Inventario: CRUD completo, búsqueda, filtro stock bajo, editar
- Equipos: CRUD inline en detalle del cliente (nombre, marca, modelo, serie, garantía)
- Visitas: check-in/check-out con geolocalización, timer en vivo, notas, historial desde API
- Presupuestos: items con IVA, PDF real (expo-print + sharing), envío WhatsApp
- Reportes: stats dinámicos desde API, pull-to-refresh, 6 cards con acción
- Asistente IA: respuestas contextuales (cámaras, red, servidor, impresora, correo), follow-up, adjuntar fotos, integración OpenAI

### UX/UI
- Modo oscuro/claro completo (todas las pantallas + componentes)
- i18n Español/Inglés con toggle en Settings (persistente)
- Animaciones Reanimated: Button press (scale spring), StatCard entrada (FadeInDown stagger), ScreenWrapper (FadeIn), TabBar icons (spring scale), OfflineIndicator (FadeInDown/FadeOutUp)
- OfflineIndicator: banner animado al perder conexión (NetInfo)
- Tab bar con safe area insets + iconos animados
- Búsqueda en Clientes, Tickets e Inventario
- Pull-to-refresh en todas las listas
- Auto-refresh al volver (useFocusEffect)
- Estados vacíos inteligentes
- Toast global para feedback no bloqueante
- Haptic feedback en botones
- Caché offline con AsyncStorage + TTL 5min + invalidación en mutaciones
- Componentes reutilizables: Card, EmptyState, Avatar, SearchBar, FAB, Loading, Toast, AnimatedCard, Badge, StatCard, Input, Button, ScreenWrapper, OfflineIndicator, AnimatedTabIcon

### Pantallas
- Splash, Login, Register, WhatsAppLogin, ResetPassword
- Dashboard (tab), Clientes (tab), Tickets (tab), Mapa (tab, interactivo con MapView), IA (tab)
- TicketDetail, ClientDetail, NewTicket, NewClient, NewInventory, NewQuote, MapPicker
- Profile, Settings, Admin, Reports, Inventory
- EditProfile, Company, Billing, Notifications, Security, Help, About

## Testing
- 58 suites, 425 tests
- Cobertura: 30+ pantallas, utils (formatters, validators, whatsapp, haptics), store (Zustand), componentes (Button, Badge, Input, Toast, Card, Avatar, SearchBar, StatCard, EmptyState, Loading, FAB, AnimatedCard, OfflineIndicator, AnimatedTabIcon), servicios (cache, api, auth), hooks (useTheme), i18n
- Setup: jest-expo, mocking AsyncStorage + NetInfo + Reanimated
- Nota: MapPickerScreen no se puede renderizar desde el módulo real debido a un issue con la transpilación JSX + Babel en React 19. Se usa un `MapPickerView` inline que replica el mismo árbol JSX. MapScreen tampoco renderiza MapView nativo (mocked con View).

## Para producción
1. Configurar `.env` con credenciales reales de Supabase y OpenAI
2. Reemplazar mock data en `api.ts` por datos reales de Supabase
3. Hacer build nativa para notificaciones push (`eas build`)

## Estructura
```
src/
  components/     # UI reutilizable (Button, Input, Badge, Toast, ScreenWrapper, OfflineIndicator, etc.)
  hooks/          # useTheme, useTranslation
  i18n/           # Traducciones español/inglés (es.ts, en.ts)
  navigation/     # AppNavigator (tabs + stack)
  screens/        # 30+ pantallas con tests
  services/       # api.ts (mock + Supabase), auth.ts, cache.ts, supabase.ts, notifications.ts, openai.ts
  store/          # Zustand: useAppStore (user, auth, darkMode, locale, toast, etc.)
  theme/          # Colors (light/dark), spacing, typography
  types/          # Interfaces TypeScript
  utils/          # formatters, validators, whatsapp deep links, haptics
```
