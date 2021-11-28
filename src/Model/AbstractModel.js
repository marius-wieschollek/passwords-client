import UnknownPropertyError from '../Exception/UnknownPropertyError';

export default class AbstractModel {

    /**
     * @param {Object} properties
     * @param {Object} [data={}]
     */
    constructor(properties, data = {}) {
        this._properties = properties;
        this._originalData = {};
        this._data = {};
        this.setProperties(data);
        this._originalData = {};
    }

    /**
     *
     * @param {String} property
     * @return {boolean}
     */
    hasProperty(property) {
        return this._properties.hasOwnProperty(property);
    }

    /**
     * @param {String} property
     *
     * @return {*}
     * @api
     */
    getProperty(property) {
        if(!this.hasProperty(property)) {
            throw new UnknownPropertyError(property, this);
        }

        if(!this._data.hasOwnProperty(property)) {
            return undefined;
        }

        return this._data[property];
    }

    /**
     * @param {String} property
     * @param {*} value
     *
     * @return {this}
     * @api
     */
    setProperty(property, value) {
        if(!this.hasProperty(property)) {
            throw new UnknownPropertyError(property, this);
        }

        this._originalData[property] = this._data[property];
        this._data[property] = value;

        return this;
    }

    /**
     * @return {{}}
     * @api
     */
    getProperties() {
        let data = {};

        for(let key in this._properties) {
            if(!this._properties.hasOwnProperty(key)) continue;

            data[key] = this.getProperty(key);
        }

        return data;
    }

    /**
     * @param {Object} properties
     *
     * @return {this}
     * @api
     */
    setProperties(properties) {
        for(let key in properties) {
            if(!properties.hasOwnProperty(key)) continue;

            this.setProperty(key, properties[key]);
        }

        return this;
    }

    /**
     * @return {Object}
     */
    getPropertyConfiguration() {
        return this._properties;
    }

    /**
     *
     * @return {{}}
     * @api
     */
    toJSON() {
        return this.getProperties();
    }
}