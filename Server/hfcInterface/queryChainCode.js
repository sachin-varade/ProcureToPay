'use strict';

var queryChainCode = function(channel, chaincodeId, functionName, args) {    
	const request = {
		//targets : --- letting this default to the peers assigned to the channel
		chaincodeId: chaincodeId,
		fcn: functionName,
		args: args
	};

	// send the query proposal to the peer
	return channel.queryByChaincode(request)
	.then((query_responses) => {
	console.log("Query has completed, checking results");	
	if (query_responses && query_responses.length > 0) {
		if (query_responses[0] instanceof Error) {
			return "Error: error from query = ", query_responses[0];
		} else {
			return JSON.parse(query_responses[0].toString());
		}
	} else {
		return "No payloads were returned from query";
	}
	}).catch((err) => {
		throw err;
	});
}

var queryInfo = function(channel, peer) {    
	return channel.queryInfo(peer, false)
	.then((query_responses) => {
	return query_responses;
	}).catch((err) => {
		throw err;
	});
}

var queryBlock = function(channel, peer, blockNumber) {    
	return channel.queryBlock(blockNumber, peer, false)
	.then((query_responses) => {
	return query_responses;
	}).catch((err) => {
		throw err;
	});
}

var queryBlockByHash = function(channel, peer, blockHash) {    
	return channel.queryBlockByHash(blockHash, peer, false)
	.then((query_responses) => {
	return query_responses;
	}).catch((err) => {
		throw err;
	});
}


exports.queryChainCode = queryChainCode;
exports.queryInfo = queryInfo;
exports.queryBlock = queryBlock;
exports.queryBlockByHash = queryBlockByHash;