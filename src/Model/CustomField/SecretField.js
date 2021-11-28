import AbstractField from './AbstractField';
import Properties from '../../Configuration/SecretField';

export default class SecretField extends AbstractField {

    /**
     *
     * @param {object} data
     */
    constructor(data) {
        data.type = 'secret';
        super(Properties, data);
    }
}