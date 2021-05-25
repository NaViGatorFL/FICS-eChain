import Api from '@/services/api'

export default {
    createAsset(data, orgName){
        return Api().post('createAsset', {
            data: data,
            orgName : orgName
        })
    },

    sellAsset(data, newOwnerName, newOwnerMSPID, orgName){
        return Api().post('sellAsset', {
            data : data,
            newOwnerName : newOwnerName,
            newOwnerMSPID : newOwnerMSPID,
            orgName : orgName
        })
    },

    deleteAsset(data, orgName){
        return Api().post('deleteAsset', {
            data : data,
            orgName : orgName
        })
    },

    async verifyOnLedger(data, orgName){
        // console.log(data);
        return Api().post('verifyOnLedger', {
            data : data,
            orgName : orgName
        })
    },

    async getChallenge(data,orgName){
        return Api().post('getChallenge', {
            orgName : orgName,
            data : data
        })
    },

    async pufVerify(ecid, challenge, generatedResponse, orgName){
        console.log(ecid + " " + challenge + " " + generatedResponse);
        return Api().post('pufVerify', {
            ecid : ecid,
            orgName : orgName,
            challenge : challenge,
            generatedResponse : generatedResponse
        })
    },

    async getAssetHistory(data, orgName){
        return Api().post('GetAssetHistory', {
            data : data,
            orgName : orgName
        })
    }


}