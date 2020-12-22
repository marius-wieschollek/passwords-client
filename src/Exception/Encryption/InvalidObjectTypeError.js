export default class InvalidObjectTypeError extends Error {
    constructor(type) {
        super(`Invalid Object Type "${type}"`);
    }
}