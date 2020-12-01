import SessionAuthorization from '../Authorization/SessionAuthorization';
import Server from '../Model/Server/Server';
import BaseClassLoader from "../ClassLoader/BaseClassLoader";
import DefaultClassLoader from "../ClassLoader/DefaultClassLoader";
import BaseApi from "./BaseApi";

export default class Api extends BaseApi {

    /**
     *
     * @param {Server} server
     * @param {Object} [config={}]
     * @param {Object} [classes={}]
     */
    constructor(server, config = {}, classes = {}) {
        if(!(classes instanceof BaseClassLoader)) {
            classes = new DefaultClassLoader(classes);
        }

        super(server, config, classes);
    }

    /**
     *
     * @returns {SessionAuthorization}
     * @deprecated
     */
    getSessionAuthorisation() {
        console.trace('API.getSessionAuthorisation() is deprecated. Use API.getSessionAuthorization() instead');
        return this.getSessionAuthorization();
    }
}