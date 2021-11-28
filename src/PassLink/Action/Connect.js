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
    async _decodeTheme() {
        if(this._parameters.hasOwnProperty('t')) {
            let pako   = await import(/* webpackChunkName: "pako" */ 'pako'),
                base64 = this._parameters.t,
                zipped = atob(base64),
                data   = pako.inflate(zipped, {to: 'string'});

            return this._themeFromV1(data);
        } else if(this._parameters.hasOwnProperty('theme')) {
            let pako   = await import(/* webpackChunkName: "pako" */ 'pako'),
                base64 = this._parameters.theme,
                zipped = atob(base64),
                data   = pako.inflate(zipped, {to: 'string'});

            return this._themeFromJson(data);
        }
        return null;
    }

    /**
     * @param {String} data
     * @return {Object|null}
     * @private
     */
    _themeFromJson(data) {
        let theme = JSON.parse(data);

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
        if(theme.hasOwnProperty('background') && theme.background.substr(0, 8) !== 'https://') {
            theme.background = this._parameters.baseUrl + theme.background;
        }
        if(theme.hasOwnProperty('logo')) {
            theme.logo = this._parameters.baseUrl + theme.logo;
        }

        this._theme = theme;

        return theme;
    }

    /**
     * @param {String} data
     * @return {Object|null}
     * @private
     */
    _themeFromV1(data) {
        let parts = data.split('|');
        if(parts.length !== 6) return null;

        let theme = {};

        theme['label'] = parts[0];
        theme['logo'] = `${this._parameters.baseUrl}/${parts[1]}`;
        theme['background'] = parts[2].substr(0, 3) === '://' ? `https${parts[2]}`:`${this._parameters.baseUrl}/${parts[2]}`;
        theme['color.primary'] = parts[3].length === 6 ? '#' + parts[3]:parts[3];
        theme['color.text'] = parts[4].length === 6 ? '#' + parts[4]:parts[4];
        theme['color.background'] = parts[5].length === 6 ? '#' + parts[5]:parts[5];

        this._theme = theme;

        return theme;
    }
}