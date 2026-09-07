import PessoaJuridicaEntity from '../entities/pessoaJuridicaEntity.js';
import PessoaJuridicaRepository from '../repositories/pessoaJuridicaRepository.js';

export default class PessoaJuridicaController {

    #repo;

    constructor() {
        this.#repo = new PessoaJuridicaRepository();
    }

    async listar(req, res) {
        try {
            const lista = await this.#repo.listar();
            if (lista.length === 0) {
                return res.status(404).json({ msg: 'Nenhuma pessoa jurídica encontrada.' });
            }
            return res.status(200).json(lista);
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao listar pessoas jurídicas.' });
        }
    }

    async obter(req, res) {
        try {
            const { id } = req.params;
            const entidade = await this.#repo.obter(id);
            if (!entidade) {
                return res.status(404).json({ msg: 'Pessoa jurídica não encontrada.' });
            }
            return res.status(200).json(entidade);
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao obter pessoa jurídica.' });
        }
    }

    async gravar(req, res) {
        try {
            const { nome, telefone, endereco, cnpj, razaoSocial } = req.body;

            const entidade = new PessoaJuridicaEntity(
                0, nome, telefone, endereco, true, cnpj, razaoSocial
            );

            if (!entidade.validar()) {
                return res.status(400).json({ msg: 'Nome, CNPJ e razão social são obrigatórios.' });
            }

            await this.#repo.gravar(entidade);
            return res.status(201).json(entidade);

        } catch (ex) {
            console.error(ex);
            // Trata erro de CNPJ duplicado (unique constraint)
            if (ex.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ msg: 'CNPJ já cadastrado.' });
            }
            return res.status(500).json({ msg: 'Erro ao cadastrar pessoa jurídica.' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id, nome, telefone, endereco, cnpj, razaoSocial } = req.body;

            const existente = await this.#repo.obter(id);
            if (!existente) {
                return res.status(404).json({ msg: 'Pessoa jurídica não encontrada.' });
            }

            const entidade = new PessoaJuridicaEntity(
                id, nome, telefone, endereco, existente.ativo, cnpj, razaoSocial
            );

            if (!entidade.validar()) {
                return res.status(400).json({ msg: 'Nome, CNPJ e razão social são obrigatórios.' });
            }

            await this.#repo.atualizar(entidade);
            return res.status(200).json({ msg: 'Pessoa jurídica atualizada com sucesso.' });

        } catch (ex) {
            console.error(ex);
            if (ex.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ msg: 'CNPJ já cadastrado.' });
            }
            return res.status(500).json({ msg: 'Erro ao atualizar pessoa jurídica.' });
        }
    }

    async inativar(req, res) {
        try {
            const { id } = req.params;
            const existente = await this.#repo.obter(id);
            if (!existente) {
                return res.status(404).json({ msg: 'Pessoa jurídica não encontrada.' });
            }
            await this.#repo.inativar(id);
            return res.status(200).json({ msg: 'Pessoa jurídica inativada com sucesso.' });
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao inativar pessoa jurídica.' });
        }
    }
}
