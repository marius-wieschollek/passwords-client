export default class ThrottledQueue {

    /**
     *
     * @param {Object} config
     * @param {Function[]} items
     */
    constructor(config = {concurrent: 5, timeframe: 0}, items = []) {
        this._config = config;
        this._queue = items;
        this._activeCount = 0;

        if(items.length > 0) {
            this.run();
        }
    }

    /**
     * @param {Function} item
     */
    add(item) {
        this._queue.push(item);
        this.run();
    }

    run() {
        if(this._activeCount >= this._config.concurrent || this._queue.length === 0) return;

        this._activeCount++;
        let promise = new Promise((resolve, reject) => {
            try {
                let item = this._queue.shift();
                item();
                resolve();
            } catch(e) {
                reject();
            }
        });

        promise.finally(() => {
            this._registerItemProcessed();
        });

        this.run();
    }

    _registerItemProcessed() {
        if(this._config.timeframe === 0) {
            this._activeCount--;
            this.run();
        } else {
            setTimeout(
                () => {
                    this._activeCount--;
                    this.run();
                },
                this._config.timeframe * 1000
            );
        }
    }
}