'use strict';
var fabric_client;
var channels;
var peers;
var eventHubPeers;
var orderer;
var helper = require('./helper.js');
var queryChainCode = require('../hfcInterface/queryChainCode.js');
var invokeChainCode = require('../hfcInterface/invokeChainCode.js');
var config = require('../config/config.js');
const save = require('save-file');
var crypto = require('crypto');
var fs = require('fs');
var uuid = require('node-uuid');
var commonData = require('../data/common.json');

var logisticConfig = config.network.logistic;
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var logisticService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    logisticService.getAllLogisticTransactions = function(option, value){
        console.log("getAllLogisticTransactions");
        return fabric_client.getUserContext(users.logisticUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.logisticChannelPC, 
                logisticConfig.channels.procurementchannel.chaincodeId, 
                "getAllLogisticTransactions", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.saveLogisticTransaction = function(logisticTransaction){
        console.log("saveLogisticTransaction");
        
        return fabric_client.getUserContext(users.logisticUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.logisticChannelPC, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:7053",
                logisticConfig.channels.procurementchannel.chaincodeId, 
                "saveLogisticTransaction",  
                [
                    logisticTransaction.consignmentNumber,
                    logisticTransaction.salesOrderRefNumber, 
                    //TODO : MDM : salesOrderRefNumber passed, GO code stores this in bt.GoodsIssueRefNumber
                    logisticTransaction.purchaseOrderRefNumber,
                    logisticTransaction.supplierNumber,
                    logisticTransaction.shipToParty,
                    logisticTransaction.pickedupDatetime,
                    logisticTransaction.expectedDeliveryDatetime,
                    logisticTransaction.actualDeliveryDatetime,
                    logisticTransaction.hazardousMaterial,
                    logisticTransaction.packagingInstruction,
                    logisticTransaction.route,
                    logisticTransaction.vehicleId,
                    logisticTransaction.status

                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.getUniqueId = function(option, value){
        console.log("getUniqueId");
        return fabric_client.getUserContext(users.logisticUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.logisticChannelPC, 
                logisticConfig.channels.procurementchannel.chaincodeId, 
                "getUniqueId", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.queryInfo = function(){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.logisticUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryInfo(channels.logisticChannelPC, 
                peers.logisticPeer);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.queryBlock = function(blockNumber){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.logisticUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlock(channels.logisticChannelPC, 
                peers.logisticPeer, blockNumber);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.queryBlockByHash = function(blockHash){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.logisticUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlockByHash(channels.logisticChannelPC, 
                peers.logisticPeer, blockHash);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

	return logisticService;
};

