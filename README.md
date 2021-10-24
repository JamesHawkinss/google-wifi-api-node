# google-wifi-api-node
A Node.js wrapper for the Google Wi-Fi API

See [this documentation](https://documenter.getpostman.com/view/7490211/SzzdD1pF#intro) for in-depth information about the API in use.

### Requirements
This library requires a refresh token, which can be obtained here: [https://www.angelod.com/onhubauthtool/](https://www.angelod.com/onhubauthtool/) 

### Methods
```async getGroups()```
```async getGroupStatus(groupId)```
```async getGroupDevices(groupId)```
```async setAccessPointLightBrightness(apId, automatic = false, intensity = 100)```
```async rebootAccessPoint(apId)```
```async deleteAccessPoint(apId)```
```async setStadiaOptimization(groupId, enabled = true)```