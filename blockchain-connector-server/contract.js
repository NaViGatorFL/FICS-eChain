"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */

const fabric_contract_api_1 = require("fabric-contract-api");
const MyAsset = require("./my-asset");
const VerificationAsset = require("./VerificationAsset");
const VERIFICATION_ASSET_KEY_PREFIX = "vf_";
const NUMBER_OF_BITS_IN_PUF = 64;

var hammingDistance = require('./HammingDistance')

class MyAssetContract extends fabric_contract_api_1.Contract {
    async myAssetExists(ctx, myAssetId) {
        const data = await ctx.stub.getState(myAssetId);
        return (!!data && data.length > 0);
    }

    processpufCRP(pufCRP) {
        //let regexpNames =  /\[('[a-zA-Z0-9]+'),('[a-zA-Z0-9]+')\]/mg;
        console.log(pufCRP)
        let pufCRPMap = {};
        let regex =  /\['*([a-zA-Z0-9]+)'*\s*,\s*'*([a-zA-Z0-9]+)'*\]/mg;
        let match = regex.exec(pufCRP);
        do {
            pufCRPMap[match[1]] = match[2]
            //  console.log(`Hello ${match[1]} ${match[2]}`);
        } while((match = regex.exec(pufCRP)) !== null);

        console.log(pufCRPMap)
        return pufCRPMap;
    }

    async createMyAsset(ctx, serialNumber, assetType, deviceType,
                        partNumber, ocmName, ocmMSPID, ecid, revisionCode, lotID,
                        boxLotID, bagID, siOdometer, pufCRP, pfCLUpperThreshold, pfCLLowerThreshold) {
        const exists = await this.myAssetExists(ctx, serialNumber);

        if (exists) {
            throw new Error(`The my asset ${serialNumber} already exists`);
        }

        var pufCRPMap = this.processpufCRP(pufCRP);
        const myAsset = new MyAsset(serialNumber, assetType, deviceType,
            partNumber, ocmName, ocmMSPID, ecid, revisionCode, lotID,
            boxLotID, bagID, siOdometer);


        const verificationAsset = new VerificationAsset(serialNumber, ecid, pufCRPMap,
            pfCLUpperThreshold, pfCLLowerThreshold);



        const myAssetJSON = Buffer.from(JSON.stringify(myAsset));
        const verificationAssetJSON = Buffer.from(JSON.stringify(verificationAsset));

        await ctx.stub.putState(serialNumber, myAssetJSON);
        await ctx.stub.putState(VERIFICATION_ASSET_KEY_PREFIX + ecid, verificationAssetJSON);
    }

    // input arguments
    // serialNumber, ecid

    async readMyAsset(ctx, serialNumber) {
        const myAsset = await this.getAsset(ctx, serialNumber);
        return myAsset;
    }

    async readVerificationAsset(ctx, ecid) {
        const assetKey = VERIFICATION_ASSET_KEY_PREFIX + ecid;

        const verificationAsset = await this.getAsset(ctx, assetKey);
        return verificationAsset;
    }

    async saveAsset(ctx, assetKey, asset) {
        const assetJSON = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(assetKey, assetJSON);
    }

    async getAsset(ctx, assetKey) {
        const exists = await this.myAssetExists(ctx, assetKey);
        if (!exists) {
            throw new Error(`The verification asset for ${assetKey} does not exist`);
        }
        const data = await ctx.stub.getState(assetKey);
        return JSON.parse(data.toString())
    }

    async getChallenge(ctx, ecid) {
        const assetKey = VERIFICATION_ASSET_KEY_PREFIX + ecid;

        const verificationAsset = await this.getAsset(ctx, assetKey);

        const pufCRPMap = verificationAsset.pufCRPMap;

        const firstChallenge = Object.keys(pufCRPMap)[0];

        var challenge = {}

        challenge['challenge'] = firstChallenge;

        // return the first challenge
        return JSON.stringify(challenge);;
    }

