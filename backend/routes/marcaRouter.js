import express from 'express';
import MarcaController from '../controllers/marcaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new MarcaController();
const auth = new AuthMiddleware();

const proteger = (req, res, next) => auth.validar(req, res, next);

// GET  /marca              — lista todas (requer autenticação)
router.get('/', proteger, (req, res) => controller.listar(req, res));

// GET  /marca/:id           — busca por id
router.get('/:id', proteger, (req, res) => controller.obter(req, res));

// POST /marca               — cadastrar nova
router.post('/', proteger, (req, res) => controller.gravar(req, res));

// PUT  /marca                — atualizar
router.put('/', proteger, (req, res) => controller.atualizar(req, res));

// PATCH /marca/:id/inativar — exclusão lógica
router.patch('/:id/inativar', proteger, (req, res) => controller.inativar(req, res));

export default router;
