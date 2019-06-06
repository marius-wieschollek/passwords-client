This library contains a JavaScript client for the [Passwords app for Nextcloud](https://apps.nextcloud.com/apps/passwords)
Cou can find the API documentation [here](https://git.mdns.eu/nextcloud/passwords/wikis/developers/index)

### Using the client
You can use the enhanced version of the client in your project like this:
```javascript
import EnhancedApi from 'passwords-client';

let api =  new EnhancedApi();
api.initialize({baseUrl:'https://cloud.example.com', user:'user', password:'password'});
```

#### Using the simple api
There is a "slim" version of the api.
This version will just communicate with the api but does no processing or encryption of the objects.

```javascript
import EventEmitter from 'eventemitter3';
import {SimpleApi} from 'passwords-client';

let events = new EventEmitter(),
    api =  new SimpleApi();

api.initialize({apiUrl:'https://cloud.example.com/index.php/apps/passwords/', user:'user', password:'password', events});
```


### Development
You cah use a development version in your project with the following commands

```bash
# Go into library folder
cd passwords-client
sudo npm link

# Go into project folder
cd ../project
npm link passwords-client
```