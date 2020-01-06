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
            return new Promise((resolve) => { resolve(true); });
        }

        if(this._true.promise === null) {
            this._true.promise = new Promise((resolve) => {
                this._true.resolve = resolve;
            });
        }

        return this._true;
    }

    /**
     *
     * @returns {Promise<boolean>}
     */
    async awaitFalse() {
        if(!this._value) {
            return new Promise((resolve) => { resolve(false); });
        }

        if(this._false.promise === null) {
            this._false.promise = new Promise((resolve) => {
                this._false.resolve = resolve;
            });
        }

        return this._false;
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

        return this._change;
    }

    /**
     *
     * @returns {boolean}
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
            if(this._true.promise !== null) this._true.resolve();
            this._true.promise = null;
        } else {
            if(this._false.promise !== null) this._true.resolve();
            this._false.promise = null;
        }

        if(this._change.promise !== null) this._change.resolve();
        this._change.promise = null;
    }
}