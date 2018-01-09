/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"fmt"
	"encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)
// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode - %s", err)
	}
}

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type Material struct {
	MaterialId					string		`json:"materialId"`
	ProductName					string		`json:"productName"`
	ProductDescription			string		`json:"productDescription"`
	Quantity					string		`json:"quantity"`	
	QuantityUnit				string		`json:"quantityUnit"`
	PricePerUnit				string		`json:"pricePerUnit"`	
	Currency					string		`json:"currency"`
	NetAmount					string		`json:"netAmount"`
	DispatchedQuantity			string		`json:"dispatchedQuantity"`
	BatchNumber					string		`json:"batchNumber"`
	ExpectedDeliveryDate					string		`json:"expectedDeliveryDate"`
}

type FinanceInvoice struct {
	InvoiceNumber						string		`json:"invoiceNumber"`
	InvoiceDate							string		`json:"invoiceDate"`
	InvoicePublishDate							string		`json:"invoicePublishDate"`
	GoodsIssueNumber					string		`json:"goodsIssueNumber"`
	GoodsIssueDate						string		`json:"goodsIssueDate"`
	SalesOrderNumber					string		`json:"salesOrderNumber"`
	PurchaseOrderRefNumber				string		`json:"purchaseOrderRefNumber"`
	PurchaseOrderRefDate				string		`json:"purchaseOrderRefDate"`
	SupplierCode						string		`json:"supplierCode"`
	PurchaserCompany					string		`json:"purchaserCompany"`
	PurchaserCompanyDept				string		`json:"purchaserCompanyDept"`
	PurchaserContactPersonName			string		`json:"purchaserContactPersonName"`
	PurchaserContactPersonAddress		string		`json:"purchaserContactPersonAddress"`
	PurchaserContactPersonPhone			string		`json:"purchaserContactPersonPhone"`
	PurchaserContactPersonEmail			string		`json:"purchaserContactPersonEmail"`
	DeliverToPersonName					string		`json:"deliverToPersonName"`
	DeliveryAddress						string		`json:"deliveryAddress"`
	InvoicePartyId						string		`json:"invoicePartyId"`
	InvoiceAddress						string		`json:"invoiceAddress"`
	GrossAmount							string		`json:"grossAmount"`
	VatNumber							string		`json:"vatNumber"`
	MaterialList						[]Material		`json:"materialList"`
	StatusUpdates						[]StatusUpdates		`json:"statusUpdates"`
	CurrentStatus							string		`json:"currentStatus"`
}

type StatusUpdates struct{
	Status 						string 	`json:"status"`
	UpdatedBy 						string 	`json:"updatedBy"`
	UpdatedOn 						string 	`json:"updatedOn"`
}

type AllFinanceInvoiceNumbers struct{
	InvoiceNumbers 						[]string 	`json:"invoiceNumbers"`
}

type AllFinanceInvoiceDetails struct{
	FinanceInvoices 						[]FinanceInvoice `json:"financeInvoices"`
}

type PaymentProposal struct {
	PaymentProposalNumber					string	`json:"paymentProposalNumber"`
	PaymentProposalDate						string	`json:"paymentProposalDate"`
	VendorUniqueNumber						string	`json:"vendorUniqueNumber"`
	VendorBankAccountNumber					string	`json:"vendorBankAccountNumber"`
	VendorBankAccountType					string	`json:"vendorBankAccountType"`
	BankUniqueid							string	`json:"bankUniqueid"`
	CreatedBy								string	`json:"createdBy"`
	CreationDate							string	`json:"creationDate"`
	ProposalDetails							[]PaymentProposalDetails	`json:"proposalDetails"`	
}

type PaymentProposalDetails struct {
	PaymentProposalNumber					string	`json:"paymentProposalNumber"`
	ProposedPaymentDate						string	`json:"proposedPaymentDate"`
	Tax										string	`json:"tax"`
	Amount									string	`json:"amount"`
	PoReferenceNumber						string	`json:"poReferenceNumber"`
	InvoiceReferenceNumber					string	`json:"InvoiceReferenceNumber"`
	Status									string	`json:"status"`
	BankProcessingDate						string	`json:"bankProcessingDate"`
}

type AllPaymentProposalNumbers struct {
	PaymentProposalNumbers 			[]string	`json:"paymentProposalNumbers"`
}

type AllPaymentProposalDetails struct {
	PaymentProposals []PaymentProposal	`json:"paymentProposals"`
}


// ============================================================================================================================
// Init - initialize the chaincode 
//
// Shows off PutState() and how to pass an input argument to chaincode.
//
// Inputs - Array of strings
// 
// Returns - shim.Success or error
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("App Is Starting Up")
	_, args := stub.GetFunctionAndParameters()
	var err error
	
	fmt.Println("Init() args count:", len(args))
	fmt.Println("Init() args found:", args)

	// expecting 1 arg for instantiate or upgrade
	if len(args) == 1 {
		fmt.Println("Init() arg[0] length", len(args[0]))

		// expecting arg[0] to be length 0 for upgrade
		if len(args[0]) == 0 {
			fmt.Println("args[0] is empty... must be upgrading")
		} else {
			fmt.Println("args[0] is not empty, must be instantiating")
		}
	}
	
	var allFinanceInvoiceNumbers AllFinanceInvoiceNumbers
	jsonAsBytesAllFinanceInvoiceNumbers, _ := json.Marshal(allFinanceInvoiceNumbers)
	err = stub.PutState("allFinanceInvoiceNumbers", jsonAsBytesAllFinanceInvoiceNumbers)
	if err != nil {		
		return shim.Error(err.Error())
	}


	var allPaymentProposalNumbers AllPaymentProposalNumbers
	jsonAsBytesAllPaymentProposalNumbers, _ := json.Marshal(allPaymentProposalNumbers)
	err = stub.PutState("allPaymentProposalNumbers", jsonAsBytesAllPaymentProposalNumbers)
	if err != nil {		
		return shim.Error(err.Error())
	}

	fmt.Println(" - ready for action")                        
	return shim.Success(nil)
}


// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()	
	fmt.Println("starting invoke, for - " + function)

	// Handle different functions
	if function == "init" {                    //initialize the chaincode state, used as reset
		return t.Init(stub)
	} else if function == "getAllFinanceInvoices" {
		return getAllFinanceInvoices(stub, args[0], args[1])
	} else if function == "saveFinanceInvoice" {
		return saveFinanceInvoice(stub, args)
	} else if function == "getAllPaymentProposals" {
		return getAllPaymentProposals(stub, args[0], args[1])
	} else if function == "savePaymentProposal" {
		return savePaymentProposal(stub, args)
	} else if function == "updateFinanceInvoice" {
		return updateFinanceInvoice(stub, args)
	} else if function == "getUniqueId" {
		return getUniqueId(stub, args[0], args[1])
	} else if function == "processPayment" {
		return processPayment(stub, args)
	} else if function == "getAllDashboardData" {
		return getAllDashboardData(stub, args[0], args[1])
	}
	
	// error out
	fmt.Println("Received unknown invoke function name - " + function)
	return shim.Error("Received unknown invoke function name - '" + function + "'")
}

// ============================================================================================================================
// Query - legacy function
// ============================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Error("Unknown supported call - Query()")
}