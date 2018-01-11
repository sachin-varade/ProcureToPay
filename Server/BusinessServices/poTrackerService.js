'use strict';

var procurementService, financeService, logisticService, vendorService, bankService, userService;

module.exports = function (procurementService, financeService, logisticService, vendorService, bankService, userService) {
    var poTrackerService = {};


    poTrackerService.getPurchaseOrderTrackingDetails = function(option, value){
        //this.userData = userService.getUserData();
        var poTrackerEntity = {};

        poTrackerEntity.PurchaseOrderNumber = value;

        //1. Purchase Order Details
        return procurementService.getAllPurchaseOrders(option, value)
        .then((result) => {
            if(result.purchaseOrders != undefined && result.purchaseOrders.length > 0) {
                console.log("PurchaseOrderNumber: ", result.purchaseOrders[0].purchaseOrderNumber);
                poTrackerEntity.PurchaseOrders = result.purchaseOrders[0];
                // poTrackerEntity.PurchaseOrderNumber = result.purchaseOrders[0].purchaseOrderNumber;
                // poTrackerEntity.PurchaseOrderDate = result.purchaseOrders[0].purchaseOrderDate;
            }
            else{
                console.log("PurchaseOrder details not found");
                poTrackerEntity.PurchaseOrders = {};
                // poTrackerEntity.PurchaseOrderNumber = "";
                //return poTrackerEntity;

            }

            //2. Sales Order Details
            return vendorService.getAllVendorSalesOrders(option, value)
            .then((result) => {
                if(result.vendorSalesOrders != undefined && result.vendorSalesOrders.length > 0 ){
                    poTrackerEntity.VendorSalesOrder = result.vendorSalesOrders[0];
                    // poTrackerEntity.VendorSalesOrderStatus = result.vendorSalesOrders[0].Status;
                    // poTrackerEntity.VendorSalesOrderStatusUpdatedOn =  result.vendorSalesOrders[0].StatusUpdatedOn;
                }
                else{
                    poTrackerEntity.VendorSalesOrder = {};
                    // poTrackerEntity.VendorSalesOrderStatus = "";
                    // poTrackerEntity.VendorSalesOrderStatusUpdatedOn =  "";
                }

                //3. Goods Issue Details
                return vendorService.getAllGoodsIssue(option, value)
                .then((result) => {
                    if(result.goodsIssueList != undefined && result.goodsIssueList.length > 0) {
                        console.log("GoodsIssueNumber: ", result.goodsIssueList[0].GoodsIssueNumber);
                        poTrackerEntity.GoodsIssue = result.goodsIssueList[0];
                        // poTrackerEntity.GoodsIssueNumber = result.goodsIssueList[0].GoodsIssueNumber;
                        // poTrackerEntity.GoodsIssueDate = result.goodsIssueList[0].GoodsIssueDate;
                    }
                    else{
                        poTrackerEntity.GoodsIssue = {};
                        // poTrackerEntity.GoodsIssueNumber = "";
                        // poTrackerEntity.GoodsIssueDate = "";
                    }
                   

                    //4. Vendor - Issue invoice 
                    return vendorService.getAllVendorInvoices(option, value)
                    .then((result) => {
                        if(result.vendorInvoices != undefined && result.vendorInvoices.length > 0) {
                            console.log("Vendor Invoice Number : ", result.vendorInvoices[0].InvoiceNumber);
                            poTrackerEntity.VendorInvoices = result.vendorInvoices[0];
                        }
                        else{
                            poTrackerEntity.VendorInvoices = {};
                        }

                        //5. Vendor - Issue invoice
                        return logisticService.getAllLogisticTransactions(option, value)
                        .then((result) => {
                            if(result.logisticTransactions != undefined && result.logisticTransactions.length > 0) {
                                console.log("Logistic Consignment Number : ", result.logisticTransactions[0].ConsignmentNumber);
                                poTrackerEntity.LogisticTransaction = result.logisticTransactions[0];
                            }
                            else{
                                poTrackerEntity.LogisticTransaction = {};
                            }

                            //6. Goods Receipt
                            return procurementService.getAllGoodsReceiptDetails(option, value)
                            .then((result) => {
                                if(result.goodsReceipts != undefined && result.goodsReceipts.length > 0) {
                                    console.log("Goods Receipt Number : ", result.goodsReceipts[0].GoodsReceiptNumber);
                                    poTrackerEntity.GoodsReceipts = result.goodsReceipts[0];
                                }
                                else{
                                    poTrackerEntity.GoodsReceipts = {};
                                }

                                //7. Syngenta Finance - Invoice Validate
                                return financeService.getAllFinanceInvoices(option, value)
                                .then((result) => {
                                    if(result.financeInvoices != undefined && result.financeInvoices.length > 0) {
                                        console.log("Finance Invoice Number : ", result.financeInvoices[0].invoiceNumber);
                                        poTrackerEntity.FinanceInvoices = result.financeInvoices[0];
                                    }
                                    else{
                                        poTrackerEntity.FinanceInvoices = {};
                                    }  

                                    //8. Syngenta Finance - Payment Proposal + Bank Status
                                    return financeService.getAllPaymentProposals(option, value)
                                    .then((result) => {
                                        if(result.paymentProposals != undefined && result.paymentProposals.length > 0) {
                                            console.log("Finance Payment Proposal Number : ", result.paymentProposals[0].paymentProposalNumber);
                                            poTrackerEntity.PaymentDetails = result.paymentProposals[0];
                                        }
                                        else{
                                            poTrackerEntity.PaymentDetails = {};
                                        }                               
                            
                                    return poTrackerEntity;
                                    });  // 8 End
                                }); //7 End
                            }); //6 End
                        }); //5 End
                    }); // 4 End
                }); // 3 End

            }); // 2 End
        }); //1 End
    }

    poTrackerService.getSalesOrderTrackingDetails = function(option, value){
        //this.userData = userService.getUserData();
        var poTrackerEntity = {};

        poTrackerEntity.PurchaseOrderNumber = value;
            //2. Sales Order Details
            return vendorService.getAllVendorSalesOrders(option, value)
            .then((result) => {
                if(result.vendorSalesOrders != undefined && result.vendorSalesOrders.length > 0 ){
                    poTrackerEntity.VendorSalesOrder = result.vendorSalesOrders[0];
                    // poTrackerEntity.VendorSalesOrderStatus = result.vendorSalesOrders[0].Status;
                    // poTrackerEntity.VendorSalesOrderStatusUpdatedOn =  result.vendorSalesOrders[0].StatusUpdatedOn;
                }
                else{
                    poTrackerEntity.VendorSalesOrder = {};
                    return poTrackerEntity;
                }

                //3. Goods Issue Details
                return vendorService.getAllGoodsIssue("so", poTrackerEntity.VendorSalesOrder.salesOrderNumber)
                .then((result) => {
                    if(result.goodsIssueList != undefined && result.goodsIssueList.length > 0) {
                        console.log("GoodsIssueNumber: ", result.goodsIssueList[0].GoodsIssueNumber);
                        poTrackerEntity.GoodsIssue = result.goodsIssueList[0];
                        // poTrackerEntity.GoodsIssueNumber = result.goodsIssueList[0].GoodsIssueNumber;
                        // poTrackerEntity.GoodsIssueDate = result.goodsIssueList[0].GoodsIssueDate;
                    }
                    else{
                        poTrackerEntity.GoodsIssue = {};
                        return poTrackerEntity;
                    }
                   

                    //4. Vendor - Issue invoice 
                    return vendorService.getAllVendorInvoices("so", poTrackerEntity.GoodsIssue.salesOrderNumber)
                    .then((result) => {
                        if(result.vendorInvoices != undefined && result.vendorInvoices.length > 0) {
                            console.log("Vendor Invoice Number : ", result.vendorInvoices[0].InvoiceNumber);
                            poTrackerEntity.VendorInvoices = result.vendorInvoices[0];
                        }
                        else{
                            poTrackerEntity.VendorInvoices = {};
                            return poTrackerEntity;
                        }

                        //5. Vendor - Issue invoice
                        return logisticService.getAllLogisticTransactions("gin", poTrackerEntity.VendorInvoices.goodsIssueNumber)
                        .then((result) => {
                            if(result.logisticTransactions != undefined && result.logisticTransactions.length > 0) {
                                console.log("Logistic Consignment Number : ", result.logisticTransactions[0].ConsignmentNumber);
                                poTrackerEntity.LogisticTransaction = result.logisticTransactions[0];
                            }
                            else{
                                poTrackerEntity.LogisticTransaction = {};
                                return poTrackerEntity;
                            }

                            //6. Goods Receipt
                            return procurementService.getAllGoodsReceiptDetails("po", poTrackerEntity.LogisticTransaction.purchaseOrderRefNumber)
                            .then((result) => {
                                if(result.goodsReceipts != undefined && result.goodsReceipts.length > 0) {
                                    console.log("Goods Receipt Number : ", result.goodsReceipts[0].GoodsReceiptNumber);
                                    poTrackerEntity.GoodsReceipts = result.goodsReceipts[0];
                                }
                                else{
                                    poTrackerEntity.GoodsReceipts = {};
                                    return poTrackerEntity;
                                }

                                //7. Syngenta Finance - Invoice Validate
                                return financeService.getAllFinanceInvoices("po", poTrackerEntity.GoodsReceipts.purchaseOrderRefNumber)
                                .then((result) => {
                                    if(result.financeInvoices != undefined && result.financeInvoices.length > 0) {
                                        console.log("Finance Invoice Number : ", result.financeInvoices[0].invoiceNumber);
                                        poTrackerEntity.FinanceInvoices = result.financeInvoices[0];
                                    }
                                    else{
                                        poTrackerEntity.FinanceInvoices = {};
                                        return poTrackerEntity;
                                    }  

                                    //8. Syngenta Finance - Payment Proposal + Bank Status
                                    return financeService.getAllPaymentProposals("po", poTrackerEntity.FinanceInvoices.purchaseOrderRefNumber)
                                    .then((result) => {
                                        if(result.paymentProposals != undefined && result.paymentProposals.length > 0) {
                                            console.log("Finance Payment Proposal Number : ", result.paymentProposals[0].paymentProposalNumber);
                                            poTrackerEntity.PaymentDetails = result.paymentProposals[0];
                                        }
                                        else{
                                            poTrackerEntity.PaymentDetails = {};
                                        }                               
                            
                                    return poTrackerEntity;
                                    });  // 8 End
                                }); //7 End
                            }); //6 End
                        }); //5 End
                    }); // 4 End
                }); // 3 End

            }); // 2 End
    }

    poTrackerService.getAllDashboardData = function(option, value){
        var poEntity = {};

            return procurementService.getAllDashboardData("date-po-created", value)
            .then((result) => {
                if(result.purchaseOrders != undefined && result.purchaseOrders.length > 0 ){
                    poEntity.purchaseOrders = result.purchaseOrders;
                    return procurementService.getAllDashboardData("date-so-created", value)
                    .then((result) => {
                        if(result.vendorSalesOrders != undefined && result.vendorSalesOrders.length > 0 ){
                            poEntity.vendorSalesOrders = result.vendorSalesOrders;
                            return procurementService.getAllDashboardData("date-goods-issued", value)
                            .then((result) => {
                                if(result.goodsIssueList != undefined && result.goodsIssueList.length > 0 ){
                                    poEntity.goodsIssueList = result.goodsIssueList;
                                    return procurementService.getAllDashboardData("date-logistic-delivered", value)
                                    .then((result) => {
                                        if(result){
                                            poEntity.logisticTransactions = result.logisticTransactions;
                                            return procurementService.getAllDashboardData("date-vendor-invoice-created", value)
                                            .then((result) => {
                                                if(result.vendorInvoices != undefined && result.vendorInvoices.length > 0 ){
                                                    poEntity.vendorInvoices = result.vendorInvoices;
                                                    return procurementService.getAllDashboardData("date-goods-received", value)
                                                    .then((result) => {
                                                        if(result){
                                                            poEntity.goodsReceipts = result.goodsReceipts;
                                                            return procurementService.getAllDashboardData("date-po-numbers", value)
                                                            .then((result) => {
                                                                if(result){
                                                                    poEntity.poNumbers = result;
                                                                    return financeService.getAllDashboardData("date-finance-invoice-created", poEntity.poNumbers)
                                                                    .then((result) => {
                                                                        if(result.financeInvoices != undefined && result.financeInvoices.length > 0 ){
                                                                            poEntity.financeInvoices = result.financeInvoices;
                                                                            return financeService.getAllDashboardData("date-payment-proposal-created", poEntity.poNumbers)
                                                                            .then((result) => {
                                                                                if(result.paymentProposals != undefined && result.paymentProposals.length > 0 ){
                                                                                    poEntity.paymentProposals = result.paymentProposals;
                                                                                }
                                                                                return poEntity;
                                                                            });
                                                                        }
                                                                        else{
                                                                            return poEntity;
                                                                        }
                                                                    });
                                                                }
                                                                else{
                                                                    return poEntity;
                                                                }
                                                            });
                                                        }
                                                        else{
                                                            return poEntity;
                                                        }
                                                    });
                                                }
                                                else{
                                                    return poEntity;
                                                }
                                            });
                                        }
                                        else{
                                            return poEntity;
                                        }
                                    });
                                }
                                else{
                                    return poEntity;
                                }
                            });
                        }
                        else{
                            return poEntity;
                        }
                    });
                }
                else{
                    return poEntity;
                }
            }); 
    }

    return poTrackerService;
}        
                
            // //Ikea Received
            // return ikeaService.getAllIkeaReceived(option, poTrackerEntity.IkeaReceivedNumber)
            //     .then((result) => {
            //         //poTrackerEntity.IkeaStoreName = userService.getUserNameById("ikeas", "1");

            //         if (result && result.ikeaReceived &&  result.ikeaReceived.length >0){
            //             poTrackerEntity.ikeaReceived = result.ikeaReceived[0];
            //             poTrackerEntity.IkeaStoreName = userService.getUserNameById("ikeas", result.ikeaReceived[0].ikeaId);
                        
            //             poTrackerEntity.IkeaReceivedDate = result.ikeaReceived[0].receivedDate;
            //             poTrackerEntity.IkeaReceivedConsignmentNumber = result.ikeaReceived[0].consignmentNumber;
            //             poTrackerEntity.IkeaPurchaseOrderNumber = result.ikeaReceived[0].purchaseOrderNumber;                        
            //             poTrackerEntity.ProcessorToIkeaTransportConsitionSatisfied = result.ikeaReceived[0].transportConsitionSatisfied;                        
            //         }       
            //         else{
            //             return;
            //         }
            //         // Logistics - Processor to Ikea
            //         return logisticService.getAllLogisticP2ITransactions(option, poTrackerEntity.IkeaReceivedConsignmentNumber)
            //         .then((result) => {
            //             if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
            //                 poTrackerEntity.logisticP2ITransactions = result.logisticTransactions[0];
            //                 poTrackerEntity.ProcessorToIkeaTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
            //                 poTrackerEntity.ProcessorToIkeaPickUpDate = result.logisticTransactions[0].dispatchDateTime;
            //                 poTrackerEntity.ProcessorToIkeaDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
            //                 poTrackerEntity.ProcessorConsignmentNumber = result.logisticTransactions[0].processorConsignmentNumber;                            
            //             }
            //             else{
            //                 return;
            //             }
            //             // Processor Dispatch
            //             return processorService.getAllProcessorDispatch(option, poTrackerEntity.ProcessorConsignmentNumber)
            //             .then((result) => {
            //                 if (result && result.processorDispatch &&  result.processorDispatch.length >0){
            //                     poTrackerEntity.processorDispatch = result.processorDispatch[0];
            //                     poTrackerEntity.ProcessorUseByDate = result.processorDispatch[0].usedByDate;
            //                     poTrackerEntity.ProcessorBatchCode = result.processorDispatch[0].processorBatchCode;
            //                 }
            //                 else{
            //                     return;
            //                 }
            //                 //Processor Transaction
            //                 return processorService.getAllProcessingTransactions(option, poTrackerEntity.ProcessorBatchCode)
            //                 .then((result) => {
            //                     if (result && result.processingTransaction &&  result.processingTransaction.length >0){
            //                         poTrackerEntity.processingTransaction = result.processingTransaction[0];
            //                         poTrackerEntity.ProcessingDate = result.processingTransaction[0].updatedOn;
            //                         poTrackerEntity.ProcessorReceiptNumber = result.processingTransaction[0].processorReceiptNumber;
            //                     }
            //                     else{
            //                         return;
            //                     }
            //                     // Processor Received
            //                     return processorService.getAllProcessorReceived(option, poTrackerEntity.ProcessorReceiptNumber)
            //                     .then((result) => {
            //                         if (result && result.processorReceived &&  result.processorReceived.length >0){
            //                             poTrackerEntity.processorReceived = result.processorReceived[0];
            //                             poTrackerEntity.ProcessorCompanyName = userService.getUserNameById("processors", result.processorReceived[0].processorId);
            //                             poTrackerEntity.AbattoirToProcessorTransportConsignemntNumber = result.processorReceived[0].consignmentNumber;
            //                             poTrackerEntity.ProcessorPurchaseOrderNumber = result.processorReceived[0].purchaseOrderNumber;
            //                             poTrackerEntity.AbattoirToProcessorTransportConsitionSatisfied =  result.processorReceived[0].transportConsitionSatisfied;
            //                         }
            //                         else{
            //                             return;
            //                         }
            //                         // Logistics Abattoir to Processor
            //                         return logisticService.getAllLogisticA2PTransactions(option, poTrackerEntity.AbattoirToProcessorTransportConsignemntNumber)
            //                         .then((result) => {
            //                             if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
            //                                 poTrackerEntity.logisticA2PTransactions = result.logisticTransactions[0];
            //                                 poTrackerEntity.AbattoirToProcessorTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
            //                                 poTrackerEntity.AbattoirToProcessorTransportConsignemntNumber = result.logisticTransactions[0].consignmentNumber;
                                            
            //                                 poTrackerEntity.AbattoirToProcessorPickUpDate = result.logisticTransactions[0].dispatchDateTime;
            //                                 poTrackerEntity.AbattoirToProcessorDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
            //                                 poTrackerEntity.AbattoirConsignmentNumber = result.logisticTransactions[0].abattoirConsignmentNumber;
            //                             }
            //                             else{
            //                                 return;
            //                             }
            //                             // Abattoir Dispatch
            //                             return abattoirService.getAllAbattoirDispatch(option, poTrackerEntity.AbattoirConsignmentNumber)
            //                             .then((result) => {
            //                                 if (result && result.abattoirMaterialDispatch &&  result.abattoirMaterialDispatch.length >0){
            //                                     poTrackerEntity.abattoirMaterialDispatch = result.abattoirMaterialDispatch[0];
            //                                     poTrackerEntity.AbattoirBatchCode = result.abattoirMaterialDispatch[0].consignmentNumber;
            //                                     poTrackerEntity.AbattoirUseByDate = result.abattoirMaterialDispatch[0].usedByDate;
            //                                     poTrackerEntity.AbattoirProcessDate = result.abattoirMaterialDispatch[0].updatedOn;
            //                                     poTrackerEntity.AbattoirRawMaterialBatchNumber = result.abattoirMaterialDispatch[0].rawMaterialBatchNumber;
            //                                     poTrackerEntity.AbattoirDispatchMaterialClass = result.abattoirMaterialDispatch[0].materialGrade;
            //                                     poTrackerEntity.AbbattoirPurchaseOrderReferenceNumber = result.abattoirMaterialDispatch[0].purchaseOrderReferenceNumber;
            //                                     poTrackerEntity.ReceiptBatchId = result.abattoirMaterialDispatch[0].receiptBatchId;
            //                                 }
            //                                 else{
            //                                     return;
            //                                 }
            //                                 // Abattoir Received
            //                                 return abattoirService.getAllAbattoirReceived(option, poTrackerEntity.ReceiptBatchId)
            //                                 .then((result) => {
            //                                     if (result && result.abattoirMaterialReceived &&  result.abattoirMaterialReceived.length >0){
            //                                         poTrackerEntity.abattoirMaterialReceived = result.abattoirMaterialReceived[0];
            //                                         poTrackerEntity.AbattoirName = userService.getUserNameById("abattoirs", result.abattoirMaterialReceived[0].abattoirId);
                                                    
            //                                         poTrackerEntity.FarmerName = userService.getUserNameById("farmers", result.abattoirMaterialReceived[0].farmerId);
            //                                         poTrackerEntity.AbattoirRawMaterialBatchNumber = result.abattoirMaterialReceived[0].rawMaterialBatchNumber;
            //                                         poTrackerEntity.FarmerMaterialClass = result.abattoirMaterialReceived[0].materialGrade;
            //                                         poTrackerEntity.ReceiptBatchId = result.abattoirMaterialReceived[0].receiptBatchId;
            //                                     }
            //                                     return poTrackerEntity;
            //                                 });                                            
            //                             });
            //                         });
            //                     });
            //                 });
            //             })
            //         });
            //     });
            
            
            // });


        
