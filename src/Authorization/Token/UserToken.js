import AbstractToken from './AbstractToken';

export default class UserToken extends AbstractToken {

    /**
     *
     * @return {String}
     */
    getType() {
        return 'user-token';
    }

    /**
     *
     * @param {String} value
     * @return {UserToken}
     */
    setToken(value) {
        this._token = value;

        return this;
    }
}