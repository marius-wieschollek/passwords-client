import AbstractToken from './AbstractToken';

export default class RequestToken extends AbstractToken {

    /**
     *
     * @return {String}
     */
    getType() {
        return 'request-token';
    }

    async sendRequest() {
        if(!this.requiresRequest()) return true;

        try {
            this._token = await this._api
                .getRequest()
                .setPath(`1.0/token/${this._id}/request`)
                .send();
            return true;
        } catch(e) {
            console.error(e);
        }

        return false;
    }
}