import AbstractModel from '../AbstractModel';

export default class AbstractField extends AbstractModel {

    /**
     *
     * @param {String} value
     * @return {AbstractField}
     */
    setType(value) {
        return this;
    }

    /**
     *
     * @return {String}
     */
    getType() {
        return this.getProperty('type');
    }

    /**
     *
     * @param {String} value
     * @return {AbstractField}
     */
    setLabel(value) {
        this.setProperty('label');

        return this;
    }

    /**
     *
     * @return {String}
     */
    getLabel() {
        return this.getProperty('label');
    }

    /**
     *
     * @param {String} value
     * @return {AbstractField}
     */
    setValue(value) {
        this.setProperty('value');

        return this;
    }

    /**
     *
     * @return {String}
     */
    getValue() {
        return this.getProperty('value');
    }
}