/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const newapp = express();
newapp.use(morgan('combined'));
newapp.use(cors());
newapp.use(bodyParser.json({limit: "50mb"}));
newapp.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

const { Gateway, Wallets } = require('fabric-network');

// load the network configuration
const ccpPath = path.resolve(__dirname, '.', 'connection.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

let orgMap = new Map();
orgMap.set("OCM", "org1.ficsechain.com");
orgMap.set("IC-Distributor-1", "org2.ficsechain.com");
orgMap.set("IC-Distributor-2", "org3.ficsechain.com");
orgMap.set("PCB-Assembler" , "org4.ficsechain.com");
orgMap.set("PCB-Distributor" , "org5.ficsechain.com");
orgMap.set("System-Integrator" , "org6.ficsechain.com");
//orgMap.set("System-Distributor" , "org7.fiscechain.com");

async function main() {

	try {
		// // load the network configuration
		orgMap.forEach(enrollAdmin);

		async function enrollAdmin(value) {
			const walletPath = path.join('/vars/profiles/vscode/wallets', value);
			const wallet = await Wallets.newFileSystemWallet(walletPath);
			const identity = await wallet.get('Admin');
			if (!identity) {
				console.log('Admin identity can not be found in the wallet');
				return;
			}
		}
	}
	catch (error) {
		console.error(`Failed to enroll admin user "admin": ${error}`);
		process.exit(1);
	}
}

newapp.post('/initialize', async (req, res) => {
	const walletPath = path.join('/vars/profiles/vscode/wallets', req.body.orgName);
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	console.log(ccp)
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');

	// Get the contract from the network.
	const contract = network.getContract('asset');
	console.log('\n--> Submit Transaction: InitLedger, function creates the new assets on the ledger');
	req.body.excelData.forEach((rowObj) => {
		console.log(JSON.stringify(rowObj));
		contract.submitTransaction('InitLedger', JSON.stringify(rowObj));
	});
	//await contract.submitTransaction('InitLedger', req.body.excelData);
	console.log('*** Result: committed');
	gateway.disconnect();
});

newapp.post('/createAsset', async (req, res) => {
	console.log(req.body.orgName);
	const walletPath = path.join('/vars/profiles/vscode/wallets', orgMap.get(req.body.orgName));
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	//console.log(ccp)
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');
	const id = "1"
	// Get the contract from the network.
	const contract = network.getContract('asset');
	//contract.submitTransaction('createMyAsset', "1","2","3","4","5","6","7","8","9","10");
	//console.log(JSON.stringify(req.body.data))	;
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	let array = [];
	for(var i = 0; i < req.body.data.length; i++) {
		var rowObj = req.body.data[i];
		//console.log(JSON.stringify(rowObj));
		//contract.submitTransaction('CreateMyAsset', JSON.stringify(rowObj));
		try{
			await contract.submitTransaction('createMyAsset', rowObj.serialNumber, rowObj.assetType, rowObj.deviceType, rowObj.partNumber,
				rowObj.ocmName, rowObj.ocmMSPID, rowObj.ECID, rowObj.revisionCode, rowObj.lotID,
				rowObj.boxLotID, rowObj.bagID, rowObj["siOdometerThreshold(Seconds)"].toString(), rowObj["PUF CRPs"], rowObj["PUF CL Upper Threshold"], rowObj["PUF CL Lower Threshold"]);
		}
		catch(error){
			array.push(rowObj.serialNumber);
		}
	};

	console.log('*** Result: committed');
	gateway.disconnect();

	var jsonResponse = { "Submitted" : req.body.data.length, "Rejected" : array.length, "Enrolled" : req.body.data.length - array.length};
	res.send(jsonResponse);
});

newapp.post('/queryAll', async (req, res) => {
	const walletPath = path.join('/vars/profiles/vscode/wallets', orgMap.get(req.body.orgName));
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');

	// Get the contract from the network.
	const contract = network.getContract('asset');
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	req.body.excelData.forEach((rowObj) => {
		console.log(JSON.stringify(rowObj));
		contract.submitTransaction('readMyAsset', JSON.stringify(rowObj));
	});
	//await contract.submitTransaction('InitLedger', req.body.excelData);
	console.log('*** Result: committed');
	gateway.disconnect();
});

newapp.post('/GetAssetHistory', async (req, res) => {
	const walletPath = path.join('/vars/profiles/vscode/wallets', orgMap.get(req.body.orgName));
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');

	// Get the contract from the network.
	const contract = network.getContract('asset');
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	let result = [];
	for(var i = 0; i < req.body.data.length; i++) {

		//console.log(req.body.data.length);
		var rowObj = req.body.data[i];
		//console.log(req.body.data[i]);
		//console.log(rowObj.ECID);
		let parsedResponse = {};
		//parsedResponse["ecid"] = rowObj.ecid;
		parsedResponse["Serial Number"] = rowObj.serialNumber;
		let historyOwnwers = await contract.evaluateTransaction('GetAssetHistory', rowObj.serialNumber);
		//console.log(historyOwnwers)
		let parsedHistoryResponse = await JSON.parse(historyOwnwers);
		parsedResponse["ECID"] = parsedHistoryResponse[i].Value.ecid;
		var array = [];
		for(var j = parsedHistoryResponse.length-1; j >= 0; j--){

			var obj = { "currOwnerName" : parsedHistoryResponse[j].Value.currOwnerName ,  "BlockType" : parsedHistoryResponse[j].Value.lastActivityType};
			//console.log(JSON.stringify(obj));
			//string = string.concat("[Owner.");
			//string  = string.concat(parsedHistoryResponse[j].Value.currOwnerName)
			//string = string.concat(", Bloack Type:");
			//string = string.concat(parsedHistoryResponse[j].Value.lastActivityType);
			//string = string.concat("]");
			//string = string.concat("   ");
			// console.log(parsedHistoryResponse[j].Value.currOwnerName);
			// array.push(parsedHistoryResponse[j].Value.currOwnerName);
			//if(j != 0){
			//	string  = string.concat("-->>")
			//}
			array.push(obj);
		}
		//console.log(array);
		parsedResponse["Provenance Records"] = array;
		//parsedResponse["ecid"] = parsedHistoryResponse[j].Value.ecid;

		//console.log(array);
		console.log(parsedResponse);
		//console.log(historyOwnwers);
		//console.log(historyOwnwers.Value);
		result.push(parsedResponse);
	}
	//await contract.submitTransaction('InitLedger', req.body.excelData);
	console.log('*** Result: committed');
	gateway.disconnect();
	res.send(result);
});

newapp.post('/sellAsset', async (req, res) => {

	const walletPath = path.join('/vars/profiles/vscode/wallets', orgMap.get(req.body.orgName));
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');

	// Get the contract from the network.
	const contract = network.getContract('asset');
	let array = [];
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	for(var i = 0; i < req.body.data.length; i++) {
		var rowObj = req.body.data[i];
		try{
			console.log(JSON.stringify(rowObj));
			await contract.submitTransaction('updateMyAsset', rowObj.serialNumber, req.body.newOwnerName, req.body.newOwnerMSPID);
		}
		catch(error){
			array.push(rowObj.serialNumber);
		}
	};
	//await contract.submitTransaction('InitLedger', req.body.excelData);
	console.log('*** Result: committed');
	gateway.disconnect();
	var jsonResponse = { "Submitted" : req.body.data.length, "Rejected" : array.length, "Transfered" : req.body.data.length - array.length, "RejectedList" : array};
	res.send(jsonResponse);
});

newapp.post('/verifyOnLedger', async (req, res) => {
	const walletPath = path.join('/vars/profiles/vscode/wallets', orgMap.get(req.body.orgName));
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');

	// Get the contract from the network.
	const contract = network.getContract('asset');
	let result = [];
	console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	for(var i = 0; i < req.body.data.length; i++){
		//console.log(req.body.data.length);
		var rowObj = req.body.data[i];
		//console.log(req.body.data);
		//console.log(rowObj.ECID);
		let temp  = await contract.evaluateTransaction('readVerificationAsset', rowObj.ECID);
		//console.log(temp);
		let parsedResponse = await JSON.parse(temp);
		//console.log(parsedResponse);
		let historyOwnwers = await contract.evaluateTransaction('GetAssetHistory', parsedResponse.serialNumber);
		let parsedHistoryResponse = await JSON.parse(historyOwnwers);
		//console.log(parsedHistoryResponse);
		//var string = "";
		var array = [];
		for(var j = parsedHistoryResponse.length-1; j >= 0; j--){

			var obj = { "currOwnerName" : parsedHistoryResponse[j].Value.currOwnerName ,  "BlockType" : parsedHistoryResponse[j].Value.lastActivityType};
			//console.log(JSON.stringify(obj));
			//string = string.concat("[Owner.");
			//string  = string.concat(parsedHistoryResponse[j].Value.currOwnerName)
			//string = string.concat(", Bloack Type:");
			//string = string.concat(parsedHistoryResponse[j].Value.lastActivityType);
			//string = string.concat("]");
			//string = string.concat("   ");
			// console.log(parsedHistoryResponse[j].Value.currOwnerName);
			// array.push(parsedHistoryResponse[j].Value.currOwnerName);
			//if(j != 0){
			//	string  = string.concat("-->>")
			//}
			array.push(obj);
		}
		console.log(array);
		parsedResponse["Provenance Records"] = array;
		if(array.length > 0)
			parsedResponse["Verification Results"] = "Pass";
		else parsedResponse["Verification Results"] = "Fail";
		//console.log(array);
		//console.log(parsedResponse);
		//console.log(historyOwnwers);
		//console.log(historyOwnwers.Value);
		result.push(parsedResponse);
	}
	//req.body.data.forEach((rowObj) => {
	//	 console.log(rowObj.ECID);

	//	let temp = contract.evaluateTransaction('readVerificationAsset', rowObj.ECID);
	//	console.log(temp);
	//	console.log(JSON.stringify(temp));
	//	result.push(temp);

	//});
	//await contract.submitTransaction('InitLedger', req.body.excelData);

	console.log("Chirag");
	//console.log(result);
	gateway.disconnect();
	res.send(result);
});

newapp.post('/getChallenge', async (req, res) => {
	const walletPath = path.join('/vars/profiles/vscode/wallets', orgMap.get(req.body.orgName));
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');

	// Get the contract from the network.
	const contract = network.getContract('asset');
	let result;
	// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	result  = await contract.evaluateTransaction('getChallenge', req.body.data);
	console.log(result);
	let parsedResponse = await JSON.parse(result);
	console.log(parsedResponse);

	//req.body.data.forEach((rowObj) => {
	//	 console.log(rowObj.ECID);

	//	let temp = contract.evaluateTransaction('readVerificationAsset', rowObj.ECID);
	//	console.log(temp);
	//	console.log(JSON.stringify(temp));
	//	result.push(temp);

	//});
	//await contract.submitTransaction('InitLedger', req.body.excelData);

	console.log("Chirag");
	gateway.disconnect();
	res.send(parsedResponse);
});

newapp.post('/pufVerify', async (req, res) => {
	const walletPath = path.join('/vars/profiles/vscode/wallets', orgMap.get(req.body.orgName));
	const wallet = await Wallets.newFileSystemWallet(walletPath);
	const gateway = new Gateway();
	await gateway.connect(ccp, {
		wallet,
		identity: 'Admin',
		discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
	});
	// Get the network (channel) our contract is deployed to.
	const network = await gateway.getNetwork('mychannel');
	console.log("*****************************************************************");
	// Get the contract from the network.
	const contract = network.getContract('asset');
	let result;
	// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
	result  = await contract.submitTransaction('verifypufCRP', req.body.ecid, req.body.challenge, req.body.generatedResponse, 'org1.ficsechain.com');
	console.log(result);
	let parsedResponse = await JSON.parse(result);
	console.log(parsedResponse);

	//req.body.data.forEach((rowObj) => {
	//	 console.log(rowObj.ECID);

	//	let temp = contract.evaluateTransaction('readVerificationAsset', rowObj.ECID);
	//	console.log(temp);
	//	console.log(JSON.stringify(temp));
	//	result.push(temp);

	//});
	//await contract.submitTransaction('InitLedger', req.body.excelData);

	console.log("Chirag");
	gateway.disconnect();
	res.send(parsedResponse);
});

main();
newapp.listen(process.env.PORT || 7081);
