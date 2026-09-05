import Repository from './repository.js';
import PessoaFisicaEntity from '../entities/pessoaFisicaEntity.js';
import bcrypt from 'bcryptjs';

export default class PessoaFisicaRepository extends Repository {

    constructor() {
        super();
    }

    async listar() {
        // Busca todas as pessoas físicas com JOIN em PESSOA (dados base)
        const sql = `
            SELECT p.id_pessoa, p.nome, p.telefone, p.endereco, p.ativo,
                   pf.cpf, pf.data_nascimento, pf.login, pf.senha, pf.id_pessoa_juridica
            FROM PESSOA p
            INNER JOIN PESSOA_FISICA pf ON p.id_pessoa = pf.id_pessoa
            WHERE p.ativo = true
            ORDER BY p.nome
        `;
        const rows = await this.banco.ExecutaComando(sql);
        return rows.map(r => PessoaFisicaEntity.toMap(r));
    }

    async obter(id) {
        const sql = `
            SELECT p.id_pessoa, p.nome, p.telefone, p.endereco, p.ativo,
                   pf.cpf, pf.data_nascimento, pf.login, pf.senha, pf.id_pessoa_juridica
            FROM PESSOA p
            INNER JOIN PESSOA_FISICA pf ON p.id_pessoa = pf.id_pessoa
            WHERE p.id_pessoa = ?
        `;
        const rows = await this.banco.ExecutaComando(sql, [id]);
        return rows.length > 0 ? PessoaFisicaEntity.toMap(rows[0]) : null;
    }

    async gravar(entidade) {
        // 1) Insere na tabela PESSOA
        const sqlPessoa = `
            INSERT INTO PESSOA (nome, telefone, endereco, tipo, ativo)
            VALUES (?, ?, ?, 'F', true)
        `;
        const id = await this.banco.ExecutaComandoLastInserted(sqlPessoa, [
            entidade.nome,
            entidade.telefone ?? null,
            entidade.endereco ?? null
        ]);

        // 2) Hash da senha se for usuário do sistema
        let senhaHash = null;
        if (entidade.senha) {
            senhaHash = await bcrypt.hash(entidade.senha, 10);
        }

        // 3) Insere na tabela PESSOA_FISICA (mesma PK)
        const sqlFisica = `
            INSERT INTO PESSOA_FISICA (id_pessoa, cpf, data_nascimento, login, senha, id_pessoa_juridica)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await this.banco.ExecutaComandoNonQuery(sqlFisica, [
            id,
            entidade.cpf ?? null,
            entidade.dataNascimento ?? null,
            entidade.login ?? null,
            senhaHash,
            entidade.idPessoaJuridica ?? null
        ]);

        entidade.id = id;
        entidade.senha = senhaHash;
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

        // Atualiza PESSOA_FISICA (sem mexer na senha aqui — use trocarSenha)
        const sqlFisica = `
            UPDATE PESSOA_FISICA SET cpf = ?, data_nascimento = ?, login = ?, id_pessoa_juridica = ?
            WHERE id_pessoa = ?
        `;
        return await this.banco.ExecutaComandoNonQuery(sqlFisica, [
            entidade.cpf ?? null,
            entidade.dataNascimento ?? null,
            entidade.login ?? null,
            entidade.idPessoaJuridica ?? null,
            entidade.id
        ]);
    }

    async inativar(id) {
        // Exclusão lógica — ativo = false
        const sql = `UPDATE PESSOA SET ativo = false WHERE id_pessoa = ?`;
        return await this.banco.ExecutaComandoNonQuery(sql, [id]);
    }

    async trocarSenha(id, novaSenha) {
        const senhaHash = await bcrypt.hash(novaSenha, 10);
        const sql = `UPDATE PESSOA_FISICA SET senha = ? WHERE id_pessoa = ?`;
        return await this.banco.ExecutaComandoNonQuery(sql, [senhaHash, id]);
    }

    // Usado pelo AuthMiddleware para validar login
    async validarAcesso(login, senha) {
        const sql = `
            SELECT p.id_pessoa, p.nome, p.telefone, p.endereco, p.ativo,
                   pf.cpf, pf.data_nascimento, pf.login, pf.senha, pf.id_pessoa_juridica
            FROM PESSOA p
            INNER JOIN PESSOA_FISICA pf ON p.id_pessoa = pf.id_pessoa
            WHERE pf.login = ? AND p.ativo = true
        `;
        const rows = await this.banco.ExecutaComando(sql, [login]);
        if (rows.length === 0) return null;

        const usuario = PessoaFisicaEntity.toMap(rows[0]);
        const senhaOk = await bcrypt.compare(senha, usuario.senha);
        return senhaOk ? usuario : null;
    }
}
