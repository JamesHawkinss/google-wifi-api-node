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

    async _request(url, options) {
        try {
            return await got(url, {
                ...options,
                responseType: 'json'
            });
        } catch (e) {
            if (e.message === 'Response code 401 (Unauthorized)') {
                // attempt to overwrite the original auth header
                await this.init();
                return await this.__request(url, { method, headers: { "Authorization": `Bearer ${this.apiKey}` }, form });
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
        const { body } = await this._request(
            `${this.baseUrl}/groups`,
            {
                method: 'get',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
            }
        );

        return body;
    }

    async getGroupStatus(groupId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/status`,
            {
                method: 'get',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
            }
        );

        return body;
    }

    async getGroupDevices(groupId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stations`,
            {
                method: 'get',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
            }
        );

        return body;
    }

    async setAccessPointLightBrightness(apId, automatic = false, intensity = 100) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/lighting`,
            {
                method: 'put',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: { automatic, intensity }
            }
        );

        return body;
    }

    async rebootAccessPoint(apId) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}/reboot`,
            {
                method: 'post',
                headers: { "Authorization": `Bearer ${this.apiKey}` }
            }
        );

        return body;
    }

    async deleteAccessPoint(apId) {
        const { body } = await this._request(
            `${this.baseUrl}/accesspoints/${apId}`,
            {
                method: 'delete',
                headers: { "Authorization": `Bearer ${this.apiKey}` }
            }
        );

        return body;
    }

    async setStadiaOptimization(groupId, enabled = true) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/updateStadiaPrioritization`,
            {
                method: 'put',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: { enabled }
            }
        );

        return body;
    }

    async modifyGroupDeviceGroup(groupId, deviceGroupId, group) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets/${deviceGroupId}`,
            {
                method: 'post',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: group
            }
        );

        return body;
    }

    async createGroupDeviceGroup(groupId, group) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets`,
            {
                method: 'post',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: group
            }
        );

        return body;
    }

    async deleteGroupDeviceGroup(groupId, deviceGroupId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationSets/${deviceGroupId}`,
            {
                method: 'delete',
                headers: { "Authorization": `Bearer ${this.apiKey}` }
            }
        );

        return body;
    }

    async pauseGroupDeviceGroups(groupId, paused = true, deviceGroupIds = [], expiryTimestamp = undefined) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/stationBlocking`,
            {
                method: 'put',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: {
                    blocked: paused,
                    expiryTimestamp,
                    stationSetId: deviceGroupIds
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
                headers: { "Authorization": `Bearer ${this.apiKey}` },
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
                headers: { "Authorization": `Bearer ${this.apiKey}` },
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
            {
                method: 'delete',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: {
                    stationId: deviceId
                }
            }
        );

        return body;
    }

    async rebootEntireSystem(groupId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/reboot`,
            {
                method: 'post',
                headers: { "Authorization": `Bearer ${this.apiKey}` }
            }
        );

        return body;
    }

    async getGroupPasswords(groupId) {
        const { body } = await this._request(
            `${this.baseUrl}/groups/${groupId}/psks`,
            {
                method: 'post',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: {}
            }
        );

        return body;
    }

    async getDataSharingPreferences() {
        const { body } = await this._request(
            `${this.baseUrl}/userPreferences`,
            {
                method: 'get',
                headers: { "Authorization": `Bearer ${this.apiKey}` }
            }
        );

        return body;
    }

    async setDataSharingPreferences(data) {
        const { body } = await this._request(
            `${this.baseUrl}/userPreferences`,
            {
                method: 'put',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                json: data
            }
        );

        return body;
    }

    async operations(operationId) {
        const response = await this._request(
            `${this.baseUrl}/operations/${encodeURIComponent(operationId)}`,
            {
                method: 'get',
                headers: { "Authorization": `Bearer ${this.apiKey}` },
            }
        );

        return response;
    }
}

module.exports = GoogleWifiApi;