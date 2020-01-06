export default class Session {

    constructor() {
        this._user = null;
        this._token = null;
        this._id = null;
        this._authorized = false;
    }

    getUser() {
        return this._user;
    }

    setUser(value) {
        this._user = value;

        return this;
    }

    getToken() {
        return this._token;
    }

    setToken(value) {
        this._token = value;

        return this;
    }

    getId() {
        return this._id;
    }

    setId(value) {
        this._id = value;

        return this;
    }

    getAuthorized() {
        return this._authorized;
    }

    setAuthorized(value) {
        this._authorized = value;

        return this;
    }


}