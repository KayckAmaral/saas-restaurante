import Repository from './repository.js';
import PessoaJuridicaEntity from '../entities/pessoaJuridicaEntity.js';

export default class PessoaJuridicaRepository extends Repository {

    constructor() {
        super();
    }

    async listar() {
        // Busca todas as pessoas jurídicas com JOIN em PESSOA (dados base)
        const sql = `
            SELECT p.id_pessoa, p.nome, p.telefone, p.endereco, p.ativo,
                   pj.cnpj, pj.razao_social
            FROM PESSOA p
            INNER JOIN PESSOA_JURIDICA pj ON p.id_pessoa = pj.id_pessoa
            WHERE p.ativo = true
            ORDER BY p.nome
        `;
        const rows = await this.banco.ExecutaComando(sql);
        return rows.map(r => PessoaJuridicaEntity.toMap(r));
    }

    async obter(id) {
        const sql = `
            SELECT p.id_pessoa, p.nome, p.telefone, p.endereco, p.ativo,
                   pj.cnpj, pj.razao_social
            FROM PESSOA p
            INNER JOIN PESSOA_JURIDICA pj ON p.id_pessoa = pj.id_pessoa
            WHERE p.id_pessoa = ?
        `;
        const rows = await this.banco.ExecutaComando(sql, [id]);
        return rows.length > 0 ? PessoaJuridicaEntity.toMap(rows[0]) : null;
    }

    async gravar(entidade) {
        // 1) Insere na tabela PESSOA
        const sqlPessoa = `
            INSERT INTO PESSOA (nome, telefone, endereco, tipo, ativo)
            VALUES (?, ?, ?, 'J', true)
        `;
        const id = await this.banco.ExecutaComandoLastInserted(sqlPessoa, [
            entidade.nome,
            entidade.telefone ?? null,
            entidade.endereco ?? null
        ]);

        // 2) Insere na tabela PESSOA_JURIDICA (mesma PK)
        const sqlJuridica = `
            INSERT INTO PESSOA_JURIDICA (id_pessoa, cnpj, razao_social)
            VALUES (?, ?, ?)
        `;
        await this.banco.ExecutaComandoNonQuery(sqlJuridica, [
            id,
            entidade.cnpj,
            entidade.razaoSocial
        ]);

        entidade.id = id;
        return true;
    }

    async atualizar(entidade) {
        // Atualiza PESSOA
        const sqlPessoa = `
            UPDATE PESSOA SET nome = ?, telefone = ?, endereco = ?
            WHERE id_pessoa = ?
        `;
        await this.banco.ExecutaComandoNonQuery(sqlPessoa, [
            entidade.nome,
            entidade.telefone ?? null,
            entidade.endereco ?? null,
            entidade.id
        ]);

        // Atualiza PESSOA_JURIDICA
        const sqlJuridica = `
            UPDATE PESSOA_JURIDICA SET cnpj = ?, razao_social = ?
            WHERE id_pessoa = ?
        `;
        return await this.banco.ExecutaComandoNonQuery(sqlJuridica, [
            entidade.cnpj,
            entidade.razaoSocial,
            entidade.id
        ]);
    }

    async inativar(id) {
        // Exclusão lógica — ativo = false
        const sql = `UPDATE PESSOA SET ativo = false WHERE id_pessoa = ?`;
        return await this.banco.ExecutaComandoNonQuery(sql, [id]);
    }
}
