"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */

class VerificationAsset {
    serialNumber;
    ecid;
    pufCRPMap;
    pfCLUpperThreshold;
    pfCLLowerThreshold;

    constructor(serialNumber, ecid, pufCRPMap, pfCLUpperThreshold, pfCLLowerThreshold) {
        this.serialNumber = serialNumber;
        this.ecid = ecid;
        this.pufCRPMap = pufCRPMap;
        this.pfCLUpperThreshold = parseFloat(pfCLUpperThreshold);
        this.pfCLLowerThreshold = parseFloat(pfCLLowerThreshold);
    }

};

module.exports = VerificationAsset;