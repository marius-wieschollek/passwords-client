import ConfigurationError from "../Exception/ConfigruationError";

export default class BaseApi {

    /**
     *
     * @param server
     * @param config
     * @param classes
     */
    constructor(server, config, classes) {
        this._setConfig(config);
        this._classes = classes;
        this._classes.setInstance('model.server', server);
        this._classes.setInstance('api', this);

        this._server = server;
        this._session = this._classes.getInstance('model.session', server.getUser(), server.getToken());
        this._events = this._classes.getInstance('event.event');
    }

    /**
     *
     * @param {String} event
     * @param {Function} listener
     */
    on(event, listener) {
        this._events.on(event, listener);
    }

    /**
     *
     * @param {String} event
     * @param {Function} listener
     */
    once(event, listener) {
        this._events.once(event, listener);
    }

    /**
     *
     * @param {String} event
     * @param {Function} listener
     */
    off(event, listener) {
        this._events.off(event, listener);
    }

    /**
     *
     * @param {String} event
     * @param {Object} data
     */
    emit(event, data) {
        this._events.emit(event, data);
    }

    /**
     *
     * @return {Server}
     */
    getServer() {
        return this._server;
    }

    /**
     *
     * @return {ApiRequest}
     */
    getRequest() {
        /** @type {ApiRequest} **/
        let request = this.getClass('network.request', this, this._server.getApiUrl(), this.getSession());
        if(this._config.userAgent !== null) {
            request.setUserAgent(this._config.userAgent);
        }

        return request;
    }

    /**
     * @returns {Session}
     */
    getSession() {
        return this._session
                   .setUser(this._server.getUser())
                   .setToken(this._server.getToken());
    }

    /**
     *
     * @returns {SessionAuthorization}
     */
    getSessionAuthorization() {
        return this.getInstance('authorization.session');
    }

    /**
     *
     * @returns {PasswordRepository}
     */
    getPasswordRepository() {
        return this.getInstance('repository.password');
    }

    /**
     *
     * @returns {FolderRepository}
     */
    getFolderRepository() {
        return this.getInstance('repository.folder');
    }

    /**
     *
     * @returns {TagRepository}
     */
    getTagRepository() {
        return this.getInstance('repository.tag');
    }

    /**
     *
     * @returns {CSEv1Encryption}
     */
    getCseV1Encryption() {
        return this.getInstance('encryption.csev1');
    }

    /**
     *
     * @returns {CSEv1Encryption}
     */
    getDefaultEncryption() {
        let mode = 'auto';
        if(this._config.hasOwnProperty('defaultEncryption')) {
            mode = this._config.defaultEncryption;
        }

        if(mode === 'none') {
            return this.getInstance('encryption.none');
        }
        if(mode === 'csev1') {
            return this.getInstance('encryption.csev1');
        }

        let csev1 = this.getInstance('encryption.csev1');
        if(csev1.enabled()) return csev1;

        return this.getInstance('encryption.none');
    }

    /**
     *
     * @param parameters
     * @return {*}
     */
    getInstance(...parameters) {
        return this._classes.getInstance(...parameters)
    }

    /**
     *
     * @param parameters
     * @return {*}
     */
    setInstance(...parameters) {
        return this._classes.setInstance(...parameters)
    }

    /**
     *
     * @param parameters
     * @return {*}
     */
    getClass(...parameters) {
        return this._classes.getClass(...parameters)
    }

    /**
     *
     * @param config
     * @private
     */
    _setConfig(config) {
        if(!config.hasOwnProperty('userAgent')) {
            config.userAgent = null;
        }

        if(config.hasOwnProperty('defaultEncryption') && ['auto', 'none', 'csev1'].indexOf(config.defaultEncryption) === -1) {
            throw new ConfigurationError('Invalid default encryption');
        } else {
            config.defaultEncryption = 'auto';
        }

        this._config = config;
    }
}