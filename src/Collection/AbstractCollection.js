import AbstractModel from '../Model/AbstractModel';

export default class AbstractCollection {

    /**
     * @return {Number}
     */
    get length() {
        return this._elements.length;
    }

    /**
     *
     * @param {AbstractConverter} converter
     * @param {AbstractModel} elements
     */
    constructor(converter, ...elements) {
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

        for(let element of this._elements) {
            if(element.getId() === id) return true;
        }

        return false;
    }

    /**
     * @param {(Number|String)} index
     * @return {AbstractModel|string|null}
     * @api
     */
    get(index) {
        if(this._elements.hasOwnProperty(index)) {
            return this._elements[index];
        }

        for(let element of this._elements) {
            if(element.getId() === index) return element;
        }

        return null;
    }

    /**
     * Get the first item from the collection
     *
     * @returns {AbstractModel|null}
     */
    first() {
        if(this._elements.length === 0) return null;
        return this._elements[0];
    }

    /**
     * Get the last item from the collection
     *
     * @returns {AbstractModel|null}
     */
    last() {
        if(this._elements.length === 0) return null;
        return this._elements[this._elements.length - 1];
    }

    /**
     * Applies the callback to every item in the collection and returns the result
     *
     * @param {Function} callback
     * @returns {Array<*>}
     */
    map(callback) {
        let items      = [],
            collection = this.getReference();

        for(let item of collection) {
            items.push(callback(item));
        }

        return items;
    }

    /**
     * Get a reference to the internal items array
     *
     * @returns {AbstractModel[]}
     * @api
     */
    getReference() {
        return this._elements;
    }

    /**
     * Get a clone of the internal items array
     *
     * @returns {AbstractModel[]}
     * @api
     */
    getClone() {
        return this._elements.slice(0);
    }

    /**
     *
     * @param {(AbstractModel|AbstractModel[])} elements
     */
    replaceAll(...elements) {
        /** @type AbstractModel[] **/
        this._elements = this._getParamArray(elements);
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
     * @return {Object}
     */
    toJSON() {
        let json = [];

        for(let element of this._elements) {
            json.push(this._converter.toObject(element));
        }

        return json;
    }

    [Symbol.iterator]() {
        let index = 0;
        return {
            /**
             * @return {{value: AbstractModel, done: boolean}|{done: boolean}}
             */
            next: () => {
                if(index < this._elements.length) {
                    return {
                        value: this._elements[index++],
                        done : false
                    };
                } else {
                    index = 0;
                    return {done: true};
                }
            }
        };
    }
}