import Properties from '../../Configuration/Password';
import AbstractRevisionModel from '../AbstractRevisionModel';

export default class Password extends AbstractRevisionModel {

    get MODEL_TYPE() {return 'password';}

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
     * @return {Password}
     */
    setLabel(value) {
        return this.setProperty('label', value);
    }

    /**
     * @return {String}
     */
    getUserName() {
        return this.getProperty('username');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setUserName(value) {
        return this.setProperty('username', value);
    }

    /**
     * @return {String}
     */
    getPassword() {
        return this.getProperty('password');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setPassword(value) {
        return this.setProperty('password', value);
    }

    /**
     * @return {String}
     */
    getUrl() {
        return this.getProperty('url');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setUrl(value) {
        return this.setProperty('url', value);
    }

    /**
     * @return {String}
     */
    getNotes() {
        return this.getProperty('notes');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setNotes(value) {
        return this.setProperty('notes', value);
    }

    /**
     * @return {CustomFieldCollection}
     */
    getCustomFields() {
        return this.getProperty('customFields');
    }

    /**
     * @param {CustomFieldCollection} value
     * @return {Password}
     */
    setCustomFields(value) {
        return this.setProperty('customFields', value);
    }

    /**
     * @return {Number}
     */
    getStatus() {
        return this.getProperty('status');
    }

    /**
     * @param {Number} value
     *
     * @return {Password}
     */
    setStatus(value) {
        return this.setProperty('status', value);
    }

    /**
     * @return {String}
     */
    getStatusCode() {
        return this.getProperty('statusCode');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setStatusCode(value) {
        return this.setProperty('statusCode', value);
    }

    /**
     * @return {String}
     */
    getHash() {
        return this.getProperty('hash');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setHash(value) {
        return this.setProperty('hash', value);
    }

    /**
     * @return {String}
     */
    getFolder() {
        return this.getProperty('folder');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setFolder(value) {
        return this.setProperty('folder', value);
    }

    /**
     * @return {(string|null)}
     */
    getShare() {
        return this.getProperty('share');
    }

    /**
     * @param {(string|null)} value
     *
     * @return {Password}
     */
    setShare(value) {
        return this.setProperty('share', value);
    }

    /**
     * @return {Boolean}
     */
    isShared() {
        return this.getProperty('shared');
    }

    /**
     * @return {Boolean}
     */
    getShared() {
        return this.getProperty('shared');
    }

    /**
     * @return {Boolean}
     */
    setShared(value) {
        return this.setProperty('shared', value);
    }

    /**
     * @return {Boolean}
     */
    isEditable() {
        return this.getProperty('editable');
    }

    /**
     * @return {Boolean}
     */
    getEditable() {
        return this.getProperty('editable');
    }

    /**
     * @param {Boolean} value
     *
     * @return {Password}
     */
    setEditable(value) {
        return this.setProperty('editable', value);
    }
}