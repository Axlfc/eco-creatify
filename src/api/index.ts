import express from 'express';
import proposalsRouter from './routes/proposals';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import path from 'path';

const app = express();
app.use(express.json());

// --- SERVIR FRONTEND SPA DESDE /build ---
// 1. Servir archivos estáticos del frontend compilado (Vite/React/etc)
app.use(express.static(path.join(__dirname, '../../build')));

// 2. Catch-all: cualquier ruta que NO sea /api/* devuelve index.html (soporte SPA)
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});
// --- FIN SERVIR FRONTEND SPA ---

// Rutas de API (deben ir después del static/catch-all para no ser sobreescritas)
app.use('/api/proposals', proposalsRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env['PORT'] || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
