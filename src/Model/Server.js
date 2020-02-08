import SimpleServer from './Server/Server';

/**
 * @deprecated
 */
export default class Server extends SimpleServer {

    constructor(data = {}, properties = null) {
        console.trace('Deprecated server class used');
        super(data, properties);
    }
}