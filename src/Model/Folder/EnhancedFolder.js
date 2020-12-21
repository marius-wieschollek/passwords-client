import Folder from './Folder';

export default class EnhancedFolder extends Folder {

    /**
     *
     * @param {Object} [data={}]
     * @param {BasicPasswordsClient} api
     */
    constructor(data = {}, api) {
        super(data);
        this._api = api;
    }

    /**
     *
     * @returns {Server}
     */
    getServer() {
        return this._api.getServer();
    }

    /**
     *
     * @returns {Promise<FolderCollection>}
     */
    async fetchRevisions() {
        if(this.getProperty('revisions') === undefined) {
            await this._api.getFolderRepository().findById(this.getId(), 'revisions');
        }

        return this.getProperty('revisions');
    }

    /**
     *
     * @returns {Promise<PasswordCollection>}
     */
    async fetchPasswords() {
        if(this.getProperty('passwords') === undefined) {
            await this._api.getFolderRepository().findById(this.getId(), 'passwords');
        }

        return this.getProperty('passwords');
    }

    /**
     *
     * @returns {Promise<FolderCollection>}
     */
    async fetchFolders() {
        if(this.getProperty('folders') === undefined) {
            await this._api.getFolderRepository().findById(this.getId(), 'folders');
        }

        return this.getProperty('folders');
    }

    /**
     *
     * @returns {Promise<Folder>}
     */
    async fetchParent() {
        if(this.getProperty('parent') === undefined) {
            await this._api.getFolderRepository().findById(this.getId(), 'parent');
        }

        return this.getProperty('parent');
    }
}