import AbstractConverter from './AbstractConverter';

export default class FolderConverter extends AbstractConverter {

    /**
     * @param {Api} api
     */
    constructor(api) {
        super(api, 'folder');
    }
}