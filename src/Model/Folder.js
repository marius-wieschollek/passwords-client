import AbstractModel from './AbstractModel';
import Properties from '../Configuration/Password';

export default class Folder extends AbstractModel {

    /**
     *
     * @param {Api} api
     * @param {Object} [data={}]
     */
    constructor(api, data = {}) {
        super(Properties, data);
        this._api = api;
    }

    getId() {
        return this._getProperty('id');
    }

    setId(value) {
        return this._setProperty('id', value);
    }

    getLabel() {
        return this._getProperty('label');
    }

    setLabel(value) {
        return this._setProperty('label', value);
    }

    /**
     *
     * @returns {Server}
     */
    getServer() {
        return this._api.getServer();
    }

    /**
     *
     * @returns {Promise<Folder[]>}
     */
    async fetchRevisions() {

    }

    /**
     *
     * @returns {Promise<Password[]>}
     */
    async fetchPasswords() {

    }
}