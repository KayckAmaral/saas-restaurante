import express from 'express';
import AutenticacaoController from '../controllers/autenticacaoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new AutenticacaoController();
const auth = new AuthMiddleware();

// POST /autenticacao/token — login
router.post('/token', (req, res) => controller.token(req, res));

// GET /autenticacao/usuario — retorna o usuário logado (requer autenticação)
router.get('/usuario', (req, res, next) => auth.validar(req, res, next), (req, res) => controller.usuario(req, res));

// POST /autenticacao/logout — logout
router.post('/logout', (req, res) => controller.logout(req, res));

export default router;
