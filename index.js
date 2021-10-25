const axios = require('axios');

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
            if (!this.apiKey) await this.init();

            return await axios({
                url,
                ...options,
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                method: options.method ? options.method : 'get',
                responseType: 'json'
            });
        } catch (e) {
            throw e;
        }
    }

    async __request(url, options) {
        return await axios({
            url,
            ...options,
            responseType: 'json'
        });
    }

    async _getApiKey(refreshToken) {
        try {
            const params = new URLSearchParams();
            params.append('app_id', 'com.google.OnHub');
            params.append('client_id', '586698244315-vc96jg3mn4nap78iir799fc2ll3rk18s.apps.googleusercontent.com');
            params.append('hl', 'en-US');
            params.append('lib_ver', '3.3',);
            params.append('response_type', 'token',);
            params.append('scope', 'https://www.googleapis.com/auth/accesspoints https://www.googleapis.com/auth/clouddevices');

            const { data } = await this.__request(
                'https://oauthaccountmanager.googleapis.com/v1/issuetoken',
                {
                    method: 'post',
                    headers: { "Authorization": `Bearer ${refreshToken}` },
                    params
                }
            );

            return data.token;
        } catch (e) {
            throw e;
        }
    }

    async getGroups() {
        const { data } = await this._request(`${this.baseUrl}/groups`);
        return data;
    }

    async getGroupStatus(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/status`);
        return data;
    }

    async getGroupDevices(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/stations`);
        return data;
    }

    async setAccessPointLightBrightness(apId, automatic = false, intensity = 100) {
        const { data } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/lighting`,
            { method: 'put', data: { automatic, intensity } }
        );

        return data;
    }

    async rebootAccessPoint(apId) {
        const { data } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/reboot`,
            { method: 'post' }
        );

        return data;
    }

    async deleteAccessPoint(apId) {
        const { data } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}`,
            { method: 'delete' }
        );

        return data;
    }

    async setStadiaOptimization(groupId, enabled = true) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/updateStadiaPrioritization`,
            { method: 'put', data: { enabled } }
        );

        return data;
    }

    async modifyGroupDeviceGroup(groupId, stationSetId, group) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets/${stationSetId}`,
            { method: 'post', data: group }
        );

        return data;
    }

    async createGroupDeviceGroup(groupId, group) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets`,
            { method: 'post', data: group }
        );

        return data;
    }

    async deleteGroupDeviceGroup(groupId, stationSetId) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets/${stationSetId}`,
            { method: 'delete' }
        );

        return data;
    }

    async pauseGroupDeviceGroups(groupId, paused = true, stationSetIds = [], expiryTimestamp = undefined) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationBlocking`,
            {
                method: 'put',
                data: {
                    blocked: paused,
                    expiryTimestamp,
                    stationSetId: stationSetIds
                }
            }
        );

        return data;
    }

    async pauseGroupDevices(groupId, paused = true, deviceIds = [], expiryTimestamp = undefined) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationBlocking`,
            {
                method: 'put',
                data: {
                    blocked: paused,
                    expiryTimestamp,
                    stationId: deviceIds
                }
            }
        );

        return data;
    }

    async prioritizeGroupDevice(groupId, deviceId, prioritizationEndTime = undefined) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/prioritizedStation`,
            {
                method: 'put',
                data: {
                    stationId: deviceId,
                    prioritizationEndTime
                }
            }
        );

        return data;
    }

    // might not work
    async unprioritizeGroupDevice(groupId, deviceId) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/prioritizedStation`,
            { method: 'delete', data: { stationId: deviceId } }
        );

        return data;
    }

    async rebootEntireSystem(groupId) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/reboot`,
            { method: 'post' }
        );

        return data;
    }

    async getGroupPasswords(groupId) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/psks`,
            { method: 'post' }
        );

        return data;
    }

    async getDataSharingPreferences() {
        const { data } = await this._request(`${this.baseUrl}/userPreferences`);
        return data;
    }

    async setDataSharingPreferences(object) {
        const { data } = await this._request(
            `${this.baseUrl}/userPreferences`,
            { method: 'put', data: object }
        );

        return data;
    }

    async operations(operationId) {
        const { data } = await this._request(`${this.baseUrl}/operations/${encodeURIComponent(operationId)}`);
        return data;
    }

    async operationsPsks(operationId) {
        const { data } = await this._request(`${this.baseUrl}/operations/${encodeURIComponent(operationId)}/psks`);
        return data;
    }

    async operationsMacAddresses(operationId) {
        const { data } = await this._request(`${this.baseUrl}/operations/${encodeURIComponent(operationId)}/macAddresses`);
        return data;
    }

    async oobeflow() {
        const { data } = await this._request(`${this.baseUrl}/oobeflow`);
        return data;
    }

    async getAccessPointHardwareBundleSetupInfo(apId) {
        const { data } = await this._request(`${this.baseUrl}/accesspoints/${apId}/hardwareBundleSetupInfo`);
        return data;
    }

    async requestAccessPointLocalSpeedTest(apId) {
        const { data } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/localSpeedTest`,
            { method: 'post' }
        );

        return data;
    }

    async requestAccessPointMeshSpeedTest(clientApId) {
        const { data } = await this._request(
            `${this.baseUrl}/accesspoints/${clientApId}/meshSpeedTest`,
            { method: 'post' }
        );

        return data;
    }

    async requestAccessPointWifiblasterSpeedTest(apId) {
        const { data } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/wifiblasterSpeedTest`,
            { method: 'post' }
        );

        return data;
    }

    async getGroupBackhaulOfChildNodes(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/backhaulOfChildNodes`);
        return data;
    }

    // async getGroupHistoricalUsage(groupId) {
    //     const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/historicalUsage`);
    //     return data;
    // }

    async getGroupMeshConfiguration(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/meshConfiguration`);
        return data;
    }

    async getGroupMeshSpeedTestResults(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/meshSpeedTestResults`);
        return data;
    }

    async getGroupRealtimeMetrics(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/realtimeMetrics`);
        return data;
    }

    async getGroupSpeedTestResults(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/speedTestResults`);
        return data;
    }

    async getGroupWifiblasterSpeedTestResults(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/wifiblasterSpeedTestResults`);
        return data;
    }

    async getGroupInsightCards(groupId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/insightCards`);
        return data;
    }

    async getGroupInsightCard(groupId, cardId) {
        const { data } = await this._request(`${this.baseUrl}/groups/${groupId}/insightCards/${cardId}`);
        return data;
    }

    async doGroupInsightCardAction(groupId, cardId) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/insightCards/${cardId}/action`,
            { method: 'post' }
        );

        return data;
    }

    async deleteGroupInsightCard(groupId, cardId) {
        const { data } = await this._request(
            `${this.baseUrl}/groups/${groupId}/insightCards/${cardId}`,
            { method: 'delete' }
        );

        return data;
    }
}

module.exports = GoogleWifiApi;