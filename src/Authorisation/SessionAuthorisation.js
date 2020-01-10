import PWDv1Challenge from './Challenge/PWDv1Challenge';
import CSEv1Keychain from '../Encryption/Keychain/CSEv1Keychain';

export default class SessionAuthorisation {

    /**
     *
     * @param {Api} api
     */
    constructor(api) {
        this._api = api;
        this._challenge = null;
        this._token = null;
    }

    async load() {
        let response = await this._api.getRequest()
            .setPath('api/1.0/session/request')
            .send();

        let requirements = response.getData();
        if(requirements.hasOwnProperty('challenge')) {
            this._challenge = new PWDv1Challenge(requirements.challenge)
        }

        return this;
    }

    hasChallenge() {
        return this._challenge !== null;
    }

    /**
     * 
     * @returns {PWDv1Challenge}
     */
    getChallenge() {
        return this._challenge;
    }

    hasToken() {
        return this._token !== null;
    }

    getToken() {
        return this._token;
    }

    async authorize(password, token) {
        let data = {};
        if(this.hasChallenge()) {
            if(password) {
                data.challenge = this._challenge
                    .setPassword(password)
                    .solve();
            } else {
                data.challenge = this._challenge.solve();
            }
        }

        let request = await this._api.getRequest()
            .setPath('api/1.0/session/open')
            .setData(data);

        let response = await request.send();
        if(response.getData().success) {
            if(this.hasChallenge()) {
                let keychain = new CSEv1Keychain(response.getData().keys.CSEv1r1, this._challenge.getPassword());
                this._api.getCseV1Encryption().setKeychain(keychain);
            }
            request.getSession().setAuthorized(true);
        }
    }

}