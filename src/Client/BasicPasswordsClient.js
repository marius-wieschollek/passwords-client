import ConfigurationError from "../Exception/ConfigruationError";

export default class BasicPasswordsClient {

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
        this._classes.setInstance('client', this);
        this._classes.setInstance('classes', this._classes);

        this._server = server;
        this._events = this._classes.getInstance('event.event');
        this.renewSession();
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
     * @returns {Logger}
     */
    getLogger() {
        return this._classes.getInstance('logger');
    }

    /**
     * @returns {Boolean}
     */
    isAuthorized() {
        return this
            .getSession()
            .getAuthorized();
    }

    /**
     *
     * @return {ApiRequest}
     */
    getRequest() {
        /** @type {ApiRequest} **/
        let request = this._classes.getClass('network.request', this, this._server.getApiUrl(), this.getSession());
        if(this._config.userAgent !== null) {
            request.setUserAgent(this._config.userAgent);
        }

        return request;
    }

    /**
     * @returns {Session}
     */
    getSession() {
        return this
            ._session
            .setUser(this._server.getUser())
            .setToken(this._server.getToken());
    }

    /**
     * Replaces the session with a blank one
     *
     * @returns {Session}
     */
    renewSession() {
        this._session = this._classes.getClass('model.session', this._server.getUser(), this._server.getToken());
        this._classes.setInstance('session', this._session);
        this._classes.setInstance('model.session', this._session);
        this._classes.setInstance('authorization.session', this._classes.getClass('authorization.session'));
        return this._session;
    }

    /**
     *
     * @return {Session}
     */
    closeSession() {
        this.getRequest()
            .setPath('1.0/session/close')
            .send();

        return this.renewSession();
    }

    /**
     *
     * @returns {SessionAuthorization}
     */
    getSessionAuthorization() {
        return this._classes.getInstance('authorization.session');
    }

    /**
     *
     * @returns {PasswordRepository}
     */
    getPasswordRepository() {
        return this._classes.getInstance('repository.password');
    }

    /**
     *
     * @returns {FolderRepository}
     */
    getFolderRepository() {
        return this._classes.getInstance('repository.folder');
    }

    /**
     *
     * @returns {TagRepository}
     */
    getTagRepository() {
        return this._classes.getInstance('repository.tag');
    }

    /**
     *
     * @returns {CSEv1Encryption}
     */
    getCseV1Encryption() {
        return this._classes.getInstance('encryption.csev1');
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
            return this._classes.getInstance('encryption.none');
        }
        if(mode === 'csev1') {
            return this._classes.getInstance('encryption.csev1');
        }

        let csev1 = this._classes.getInstance('encryption.csev1');
        if(csev1.enabled()) return csev1;

        return this._classes.getInstance('encryption.none');
    }

    /**
     *
     * @param parameters
     * @return {*}
     */
    getInstance(...parameters) {
        return this._classes.getInstance(...parameters);
    }

    /**
     *
     * @param parameters
     * @return {*}
     */
    setInstance(...parameters) {
        return this._classes.setInstance(...parameters);
    }

    /**
     *
     * @param parameters
     * @return {*}
     */
    getClass(...parameters) {
        return this._classes.getClass(...parameters);
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return this.getServer().getProperties();
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