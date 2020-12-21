import AbstractConverter from './AbstractConverter';

export default class TagConverter extends AbstractConverter {

    /**
     * @param {BasicPasswordsClient} api
     */
    constructor(api) {
        super(api, 'tag');
    }
}