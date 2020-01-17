export default class AbstractCollection {

    /**
     *
     * @param {Api} api
     * @param {AbstractModel[]} elements
     */
    constructor(api, ...elements) {
        this._api = api;
        this._index = 0;
        this._elements = [];

        if(Array.isArray(elements)) {
            if(elements.length === 1) {
                let element = elements.pop();
                this._elements = Array.isArray(element) ? element:[element];
            } else {
                this._elements = elements;
            }
        }
    }

    /**
     *
     * @param elements
     * @api
     */
    add(...elements) {
        for(let element of elements) {
            if(element === null) {
                throw new Error('Element is null');
            } else if(typeof element === 'string') {
                this._elements.push(this._makeModelFromJSON(element));
            } else if(typeof element === 'object' && element.constructor && element.constructor.name === 'Object') {
                this._elements.push(this._makeModelFromData(element));
            } else if(typeof element === 'object' && element.getId) {
                this._elements.push(element);
            } else {
                throw new Error('Element is not processable');
            }
        }
    }

    /**
     *
     * @param {String} string
     * @return {Promise<AbstractModel>}
     * @protected
     */
    _makeModelFromJSON(string) {
        let data = JSON.parse(string);

        if(typeof data === 'object' && data !== null && data.constructor && data.constructor.name === 'Object') {
            return this._makeModelFromData(data);
        }

        throw new Error('Invalid JSON string');
    }

    /**
     *
     * @param {Object} data
     * @return {Promise<AbstractModel>}
     * @protected
     */
    _makeModelFromData(data) {
        throw Error('Collection._makeModelFromData() is not implemented');
    }

    [Symbol.iterator]() {
        return {
            next: () => {
                if(this._index < this._elements.length) {
                    return {
                        value: this._elements[this._index++],
                        done : false
                    };
                } else {
                    this._index = 0;
                    return {done: true};
                }
            }
        };
    }
}