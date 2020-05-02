export default class InvalidLink extends Error {
    constructor(action) {super(`Unknown action ${action}`);}
}