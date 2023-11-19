export default class EventEmitter {

    constructor() {
        this._listeners = {};
        this._once = {};
    }

    /**
     * @param {String|String[]} event
     * @param {Object} data
     *
     * @return {Promise<void>}
     */
    async emit(event, data) {
        if(Array.isArray(event)) {
            event.forEach((event) => {this.emit(event, data);});
            return;
        }

        await this._notifyListeners(event, data);
        await this._notifyOnce(event, data);
    }

    /**
     * @param {String|String[]} event
     * @param {Function} callback
     *
     * @return EventEmitter
     */
    on(event, callback) {
        if(Array.isArray(event)) {
            event.forEach((event) => {this.on(event, callback);});
            return this;
        }

        if(!this._listeners.hasOwnProperty(event)) {
            this._listeners[event] = [];
        }

        this._listeners[event].push(callback);

        return this;
    }

    /**
     * @param {String|String[]} event
     * @param {Function} callback
     *
     * @return EventEmitter
     */
    off(event, callback) {
        if(Array.isArray(event)) {
            event.forEach((event) => {this.off(event, callback);});
            return this;
        }

        if(!this._listeners.hasOwnProperty(event)) {
            return this;
        }

        for(let i = 0; i < this._listeners[event].length; i++) {
            if(this._listeners[event][i] === callback) {
                this._listeners[event].splice(i, 1);
                i--;
            }
        }

        return this;
    }

    /**
     * @param {String} event
     * @param {Function} callback
     *
     * @return EventEmitter
     */
    once(event, callback) {
        if(!this._once.hasOwnProperty(event)) {
            this._once[event] = [];
        }

        this._once[event].push(callback);

        return this;
    }

    /**
     * @param {String} event
     * @param {Object} data
     * @return {Promise<void>}
     * @private
     */
    async _notifyListeners(event, data) {
        if(!this._listeners.hasOwnProperty(event)) {
            return;
        }

        for(let callback of this._listeners[event]) {
            try {
                await callback(data);
            } catch(e) {
                console.error(e);
            }
        }
    }

    /**
     * @param {String} event
     * @param {Object} data
     * @return {Promise<void>}
     * @private
     */
    async _notifyOnce(event, data) {
        if(!this._once.hasOwnProperty(event)) {
            return;
        }

        let callback;
        while(callback = this._once[event].pop()) {
            try {
                await callback(data);
            } catch(e) {
                console.error(e);
            }
        }
    }
}