import ConfigruationError from '../../Exception/ConfigruationError';
import Properties from '../../Configuration/Server.json';
import AbstractModel from './../AbstractModel';
import ObjectMerger from '../../Utility/ObjectMerger';

export default class Server extends AbstractModel {

    get MODEL_TYPE() {return 'server';}

    /**
     *
     * @param {Object} data
     * @param {(Object|null)} [properties=null]
     */
    constructor(data = {}, properties = null) {
        if(!data.hasOwnProperty('baseUrl') || data.baseUrl.substr(0, 5) !== 'https') {
            throw new ConfigruationError('Base URL missing or invalid');
        }

        if(properties !== null) ObjectMerger.merge(Properties, properties);
        super(Properties, data);
    }

    /**
     * @return {String}
     */
    getBaseUrl() {
        return this.getProperty('baseUrl');
    }

    /**
     * @param {String} value
     *
     * @return {Server}
     */
    setBaseUrl(value) {
        if(value.substr(0, 5) !== 'https') {
            throw new ConfigruationError('Base URL missing or invalid');
        }

        return this.setProperty('baseUrl', value);
    }

    /**
     * @return {String}
     */
    getUser() {
        return this.getProperty('user');
    }

    /**
     * @param {String} value
     *
     * @return {Server}
     */
    setUser(value) {
        return this.setProperty('user', value);
    }

    /**
     * @return {String}
     */
    getToken() {
        return this.getProperty('token');
    }

    /**
     * @param {String} value
     *
     * @return {Server}
     */
    setToken(value) {
        return this.setProperty('token', value);
    }

    /**
     * @return {String}
     */
    getApiUrl() {
        return `${this.getBaseUrl()}index.php/apps/passwords/api/`;
    }
}