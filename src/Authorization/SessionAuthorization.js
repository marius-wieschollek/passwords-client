import PWDv1Challenge from './Challenge/PWDv1Challenge';
import CSEv1Keychain from '../Encryption/Keychain/CSEv1Keychain';
import AbstractToken from './Token/AbstractToken';

export default class SessionAuthorization {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
        this._challenge = null;
        this._activeToken = null;
        this._tokens = [];
        this._loaded = false;
    }

    /**
     *
     * @return {Promise<void>}
     */
    async load() {
        if(this._loaded) return;
        this._loaded = true;
        let response = await this._api.getRequest()
            .setPath('api/1.0/session/request')
            .send();

        let requirements = response.getData();
        if(requirements.hasOwnProperty('challenge')) {
            this._createChallenge(requirements.challenge);
        }
        if(requirements.hasOwnProperty('token')) {
            this._createTokens(requirements.token);
        }
    }

    /**
     *
     * @return {Boolean}
     * @deprecated
     */
    hasChallenge() {
        return this.requiresChallenge();
    }

    /**
     *
     * @return {Boolean}
     */
    requiresChallenge() {
        return this._challenge !== null;
    }

    /**
     *
     * @returns {PWDv1Challenge}
     */
    getChallenge() {
        return this._challenge;
    }

    /**
     *
     * @return {Boolean}
     */
    requiresToken() {
        return this._tokens.length !== 0;
    }

    /**
     *
     * @return {AbstractToken[]}
     */
    getTokens() {
        return this._tokens;
    }

    /**
     *
     * @return {(AbstractToken|null)}
     */
    getActiveToken() {
        return this._activeToken;
    }

    /**
     *
     * @param {(AbstractToken|String|null)} tokenId
     * @return {SessionAuthorization}
     */
    setActiveToken(tokenId) {
        if(tokenId instanceof AbstractToken) {
            tokenId = tokenId.getId();
        }

        if(tokenId === null) {
            this._activeToken = null;
        }

        for(let token of this._tokens) {
            if(token.getId() === tokenId) {
                this._activeToken = token;
            }
        }

        return this;
    }

    /**
     *
     * @param {String} [password]
     * @param {(String|AbstractToken)} [token]
     * @return {Promise<void>}
     */
    async authorize(password, token) {
        let data = {};
        if(this.requiresChallenge()) {
            if(password) {
                data.challenge = this._challenge
                    .setPassword(password)
                    .solve();
            } else {
                data.challenge = this._challenge.solve();
            }
        }

        if(this.requiresToken()) {
            if(token) this.setActiveToken(token);
            token = this.getActiveToken();

            data.token = {};
            data.token[token.getId()] = token.getToken();
        }

        let request = await this._api.getRequest()
            .setPath('api/1.0/session/open')
            .setData(data);

        let response = await request.send();
        if(response.getData().success) {
            if(this.requiresChallenge()) {
                let keychain = new CSEv1Keychain(response.getData().keys.CSEv1r1, this._challenge.getPassword());
                this._api.getCseV1Encryption().setKeychain(keychain);
            }
            request.getSession().setAuthorized(true);
        }
    }

    /**
     *
     * @param {Object} challenge
     * @private
     */
    _createChallenge(challenge) {
        if(challenge.type === 'PWDv1r1') {
            this._challenge = this._api.getClass('challenge.pwdv1', challenge);
        } else {
            throw new this._api.getClass('exception.challenge');
        }
    }

    /**
     *
     * @param {Object[]} tokens
     * @private
     */
    _createTokens(tokens) {
        this._tokens = [];

        for(let token of tokens) {
            if(token.type === 'user-token') {
                let model = this._api.getClass('token.user', this._api, token.id, token.label, token.description, token.request);
                this._tokens.push(model);
            }
            if(token.type === 'request-token') {
                let model = this._api.getClass('token.request', this._api, token.id, token.label, token.description, token.request);
                this._tokens.push(model);
            }
        }

        if(this._tokens.length === 0 && tokens.length !== 0) {
            throw new this._api.getClass('exception.token');
        }
    }
}