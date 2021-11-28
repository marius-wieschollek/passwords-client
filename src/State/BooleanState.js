export default class BooleanState {

    get value() {
        return this.get();
    }

    set value(value) {
        this.set(value);
    }

    constructor(value) {
        this._value = value === true;
        this._true = {
            promise: null,
            resolve: null
        };
        this._false = {
            promise: null,
            resolve: null
        };
        this._change = {
            promise: null,
            resolve: null
        };
        this._onTrue = [];
        this._onFalse = [];
        this._onChange = [];
    }

    get() {
        return this._value;
    }

    set(value) {
        this._value = value === true;
        this._notify();
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async awaitTrue() {
        if(this._value) {
            return new Promise((resolve) => resolve(true));
        }

        if(this._true.promise === null) {
            this._true.promise = new Promise((resolve) => {
                this._true.resolve = resolve;
            });
        }

        return this._true.promise;
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async awaitFalse() {
        if(!this._value) {
            return new Promise((resolve) => resolve(false));
        }

        if(this._false.promise === null) {
            this._false.promise = new Promise((resolve) => {
                this._false.resolve = resolve;
            });
        }

        return this._false.promise;
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async awaitChange() {
        if(this._change.promise === null) {
            this._change.promise = new Promise((resolve) => {
                this._change.resolve = resolve;
            });
        }

        return this._change.promise;
    }

    /**
     *
     * @param {Function} callback
     */
    onTrue(callback) {
        this._onTrue.push(callback);
    }

    /**
     *
     * @param {Function} callback
     */
    offTrue(callback) {
        this._off('_onTrue', callback);
    }

    /**
     *
     * @param {Function} callback
     */
    onFalse(callback) {
        this._onFalse.push(callback);
    }

    /**
     *
     * @param {Function} callback
     */
    offFalse(callback) {
        this._off('_onFalse', callback);
    }

    /**
     *
     * @param {Function} callback
     */
    onChange(callback) {
        this._onChange.push(callback);
    }

    /**
     *
     * @param {Function} callback
     */
    offChange(callback) {
        this._off('_onChange', callback);
    }

    /**
     *
     * @returns {Boolean}
     */
    toJSON() {
        return this._value;
    }

    /**
     *
     * @private
     */
    _notify() {
        if(this._value) {
            if(this._true.promise !== null) this._true.resolve(this);
            this._true.promise = null;
            this._notifyEvents('_onTrue');
        } else {
            if(this._false.promise !== null) this._false.resolve(this);
            this._false.promise = null;
            this._notifyEvents('_onFalse');
        }

        if(this._change.promise !== null) this._change.resolve(this, this._value);
        this._change.promise = null;
        this._notifyEvents('_onChange');
    }

    /**
     *
     * @param {String} event
     * @private
     */
    _notifyEvents(event) {
        for(let callback of this[event]) {
            callback(this, this._value);
        }
    }

    /**
     *
     * @param {String} event
     * @param {Function} callback
     * @private
     */
    _off(event, callback) {
        let index = this[event].indexOf(callback);
        if(index !== -1) {
            this[event].splice(index, 1);
        }
    }
}