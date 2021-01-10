import AbstractConverter from './AbstractConverter';

export default class FolderConverter extends AbstractConverter {

    /**
     * @param {BasicPasswordsClient} client
     */
    constructor(client) {
        super(client, 'folder');
    }
}