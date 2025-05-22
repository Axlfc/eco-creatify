# Escenarios de uso y casos límite: Prototipo DID + validación comunitaria

## Escenario 1: Usuario obtiene validación suficiente
- El usuario genera su DID.
- Recibe 3 validaciones comunitarias (mock).
- Se emite una credencial verificable de prueba de humanidad.

## Escenario 2: Usuario no alcanza el umbral de validaciones
- El usuario genera su DID.
- Recibe solo 2 validaciones.
- No se emite credencial.
- El sistema informa que no se alcanzó el umbral.

## Escenario 3: Validadores duplicados
- Si un validador intenta validar dos veces, solo cuenta la primera.
- El sistema ignora validaciones duplicadas.

## Escenario 4: Validaciones fuera de tiempo
- Si las validaciones llegan después de un tiempo límite (no implementado en el prototipo), podrían ser ignoradas.

## Escenario 5: Emisión y verificación de credencial
- La credencial emitida puede ser verificada por cualquier parte compatible con W3C VC/JWT.

---

Estos escenarios pueden ser extendidos en una integración real con BrightID/PoH y lógica de disputas.
