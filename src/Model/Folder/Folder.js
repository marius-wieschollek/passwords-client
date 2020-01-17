import AbstractModel from '../AbstractModel';
import Properties from '../../Configuration/Folder';

export default class Folder extends AbstractModel {

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
     * @return {Folder}
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
     * @return {Folder}
     */
    setLabel(value) {
        return this.setProperty('label', value);
    }
}