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
        super(data, api);
    }
}