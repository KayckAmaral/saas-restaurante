import jwt from 'jsonwebtoken';
import PessoaFisicaRepository from '../repositories/pessoaFisicaRepository.js';

const SEGREDO = process.env.JWT_SEGREDO || 'saas-restaurante-segredo-dev';

export default class AuthMiddleware {

    gerarToken(id, nome, login) {
        return jwt.sign({ id, nome, login }, SEGREDO);
    }

    async validar(req, res, next) {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ msg: 'Token não encontrado!' });
        }

        try {
            const payload = jwt.verify(token, SEGREDO);
            const repo    = new PessoaFisicaRepository();
            const usuario = await repo.obter(payload.id);

            if (!usuario) {
                return res.status(404).json({ msg: 'Usuário não encontrado' });
            }
            if (!usuario.ativo) {
                return res.status(401).json({ msg: 'Usuário inativo' });
            }

            req.usuarioLogado = usuario;
            next();
        } catch (ex) {
            console.error(ex);
            return res.status(401).json({ msg: 'Token inválido!' });
        }
    }
}
