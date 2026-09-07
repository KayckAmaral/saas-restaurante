import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

import autenticacaoRouter from './routes/autenticacaoRouter.js';
import pessoaFisicaRouter from './routes/pessoaFisicaRouter.js';
import marcaRouter from './routes/marcaRouter.js';

const require = createRequire(import.meta.url);
const swaggerJson = require('./swagger.json');

const server = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares globais ──────────────────────────────────────────────────────
server.use(express.json());
server.use(cookieParser());
server.use(cors({
    origin: [
        'http://localhost:3000',
        `http://${process.env.VM_IP || '137.131.159.192'}`
    ],
    credentials: true
}));

// ── Swagger ──────────────────────────────────────────────────────────────────
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson, {
    swaggerOptions: { withCredentials: true }
}));

// ── Rotas ────────────────────────────────────────────────────────────────────
server.use('/autenticacao', autenticacaoRouter);
server.use('/pessoa-fisica', pessoaFisicaRouter);
server.use('/marca', marcaRouter);

// ── Health check ─────────────────────────────────────────────────────────────
server.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação: http://localhost:${PORT}/docs`);
});
