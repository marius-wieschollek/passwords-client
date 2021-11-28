This is as WIP! Expect changes.

This package contains a JavaScript client for the [Passwords app for Nextcloud](https://apps.nextcloud.com/apps/passwords)

You can find the API documentation [here](https://git.mdns.eu/nextcloud/passwords/wikis/developers/index)

### Using the client
You can use the enhanced version of the client in your project like this:
```javascript
import PasswordsClient from 'passwords-client';

let client = new PasswordsClient({baseUrl:'https://cloud.example.com/', user:'user', token:'12345-12345-12345-12345-12345'});
let passwordsRepository = client.getPasswordRepository();
let passwordCollection = await passwordsRepository.findAll();
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