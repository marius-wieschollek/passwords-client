import AbstractModel from './AbstractModel';

export default class AbstractRevisionModel extends AbstractModel {

    /**
     * @return {String}
     * @api
     */
    getId() {
        return this.getProperty('id');
    }

    /**
     * @param {String} value
     *
     * @return {AbstractModel}
     * @api
     */
    setId(value) {
        return this.setProperty('id', value);
    }

    /**
     * @return {string}
     * @api
     */
    getRevision() {
        return this.getProperty('revision');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     * @api
     */
    setRevision(value) {
        return this.setProperty('revision', value);
    }

    /**
     * @return {string}
     * @api
     */
    getCseType() {
        return this.getProperty('cseType');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     * @api
     */
    setCseType(value) {
        return this.setProperty('cseType', value);
    }

    /**
     * @return {string}
     * @api
     */
    getCseKey() {
        return this.getProperty('cseKey');
    }

    /**
     *
     * @param {string} value
     * @return {Password}
     * @api
     */
    setCseKey(value) {
        return this.setProperty('cseKey', value);
    }

    /**
     * @return {string}
     * @api
     */
    getSseType() {
        return this.getProperty('sseType');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     * @api
     */
    setSseType(value) {
        return this.setProperty('sseType', value);
    }

    /**
     * @return {string}
     * @api
     */
    getClient() {
        return this.getProperty('client');
    }

    /**
     * @param {string} value
     *
     * @return {Password}
     * @api
     */
    setClient(value) {
        return this.setProperty('client', value);
    }

    /**
     * @return {Boolean}
     * @api
     */
    getHidden() {
        return this.getProperty('hidden');
    }

    /**
     * @param {Boolean} value
     *
     * @return {Password}
     * @api
     */
    setHidden(value) {
        return this.setProperty('hidden', value);
    }

    /**
     * @return {Boolean}
     * @api
     */
    isTrashed() {
        return this.getProperty('trashed');
    }

    /**
     * @return {Boolean}
     * @api
     */
    getTrashed() {
        return this.getProperty('trashed');
    }

    /**
     * @param {Boolean} value
     *
     * @return {Password}
     * @api
     */
    setTrashed(value) {
        return this.setProperty('trashed', value);
    }

    /**
     * @return {Boolean}
     * @api
     */
    isFavorite() {
        return this.getProperty('favorite');
    }

    /**
     * @return {Boolean}
     * @api
     */
    getFavorite() {
        return this.getProperty('favorite');
    }

    /**
     * @param {Boolean} value
     *
     * @return {Password}
     * @api
     */
    setFavorite(value) {
        return this.setProperty('favorite', value);
    }

    /**
     * @return {Date}
     * @api
     */
    getEdited() {
        return this.getProperty('edited');
    }

    /**
     * @param {Date} value
     *
     * @return {Password}
     * @api
     */
    setEdited(value) {
        return this.setProperty('edited', value);
    }

    /**
     * @return {Date}
     * @api
     */
    getCreated() {
        return this.getProperty('created');
    }

    /**
     * @param {Date} value
     *
     * @return {Password}
     * @api
     */
    setCreated(value) {
        return this.setProperty('created', value);
    }

    /**
     * @return {Date}
     * @api
     */
    getUpdated() {
        return this.getProperty('updated');
    }

    /**
     * @param {Date} value
     *
     * @return {Password}
     * @api
     */
    setUpdated(value) {
        return this.setProperty('updated', value);
    }

    /**
     *
     * @return {{}}
     * @api
     */
    toJSON() {
        let properties = this.getProperties();

        if(properties.hasOwnProperty('created') && properties.created instanceof Date) {
            properties.created = Math.floor(properties.created.getTime() / 1000);
        }

        if(properties.hasOwnProperty('edited') && properties.edited instanceof Date) {
            properties.edited = Math.floor(properties.edited.getTime() / 1000);
        }

        if(properties.hasOwnProperty('updated') && properties.updated instanceof Date) {
            properties.updated = Math.floor(properties.updated.getTime() / 1000);
        }

        return properties;
    }
}