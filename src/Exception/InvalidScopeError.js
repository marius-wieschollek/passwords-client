export default class InvalidScopeError extends Error {
    constructor(scope) {
        super(`Invalid scope ${scope}`);
    }
}