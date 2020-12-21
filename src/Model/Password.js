import EnhancedPassword from './Password/EnhancedPassword';

/**
 * @deprecated
 */
export default class Password extends EnhancedPassword {

    /**
     *
     * @param {BasicPasswordsClient} api
     * @param {Object} [data={}]
     */
    constructor(api, data = {}) {
        console.trace('Deprecated password class used');
        super(data, api);
    }
}