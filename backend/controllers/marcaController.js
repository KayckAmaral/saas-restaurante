import MarcaEntity from '../entities/marcaEntity.js';
import MarcaRepository from '../repositories/marcaRepository.js';

export default class MarcaController {

    #repo;

    constructor() {
        this.#repo = new MarcaRepository();
    }

    async listar(req, res) {
        try {
            const lista = await this.#repo.listar();
            if (lista.length === 0) {
                return res.status(404).json({ msg: 'Nenhuma marca encontrada.' });
            }
            return res.status(200).json(lista);
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao listar marcas.' });
        }
    }

    async obter(req, res) {
        try {
            const { id } = req.params;
            const entidade = await this.#repo.obter(id);
            if (!entidade) {
                return res.status(404).json({ msg: 'Marca não encontrada.' });
            }
            return res.status(200).json(entidade);
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao obter marca.' });
        }
    }

    async gravar(req, res) {
        try {
            const { nome } = req.body;
            const entidade = new MarcaEntity(0, nome, true);

            if (!entidade.validar()) {
                return res.status(400).json({ msg: 'O campo nome é obrigatório.' });
            }

            await this.#repo.gravar(entidade);
            return res.status(201).json(entidade);

        } catch (ex) {
            console.error(ex);
            // Trata erro de nome duplicado (unique constraint)
            if (ex.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ msg: 'Já existe uma marca com esse nome.' });
            }
            return res.status(500).json({ msg: 'Erro ao cadastrar marca.' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id, nome } = req.body;

            if (!id || !nome) {
                return res.status(400).json({ msg: 'ID e nome são obrigatórios.' });
            }

            const existente = await this.#repo.obter(id);
            if (!existente) {
                return res.status(404).json({ msg: 'Marca não encontrada.' });
            }

            const entidade = new MarcaEntity(id, nome, existente.ativo);

            if (!entidade.validar()) {
                return res.status(400).json({ msg: 'O campo nome é obrigatório.' });
            }

            await this.#repo.atualizar(entidade);
            return res.status(200).json({ msg: 'Marca atualizada com sucesso.' });

        } catch (ex) {
            console.error(ex);
            if (ex.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ msg: 'Já existe uma marca com esse nome.' });
            }
            return res.status(500).json({ msg: 'Erro ao atualizar marca.' });
        }
    }

    async inativar(req, res) {
        try {
            const { id } = req.params;
            const existente = await this.#repo.obter(id);
            if (!existente) {
                return res.status(404).json({ msg: 'Marca não encontrada.' });
            }
            await this.#repo.inativar(id);
            return res.status(200).json({ msg: 'Marca inativada com sucesso.' });
        } catch (ex) {
            console.error(ex);
            return res.status(500).json({ msg: 'Erro ao inativar marca.' });
        }
    }
}
