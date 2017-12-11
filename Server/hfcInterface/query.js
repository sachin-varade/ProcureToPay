'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Chaincode query
 */

var Fabric_Client = require('fabric-client');
var path = require('path');
var util = require('util');
var os = require('os');
var queryChainCode = require('./queryChainCode.js');

var fabric_client = new Fabric_Client();

// setup the fabric network
var channel = fabric_client.newChannel('abattoirchannel');
var peer = fabric_client.newPeer('grpc://localhost:9051');
channel.addPeer(peer);

//
var member_user = null;
var store_path = path.join(__dirname, 'hfc-key-store');
console.log('Store path:'+store_path);
var tx_id = null;

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
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

	// get the enrolled user from persistence, this user will sign all requests
	return fabric_client.getUserContext('ikeaadmin', true);
}).then((user_from_store) => {
	if (user_from_store && user_from_store.isEnrolled()) {
		console.log('Successfully loaded user1 from persistence');
		member_user = user_from_store;
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
	}


	return channel.queryInfo(peer, false);
	//return channel.queryBlock(1, peer, false);

//0th block data
//query_responses.data.data[0].payload.data.last_update.payload.header.channel_header

//request data
//query_responses.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.toString()
//read-writes
//query_responses.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset
//channel name, chaincode id, timestamp, txid, type(config-update/endorsor transaction)
//query_responses.data.data[0].payload.header.channel_header
//creator
//query_responses.data.data[0].payload.header.signature_header.creator

    //return queryChainCode.queryChainCode(channel, "ikeaCC", "query",["a"]);
}).then((query_responses) => {
	console.log(query_responses);
}).catch((err) => {
	console.error('Failed to query successfully :: ' + err);
});
