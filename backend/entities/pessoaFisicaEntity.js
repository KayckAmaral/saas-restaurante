import Entity from './entity.js';

export default class PessoaFisicaEntity extends Entity {

    #id;
    #nome;
    #telefone;
    #endereco;
    #ativo;
    #cpf;
    #dataNascimento;
    #login;
    #senha;
    #idPessoaJuridica;

    get id()               { return this.#id; }
    set id(v)              { this.#id = v; }

    get nome()             { return this.#nome; }
    set nome(v)            { this.#nome = v; }

    get telefone()         { return this.#telefone; }
    set telefone(v)        { this.#telefone = v; }

    get endereco()         { return this.#endereco; }
    set endereco(v)        { this.#endereco = v; }

    get ativo()            { return this.#ativo; }
    set ativo(v)           { this.#ativo = v; }

    get cpf()              { return this.#cpf; }
    set cpf(v)             { this.#cpf = v; }

    get dataNascimento()   { return this.#dataNascimento; }
    set dataNascimento(v)  { this.#dataNascimento = v; }

    get login()            { return this.#login; }
    set login(v)           { this.#login = v; }

    get senha()            { return this.#senha; }
    set senha(v)           { this.#senha = v; }

    get idPessoaJuridica() { return this.#idPessoaJuridica; }
    set idPessoaJuridica(v){ this.#idPessoaJuridica = v; }

    constructor(id, nome, telefone, endereco, ativo, cpf, dataNascimento, login, senha, idPessoaJuridica) {
        super();
        this.#id               = id;
        this.#nome             = nome;
        this.#telefone         = telefone;
        this.#endereco         = endereco;
        this.#ativo            = ativo;
        this.#cpf              = cpf;
        this.#dataNascimento   = dataNascimento;
        this.#login            = login;
        this.#senha            = senha;
        this.#idPessoaJuridica = idPessoaJuridica ?? null;
    }

    static toMap(row) {
        return new PessoaFisicaEntity(
            row['id_pessoa'],
            row['nome'],
            row['telefone'],
            row['endereco'],
            row['ativo'],
            row['cpf'],
            row['data_nascimento'],
            row['login'],
            row['senha'],
            row['id_pessoa_juridica'] ?? null
        );
    }

    validar() {
        return this.#nome != null && this.#nome.trim().length > 0;
    }
}
