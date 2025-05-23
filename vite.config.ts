import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// ⚠️ Importación dinámica de lovable-tagger porque es ESM-only
// Esto es necesario en Vite 5+ cuando usas plugins ESM-only en proyectos TypeScript
export default defineConfig(async ({ mode }: { mode: string }) => {
  // Importa el plugin solo cuando se ejecuta la config
  const { componentTagger } = await import('lovable-tagger');
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), componentTagger()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']
    }
  };
});

/*
Justificación:
- lovable-tagger es ESM-only, por lo que debe importarse dinámicamente en Vite 5+ si tu config es TypeScript o CJS.
- No es necesario cambiar a .mjs si usas este patrón, pero si tienes más plugins ESM-only, usa este mismo approach.
- No es obligatorio poner "type": "module" en package.json si mantienes la config así, pero si migras todo tu proyecto a ESM puro, sí deberías hacerlo.
- Si usas otros plugins ESM-only, impórtalos igual: const { plugin } = await import('plugin-name');
*/
