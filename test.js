const GoogleWifiApi = require('./index');
const googleWifiApi = new GoogleWifiApi('YOUR REFRESH TOKEN HERE');

(async () => {
    await googleWifiApi.init();
    
    const groups = await googleWifiApi.getGroups();
    const devices = await googleWifiApi.getGroupDevices(groups.groups[0].id)
    console.log(devices);
})();