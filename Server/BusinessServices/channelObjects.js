'use strict';

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');

var fabric_client = new Fabric_Client();
var store_path = path.join(__dirname, '../hfcInterface/hfc-key-store');
console.log('Store path:'+store_path);
var config = require('../config/config.js');

var buyerConfig = config.network.buyer;
var financeConfig = config.network.finance;
var logisticConfig = config.network.logistic;
var vendorConfig = config.network.vendor;
var bankConfig = config.network.bank;

var buyerChannelPC = fabric_client.newChannel(buyerConfig.channels.procurementchannel.name);
var financeChannelPC = fabric_client.newChannel(buyerConfig.channels.procurementchannel.name);
var financeChannelFC = fabric_client.newChannel(buyerConfig.channels.financechannel.name);
var logisticChannelPC = fabric_client.newChannel(buyerConfig.channels.procurementchannel.name);
var vendorChannelPC = fabric_client.newChannel(buyerConfig.channels.procurementchannel.name);
var bankChannelFC = fabric_client.newChannel(buyerConfig.channels.financechannel.name);

var buyerPeer = fabric_client.newPeer(buyerConfig.anchorPeer);
var financePeer = fabric_client.newPeer(financeConfig.anchorPeer);
var logisticPeer = fabric_client.newPeer(logisticConfig.anchorPeer);
var vendorPeer = fabric_client.newPeer(vendorConfig.anchorPeer);
var bankPeer = fabric_client.newPeer(bankConfig.anchorPeer);

var peers = {
    buyerPeer: buyerPeer,
    financePeer: financePeer,
    logisticPeer: logisticPeer,
	vendorPeer: vendorPeer,
	bankPeer: bankPeer
}

var buyerEventHubPeer = fabric_client.newPeer(buyerConfig.eventHubPeer);
var financeEventHubPeer = fabric_client.newPeer(financeConfig.eventHubPeer);
var logisticEventHubPeer = fabric_client.newPeer(logisticConfig.eventHubPeer);
var vendorEventHubPeer = fabric_client.newPeer(vendorConfig.eventHubPeer);
var bankEventHubPeer = fabric_client.newPeer(bankConfig.eventHubPeer);

var eventHubPeers={
    buyerEventHubPeer: buyerEventHubPeer,
    financeEventHubPeer: financeEventHubPeer,
    logisticEventHubPeer: logisticEventHubPeer,
	vendorEventHubPeer: vendorEventHubPeer,
	bankEventHubPeer: bankEventHubPeer
}

buyerChannelPC.addPeer(buyerPeer);
financeChannelPC.addPeer(financePeer);
financeChannelFC.addPeer(financePeer);
logisticChannelPC.addPeer(logisticPeer);
vendorChannelPC.addPeer(vendorPeer);
bankChannelFC.addPeer(bankPeer);

var orderer = fabric_client.newOrderer(config.network.orderer.orderer);
buyerChannelPC.addOrderer(orderer);
financeChannelPC.addOrderer(orderer);
financeChannelFC.addOrderer(orderer);
logisticChannelPC.addOrderer(orderer);
vendorChannelPC.addOrderer(orderer);
bankChannelFC.addOrderer(orderer);

var channels = {
	buyerChannelPC: buyerChannelPC,
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
	buyerUser: config.network.users.filter(function(x){return x.enrollmentID == "buyer1"})[0],
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