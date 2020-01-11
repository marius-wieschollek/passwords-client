import AbstractToken from './AbstractToken';

export default class UserToken extends AbstractToken {

    /**
     *
     * @return {string}
     */
    getType() {
        return 'user-token';
    }

    /**
     *
     * @param {string} value
     * @return {UserToken}
     */
    setToken(value) {
        this._token = value;

        return this;
    }
}