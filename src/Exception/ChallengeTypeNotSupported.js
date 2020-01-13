export default class ChallengeTypeNotSupported extends Error {

    /**
     *
     */
    constructor() {
        super('The required authentication challenge is not supported by this client');
    }
}