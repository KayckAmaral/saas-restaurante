import PessoaFisicaEntity from '../entities/pessoaFisicaEntity.js';
import PessoaFisicaRepository from '../repositories/pessoaFisicaRepository.js';

export default class PessoaFisicaController {

    #repo;

    constructor() {
        this.#repo = new PessoaFisicaRepository();
    }

    async listar(req, res) {
        try {
            const lista = await this.#repo.listar();
            if (lista.length === 0) {
                return res.status(404).json({ msg: 'Nenhuma pessoa física encontrada.' });
            }
            return res.status(200).json(lista);
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao listar pessoas físicas.' });
        }
    }

    async obter(req, res) {
        try {
            const { id } = req.params;
            const entidade = await this.#repo.obter(id);
            if (!entidade) {
                return res.status(404).json({ msg: 'Pessoa física não encontrada.' });
            }
            return res.status(200).json(entidade);
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao obter pessoa física.' });
        }
    }

    async gravar(req, res) {
        try {
            const { nome, telefone, endereco, cpf, dataNascimento, login, senha, idPessoaJuridica } = req.body;

            const entidade = new PessoaFisicaEntity(
                0, nome, telefone, endereco, true,
                cpf, dataNascimento, login, senha, idPessoaJuridica
            );

            if (!entidade.validar()) {
                return res.status(400).json({ msg: 'O campo nome é obrigatório.' });
            }

            await this.#repo.gravar(entidade);
            // Remove a senha do retorno por segurança
            entidade.senha = undefined;
            return res.status(201).json(entidade);

        } catch (ex) {
            console.error(ex);
            // Trata erro de login duplicado (unique constraint)
            if (ex.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ msg: 'CPF ou login já cadastrado.' });
            }
            return res.status(500).json({ msg: 'Erro ao cadastrar pessoa física.' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id, nome, telefone, endereco, cpf, dataNascimento, login, idPessoaJuridica } = req.body;

            if (!id || !nome) {
                return res.status(400).json({ msg: 'ID e nome são obrigatórios.' });
            }

            const existente = await this.#repo.obter(id);
            if (!existente) {
                return res.status(404).json({ msg: 'Pessoa física não encontrada.' });
            }

            const entidade = new PessoaFisicaEntity(
                id, nome, telefone, endereco, existente.ativo,
                cpf, dataNascimento, login, null, idPessoaJuridica
            );

            await this.#repo.atualizar(entidade);
            return res.status(200).json({ msg: 'Pessoa física atualizada com sucesso.' });

        } catch (ex) {
            console.error(ex);
            if (ex.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ msg: 'CPF ou login já cadastrado.' });
            }
            return res.status(500).json({ msg: 'Erro ao atualizar pessoa física.' });
        }
    }

    async inativar(req, res) {
        try {
            const { id } = req.params;
            const existente = await this.#repo.obter(id);
            if (!existente) {
                return res.status(404).json({ msg: 'Pessoa física não encontrada.' });
            }
            await this.#repo.inativar(id);
            return res.status(200).json({ msg: 'Pessoa física inativada com sucesso.' });
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao inativar pessoa física.' });
        }
    }
}
