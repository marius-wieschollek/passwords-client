export default class PasswordService {

    /**
     *
     * @param {BaseApi} api
     */
    constructor(api) {
        this._api = api;
    }

    /**
     *
     * @param {Boolean} [numbers=null]
     * @param {Boolean} [special=null]
     * @param {Number} [strength=null]
     * @returns {Promise<{password: String, words: String[], strength: Number, numbers: Boolean, special: Boolean}>}
     */
    async generate(numbers = null, special = null, strength = null) {
        let request = this._api.getRequest().setPath('1.0/service/password');

        if(numbers !== null || special !== null || strength !== null) {
            let data = {};
            if(numbers !== null) data.numbers = numbers;
            if(special !== null) data.special = special;
            if(strength !== null && strength >= 0 && strength <= 4) data.strength = parseInt(strength);

            request.setData(data);
        }

        let response = await request.send();

        return response.getData();
    }
}