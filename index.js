const got = require('got').default;

class GoogleWifiApi {
    constructor(refreshToken) {
        this.refreshToken = refreshToken;
        this.baseUrl = 'https://accesspoints.googleapis.com/v2';
    }

    async init() {
        try {
            this.apiKey = await this._getApiKey(this.refreshToken);
        } catch (e) {
            throw new Error('Invalid refresh token');
        }
    }

    async _request(url, options = {}) {
        try {
            return await got(url, {
                ...options,
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                method: options.method ? options.method : 'get',
                responseType: 'json'
            });
        } catch (e) {
            if (e.message === 'Response code 401 (Unauthorized)') {
                // attempt to overwrite the original auth header
                await this.init();
                return await this.__request(
                    url,
                    {
                        method: options.method ? options.method : 'get',
                        headers: { "Authorization": `Bearer ${this.apiKey}` },
                        form
                    }
                );
            }
        }
    }

    async __request(url, options) {
        return await got(url, {
            ...options,
            responseType: 'json'
        });
    }

    async _getApiKey(refreshToken) {
        try {
            const { body } = await this.__request(
                'https://oauthaccountmanager.googleapis.com/v1/issuetoken',
                {
                    method: 'post',
                    headers: { "Authorization": `Bearer ${refreshToken}` },
                    form: {
                        'app_id': 'com.google.OnHub',
                        'client_id': '586698244315-vc96jg3mn4nap78iir799fc2ll3rk18s.apps.googleusercontent.com',
                        'hl': 'en-US',
                        'lib_ver': '3.3',
                        'response_type': 'token',
                        'scope': 'https://www.googleapis.com/auth/accesspoints https://www.googleapis.com/auth/clouddevices'
                    }
                }
            );

            return body.token;
        } catch (e) {
            throw e;
        }
    }

    async getGroups() {
        const { body } = await this._request(`${this.baseUrl}/groups`);
        return body;
    }

    async getGroupStatus(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/status`);
        return body;
    }

    async getGroupDevices(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/stations`);
        return body;
    }

    async setAccessPointLightBrightness(apId, automatic = false, intensity = 100) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/lighting`,
            { method: 'put', json: { automatic, intensity } }
        );

        return body;
    }

    async rebootAccessPoint(apId) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/reboot`,
            { method: 'post' }
        );

        return body;
    }

    async deleteAccessPoint(apId) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}`,
            { method: 'delete' }
        );

        return body;
    }

    async setStadiaOptimization(groupId, enabled = true) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/updateStadiaPrioritization`,
            { method: 'put', json: { enabled } }
        );

        return body;
    }

    async modifyGroupDeviceGroup(groupId, stationSetId, group) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets/${stationSetId}`,
            { method: 'post', json: group }
        );

        return body;
    }

    async createGroupDeviceGroup(groupId, group) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets`,
            { method: 'post', json: group }
        );

        return body;
    }

    async deleteGroupDeviceGroup(groupId, stationSetId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets/${stationSetId}`,
            { method: 'delete' }
        );

        return body;
    }

    async pauseGroupDeviceGroups(groupId, paused = true, stationSetIds = [], expiryTimestamp = undefined) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationBlocking`,
            {
                method: 'put',
                json: {
                    blocked: paused,
                    expiryTimestamp,
                    stationSetId: stationSetIds
                }
            }
        );

        return body;
    }

    async pauseGroupDevices(groupId, paused = true, deviceIds = [], expiryTimestamp = undefined) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationBlocking`,
            {
                method: 'put',
                json: {
                    blocked: paused,
                    expiryTimestamp,
                    stationId: deviceIds
                }
            }
        );

        return body;
    }

    async prioritizeGroupDevice(groupId, deviceId, prioritizationEndTime = undefined) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/prioritizedStation`,
            {
                method: 'put',
                json: {
                    stationId: deviceId,
                    prioritizationEndTime
                }
            }
        );

        return body;
    }

    // might not work
    async unprioritizeGroupDevice(groupId, deviceId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/prioritizedStation`,
            { method: 'delete', json: { stationId: deviceId } }
        );

        return body;
    }

    async rebootEntireSystem(groupId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/reboot`,
            { method: 'post' }
        );

        return body;
    }

    async getGroupPasswords(groupId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/psks`,
            { method: 'post' }
        );

        return body;
    }

    async getDataSharingPreferences() {
        const { body } = await this._request(`${this.baseUrl}/userPreferences`);
        return body;
    }

    async setDataSharingPreferences(data) {
        const { body } = await this._request(
            `${this.baseUrl}/userPreferences`,
            { method: 'put', json: data }
        );

        return body;
    }

    async operations(operationId) {
        const { body } = await this._request(`${this.baseUrl}/operations/${encodeURIComponent(operationId)}`);
        return body;
    }

    async operationsPsks(operationId) {
        const { body } = await this._request(`${this.baseUrl}/operations/${encodeURIComponent(operationId)}/psks`);
        return body;
    }

    async operationsMacAddresses(operationId) {
        const { body } = await this._request(`${this.baseUrl}/operations/${encodeURIComponent(operationId)}/macAddresses`);
        return body;
    }

    async oobeflow() {
        const { body } = await this._request(`${this.baseUrl}/oobeflow`);
        return body;
    }

    async getAccessPointHardwareBundleSetupInfo(apId) {
        const { body } = await this._request(`${this.baseUrl}/accesspoints/${apId}/hardwareBundleSetupInfo`);
        return body;
    }

    async requestAccessPointLocalSpeedTest(apId) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/localSpeedTest`,
            { method: 'post' }
        );

        return body;
    }

    async requestAccessPointMeshSpeedTest(clientApId) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${clientApId}/meshSpeedTest`,
            { method: 'post' }
        );

        return body;
    }

    async requestAccessPointWifiblasterSpeedTest(apId) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/wifiblasterSpeedTest`,
            { method: 'post' }
        );

        return body;
    }

    async getGroupBackhaulOfChildNodes(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/backhaulOfChildNodes`);
        return body;
    }

    // async getGroupHistoricalUsage(groupId) {
    //     const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/historicalUsage`);
    //     return body;
    // }

    async getGroupMeshConfiguration(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/meshConfiguration`);
        return body;
    }

    async getGroupMeshSpeedTestResults(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/meshSpeedTestResults`);
        return body;
    }

    async getGroupRealtimeMetrics(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/realtimeMetrics`);
        return body;
    }

    async getGroupSpeedTestResults(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/speedTestResults`);
        return body;
    }

    async getGroupWifiblasterSpeedTestResults(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/wifiblasterSpeedTestResults`);
        return body;
    }

    async getGroupInsightCards(groupId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/insightCards`);
        return body;
    }

    async getGroupInsightCard(groupId, cardId) {
        const { body } = await this._request(`${this.baseUrl}/groups/${groupId}/insightCards/${cardId}`);
        return body;
    }

    async doGroupInsightCardAction(groupId, cardId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/insightCards/${cardId}/action`,
            { method: 'post' }
        );

        return body;
    }

    async deleteGroupInsightCard(groupId, cardId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/insightCards/${cardId}`,
            { method: 'delete' }
        );

        return body;
    }
}

module.exports = GoogleWifiApi;