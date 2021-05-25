"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */

const fabric_contract_api_1 = require("fabric-contract-api");
class MyAsset {

    serialNumber;
    ecid;
    assetType;
    deviceType;
    partNumber;
    ocmName;
    ocmMSPID;
    revisionCode;
    lotID;
    boxLotID;
    bagID;
    siOdometer;
    lastActivityType; // T or V
    lastVerificationOrg;
    confidenceLevel;
    
    
    constructor(serialNumber, assetType, deviceType, 
        partNumber, ocmName, ocmMSPID, ecid, revisionCode, lotID,
        boxLotID, bagID, siOdometer) {

        this.serialNumber = serialNumber;
        this.assetType = "IC";
        this.deviceType = deviceType;
        this.partNumber = partNumber;
        this.ocmName = "ocmXYZ";
        this.ocmMSPID = "ocmXYZID";
        this.ecid = ecid;
        this.revisionCode = revisionCode;
        this.lotID = lotID;
        this.boxLotID = boxLotID;
        this.bagID = bagID;
        this.siOdometer = siOdometer;
        this.currOwnerName = ocmName;
        this.currOwnerMSPID = ocmMSPID;
        this.prevOwnerName = "None";
        this.prevOwnerMSPID = "None";
        this.lastVerificationOrg = this.ocmName;
        this.lastActivityType = "T";
    }
};

module.exports = MyAsset;
//# sourceMappingURL=my-asset.js.map