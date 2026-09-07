import Repository from './repository.js';
import MarcaEntity from '../entities/marcaEntity.js';

export default class MarcaRepository extends Repository {

    constructor() {
        super();
    }

    async listar() {
        const sql = `SELECT id_marca, nome, ativo FROM MARCA WHERE ativo = true ORDER BY nome`;
        const rows = await this.banco.ExecutaComando(sql);
        return rows.map(r => MarcaEntity.toMap(r));
    }

    async obter(id) {
        const sql = `SELECT id_marca, nome, ativo FROM MARCA WHERE id_marca = ?`;
        const rows = await this.banco.ExecutaComando(sql, [id]);
        return rows.length > 0 ? MarcaEntity.toMap(rows[0]) : null;
    }

    async gravar(entidade) {
        const sql = `INSERT INTO MARCA (nome, ativo) VALUES (?, true)`;
        const id = await this.banco.ExecutaComandoLastInserted(sql, [entidade.nome]);
        entidade.id = id;
        return true;
    }

    async atualizar(entidade) {
        const sql = `UPDATE MARCA SET nome = ? WHERE id_marca = ?`;
        return await this.banco.ExecutaComandoNonQuery(sql, [entidade.nome, entidade.id]);
    }

    async inativar(id) {
        const sql = `UPDATE MARCA SET ativo = false WHERE id_marca = ?`;
        return await this.banco.ExecutaComandoNonQuery(sql, [id]);
    }
}
