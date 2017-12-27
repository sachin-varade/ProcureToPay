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

var procurementConfig = config.network.procurement;
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var procurementService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    procurementService.getAllPurchaseOrders = function(option, value){
        console.log("getAllPurchaseOrders");
        return fabric_client.getUserContext(users.procurementUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.procurementChannelPC, 
                procurementConfig.channels.procurementchannel.chaincodeId, 
                "getAllPurchaseOrders", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
    procurementService.savePurchaseOrder = function(purchaseOrder){
        console.log("savePurchaseOrder");
        var orderedMaterial = "";        
        if(purchaseOrder.orderedMaterial){
            purchaseOrder.orderedMaterial.forEach(element => {
            if(orderedMaterial != "")
                orderedMaterial += ",";
            orderedMaterial += element.orderMaterialId.toString() +"^"+ element.buyerMaterialGroup +"^"+ element.productName +"^"+ element.productDescription +"^"+ element.quantity.toString() +"^"+ element.quantityUnit +"^"+ element.pricePerUnit.toString() +"^"+ element.currency +"^"+ element.netAmount.toString();
            });
        }
        return fabric_client.getUserContext(users.procurementUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.procurementChannelPC, 
                eventHubPeers.procurementEventHubPeer._url, 
                //"grpc://localhost:7053",
                procurementConfig.channels.procurementchannel.chaincodeId, 
                "savePurchaseOrder",  
                [
                    purchaseOrder.purchaseOrderNumber,
                    purchaseOrder.purchaseOrderDate,
                    purchaseOrder.orderBy,
                    purchaseOrder.buyerCompany,
                    purchaseOrder.buyerDepartment,
                    purchaseOrder.buyerContactPerson,
                    purchaseOrder.buyerContactPersonAddress,
                    purchaseOrder.buyerContactPersonPhone,
                    purchaseOrder.buyerContactPersonEmail,
                    purchaseOrder.supplierName,
                    purchaseOrder.supplierUniqueNo,
                    purchaseOrder.supplierContactPerson,
                    purchaseOrder.supplierContactPersonAddress,
                    purchaseOrder.supplierContactPersonPhone,
                    purchaseOrder.supplierContactPersonEmail,
                    purchaseOrder.deliverToPersonName,
                    purchaseOrder.deliverToPersonAddress,
                    purchaseOrder.invoicePartyId,
                    purchaseOrder.invoiceAddress,
                    purchaseOrder.totalOrderAmount,
                    purchaseOrder.accountingType,
                    purchaseOrder.costCenter,
                    purchaseOrder.glAccount,
                    purchaseOrder.termsOfPayment,
                    purchaseOrder.internalNotes,
                    purchaseOrder.externalNotes,
                    purchaseOrder.vatNo,
                    purchaseOrder.termsOfDelivery,
                    orderedMaterial                    
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    procurementService.updatePurchaseOrder = function(purchaseOrder){
        console.log("updatePurchaseOrder"); 
        var orderedMaterial = "";        
        if(purchaseOrder.orderedMaterial){
            purchaseOrder.orderedMaterial.forEach(element => {
            if(orderedMaterial != "")
                orderedMaterial += ",";
            orderedMaterial += element.orderMaterialId.toString() +"^"+ element.buyerMaterialGroup +"^"+ element.productName +"^"+ element.productDescription +"^"+ element.quantity.toString() +"^"+ element.quantityUnit +"^"+ element.pricePerUnit.toString() +"^"+ element.currency +"^"+ element.netAmount.toString();
            });
        }       
        return fabric_client.getUserContext(users.procurementUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.procurementChannelPC, 
                eventHubPeers.procurementEventHubPeer._url, 
                //"grpc://localhost:7053",
                procurementConfig.channels.procurementchannel.chaincodeId, 
                "updatePurchaseOrder",  
                [
                    purchaseOrder.purchaseOrderNumber,
                    purchaseOrder.buyerContactPerson,
                    purchaseOrder.supplierName,
                    purchaseOrder.supplierContactPerson,
                    purchaseOrder.deliverToPersonName,
                    purchaseOrder.deliverToPersonAddress,
                    purchaseOrder.invoiceAddress,
                    purchaseOrder.costCenter,
                    purchaseOrder.glAccount,
                    purchaseOrder.termsOfPayment,
                    purchaseOrder.internalNotes,
                    purchaseOrder.externalNotes,
                    purchaseOrder.status,
                    orderedMaterial,
                    purchaseOrder.totalOrderAmount.toString(),
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    procurementService.queryInfo = function(){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.procurementUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryInfo(channels.procurementChannelPC, 
                peers.procurementPeer);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    procurementService.queryBlock = function(blockNumber){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.procurementUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlock(channels.procurementChannelPC, 
                peers.procurementPeer, blockNumber);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    procurementService.queryBlockByHash = function(blockHash){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.procurementUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlockByHash(channels.procurementChannelPC, 
                peers.procurementPeer, blockHash);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

   

	return procurementService;
};

