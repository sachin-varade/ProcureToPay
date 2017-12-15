var network = 
{
    procurement: {
                name: "procurement",
                channels: {
                    procurementchannel: {
                        name: "procurementchannel",
                        chaincodeId: "procurementCC"
                    }
                },
                anchorPeer: "grpc://localhost:7051",
                eventHubPeer: "grpc://localhost:7053"                
              },
    finance: {
                name: "finance",
                channels: {
                    procurementchannel: {
                        name: "procurementchannel",
                        chaincodeId: "procurementCC"
                    },
                    financechannel: {
                        name: "financechannel",
                        chaincodeId: "financeCC"
                    }
                },
                anchorPeer: "grpc://localhost:7051",
                eventHubPeer: "grpc://localhost:7053"                
              },
    logistic: {
                name: "logistic",
                channels: {
                    procurementchannel: {
                        name: "procurementchannel",
                        chaincodeId: "procurementCC"
                    }
                },
                anchorPeer: "grpc://localhost:7051",
                eventHubPeer: "grpc://localhost:7053"                
              },
    vendor: {
                name: "vendor",
                channels: {
                    procurementchannel: {
                        name: "procurementchannel",
                        chaincodeId: "procurementCC"
                    }
                },
                anchorPeer: "grpc://localhost:8051",
                eventHubPeer: "grpc://localhost:8053"                
              },
    bank: {
                name: "bank",
                channels: {
                    financechannel: {
                        name: "financechannel",
                        chaincodeId: "financeCC"
                    }
                },
                anchorPeer: "grpc://localhost:9051",
                eventHubPeer: "grpc://localhost:9053"                
              },
    orderer:{
        orderer: "grpc://localhost:7050"
    },
    admins: [
        {
            ca: {url: "http://localhost:7054", name: "ca.syngentaOrg.syngenta.com"}, 
            enrollmentID: "procurementadmin", 
            enrollmentSecret: "adminpw", 
            mspid: "SyngentaOrgMSP"
        },
        {
            ca: {url: "http://localhost:7054", name: "ca.syngentaOrg.syngenta.com"}, 
            enrollmentID: "financeadmin", 
            enrollmentSecret: "adminpw", 
            mspid: "SyngentaOrgMSP"
        },
        {
            ca: {url: "http://localhost:7054", name: "ca.syngentaOrg.syngenta.com"}, 
            enrollmentID: "logisticadmin", 
            enrollmentSecret: "adminpw", 
            mspid: "SyngentaOrgMSP"
        },
        {
            ca: {url: "http://localhost:8054", name: "ca.vendorOrg.syngenta.com"}, 
            enrollmentID: "vendoradmin", 
            enrollmentSecret: "adminpw", 
            mspid: "VendorOrgMSP"
        },        
        {
            ca: {url: "http://localhost:9054", name: "ca.bankOrg.syngenta.com"}, 
            enrollmentID: "bankadmin", 
            enrollmentSecret: "adminpw", 
            mspid: "BankOrgMSP"
        }
     ],
     users: [
        {
            ca: {url: "http://localhost:7054", name: "ca.syngentaOrg.syngenta.com"}, 
            admin: "procurementadmin", 
            enrollmentID: "procurement1", 
            affiliation: "syngentaorg.procurementDept",
            mspid: "SyngentaOrgMSP"
        },
        {
            ca: {url: "http://localhost:7054", name: "ca.syngentaOrg.syngenta.com"}, 
            admin: "financeadmin", 
            enrollmentID: "finance1", 
            affiliation: "syngentaorg.financeDept",
            mspid: "SyngentaOrgMSP"
        },
        {
            ca: {url: "http://localhost:7054", name: "ca.syngentaOrg.syngenta.com"}, 
            admin: "logisticadmin", 
            enrollmentID: "logistic1", 
            affiliation: "syngentaorg.logisticDept",
            mspid: "SyngentaOrgMSP"
        },
        {
            ca: {url: "http://localhost:8054", name: "ca.vendorOrg.syngenta.com"}, 
            admin: "vendoradmin", 
            enrollmentID: "vendor1", 
            affiliation: "vendororg.vendorDept",
            mspid: "VendorOrgMSP"
        },
        {
            ca: {url: "http://localhost:9054", name: "ca.bankOrg.syngenta.com"}, 
            admin: "bankadmin", 
            enrollmentID: "bank1", 
            affiliation: "bankorg.bankDept",
            mspid: "BankOrgMSP"
        }
    ]
};

exports.network = network;