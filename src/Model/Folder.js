import EnhancedFolder from './Folder/EnhancedFolder';

/**
 * @deprecated
 */
export default class Folder extends EnhancedFolder {

    /**
     *
     * @param {Api} api
     * @param {Object} [data={}]
     */
    constructor(api, data = {}) {
        super(data, api);
    }
}