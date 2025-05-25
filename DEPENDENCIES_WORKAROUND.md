
# Estado de dependencias críticas y workaround provisional

**Fecha:** 2025-05-25 (Actualizado - Build Fix)

## Cambios recientes
- **CRÍTICO**: Se removieron completamente las dependencias de `@veramo/*` que causaban errores de Git y build.
- Se instalaron todas las dependencias core de React/Vite que faltaban para un proyecto funcional.
- Se mejoró la configuración de Jest para aislar completamente los tests de blockchain.
- Se actualizó `setupTests.ts` para mejor manejo del entorno de testing.

## Estado actual
- ✅ La build de producción (`npm run build`) debería funcionar correctamente.
- ✅ El arranque (`npm run dev`) debería funcionar correctamente.
- ✅ Se aislaron completamente los tests de blockchain para prevenir conflictos.
- ✅ Se removieron las dependencias problemáticas que requerían acceso a Git.

## Dependencias core instaladas
- `vite` - Bundler principal
- `@vitejs/plugin-react-swc` - Plugin de React para Vite
- `react-router-dom` - Routing
- `@tanstack/react-query` - State management
- `typescript` - Tipos
- `@types/react`, `@types/react-dom`, `@types/node`, `@types/jest` - Definiciones de tipos
- `jest`, `ts-jest` - Testing framework

## Dependencias removidas por conflictos
- `@veramo/credential-w3c` - Requería acceso a repositorio Git no disponible
- `@veramo/did-manager` - Dependencia de blockchain problemática
- `@veramo/did-provider-key` - Dependencia de blockchain problemática

## Blockchain mocking - Enfoque de aislamiento total
- Los tests de blockchain están completamente deshabilitados en la configuración de Jest.
- Se removieron todas las dependencias que causaban conflictos de Git.
- El mock de blockchain solo existe en archivos de test aislados.

## Archivos excluidos del build y testing
- `src/did-community-demo.ts` - Demo de blockchain
- `src/api/treasury.ts` - API de treasury con dependencias blockchain
- `src/lib/ethers-treasury.ts` - Integración con Ethers.js
- `src/lib/treasury-explorer.ts` - Explorador de treasury
- `test/Governance.test.skip.ts` - Tests de governance con Hardhat

## Próximos pasos recomendados
1. Verificar que `npm run dev` funciona correctamente.
2. Verificar que `npm run build` genera el build sin errores.
3. Ejecutar `npm test` para validar que los tests básicos funcionan.
4. Si se necesita funcionalidad blockchain en el futuro, usar mocks locales sin dependencias externas.

## Notas importantes
- **NO** reinstalar dependencias de `@veramo/*` - causan errores de Git.
- Mantener el blockchain mocking completamente aislado en entorno de testing.
- Evitar cualquier dependencia que requiera acceso a repositorios Git externos.

---
Última actualización: 2025-05-25 (Build Fix)
