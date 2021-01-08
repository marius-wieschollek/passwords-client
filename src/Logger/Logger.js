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
     *
     * @returns {Logger}
     */
    debug(message, context = {}) {
        if(this._logLevel > 0) return this;
        console.debug(message, context);
        return this;
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     *
     * @returns {Logger}
     */
    info(message, context = {}) {
        if(this._logLevel > 1) return this;
        console.info(message, context);
        return this;
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     *
     * @returns {Logger}
     */
    log(message, context = {}) {
        if(this._logLevel > 2) return this;
        console.log(message, context);
        return this;
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     *
     * @returns {Logger}
     */
    warning(message, context = {}) {
        if(this._logLevel > 3) return this;
        console.warn(message, context);
        return this;
    }

    /**
     * @param {String} message
     * @param {Object} [context={}]
     *
     * @returns {Logger}
     */
    error(message, context = {}) {
        if(this._logLevel > 4) return this;
        console.error(message, context);
        return this;
    }

    /**
     * @param {Error} exception
     * @param {Object} [context={}]
     *
     * @returns {Logger}
     */
    exception(exception, context = {}) {
        if(this._logLevel > 4) return this;
        console.error(exception, context);
        return this;
    }
}