    async verifypufCRP(ctx, ecid, challenge, generatedResponse, verificationOrg) {
        const assetKey = VERIFICATION_ASSET_KEY_PREFIX + ecid;

        const verificationAsset = await this.getAsset(ctx, assetKey);

        console.log(verificationAsset)
        const transactionAsset = await this.getAsset(ctx, verificationAsset.serialNumber);
        transactionAsset.lastActivityType = "V";
        transactionAsset.lastVerificationOrg = verificationOrg;


        const pfCLUpperThreshold = verificationAsset.pfCLUpperThreshold;
        const pfCLLowerThreshold = verificationAsset.pfCLLowerThreshold;

        const pufCRPMap = verificationAsset.pufCRPMap;

        if (!(challenge in pufCRPMap)) {
            throw new Error(`The challenge ${challenge} does not exist`);
        }

        const storedResponse = pufCRPMap[challenge];

        var distance = hammingDistance(storedResponse, generatedResponse);

        var confidenceLevel = (1 - (distance / NUMBER_OF_BITS_IN_PUF)) * 100;
        var result = {};

        if (confidenceLevel >= pfCLUpperThreshold) {
            result['result'] = "authentic";
            transactionAsset.confidenceLevel = confidenceLevel;
            await this.saveAsset(ctx, verificationAsset.serialNumber, transactionAsset); // saving the verify transaction block

        } else if (confidenceLevel <= pfCLLowerThreshold) {
            result['result'] = "cloned";
        } else {
            result['result'] = "suspect";
        }

        return JSON.stringify(result);

    }



    //
    async updateMyAsset(ctx, serialNumber, newOwnerName, newOwnerMSPID) {
        const myAsset = await this.readMyAsset(ctx, serialNumber);

        myAsset.prevOwnerMSPID = myAsset.currOwnerMSPID;
        myAsset.prevOwnerName = myAsset.currOwnerName;

        myAsset.currOwnerMSPID = newOwnerMSPID;
        myAsset.currOwnerName = newOwnerName;

        myAsset.lastActivityType = "T"

        const buffer = Buffer.from(JSON.stringify(myAsset));
        await ctx.stub.putState(serialNumber, buffer);
        return myAsset;
    }


    async deleteMyAsset(ctx, myAssetId) {
        const exists = await this.myAssetExists(ctx, myAssetId);
        if (!exists) {
            throw new Error(`The my asset ${myAssetId} does not exist`);
        }
        await ctx.stub.deleteState(myAssetId);
    }

    // GetAssetHistory returns the chain of custody for an asset since issuance.
    async GetAssetHistory(ctx, assetKey) {

        let resultsIterator = await ctx.stub.getHistoryForKey(assetKey);
        let results = await this.GetAllResults(resultsIterator, true);

        return JSON.stringify(results);
    }

    // Example: Ad hoc rich query
    // QueryAssets uses a query string to perform a query for assets.
    // Query string matching state database syntax is passed in and executed as is.
    // Supports ad hoc queries that can be defined at runtime by the client.
    // If this is not desired, follow the QueryAssetsForOwner example for parameterized queries.
    // Only available on state databases that support rich query (e.g. CouchDB)
    async QueryAssets(ctx, queryString) {
        return await this.GetQueryResultForQueryString(ctx, queryString);
    }

    // GetQueryResultForQueryString executes the passed in query string.
    // Result set is built and returned as a byte array containing the JSON results.
    async GetQueryResultForQueryString(ctx, queryString) {

        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this.GetAllResults(resultsIterator, false);

        return JSON.stringify(results);
    }

    async GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }


    async queryAllAssets(ctx) {
        const startKey = '000';
        const endKey = '999';
        const iterator = await ctx.stub.getStateByRange(startKey, endKey);
        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString());
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString());
                }
                catch (err) {
                    console.log(err);
                    Record = res.value.value.toString();
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }
};

module.exports = MyAssetContract;
//# sourceMappingURL=my-asset-contract.js.map