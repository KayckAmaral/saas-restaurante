import Entity from './entity.js';

export default class MarcaEntity extends Entity {

    #id;
    #nome;
    #ativo;

    get id()    { return this.#id; }
    set id(v)   { this.#id = v; }

    get nome()  { return this.#nome; }
    set nome(v) { this.#nome = v; }

    get ativo() { return this.#ativo; }
    set ativo(v){ this.#ativo = v; }

    constructor(id, nome, ativo) {
        super();
        this.#id    = id;
        this.#nome  = nome;
        this.#ativo = ativo;
    }

    static toMap(row) {
        return new MarcaEntity(row['id_marca'], row['nome'], row['ativo']);
    }

    validar() {
        return this.#nome != null && this.#nome.trim().length > 0;
    }
}
