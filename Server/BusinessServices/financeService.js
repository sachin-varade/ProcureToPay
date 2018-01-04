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

var financeConfig = config.network.finance;
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var financeService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    financeService.saveFinanceInvoice = function(invoice){
        console.log("saveFinanceInvoice");        

        var orderedMaterial = "";        
        if(invoice.materialList){
            invoice.materialList.forEach(element => {
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

        var status, updatedBy, updatedOn = "";
        if(invoice.statusUpdates && invoice.statusUpdates.length > 0){
            status = invoice.statusUpdates[invoice.statusUpdates.length-1].status;
            updatedBy = invoice.statusUpdates[invoice.statusUpdates.length-1].updatedBy.toString();
            updatedOn = invoice.statusUpdates[invoice.statusUpdates.length-1].updatedOn;
        }

        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.financeChannelFC, 
                eventHubPeers.financeEventHubPeer._url, 
                //"grpc://localhost:7053",
                financeConfig.channels.financechannel.chaincodeId, 
                "saveFinanceInvoice",  
                [ 
                    invoice.invoiceNumber,
                    invoice.invoiceDate,
                    invoice.goodsIssueNumber,
                    invoice.goodsIssueDate,
                    invoice.salesOrderNumber,
                    invoice.purchaseOrderRefNumber,
                    invoice.purchaseOrderRefDate,
                    invoice.supplierCode,
                    invoice.purchaserCompany,
                    invoice.purchaserCompanyDept,
                    invoice.purchaserContactPersonName,
                    invoice.purchaserContactPersonAddress,
                    invoice.purchaserContactPersonPhone,
                    invoice.purchaserContactPersonEmail,
                    invoice.deliverToPersonName,
                    invoice.deliveryAddress,
                    invoice.invoicePartyId,
                    invoice.invoiceAddress,
                    invoice.grossAmount.toString(),
                    invoice.vatNumber, 
                    orderedMaterial,
                    invoice.invoicePublishDate,
                    status,
                    updatedBy,
                    updatedOn
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

    financeService.updateFinanceInvoice = function(invoice){
        console.log("updateFinanceInvoice");        
        var status, updatedBy, updatedOn = "";
        if(invoice.statusUpdates && invoice.statusUpdates.length > 0){
            status = invoice.statusUpdates[invoice.statusUpdates.length-1].status;
            updatedBy = invoice.statusUpdates[invoice.statusUpdates.length-1].updatedBy.toString();
            updatedOn = invoice.statusUpdates[invoice.statusUpdates.length-1].updatedOn;
        }

        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.financeChannelFC, 
                eventHubPeers.financeEventHubPeer._url, 
                //"grpc://localhost:7053",
                financeConfig.channels.financechannel.chaincodeId, 
                "updateFinanceInvoice",  
                [ 
                    invoice.invoiceNumber,
                    status,
                    updatedBy,
                    updatedOn
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
    
    financeService.getAllFinanceInvoices = function(option, value){
        console.log("getAllFinanceInvoices");
        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.financeChannelFC, 
                financeConfig.channels.financechannel.chaincodeId, 
                "getAllFinanceInvoices", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    financeService.getUniqueId = function(option, value){
        console.log("getUniqueId");
        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.financeChannelFC, 
                financeConfig.channels.financeChannelFC.chaincodeId, 
                "getUniqueId", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    financeService.savePaymentProposal = function(paymentProposal){
        console.log("savePaymentProposal");        

        var details = "";        
        if(paymentProposal.paymentProposalDetails){
            paymentProposal.paymentProposalDetails.forEach(element => {
                if(details != "") {
                    details += ",";
                }
                details += element.paymentProposalNumber 
                + "^"+ element.proposalDate 
                + "^"+ element.tax.toString()
                + "^"+ element.amount.toString() 
                + "^"+ element.poReferenceNumber 
                + "^"+ element.invoiceRefernceNumber 
                + "^"+ element.status 
                + "^"+ element.bankProcessingDate;
            });
        }

        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.financeChannelFC, 
                eventHubPeers.financeEventHubPeer._url, 
                //"grpc://localhost:7053",
                financeConfig.channels.financechannel.chaincodeId, 
                "savePaymentProposal",  
                [ 
                    paymentProposal.paymentProposalNumber,
                    paymentProposal.proposalDate,
                    paymentProposal.vendorUniqueId,
                    paymentProposal.vendorBankAccountNumber,
                    paymentProposal.vendorBankAccountType,
                    paymentProposal.vendorBankUniqueId,
                    paymentProposal.createdBy,
                    paymentProposal.createdDate,
                    details
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

    financeService.queryInfo = function(){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryInfo(channels.financeChannelFC, 
                peers.financePeer);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    financeService.queryBlock = function(blockNumber){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlock(channels.financeChannelFC, 
                peers.financePeer, blockNumber);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    financeService.queryBlockByHash = function(blockHash){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlockByHash(channels.financeChannelFC, 
                peers.financePeer, blockHash);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }


    financeService.getAllPaymentProposals = function(option, value){
        console.log("getAllPaymentProposals");
        return fabric_client.getUserContext(users.financeUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.financeChannelFC, 
                financeConfig.channels.financechannel.chaincodeId, 
                "getAllPaymentProposals", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }


	return financeService;
};

