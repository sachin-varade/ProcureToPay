"use strict";
var express = require("express");
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
}, 2000);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();             

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
router.get("/", function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// REGISTER OUR ROUTES -------------------------------
// ------------------------ COMMON routes --------------------
router.post("/login", function(req, res) {    
	var userData = userService.login(req.body);	
	res.send(userData);
});

router.get("/getUserData", function(req, res) {    
	var userData = userService.getUserData();	
	res.send(userData);
});

router.get("/getCommonData", function(req, res) {    
	var commonData = userService.getCommonData();	
	res.send(commonData);
});

// ------------------------ PROCUREMENT routes --------------------
router.post("/savePurchaseOrder", function(req, res) {    
	var promise = procurementService.savePurchaseOrder(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/updatePurchaseOrder", function(req, res) {    
	var promise = procurementService.updatePurchaseOrder(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getAllPurchaseOrders/:option/:value?", function(req, res) {    
    var promise = procurementService.getAllPurchaseOrders(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/createVendorSalesOrder", function(req, res) {    
	var promise = vendorService.createVendorSalesOrder(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});	
})

// ------------------------ LOGISTIC routes --------------------
router.post("/saveLogisticTransaction", function(req, res) {    
	var promise = logisticService.saveLogisticTransaction(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getAllLogisticTransactions/:option/:value?", function(req, res) {    
    var promise = logisticService.getAllLogisticTransactions(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});


// ------------------------ UNIQUE IDs routes --------------------
router.get("/procurement/getUniqueId/:option/:value?", function(req, res) {    
    var promise = logisticService.getUniqueId(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send({"uniqueId": resp});
	});	
});

router.get("/vendor/getUniqueId/:option/:value?", function(req, res) {    
    var promise = vendorService.getUniqueId(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send({"uniqueId": resp});
	});	
});


// ------------------------ BLOCK routes --------------------
router.get("/queryInfo/:role", function(req, res) {    
    var promise = blockService.queryInfo(req.params.role);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/queryBlock/:role/:blockNumber", function(req, res) {    
    var promise = blockService.queryBlock(req.params.role, req.params.blockNumber);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getRecentBlocks/:role/:blockNumber", function(req, res) {    
    var promise = blockService.getRecentBlocks(req.params.role, req.params.blockNumber);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

module.exports = router;
