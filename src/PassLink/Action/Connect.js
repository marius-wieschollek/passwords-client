import PassLinkAction from './PassLinkAction';
import HttpRequest from '../../Network/HttpRequest';

export default class Connect extends PassLinkAction {

    /**
     *
     * @param {Object} parameters
     */
    constructor(parameters) {
        super(parameters);
        this._codes = null;
        this._clientLabel = null;
        this._theme = null;
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
    getTheme() {
        if(this._theme !== null) return this._theme;

        return this._decodeTheme();
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
    async apply() {
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
    async _decodeTheme() {
        if(!this._parameters.hasOwnProperty('theme')) return null;

        let pako   = await import(/* webpackChunkName: "pako" */ 'pako'),
            base64 = this._parameters.theme,
            zipped = atob(base64),
            json   = pako.inflate(zipped, {to: 'string'}),
            theme  = JSON.parse(json);

        if(theme.hasOwnProperty('color')) {
            theme['color.primary'] = theme.color;
            delete theme.color;
        }
        if(theme.hasOwnProperty('txtColor')) {
            theme['color.text'] = theme.txtColor;
            delete theme.txtColor;
        }
        if(theme.hasOwnProperty('bgColor')) {
            theme['color.background'] = theme.bgColor;
            delete theme.bgColor;
        }
        if(theme.hasOwnProperty('background')) {
            theme.background = this._parameters.baseUrl + theme.background;
        }
        if(theme.hasOwnProperty('logo')) {
            theme.logo = this._parameters.baseUrl + theme.logo;
        }

        this._theme = theme;

        return theme;
    }
}