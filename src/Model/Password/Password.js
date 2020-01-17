import Properties from '../../Configuration/Password';
import AbstractModel from '../AbstractModel';

export default class Password extends AbstractModel {

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
    getId() {
        return this.getProperty('id');
    }

    /**
     * @param {String} value
     *
     * @return {Password}
     */
    setId(value) {
        return this.setProperty('id', value);
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

    getCustomFields() {
        return JSON.parse(this.getProperty('customFields'));
    }

    setCustomFields(value) {
        return this.setProperty('customFields', JSON.stringify(value));
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
     * @return {string}
     */
    getRevision() {
        return this.getProperty('revision');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     */
    setRevision(value) {
        return this.setProperty('revision', value);
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

    getShared() {
        return this.getProperty('shared');
    }

    setShared(value) {
        return this.setProperty('shared', value);
    }

    /**
     * @return {string}
     */
    getCseType() {
        return this.getProperty('cseType');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     */
    setCseType(value) {
        return this.setProperty('cseType', value);
    }

    /**
     * @return {string}
     */
    getCseKey() {
        return this.getProperty('cseKey');
    }

    /**
     *
     * @param {string} value
     * @return {Password}
     */
    setCseKey(value) {
        return this.setProperty('cseKey', value);
    }

    /**
     * @return {string}
     */
    getSseType() {
        return this.getProperty('sseType');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     */
    setSseType(value) {
        return this.setProperty('sseType', value);
    }

    /**
     * @return {string}
     */
    getClient() {
        return this.getProperty('client');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     */
    setClient(value) {
        return this.setProperty('client', value);
    }

    /**
     * @return {Boolean}
     */
    getHidden() {
        return this.getProperty('hidden');
    }

    /**
     * @param {Boolean} value
     *
     * @return {Password}
     */
    setHidden(value) {
        return this.setProperty('hidden', value);
    }

    /**
     * @return {Boolean}
     */
    getTrashed() {
        return this.getProperty('trashed');
    }

    /**
     * @param {Boolean} value
     *
     * @return {Password}
     */
    setTrashed(value) {
        return this.setProperty('trashed', value);
    }

    /**
     * @return {Boolean}
     */
    getFavorite() {
        return this.getProperty('favorite');
    }

    /**
     * @param {Boolean} value
     *
     * @return {Password}
     */
    setFavorite(value) {
        return this.setProperty('favorite', value);
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

    /**
     * @return {Date}
     */
    getEdited() {
        return this.getProperty('edited');
    }

    /**
     * @param {Date} value
     *
     * @return {Password}
     */
    setEdited(value) {
        return this.setProperty('edited', value);
    }

    /**
     * @return {Date}
     */
    getCreated() {
        return this.getProperty('created');
    }

    /**
     * @param {Date} value
     *
     * @return {Password}
     */
    setCreated(value) {
        return this.setProperty('created', value);
    }

    /**
     * @return {Date}
     */
    getUpdated() {
        return this.getProperty('updated');
    }

    /**
     * @param {Date} value
     *
     * @return {Password}
     */
    setUpdated(value) {
        return this.setProperty('updated', value);
    }
}