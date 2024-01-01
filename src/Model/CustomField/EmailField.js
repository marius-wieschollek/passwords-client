import AbstractField from './AbstractField';
import Properties from '../../Configuration/EmailField.json';

export default class EmailField extends AbstractField {

    /**
     *
     * @param {object} data
     */
    constructor(data) {
        data.type = 'email';
        super(Properties, data);
    }
}