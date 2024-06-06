export default new class Base64Utility {

    /**
     *
     * @param string
     * @return {string}
     */
    encode(string) {
        return btoa(
            encodeURIComponent(string)
                .replace(/%([0-9A-F]{2})/g,
                         function(match, p1) {
                             return String.fromCharCode('0x' + p1);
                         }
                )
        );
    }

    /**
     *
     * @param string
     * @return {string}
     */
    decode(string) {
        return decodeURIComponent(
            atob(string)
                .split('')
                .map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
    }
};