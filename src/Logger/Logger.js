export default class Logger {

    /**
     * @returns {Number}
     */
    get logLevel() {
        return this._logLevel;
    }

    /**
     * @param {Number} value
     */
    set logLevel(value) {
        this._logLevel = value;
    }

    /**
     * @param {Number} [logLevel=0]
     */
    constructor(logLevel = 0) {
        this._logLevel = logLevel;
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     */
    debug(message, context = {}) {
        if(this._logLevel > 0) return;
        console.debug(message, context);
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     */
    info(message, context = {}) {
        if(this._logLevel > 1) return;
        console.info(message, context);
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     */
    log(message, context = {}) {
        if(this._logLevel > 2) return;
        console.log(message, context);
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     */
    warning(message, context = {}) {
        if(this._logLevel > 3) return;
        console.warn(message, context);
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     */
    error(message, context = {}) {
        if(this._logLevel > 4) return;
        console.error(message, context);
    }
}