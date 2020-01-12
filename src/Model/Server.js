import ConfigruationError from '../Exception/ConfigruationError';
import Properties from '../Configuration/Server';
import AbstractModel from './AbstractModel';
import ObjectMerger from '../Utility/ObjectMerger';

export default class Server extends AbstractModel {

    constructor(data = {}, properties = null) {
        if(!data.hasOwnProperty('baseUrl') || data.baseUrl.substr(0, 5) !== 'https') {
            throw new ConfigruationError('Base URL missing or invalid');
        }

        if(properties !== null) ObjectMerger.merge(Properties, properties);
        super(Properties, data);
    }

    getBaseUrl() {
        return this._getProperty('baseUrl');
    }

    setBaseUrl(value) {
        return this._setProperty('baseUrl', value);
    }

    getUser() {
        return this._getProperty('user');
    }

    setUser(value) {
        return this._setProperty('user', value);
    }

    getToken() {
        return this._getProperty('token');
    }

    setToken(value) {
        return this._setProperty('token', value);
    }

    getApiUrl() {
        return `${this.getBaseUrl()}index.php/apps/passwords/`;
    }
}