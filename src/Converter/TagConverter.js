import AbstractConverter from './AbstractConverter';

export default class TagConverter extends AbstractConverter {

    /**
     * @param {BasicPasswordsClient} client
     */
    constructor(client) {
        super(client, 'tag');
    }
}