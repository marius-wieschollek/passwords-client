export default class Session {

    constructor(user = null, token = null, id = null, authorized = false) {
        this._user = user;
        this._token = token;
        this._id = id;
        this._authorized = authorized;
    }

    /**
     * @return {String}
     */
    getId() {
        return this._id;
    }

    /**
     * @param {String} value
     *
     * @return {Session}
     */
    setId(value) {
        this._id = value;

        return this;
    }

    /**
     * @return {String}
     */
    getUser() {
        return this._user;
    }

    /**
     * @param {String} value
     *
     * @return {Session}
     */
    setUser(value) {
        this._user = value;

        return this;
    }

    /**
     * @return {String}
     */
    getToken() {
        return this._token;
    }

    /**
     * @param {String} value
     *
     * @return {Session}
     */
    setToken(value) {
        this._token = value;

        return this;
    }

    /**
     *
     * @return {Boolean}
     */
    getAuthorized() {
        return this._authorized;
    }

    /**
     * @param {Boolean} value
     *
     * @return {Session}
     */
    setAuthorized(value) {
        this._authorized = value;

        return this;
    }


}