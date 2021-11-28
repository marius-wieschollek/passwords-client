import BasicClassLoader from "../ClassLoader/BasicClassLoader";
import DefaultClassLoader from "../ClassLoader/DefaultClassLoader";
import BasicPasswordsClient from "./BasicPasswordsClient";

export default class PasswordsClient extends BasicPasswordsClient {

    /**
     *
     * @param {(Object|Server)} server
     * @param {Object} [config={}]
     * @param {(Object|BasicClassLoader|DefaultClassLoader)} [classes={}]
     */
    constructor(server, config = {}, classes = {}) {
        if(!(classes instanceof BasicClassLoader)) {
            classes = new DefaultClassLoader(classes);
        }

        if(!server.getApiUrl || typeof server.getApiUrl !== "function") {
            server = classes.getInstance('model.server', server)
        }

        super(server, config, classes);
    }
}