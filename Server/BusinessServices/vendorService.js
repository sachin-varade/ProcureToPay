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

        var orderedMaterial = "";        
        if(salesOrder.materialList){
            salesOrder.materialList.forEach(element => {
                if(orderedMaterial != "") {
                    orderedMaterial += ",";
                }
                orderedMaterial += element.materialId 
                + "^"+ element.productName 
                + "^"+ element.productDescription 
                + "^"+ element.quantity.toString() 
                + "^"+ element.quantityUnit 
                + "^"+ element.pricePerUnit.toString() 
                + "^"+ element.currency 
                + "^"+ element.netAmount.toString()
                + "^"+ element.expectedDeliveryDate                
            });
        }

        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.vendorChannelPC, 
                eventHubPeers.vendorEventHubPeer._url, 
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
                    orderedMaterial,
                    salesOrder.status,
                    salesOrder.statusUpdatedOn,
                    salesOrder.statusUpdatedBy,
                    salesOrder.vatNo,
                    salesOrder.termsOfDelivery,
                    salesOrder.totalOrderAmount.toString(),
                    salesOrder.supplierCode
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    vendorService.getAllVendorSalesOrders = function(option, value){
        console.log("getAllVendorSalesOrders");
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.vendorChannelPC, 
                vendorConfig.channels.procurementchannel.chaincodeId, 
                "getAllVendorSalesOrders", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    vendorService.saveGoodsIssue = function(salesOrder){
        console.log("saveGoodsIssue");        

        var orderedMaterial = "";        
        if(salesOrder.materialList){
            salesOrder.materialList.forEach(element => {
                if(orderedMaterial != "") {
                    orderedMaterial += ",";
                }
                orderedMaterial += element.materialId 
                + "^"+ element.productName 
                + "^"+ element.productDescription 
                + "^"+ element.quantity.toString() 
                + "^"+ element.quantityUnit 
                + "^"+ element.pricePerUnit.toString() 
                + "^"+ element.currency 
                + "^"+ element.netAmount.toString()
                + "^"+ element.dispatchedQuantity.toString()
                + "^"+ element.batchNumber
                + "^"+ element.expectedDeliveryDate                
            });
        }

        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.vendorChannelPC, 
                eventHubPeers.vendorEventHubPeer._url, 
                //"grpc://localhost:7053",
                vendorConfig.channels.procurementchannel.chaincodeId, 
                "saveGoodsIssue",  
                [ 
                    salesOrder.goodsIssueNumber,
                    salesOrder.salesOrderNumber,
                    salesOrder.deliverToPersonName,
                    salesOrder.deliveryAddress,
                    salesOrder.logisticProvider,
                    orderedMaterial,
                    salesOrder.logisticsConsignmentNumber
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
    vendorService.getAllGoodsIssue = function(option, value){
        console.log("getAllGoodsIssue");
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.vendorChannelPC, 
                vendorConfig.channels.procurementchannel.chaincodeId, 
                "getAllGoodsIssue", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    vendorService.saveVendorInvoice = function(salesOrder){
        console.log("saveVendorInvoice");        

        var orderedMaterial = "";        
        if(salesOrder.materialList){
            salesOrder.materialList.forEach(element => {
                if(orderedMaterial != "") {
                    orderedMaterial += ",";
                }
                orderedMaterial += element.materialId 
                + "^"+ element.productName 
                + "^"+ element.productDescription 
                + "^"+ element.quantity.toString() 
                + "^"+ element.quantityUnit 
                + "^"+ element.pricePerUnit.toString() 
                + "^"+ element.currency 
                + "^"+ element.netAmount.toString()
                + "^"+ element.dispatchedQuantity.toString()
                + "^"+ element.batchNumber
                + "^"+ element.expectedDeliveryDate;
            });
        }

        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.vendorChannelPC, 
                eventHubPeers.vendorEventHubPeer._url, 
                //"grpc://localhost:7053",
                vendorConfig.channels.procurementchannel.chaincodeId, 
                "saveVendorInvoice",  
                [ 
                    salesOrder.invoiceNumber,
                    salesOrder.invoiceDate,
                    salesOrder.goodsIssueNumber,
                    salesOrder.goodsIssueDate,
                    salesOrder.salesOrderNumber,
                    salesOrder.purchaseOrderRefNumber,
                    salesOrder.purchaseOrderRefDate,
                    salesOrder.supplierCode,
                    salesOrder.purchaserCompany,
                    salesOrder.purchaserCompanyDept,
                    salesOrder.purchaserContactPersonName,
                    salesOrder.purchaserContactPersonAddress,
                    salesOrder.purchaserContactPersonPhone,
                    salesOrder.purchaserContactPersonEmail,
                    salesOrder.deliverToPersonName,
                    salesOrder.deliveryAddress,
                    salesOrder.invoicePartyId,
                    salesOrder.invoiceAddress,
                    salesOrder.grossAmount.toString(),
                    salesOrder.vatNumber, 
                    orderedMaterial,
                    new Date().toString()
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            if(err.message.indexOf("SMART_CONTRACT") > -1){
                return {
                    type: "ERROR",
                    message: err.message
                }
            }            
            throw err;
        });
    }
    
    vendorService.getAllVendorInvoices = function(option, value){
        console.log("getAllVendorInvoices");
        return fabric_client.getUserContext(users.vendorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.vendorChannelPC, 
                vendorConfig.channels.procurementchannel.chaincodeId, 
                "getAllVendorInvoices", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

	return vendorService;
};

