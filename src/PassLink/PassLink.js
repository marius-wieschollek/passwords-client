import InvalidLink from '../Exception/PassLink/InvalidLink';
import UnknownAction from '../Exception/PassLink/UnknownAction';
import Connect from './Action/Connect';

class PassLink {

    /**
     *
     * @param {String} link
     * @return {{server: String, action: String, parameters: {}}}
     */
    analyzeLink(link) {
        let url = new URL(link);

        if(['ext+passlink:', 'web+passlink:', 'passlink:'].indexOf(url.protocol) === -1 || url.pathname.indexOf('/do/') === -1) {
            throw new InvalidLink();
        }

        let [server, action] = url.pathname.split('do/'),
            parameters       = {path: action};

        for(let key of url.searchParams.keys()) {
            parameters[key] = url.searchParams.get(key);
        }
        parameters.baseUrl = `https://${server}`;
        if(action.indexOf('/') !== -1) action = action.substr(0, action.indexOf('/'));

        return {server, action, parameters};
    }

    /**
     *
     * @param {String} action
     * @param {Object} parameters
     * @return {PassLinkAction}
     */
    getAction(action, parameters) {
        if(action.substr(0, 7) === 'connect') return new Connect(parameters);

        throw new UnknownAction(action);
    }
}

export default new PassLink();