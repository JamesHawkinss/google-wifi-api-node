const GoogleWifiApi = require('./index');
const googleWifiApi = new GoogleWifiApi();

(async () => {
    await googleWifiApi.init();
    
    // const groups = await googleWifiApi.getGroups();
    // const devices = await googleWifiApi.getGroupDevices(groups.groups[0].id);
    // const status = await googleWifiApi.getGroupStatus(groups.groups[0].id);
    
    const brightness = await googleWifiApi.setAccessPointLightBrightness('', false, 0)

    console.log(brightness)
})();