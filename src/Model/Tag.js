import AbstractModel from './AbstractModel';
import Properties from '../Configuration/Password';

export default class Tag extends AbstractModel {

    /**
     *
     * @param {Server} server
     * @param {Object} [data={}]
     */
    constructor(server, data = {}) {
        super(Properties, data);
        this._server = server;
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

    getColor() {
        return this._getProperty('color');
    }

    setColor(value) {
        return this._setProperty('color', value);
    }

    /**
     *
     * @returns {Server}
     */
    getServer() {
        return this._server;
    }

    /**
     *
     * @param {Server} value
     */
    setServer(value) {
        this._server = value;
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