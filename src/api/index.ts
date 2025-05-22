import express from 'express';
import proposalsRouter from './routes/proposals';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import path from 'path';

const app = express();
app.use(express.json());

// Solo servir frontend estático y catch-all si NO estamos en test
if (process.env.NODE_ENV !== 'test') {
  app.use(express.static(path.join(__dirname, '../dist')));

  // Catch-all para SPA: cualquier ruta no-API devuelve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Las rutas de API deben ir antes de este fallback
app.use('/api/proposals', proposalsRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env['PORT'] || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
