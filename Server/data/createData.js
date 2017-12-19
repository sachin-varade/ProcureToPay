'use strict';

var channelObjects = require("../BusinessServices/channelObjects.js");
var procurementService, financeService, logisticService, vendorService, bankService, userService, blockService;
setTimeout(function() {    
	procurementService = require("../BusinessServices/procurementService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	financeService = require("../BusinessServices/financeService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	logisticService = require("../BusinessServices/logisticService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	vendorService = require("../BusinessServices/vendorService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	bankService = require("../BusinessServices/bankService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	userService = require("../BusinessServices/userService.js")();
    blockService = require("../BusinessServices/blockService.js")(procurementService, financeService, logisticService, vendorService, bankService, userService);
    savePO(0);
}, 2000);

var poData = require('./poData.json');

console.log("##########################################################");
console.log("############ SAVE PURCHASE ORDER #############");
console.log("##########################################################");

function savePO(id){
    procurementService.savePurchaseOrder(poData[id])
        .then((user) => {
            if(id< poData.length - 1){
                savePO(id+1);
            }
            else{
                console.log("##########################################################");
                console.log("######### ALL PURCHASE ORDER SAVED ##########");
                console.log("##########################################################");
            }
        }).catch((err) => {
            console.error('Failed to save PO: ' + err);
        });
}

    