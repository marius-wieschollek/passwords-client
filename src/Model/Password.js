import Properties from '../Configuration/Password';
import AbstractModel from './AbstractModel';

export default class Password extends AbstractModel {

    /**
     *
     * @param {Server} server
     * @param {Object} [data={}]
     */
    constructor(server, data = {}) {
        super(Properties, data);
        this._server = server;
    }

    getId() {
        return this._getProperty('id');
    }

    setId(value) {
        return this._setProperty('id', value);
    }

    getLabel() {
        return this._getProperty('label');
    }

    setLabel(value) {
        return this._setProperty('label', value);
    }

    getUserName() {
        return this._getProperty('username');
    }

    setUserName(value) {
        return this._setProperty('username', value);
    }

    getPassword() {
        return this._getProperty('password');
    }

    setPassword(value) {
        return this._setProperty('password', value);
    }

    getUrl() {
        return this._getProperty('url');
    }

    setUrl(value) {
        return this._setProperty('url', value);
    }

    getNotes() {
        return this._getProperty('notes');
    }

    setNotes(value) {
        return this._setProperty('notes', value);
    }

    getCustomFields() {
        return JSON.parse(this._getProperty('customFields'));
    }

    setCustomFields(value) {
        return this._setProperty('customFields', JSON.stringify(value));
    }

    getStatus() {
        return this._getProperty('status');
    }

    setStatus(value) {
        return this._setProperty('status', value);
    }

    getStatusCode() {
        return this._getProperty('statusCode');
    }

    setStatusCode(value) {
        return this._setProperty('statusCode', value);
    }

    getHash() {
        return this._getProperty('hash');
    }

    setHash(value) {
        return this._setProperty('hash', value);
    }

    getFolder() {
        return this._getProperty('folder');
    }

    setFolder(value) {
        return this._setProperty('folder', value);
    }

    getRevision() {
        return this._getProperty('revision');
    }

    setRevision(value) {
        return this._setProperty('revision', value);
    }

    getShare() {
        return this._getProperty('share');
    }

    setShare(value) {
        return this._setProperty('share', value);
    }

    getShared() {
        return this._getProperty('shared');
    }

    setShared(value) {
        return this._setProperty('shared', value);
    }

    getCseType() {
        return this._getProperty('cseType');
    }

    setCseType(value) {
        return this._setProperty('cseType', value);
    }

    getCseKey() {
        return this._getProperty('cseKey');
    }

    setCseKey(value) {
        return this._setProperty('cseKey', value);
    }

    getSseType() {
        return this._getProperty('sseType');
    }

    setSseType(value) {
        return this._setProperty('sseType', value);
    }

    getClient() {
        return this._getProperty('client');
    }

    setClient(value) {
        return this._setProperty('client', value);
    }

    getHidden() {
        return this._getProperty('hidden');
    }

    setHidden(value) {
        return this._setProperty('hidden', value);
    }

    getTrashed() {
        return this._getProperty('trashed');
    }

    setTrashed(value) {
        return this._setProperty('trashed', value);
    }

    getFavorite() {
        return this._getProperty('favorite');
    }

    setFavorite(value) {
        return this._setProperty('favorite', value);
    }

    getEditable() {
        return this._getProperty('editable');
    }

    setEditable(value) {
        return this._setProperty('editable', value);
    }

    getEdited() {
        return this._getProperty('edited');
    }

    setEdited(value) {
        return this._setProperty('edited', value);
    }

    getCreated() {
        return this._getProperty('created');
    }

    setCreated(value) {
        return this._setProperty('created', value);
    }

    getUpdated() {
        return this._getProperty('updated');
    }

    setUpdated(value) {
        return this._setProperty('updated', value);
    }

    /**
     *
     * @returns {Server}
     */
    getServer() {
        return this._server;
    }

    /**
     *
     * @param {Server} value
     */
    setServer(value) {
        this._server = value;
    }

    /**
     *
     * @returns {Promise<Password[]>}
     */
    async fetchRevisions() {

    }

    /**
     *
     * @returns {Promise<Share[]>}
     */
    async fetchShares() {

    }

    /**
     *
     * @returns {Promise<Tag[]>}
     */
    async fetchTags() {
    }

    /**
     *
     * @returns {Promise<Folder[]>}
     */
    async fetchFolder() {

    }
}