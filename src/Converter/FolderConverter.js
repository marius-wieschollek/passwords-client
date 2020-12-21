import AbstractConverter from './AbstractConverter';

export default class FolderConverter extends AbstractConverter {

    /**
     * @param {BasicPasswordsClient} api
     */
    constructor(api) {
        super(api, 'folder');
    }
}