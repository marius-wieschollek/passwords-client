export default class TokenTypeNotSupported extends Error{

    /**
     *
     */
    constructor() {
        super('None of the available tokens are supported by this client.');
    }
}