import Properties from '../../Configuration/Folder';
import AbstractRevisionModel from '../AbstractRevisionModel';

export default class Folder extends AbstractRevisionModel {

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
    getParent() {
        return this.getProperty('parent');
    }

    /**
     * @param {String} value
     *
     * @return {Folder}
     */
    setParent(value) {
        return this.setProperty('parent', value);
    }
}