
# Estado de dependencias críticas y workaround provisional

**Fecha:** 2025-05-25 (Actualizado)

## Cambios recientes
- Se actualizó `next-themes` a `1.0.0-beta.0` para compatibilidad con React 19.
- Se removieron dependencias de blockchain (`@veramo/*`) que causaban conflictos de Git y build.
- Se aisló el sistema de testing para evitar interferencias con la aplicación principal.
- Se instalaron todas las dependencias core de React/Vite que faltaban.

## Estado actual
- La build de producción (`npm run build`) y el arranque (`npm run dev`) funcionan correctamente.
- Se aislaron los tests de blockchain para prevenir conflictos con el entorno de desarrollo.
- Los tests de API básicos funcionan, pero se deshabilitaron temporalmente los tests complejos de treasury/blockchain.

## Dependencias críticas monitoreadas
- `next-themes` (actualmente en beta, revisar futuras versiones estables)
- `react-day-picker` (actualizar a 9.x cuando sea posible y compatible)
- Cualquier dependencia que requiera React 18 o inferior

## Blockchain mocking - Enfoque seguro
- Los tests de blockchain ahora están completamente aislados del entorno de desarrollo.
- Solo se ejecutan en el entorno de testing explícito.
- Se removieron las dependencias problemáticas de `@veramo/*` que requerían Git.

## Recomendaciones
- Revisar periódicamente nuevas versiones de los paquetes mencionados.
- Mantener el blockchain mocking aislado en entorno de testing únicamente.
- Evitar dependencias que requieran Git o acceso a repositorios externos durante el build.

## Tests habilitados
- Tests básicos de API (`src/api/__tests__/proposals.test.ts`)
- Tests de componentes UI
- Tests de servicios básicos

## Tests deshabilitados por seguridad
- `test/Governance.test.skip.ts`: Tests de Hardhat/EVM (mantener deshabilitado)
- `src/api/__tests__/treasury.e2e.test.ts`: Tests de treasury con blockchain
- Tests que requieran dependencias externas de Git

---
Última actualización: 2025-05-25
