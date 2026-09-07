import Entity from './entity.js';

export default class PessoaJuridicaEntity extends Entity {

    #id;
    #nome;
    #telefone;
    #endereco;
    #ativo;
    #cnpj;
    #razaoSocial;

    get id()           { return this.#id; }
    set id(v)          { this.#id = v; }

    get nome()          { return this.#nome; }
    set nome(v)         { this.#nome = v; }

    get telefone()      { return this.#telefone; }
    set telefone(v)     { this.#telefone = v; }

    get endereco()       { return this.#endereco; }
    set endereco(v)      { this.#endereco = v; }

    get ativo()          { return this.#ativo; }
    set ativo(v)         { this.#ativo = v; }

    get cnpj()            { return this.#cnpj; }
    set cnpj(v)           { this.#cnpj = v; }

    get razaoSocial()     { return this.#razaoSocial; }
    set razaoSocial(v)    { this.#razaoSocial = v; }

    constructor(id, nome, telefone, endereco, ativo, cnpj, razaoSocial) {
        super();
        this.#id          = id;
        this.#nome        = nome;
        this.#telefone    = telefone;
        this.#endereco    = endereco;
        this.#ativo       = ativo;
        this.#cnpj        = cnpj;
        this.#razaoSocial = razaoSocial;
    }

    static toMap(row) {
        return new PessoaJuridicaEntity(
            row['id_pessoa'],
            row['nome'],
            row['telefone'],
            row['endereco'],
            row['ativo'],
            row['cnpj'],
            row['razao_social']
        );
    }

    validar() {
        return this.#nome != null && this.#nome.trim().length > 0 &&
               this.#cnpj != null && this.#cnpj.trim().length > 0 &&
               this.#razaoSocial != null && this.#razaoSocial.trim().length > 0;
    }
}
