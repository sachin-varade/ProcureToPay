var network = 
{
    abattoir: {
                name: "abattoir",
                channels: {
                    abattoirchannel: {
                                        name: "abattoirchannel",
                                        chaincodeId: "abattoirCC"
                    }
                },
                anchorPeer: "grpc://localhost:7051",
                eventHubPeer: "grpc://localhost:7053"                
              },
    logisticA2P: {
                name: "logisticA2P",
                channels: {
                    abattoirchannel: {
                        name: "abattoirchannel",
                        chaincodeId: "abattoirCC"
                    }
                },
                anchorPeer: "grpc://localhost:8051",
                eventHubPeer: "grpc://localhost:8053"                
              },
    logisticP2I: {
                name: "logisticP2I",
                channels: {                    
                    processorchannel: {
                        name: "processorchannel",
                        chaincodeId: "processorCC"
                    }
                },
                anchorPeer: "grpc://localhost:8051",
                eventHubPeer: "grpc://localhost:8053"                
              },
    processor: {
                name: "processor",
                channels: {
                    abattoirchannel: {
                        name: "abattoirchannel",
                        chaincodeId: "abattoirCC"
                    },
                    processorchannel: {
                        name: "processorchannel",
                        chaincodeId: "processorCC"
                    }
                },
                anchorPeer: "grpc://localhost:9051",
                eventHubPeer: "grpc://localhost:9053"                
              },
    ikea:     {
                name: "ikea",
                channels: {
                    abattoirchannel: {
                        name: "abattoirchannel",
                        chaincodeId: "abattoirCC"
                    },
                    processorchannel: {
                        name: "processorchannel",
                        chaincodeId: "processorCC"
                    },
                    ikeachannel: {
                        name: "ikeachannel",
                        chaincodeId: "ikeaCC"
                    }
                },
                anchorPeer: "grpc://localhost:10051",
                eventHubPeer: "grpc://localhost:10053"                
              },
    orderer:{
        orderer: "grpc://localhost:7050"
    },
    admins: [
        {
            ca: {url: "http://localhost:7054", name: "ca.org1.example.com"}, 
            enrollmentID: "abattoiradmin", 
            enrollmentSecret: "adminpw", 
            mspid: "Org1MSP"
        },
        {
            ca: {url: "http://localhost:8054", name: "ca.org2.example.com"}, 
            enrollmentID: "logisticadmin", 
            enrollmentSecret: "adminpw", 
            mspid: "Org2MSP"
        },
        {
            ca: {url: "http://localhost:9054", name: "ca.org3.example.com"}, 
            enrollmentID: "processoradmin", 
            enrollmentSecret: "adminpw", 
            mspid: "Org3MSP"
        },
        {
            ca: {url: "http://localhost:10054", name: "ca.org4.example.com"}, 
            enrollmentID: "ikeaadmin", 
            enrollmentSecret: "adminpw", 
            mspid: "Org4MSP"
        }
     ],
     users: [
        {
            ca: {url: "http://localhost:7054", name: "ca.org1.example.com"}, 
            admin: "abattoiradmin", 
            enrollmentID: "abattoir1", 
            affiliation: "org1.department1",
            mspid: "Org1MSP"
        },
        {
            ca: {url: "http://localhost:8054", name: "ca.org2.example.com"}, 
            admin: "logisticadmin", 
            enrollmentID: "logisticA2P1", 
            affiliation: "org2.department1",
            mspid: "Org2MSP"
        },
        {
            ca: {url: "http://localhost:8054", name: "ca.org2.example.com"}, 
            admin: "logisticadmin", 
            enrollmentID: "logisticP2I1", 
            affiliation: "org2.department1",
            mspid: "Org2MSP"
        },
        {
            ca: {url: "http://localhost:9054", name: "ca.org3.example.com"}, 
            admin: "processoradmin", 
            enrollmentID: "processor1", 
            affiliation: "org3.department1",
            mspid: "Org3MSP"
        },
        {
            ca: {url: "http://localhost:10054", name: "ca.org4.example.com"}, 
            admin: "ikeaadmin", 
            enrollmentID: "ikea1", 
            affiliation: "org4.department1",
            mspid: "Org4MSP"
        }
    ]
};

exports.network = network;