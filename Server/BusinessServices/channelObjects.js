'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();
var store_path = path.join(__dirname, '../hfcInterface/hfc-key-store');
console.log('Store path:'+store_path);
var config = require('../config/config.js');

var procurementConfig = config.network.procurement;
var financeConfig = config.network.finance;
var logisticConfig = config.network.logistic;
var vendorConfig = config.network.vendor;
var bankConfig = config.network.bank;

var procurementChannelPC = fabric_client.newChannel(procurementConfig.channels.procurementchannel.name);
var financeChannelPC = fabric_client._channels.procurementchannel; //fabric_client.newChannel(financeConfig.channels.procurementchannel.name);
var financeChannelFC = fabric_client.newChannel(financeConfig.channels.financechannel.name);
var logisticChannelPC = fabric_client._channels.procurementchannel; //fabric_client.newChannel(logisticConfig.channels.procurementchannel.name);
var vendorChannelPC = fabric_client._channels.procurementchannel; //fabric_client.newChannel(vendorConfig.channels.procurementchannel.name);
var bankChannelFC = fabric_client._channels.financechannel; //fabric_client.newChannel(bankConfig.channels.financechannel.name);

var procurementPeer = fabric_client.newPeer(procurementConfig.anchorPeer);
var financePeer = fabric_client.newPeer(financeConfig.anchorPeer);
var logisticPeer = fabric_client.newPeer(logisticConfig.anchorPeer);
var vendorPeer = fabric_client.newPeer(vendorConfig.anchorPeer);
var bankPeer = fabric_client.newPeer(bankConfig.anchorPeer);

var peers = {
    procurementPeer: procurementPeer,
    financePeer: financePeer,
    logisticPeer: logisticPeer,
	vendorPeer: vendorPeer,
	bankPeer: bankPeer
}

var procurementEventHubPeer = fabric_client.newPeer(procurementConfig.eventHubPeer);
var financeEventHubPeer = fabric_client.newPeer(financeConfig.eventHubPeer);
var logisticEventHubPeer = fabric_client.newPeer(logisticConfig.eventHubPeer);
var vendorEventHubPeer = fabric_client.newPeer(vendorConfig.eventHubPeer);
var bankEventHubPeer = fabric_client.newPeer(bankConfig.eventHubPeer);

var eventHubPeers={
    procurementEventHubPeer: procurementEventHubPeer,
    financeEventHubPeer: financeEventHubPeer,
    logisticEventHubPeer: logisticEventHubPeer,
	vendorEventHubPeer: vendorEventHubPeer,
	bankEventHubPeer: bankEventHubPeer
}

procurementChannelPC.addPeer(procurementPeer);
//financeChannelPC.addPeer(financePeer);
financeChannelFC.addPeer(financePeer);
//logisticChannelPC.addPeer(logisticPeer);
vendorChannelPC.addPeer(vendorPeer);
bankChannelFC.addPeer(bankPeer);

var orderer = fabric_client.newOrderer(config.network.orderer.orderer);
procurementChannelPC.addOrderer(orderer);
//financeChannelPC.addOrderer(orderer);
financeChannelFC.addOrderer(orderer);
//logisticChannelPC.addOrderer(orderer);
//vendorChannelPC.addOrderer(orderer);
//bankChannelFC.addOrderer(orderer);

var channels = {
	procurementChannelPC: procurementChannelPC,
	financeChannelPC: financeChannelPC,
	financeChannelFC: financeChannelFC,
	logisticChannelPC: logisticChannelPC,
	vendorChannelPC: vendorChannelPC,
	bankChannelFC: bankChannelFC
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
	procurementUser: config.network.users.filter(function(x){return x.enrollmentID == "procurement1"})[0],
	financeUser: config.network.users.filter(function(x){return x.enrollmentID == "finance1"})[0],
	logisticUser: config.network.users.filter(function(x){return x.enrollmentID == "logistic1"})[0],
	vendorUser: config.network.users.filter(function(x){return x.enrollmentID == "vendor1"})[0],
	bankUser: config.network.users.filter(function(x){return x.enrollmentID == "bank1"})[0]
}

exports.fabric_client = fabric_client;
exports.channels = channels;
exports.peers = peers;
exports.eventHubPeers = eventHubPeers;
exports.orderer = orderer;
exports.usersForTransaction =usersForTransaction;