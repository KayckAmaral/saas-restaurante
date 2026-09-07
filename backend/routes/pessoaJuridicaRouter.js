import express from 'express';
import PessoaJuridicaController from '../controllers/pessoaJuridicaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const controller = new PessoaJuridicaController();
const auth = new AuthMiddleware();

const proteger = (req, res, next) => auth.validar(req, res, next);

// GET  /pessoa-juridica       — lista todas (requer autenticação)
router.get('/', proteger, (req, res) => controller.listar(req, res));

// GET  /pessoa-juridica/:id   — busca por id
router.get('/:id', proteger, (req, res) => controller.obter(req, res));

// POST /pessoa-juridica        — cadastrar nova
router.post('/', proteger, (req, res) => controller.gravar(req, res));

// PUT  /pessoa-juridica        — atualizar
router.put('/', proteger, (req, res) => controller.atualizar(req, res));

// PATCH /pessoa-juridica/:id/inativar — exclusão lógica
router.patch('/:id/inativar', proteger, (req, res) => controller.inativar(req, res));

export default router;
