import AuthMiddleware from '../middlewares/authMiddleware.js';
import PessoaFisicaRepository from '../repositories/pessoaFisicaRepository.js';

export default class AutenticacaoController {

    #repo;

    constructor() {
        this.#repo = new PessoaFisicaRepository();
    }

    // GET /autenticacao/usuario — retorna o usuário logado (via cookie)
    async usuario(req, res) {
        // req.usuarioLogado é populado pelo authMiddleware.validar
        const u = req.usuarioLogado;
        return res.status(200).json({
            id:    u.id,
            nome:  u.nome,
            login: u.login,
            ativo: u.ativo
        });
    }

    // POST /autenticacao/token — recebe { login, senha } e devolve o token em cookie
    async token(req, res) {
        try {
            const { login, senha } = req.body;

            if (!login || !senha) {
                return res.status(400).json({ msg: 'Informe o login e a senha.' });
            }

            const usuario = await this.#repo.validarAcesso(login, senha);

            if (!usuario) {
                return res.status(401).json({ msg: 'Login ou senha inválidos.' });
            }

            const auth  = new AuthMiddleware();
            const token = auth.gerarToken(usuario.id, usuario.nome, usuario.login);

            // Cookie httpOnly — o navegador guarda e envia automaticamente
            res.cookie('token', token, { httpOnly: true });

            return res.status(200).json({
                token,
                usuario: {
                    id:    usuario.id,
                    nome:  usuario.nome,
                    login: usuario.login
                }
            });

        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao processar o login.' });
        }
    }

    // POST /autenticacao/logout — remove o cookie
    async logout(req, res) {
        res.clearCookie('token');
        return res.status(200).json({ msg: 'Logout realizado com sucesso.' });
    }
}
