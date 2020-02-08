import RealSession from './Session/Session';

/**
 * @deprecated
 */
export default class Session extends RealSession {

    constructor(user, token, id, authorized) {
        console.trace('Deprecated session class used');
        super();
    }
}