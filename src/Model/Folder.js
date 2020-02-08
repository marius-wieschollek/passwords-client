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
        console.trace('Deprecated folder class used');
        super(data, api);
    }
}