import AbstractModel from '../Model/AbstractModel';

export default class AbstractCollection {

    /**
     *
     * @param {AbstractConverter} converter
     * @param {AbstractModel} elements
     */
    constructor(converter, ...elements) {
        this._index = 0;

        /** @type AbstractConverter **/
        this._converter = converter;

        /** @type AbstractModel[] **/
        this._elements = this._getParamArray(elements);
    }

    /**
     * @param elements
     * @api
     */
    add(...elements) {
        elements = this._getParamArray(elements);

        for(let element of elements) {
            this._addElement(element);
        }
    }

    /**
     * @param {(String|AbstractModel)} ids
     * @api
     */
    remove(...ids) {
        ids = this._getParamArray(ids);

        for(let id of ids) {
            if(typeof id === 'string') {
                this._removeElement(id);
            } else {
                this._removeElement(id.getId());
            }
        }
    }

    /**
     * @param {(String|AbstractModel)} id
     * @api
     */
    has(id) {
        id = typeof id === 'string' ? id:id.getId();

        for(let element in this._elements) {
            if(element.getId() === id) return true;
        }

        return false;
    }

    /**
     * @param {(String|Object|AbstractModel)} element
     * @private
     */
    _addElement(element) {
        if(typeof element === 'string') {
            this._elements.push(this._converter.fromJSON(element));
        } else if(element instanceof AbstractModel) {
            this._elements.push(element);
        } else if(element instanceof Object) {
            this._elements.push(this._converter.fromObject(element));
        } else {
            throw new Error('Element is not processable');
        }
    }

    /**
     * @param {String} id
     * @private
     */
    _removeElement(id) {
        for(let i = 0; i < this._elements.length; i++) {
            if(this._elements[i].getId() === id) {
                this._elements.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * @param {(Array|Object|String)} parameter
     * @return {Array}
     * @private
     */
    _getParamArray(parameter) {
        if(Array.isArray(parameter)) {
            if(parameter.length === 1) {
                let element = parameter.pop();
                return Array.isArray(element) ? element:[element];
            }

            return parameter;
        }

        return [parameter];
    }

    /**
     * @return {String[]}
     */
    toJSON() {
        let json = [];

        for(let element of this._elements) {
            json.push(this._converter.toObject(element));
        }

        return JSON.stringify(json);
    }

    [Symbol.iterator]() {
        return {
            /**
             * @return {{value: AbstractModel, done: boolean}|{done: boolean}}
             */
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