# Prototipo base: Sistema DID con validación comunitaria (Veramo + prueba de humanidad mock)

Este ejemplo muestra cómo:
- Generar un DID para un usuario usando Veramo.
- Simular validaciones comunitarias (mock, como si fueran de BrightID/Proof of Humanity).
- Emitir una credencial verificable tras alcanzar el umbral de validaciones.

## Uso

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ejecuta el ejemplo:
   ```bash
   npx ts-node src/did-community-demo.ts
   ```

## Archivos principales
- `src/did-community-demo.ts`: Código principal del flujo DID + validación comunitaria.

## Flujo
1. **Generación de DID**: Se crea un DID local para el usuario.
2. **Solicitar validaciones**: Se simulan validaciones comunitarias (mock).
3. **Emisión de credencial**: Al alcanzar el umbral, se emite una credencial verificable de "Prueba de humanidad".

## Notas
- No se conecta a BrightID/PoH real, solo simula el flujo.
- El código está documentado paso a paso.
- Puedes modificar el umbral de validaciones en el archivo de ejemplo.

---

Este prototipo es solo para pruebas y referencia.
