import EnhancedTag from './Tag/EnhancedTag';

/**
 * @deprecated
 */
export default class Tag extends EnhancedTag {

    /**
     *
     * @param {Api} api
     * @param {Object} [data={}]
     */
    constructor(api, data = {}) {
        console.trace('Deprecated tag class used');
        super(data, api);
    }
}