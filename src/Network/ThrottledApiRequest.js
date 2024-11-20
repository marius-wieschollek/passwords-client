import ApiRequest from "./ApiRequest";

export default class ThrottledApiRequest extends ApiRequest {

    static namedQueues = {};
    static queueConfigs = {
        'default': {concurrent: 5, timeframe: 5},
        'favicon': {concurrent: 15, timeframe: 15}
    };

    /**
     *
     * @param {BasicPasswordsClient} api
     * @param {String} [url=null]
     * @param {Session} [session=null]
     * @param {(ThrottledQueue|String)} [queue=null]
     */
    constructor(api, url = null, session = null, queue = null) {
        super(api, url, session);
        this._setQueue(queue);
    }

    send() {
        return new Promise((resolve, reject) => {
            this._queue.add(
                () => {
                    super.send()
                         .then(resolve)
                         .catch(reject);
                }
            );
        });
    }


    /**
     @param {(ThrottledQueue|String|null)} queue
     * @private
     */
    _setQueue(queue) {
        if(queue === null) {
            queue = 'default';
        }

        if(typeof queue === 'string') {
            if(!ThrottledApiRequest.queueConfigs.hasOwnProperty(queue)) {
                queue = 'default';
            }

            if(!ThrottledApiRequest.namedQueues.hasOwnProperty(queue)) {
                let queueConfig = ThrottledApiRequest.queueConfigs[queue];
                ThrottledApiRequest.namedQueues[queue] = this._api.getClass('queue.throttled', queueConfig);
            }

            this._queue = ThrottledApiRequest.namedQueues[queue];
        } else {
            this._queue = queue;
        }
    }
}