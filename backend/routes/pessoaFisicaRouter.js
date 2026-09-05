import express from 'express';
import PessoaFisicaController from '../controllers/pessoaFisicaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new PessoaFisicaController();
const auth = new AuthMiddleware();

const proteger = (req, res, next) => auth.validar(req, res, next);

// GET  /pessoa-fisica       — lista todas (requer autenticação)
router.get('/', proteger, (req, res) => controller.listar(req, res));

// GET  /pessoa-fisica/:id   — busca por id
router.get('/:id', proteger, (req, res) => controller.obter(req, res));

// POST /pessoa-fisica        — cadastrar nova
router.post('/', proteger, (req, res) => controller.gravar(req, res));

// PUT  /pessoa-fisica        — atualizar
router.put('/', proteger, (req, res) => controller.atualizar(req, res));

// PATCH /pessoa-fisica/:id/inativar — exclusão lógica
router.patch('/:id/inativar', proteger, (req, res) => controller.inativar(req, res));

export default router;
