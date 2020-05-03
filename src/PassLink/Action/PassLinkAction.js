export default class PassLinkAction {
    constructor(parameters) {
        this._parameters = parameters;
    }

    /**
     *
     * @return {Object}
     */
    getParameters() {
        return this._parameters;
    }

    /**
     *
     * @param {String} name
     * @return {*}
     */
    getParameter(name) {
        if(this._parameters.hasOwnProperty(name)) {
            return this._parameters[name];
        }

        return null;
    }

}