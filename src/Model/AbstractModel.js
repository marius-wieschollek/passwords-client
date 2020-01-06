import UnknownPropertyError from '../Exception/UnknownPropertyError';

export default class AbstractModel {

    constructor(properties = {}, data = {}) {
        this._properties = properties;
        this._originalData = {};
        this._data = {};
        this._setProperties(data);
        this._originalData = {};
    }

    _getProperty(property) {
        if(!this._properties.hasOwnProperty(property)) {
            throw new UnknownPropertyError(`Read access to unknown property ${property}`);
        }

        if(!this._data.hasOwnProperty(property)) {
            return undefined;
        }

        return this._data[property];
    }

    _setProperty(property, value) {
        if(!this._properties.hasOwnProperty(property)) {
            throw new UnknownPropertyError(`Write access to unknown property ${property}`);
        }

        this._originalData[property] = this._data[property];
        this._data[property] = value;

        return this;
    }

    _getProperties() {
        let data = {};

        for(let key in this._properties) {
            if(!this._properties.hasOwnProperty(key)) continue;

            data[key] = this._getProperty(key);
        }

        return data;
    }

    _setProperties(properties) {
        for(let key in properties) {
            if(!properties.hasOwnProperty(key)) continue;

            this._setProperty(key, properties[key]);
        }

        return this;
    }

    toJSON() {
        return this._getProperties();
    }
}