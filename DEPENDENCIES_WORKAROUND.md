# Estado de dependencias críticas y workaround provisional

**Fecha:** 2025-05-23

## Cambios recientes
- Se actualizó `next-themes` a `1.0.0-beta.0` para compatibilidad con React 19.
- Se intentó actualizar `react-day-picker` a la última versión, pero la build requiere mantener la versión `8.10.1` por dependencias cruzadas.
- Se usó `npm install --legacy-peer-deps` como workaround para resolver conflictos de dependencias entre React 19, next-themes y react-day-picker.

## Estado actual
- La build de producción (`npm run build`) y el arranque (`npm run dev`) funcionan correctamente.
- Existen advertencias de linting y de Vite sobre chunks grandes y configuración de módulos, pero no bloquean la build ni el desarrollo.
- No hay script de test definido en package.json, por lo que no se validaron tests automáticos.

## Paquetes críticos a monitorizar
- `next-themes` (actualmente en beta, revisar futuras versiones estables)
- `react-day-picker` (actualizar a 9.x cuando sea posible y compatible)
- Cualquier dependencia que requiera React 18 o inferior

## Recomendaciones
- Revisar periódicamente nuevas versiones de los paquetes mencionados.
- Migrar a alternativas modernas si los conflictos persisten o aparecen bugs.
- Añadir un script de test en package.json para facilitar la validación continua.

# Validación de dependencias y tests automáticos

- Tras cualquier actualización de dependencias críticas, ejecuta siempre:

  npm test

- El script de test ejecuta Jest sobre los archivos de test localizados en src/api/__tests__, src/tests, test, etc.
- Si aparecen errores, revisa los logs y resuelve antes de hacer deploy o actualizar más paquetes.

---
_Si necesitas actualizar dependencias críticas, revisa primero este archivo y la documentación de cada paquete._
