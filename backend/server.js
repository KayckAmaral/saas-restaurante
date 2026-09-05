import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import autenticacaoRouter from './routes/autenticacaoRouter.js';
import pessoaFisicaRouter from './routes/pessoaFisicaRouter.js';

const server = express();
const PORT   = process.env.PORT || 5000;

// ── Middlewares globais ──────────────────────────────────────────────────────
server.use(express.json());
server.use(cookieParser());
server.use(cors({
    origin: [
        'http://localhost:3000',              // Next.js local
        `http://${process.env.VM_IP || '137.131.159.192'}` // VM em produção
    ],
    credentials: true  // necessário para envio de cookies httpOnly
}));

// ── Rotas ────────────────────────────────────────────────────────────────────
server.use('/autenticacao', autenticacaoRouter);
server.use('/pessoa-fisica', pessoaFisicaRouter);

// ── Health check ─────────────────────────────────────────────────────────────
server.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Start ─────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
