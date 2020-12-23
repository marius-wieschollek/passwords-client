export default class ConfigurationError extends Error {

    /**
     * @returns {String}
     */
    get name() {
        return 'ConfigurationError';
    }
}