export default class ResponseDecodingError extends Error {

    constructor(response, error, message = '') {

        if(message.length === 0) {
            message = error.message;
        }

        super(message);

        this.response = response;
        this.error = error;
    }
}