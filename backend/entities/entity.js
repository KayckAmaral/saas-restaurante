export default class Entity {

    constructor() {}

    // toJSON genérico herdado por todas as entidades
    toJSON() {
        const props = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        const json = {};
        for (const prop of props) {
            json[prop] = this[prop];
        }
        return json;
    }
}
