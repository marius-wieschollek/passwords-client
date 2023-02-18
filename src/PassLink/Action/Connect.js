import PassLinkAction from './PassLinkAction';
import HttpRequest from '../../Network/HttpRequest';

export default class Connect extends PassLinkAction {

    /**
     * @param {Object} parameters
     */
    constructor(parameters) {
        if(!parameters.hasOwnProperty('id') && parameters.path.length > 8) {
            parameters.id = parameters.path.substr(8, 36);
        }

        super(parameters);
        this._codes = null;
        this._clientLabel = null;
        this._theme = null;
        this._promise = null;
    }

    /**
     * Get the suggested name of the client
     *
     * @return {(null|String)}
     */
    getClientLabel() {
        return this._clientLabel;
    }

    /**
     * Set the suggested name of the client
     *
     * @param {String} value
     * @return {Connect}
     */
    setClientLabel(value) {
        this._clientLabel = value;

        return this;
    }

    /**
     * Get the theme from the link
     *
     * @return {Promise<null|object>|null}
     */
    async getTheme() {
        if(this._theme !== null) return this._theme;

        return await this._loadTheme();
    }

    /**
     *
     * @return {[]}
     */
    getCodes() {
        if(this._codes !== null) return this._codes;

        let codes = [],
            spec  = new RegExp('^(?=\\S*[a-z])(?=\\S*[A-Z])(?=\\S*[\\d])\\S*$');

        while(codes.length < 4) {
            let code = Array(4)
                .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
                .map(x => x[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * x.length)])
                .join('');

            if(spec.test(code)) codes.push(code);
        }

        this._codes = codes;
        return codes;
    }

    /**
     * Apply for the registration
     *
     * @return {Promise<void>}
     */
    apply() {
        if(this._promise === null) {
            this._promise = this._sendRequest();
        }

        return this._promise;
    }

    /**
     *
     * @return {Promise<void>}
     * @private
     */
    async _sendRequest() {
        let url     = `${this._parameters.baseUrl}index.php/apps/passwords/link/connect/apply`,
            request = new HttpRequest(url);

        let data = {
            id   : this._parameters.id,
            codes: this.getCodes()
        };

        if(this._clientLabel !== null) data.label = this._clientLabel;

        let response = await request.setData(data).send();

        return response.getData();
    }

    /**
     *
     * @private
     */
    async _loadTheme() {
        let url     = `${this._parameters.baseUrl}index.php/apps/passwords/link/connect/theme`,
            request = new HttpRequest(url);

        let data = {id: this._parameters.id};

        try {
            let response = await request.setData(data).send();
            this._theme = response.getData();

            return response.getData();
        } catch(e) {
            return null;
        }
    }
}