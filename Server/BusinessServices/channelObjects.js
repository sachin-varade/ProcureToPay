'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();
var store_path = path.join(__dirname, '../hfcInterface/hfc-key-store');
console.log('Store path:'+store_path);
var config = require('../config/config.js');

var abattoirConfig = config.network.abattoir;
var logisticA2PConfig = config.network.logisticA2P;
var logisticP2IConfig = config.network.logisticP2I;
var processorConfig = config.network.processor;
var ikeaConfig = config.network.ikea;
var abattoirchannel = fabric_client.newChannel(abattoirConfig.channels.abattoirchannel.name);
var processorchannel = fabric_client.newChannel(processorConfig.channels.processorchannel.name);
var ikeachannel = fabric_client.newChannel(ikeaConfig.channels.ikeachannel.name);

var abattoirPeer = fabric_client.newPeer(abattoirConfig.anchorPeer);
var logisticPeer = fabric_client.newPeer(logisticA2PConfig.anchorPeer);
var processorPeer = fabric_client.newPeer(processorConfig.anchorPeer);
var ikeaPeer = fabric_client.newPeer(ikeaConfig.anchorPeer);

var peers = {
    abattoirPeer: abattoirPeer,
    logisticPeer: logisticPeer,
    processorPeer: processorPeer,
    ikeaPeer: ikeaPeer
}

var abattoirEventHubPeer = fabric_client.newPeer(abattoirConfig.eventHubPeer);
var logisticEventHubPeer = fabric_client.newPeer(logisticA2PConfig.eventHubPeer);
var processorEventHubPeer = fabric_client.newPeer(processorConfig.eventHubPeer);
var ikeaEventHubPeer = fabric_client.newPeer(ikeaConfig.eventHubPeer);

var eventHubPeers={
    abattoirEventHubPeer: abattoirEventHubPeer,
    logisticEventHubPeer: logisticEventHubPeer,
    processorEventHubPeer: processorEventHubPeer,
    ikeaEventHubPeer: ikeaEventHubPeer
}

abattoirchannel.addPeer(abattoirPeer);
processorchannel.addPeer(processorPeer);
ikeachannel.addPeer(ikeaPeer);

var orderer = fabric_client.newOrderer(config.network.orderer.orderer);
abattoirchannel.addOrderer(orderer);
processorchannel.addOrderer(orderer);
ikeachannel.addOrderer(orderer);

var channels = {
	abattoirchannel: abattoirchannel,
	processorchannel: processorchannel,
	ikeachannel: ikeachannel
}

Fabric_Client.newDefaultKeyValueStore({ path: store_path
}).then((state_store) => {
	// assign the store to the fabric client
	fabric_client.setStateStore(state_store);
	var crypto_suite = Fabric_Client.newCryptoSuite();
	// use the same location for the state store (where the users' certificate are kept)
	// and the crypto store (where the users' keys are kept)
	var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
	fabric_client.setCryptoSuite(crypto_suite);
}).catch((err) => {
	throw err;
});

var usersForTransaction = {
	abattoirUser: config.network.users.filter(function(x){return x.enrollmentID == "abattoir1"})[0],
	logisticA2PUser: config.network.users.filter(function(x){return x.enrollmentID == "logisticA2P1"})[0],
	logisticP2IUser: config.network.users.filter(function(x){return x.enrollmentID == "logisticP2I1"})[0],
	processorUser: config.network.users.filter(function(x){return x.enrollmentID == "processor1"})[0],
	ikeaUser: config.network.users.filter(function(x){return x.enrollmentID == "ikea1"})[0]
}

exports.fabric_client = fabric_client;
exports.channels = channels;
exports.peers = peers;
exports.eventHubPeers = eventHubPeers;
exports.orderer = orderer;
exports.usersForTransaction =usersForTransaction;