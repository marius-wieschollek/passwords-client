import AbstractField from './AbstractField';
import Properties from '../../Configuration/UrlField.json';

export default class UrlField extends AbstractField {

    /**
     *
     * @param {object} data
     */
    constructor(data) {
        data.type = 'url';
        super(Properties, data);
    }
}