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

var vendorConfig = config.network.vendor;
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var vendorService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    vendorService.getUniqueId = function(option, value){
        console.log("getUniqueId");
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.vendorChannelPC, 
                vendorConfig.channels.procurementchannel.chaincodeId, 
                "getUniqueId", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    vendorService.queryInfo = function(){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryInfo(channels.vendorChannelPC, 
                peers.vendorPeer);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    vendorService.queryBlock = function(blockNumber){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlock(channels.vendorChannelPC, 
                peers.vendorPeer, blockNumber);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    vendorService.queryBlockByHash = function(blockHash){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlockByHash(channels.vendorChannelPC, 
                peers.vendorPeer, blockHash);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    vendorService.createVendorSalesOrder = function(salesOrder){
        console.log("createVendorSalesOrder");        
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.vendorChannelPC, 
                eventHubPeers.procurementEventHubPeer._url, 
                //"grpc://localhost:7053",
                vendorConfig.channels.procurementchannel.chaincodeId, 
                "saveVendorSalesOrder",  
                [ 
                    salesOrder.salesOrderNumber,
                    salesOrder.purchaseOrderRefNumber,
                    salesOrder.purchaseOrderRefDate,	
                    salesOrder.purchaserCompany,		
                    salesOrder.purchaserCompanyDept,
                    salesOrder.purchaserContactPersonName,
                    salesOrder.purchaserContactPersonAddress,
                    salesOrder.purchaserContactPersonPhone,
                    salesOrder.purchaserContactPersonEmail,
                    salesOrder.deliverToPersonName,
                    salesOrder.deliveryAddress,
                    salesOrder.invoicePartyId,
                    salesOrder.invoicePartyAddress,
                    salesOrder.materialList,
                    salesOrder.status,
                    salesOrder.statusUpdatedOn,
                    salesOrder.statusUpdatedBy
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
	return vendorService;
};

