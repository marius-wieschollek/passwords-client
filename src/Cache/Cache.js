export default class Cache {

    constructor() {
        this._data = {};
    }

    has(key) {
        return this._data.hasOwnProperty(key);
    }

    get(key) {
        if(this.has(key)) {
            return this._data[key].value;
        }

        return null;
    }

    set(key, value, type = null) {
        this._data[key] = {value, type};
    }

    remove(key) {
        delete this._data[key];
    }

    clear() {
        this._data = {};
    }

    getByType(type) {
        let results = [];
        for(let key in this._data) {
            if(!this._data.hasOwnProperty(key)) continue;
            let element = this._data[key];

            if(element.type === type) {
                results.push(element.value);
            }
        }

        return results;
    }
}