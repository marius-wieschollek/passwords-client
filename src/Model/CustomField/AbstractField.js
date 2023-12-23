import AbstractModel from '../AbstractModel';

export default class AbstractField extends AbstractModel {

    get MODEL_TYPE() {return 'custom-field';}

    /**
     * @param {String} value
     */
    set type(value) {
        throw new Error('Type is not writeable')
    }

    /**
     * @return {String}
     */
    get type() {
        return this.getProperty('type');
    }

    /**
     * @param {String} value
     */
    set label(value) {
        this.setProperty('label', value);
    }

    /**
     * @return {String}
     */
    get label() {
        return this.getProperty('label');
    }

    /**
     * @param {String} value
     */
    set value(value) {
        this.setProperty('value', value);
    }

    /**
     * @return {String}
     */
    get value() {
        return this.getProperty('value');
    }

    /**
     * @param {String} value
     * @return {this}
     */
    setType(value) {
        return this;
    }

    /**
     * @return {String}
     */
    getType() {
        return this.getProperty('type');
    }

    /**
     * @param {String} value
     * @return {this}
     */
    setLabel(value) {
        this.label = value;

        return this;
    }

    /**
     * @return {String}
     */
    getLabel() {
        return this.getProperty('label');
    }

    /**
     * @param {String} value
     * @return {this}
     */
    setValue(value) {
        this.value = value;

        return this;
    }

    /**
     * @return {String}
     */
    getValue() {
        return this.getProperty('value');
    }
}