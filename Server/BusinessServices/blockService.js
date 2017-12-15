'use strict';

var procurementService, financeService, logisticService, vendorService, bankService, userService;

module.exports = function (procurementService, financeService, logisticService, vendorService, bankService, userService) {
    var blockService = {};

    blockService.queryInfo = function(role){
        if(role.toUpperCase() === 'PROCUREMENT'){
            return procurementService.queryInfo()
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });
        }
        else if(role.toUpperCase() === 'vendor'){
            return processorService.queryInfo()
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });
        }
        else if(role.toUpperCase() === 'ROL4'){
            return ikeaService.queryInfo()
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });
        }
        console.log("queryInfo");
    }

    blockService.queryBlock = function(role, blockNumber){
        if(role.toUpperCase() === 'PROCUREMENT'){
            return procurementService.queryBlock(blockNumber)
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });
        }
        else if(role.toUpperCase() === 'vendor'){
            return processorService.queryBlock(blockNumber)
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });
        }
        else if(role.toUpperCase() === 'logistic'){
            return ikeaService.queryBlock(blockNumber)
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });
        }
    }

    blockService.queryBlockByHash = function(role, blockHash){
        if(role.toUpperCase() === 'PROCUREMENT'){
            return procurementService.queryBlockByHash(blockHash)
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });
        }
       
    }

    blockService.getBlock = function(blockList, role, blockNumber){
        var count = 10;
        return blockService.queryBlock(role, blockNumber)
        .then((query_responses) => {
            count--;
            var response = {};
            response.blockNumber= blockNumber;
            if(blockNumber > 0){
                response.reqData = query_responses.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.toString();
                response.readWrites = query_responses.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset;
                response.channelHeader = query_responses.data.data[0].payload.header.channel_header;
                response.creator = query_responses.data.data[0].payload.header.signature_header.creator;
            }
            else{
                response.channelHeader = query_responses.data.data[0].payload.data.last_update.payload.header.channel_header;
            }
            response.channelHeader.extension = response.channelHeader.extension.toString();
            response.header = query_responses.header;
            blockList.push(response);
            if(blockNumber > 0 && count > 0){
                return blockService.getBlock(blockList, role, blockNumber-1);
            }
            else{
                return blockList;
            }
        }).catch((err) => {
            throw err;
        });
    }

    blockService.getBlockByHash = function(blockList, role, blockHash){
        var count = 10;
        return blockService.queryBlockByHash(role, blockHash)
        .then((query_responses) => {
            count--;
            var strBytes = new Uint8Array(query_responses.header.previous_hash);
            
            var response = {};
            return blockService.getBlockByHash(blockList, role, strBytes);
            // response.blockNumber= blockNumber;
            // if(blockNumber > 0){
            //     response.reqData = query_responses.data.data[0].payload.data.actions[0].payload.chaincode_proposal_payload.input.toString();
            //     response.readWrites = query_responses.data.data[0].payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[0].rwset;
            //     response.channelHeader = query_responses.data.data[0].payload.header.channel_header;
            //     response.creator = query_responses.data.data[0].payload.header.signature_header.creator;
            // }
            // else{
            //     response.channelHeader = query_responses.data.data[0].payload.data.last_update.payload.header.channel_header;
            // }
            // response.header = query_responses.header;
            // blockList.push(response);
            // if(blockNumber > 0 && count > 0){
            //     return blockService.getBlock(blockList, role, blockNumber-1);
            // }
            // else{
            //     return blockList;
            // }
        }).catch((err) => {
            throw err;
        });
    }

    blockService.getRecentBlocks = function(role, blockNumber){
        var blockList = new Array(0);    
        return blockService.queryInfo(role)
        .then((results) => {
            if(blockNumber == -1){
                blockNumber = results.height.low;
            }
            return blockService.getBlock(blockList, role, blockNumber-1)
            .then((results) => {
                return results;
            }).catch((err) => {
                throw err;
            });

            // return blockService.getBlockByHash(blockList, role, results.currentBlockHash)
            // .then((results) => {
            //     return results;
            // }).catch((err) => {
            //     throw err;
            // });
           

        }).catch((err) => {
            throw err;
        });
    }

    return blockService;
}