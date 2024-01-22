import Properties from '../../Configuration/Folder.json';
import AbstractRevisionModel from '../AbstractRevisionModel';

export default class Folder extends AbstractRevisionModel {

    get MODEL_TYPE() {return 'folder';}

    /**
     *
     * @param {Object} [data={}]
     */
    constructor(data = {}) {
        super(Properties, data);
    }

    /**
     * @return {String}
     */
    getLabel() {
        return this.getProperty('label');
    }

    /**
     * @param {String} value
     *
     * @return {Folder}
     */
    setLabel(value) {
        return this.setProperty('label', value);
    }

    /**
     * @return {String}
     */
    getParentId() {
        if(this._properties.hasOwnProperty('parent')) {
            return this.getParent().getId();
        }

        return this.getProperty('parentId');
    }

    /**
     * @param {String} value
     *
     * @return {Folder}
     */
    setParentId(value) {
        if(this._properties.hasOwnProperty('parent')) {
            return this.setParent(null);
        }

        this.setProperty('parentId', value);

        return this;
    }

    /**
     * @return {Folder}
     */
    getParent() {
        return this.getProperty('parent');
    }

    /**
     * @param {Folder} value
     *
     * @return {Folder}
     */
    setParent(value) {
        return this.setProperty('parent', value);
    }

    /**
     * @return {(FolderCollection|null)}
     */
    getFolders() {
        return this.getProperty('folders');
    }

    /**
     * @param {(FolderCollection|null)} value
     *
     * @return {Folder}
     */
    setFolders(value) {
        return this.setProperty('folders', value);
    }

    /**
     * @return {(PasswordCollection|null)}
     */
    getPasswords() {
        return this.getProperty('passwords');
    }

    /**
     * @param {(PasswordCollection|null)} value
     *
     * @return {Folder}
     */
    setPasswords(value) {
        return this.setProperty('passwords', value);
    }

    /**
     * @return {(FolderCollection|null)}
     */
    getRevisions() {
        return this.getProperty('revisions');
    }

    /**
     * @param {(FolderCollection|null)} value
     *
     * @return {Folder}
     */
    setRevisions(value) {
        return this.setProperty('revisions', value);
    }
}