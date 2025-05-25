# ROADMAP

## Estado actual (mayo 2025)

- Estructura legacy con rutas y lógica centralizada en `App.tsx`.
- Nuevos módulos scaffolded (forum, proposals, consensus, dashboard, user profile, jobs, network) y hooks/contextos preparados para integración progresiva.
- Contextos globales (`SidebarContext`, `NotificationContext`) listos para envolver la app.
- Duplicidades detectadas en perfil/usuario y moderación (ver TODOs en legacy).
- Integración Web3/Ethers.js en fase de preparación (ver TODOs en proposals/consensus, jobs, network).
- Documentación y mocks de API en progreso (Swagger/OpenAPI).

## Próximos pasos

1. **Migrar rutas legacy a nuevas páginas scaffolded**
   - Mantener ambas rutas operativas hasta completar la migración.
   - Marcar legacy como deprecated y añadir TODOs de migración.

2. **Unificar lógica de usuario/perfil y moderación**
   - Centralizar tipos y lógica de reputación, historial y networking.
   - Refactorizar componentes legacy (`ProfileCard`, `UserProfile`, `ModeratorQueue`, etc.)

3. **Conectar contextos globales**
   - Envolver la app en `SidebarContext`, `NotificationContext` y futuro `AuthContext` en `App.tsx`.
   - Mantener `QueryClientProvider` y React Router en el entrypoint.

4. **Preparar integración Web3**
   - Añadir lógica Ethers.js y wallet en proposals/consensus, jobs y network.
   - Mantener fallback mock para desarrollo.

5. **Documentar y tipar todo el código**
   - Mantener comentarios JSDoc y TODOs claros en cada archivo.
   - Documentar endpoints mock en Swagger/OpenAPI.

## Recomendaciones para contributors

- No sobrescribir lógica legacy sin migración progresiva.
- Añadir TODOs claros en cada integración/refactor.
- Priorizar modularidad y tipado estricto.
- Mantener comentarios y documentación actualizados.
- Consultar este ROADMAP antes de abordar nuevas features o refactors.
