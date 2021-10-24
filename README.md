# google-wifi-api-node
A Node.js wrapper for the Google Wi-Fi API

```npm i google-wifi-api-node```

See [this documentation](https://documenter.getpostman.com/view/7490211/SzzdD1pF#intro) for in-depth information about the API in use.

### Requirements
This library requires a refresh token, which can be obtained here: [https://www.angelod.com/onhubauthtool/](https://www.angelod.com/onhubauthtool/) 

### Example usage
```js
const GoogleWifiApi = require('./index');
const googleWifiApi = new GoogleWifiApi('YOUR REFRESH TOKEN HERE');

(async () => {
    await googleWifiApi.init();
    
    const groups = await googleWifiApi.getGroups();
    const devices = await googleWifiApi.getGroupDevices(groups.groups[0].id)
    console.log(devices);
})();
```