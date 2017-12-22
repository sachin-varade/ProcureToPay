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

//PurchaseOrderNumber is unique
type PurchaseOrder struct {
	PurchaseOrderNumber			string		`json:"purchaseOrderNumber"`
	PurchaseOrderDate			string		`json:"purchaseOrderDate"`
	ShoppingOrderNumber			string		`json:"shoppingOrderNumber"`
	ShoppingOrderDate			string		`json:"shoppingOrderDate"`
	OrderBy						string		`json:"orderBy"`
	BuyerCompany				string		`json:"buyerCompany"`
	BuyerDepartment				string		`json:"buyerDepartment"`
	BuyerContactPerson			string		`json:"buyerContactPerson"`
	BuyerContactPersonAddress	string		`json:"buyerContactPersonAddress"`
	BuyerContactPersonPhone		string		`json:"buyerContactPersonPhone"`
	BuyerContactPersonEmail		string		`json:"buyerContactPersonEmail"`
	SupplierName				string		`json:"supplierName"`
	SupplierUniqueNo				string		`json:"supplierUniqueNo"`
	SupplierContactPerson				string		`json:"supplierContactPerson"`
	SupplierContactPersonAddress				string		`json:"supplierContactPersonAddress"`
	SupplierContactPersonAddressPhone				string		`json:"supplierContactPersonPhone"`
	SupplierContactPersonAddressEmail				string		`json:"supplierContactPersonEmail"`
	DeliverToPersonName			string		`json:"deliverToPersonName"`
	DeliverToPersonAddress		string		`json:"deliverToPersonAddress"`
	InvoiceAddress				string		`json:"invoiceAddress"`
	TotalOrderAmount			string		`json:"totalOrderAmount"`
	AccountingType				string		`json:"accountingType"`
	CostCenter					string		`json:"costCenter"`
	GLAccount					string		`json:"glAccount"`
	TermsOfPayment				string		`json:"termsOfPayment"`
	InternalNotes				string		`json:"internalNotes"`
	ExternalNotes				string		`json:"externalNotes"`
	OrderedMaterial				[]OrderMaterial	`json:"orderedMaterial"`
	Status				string	`json:"status"`
}

type OrderMaterial struct {
	OrderMaterialId				string		`json:"orderMaterialId"`
	BuyerMaterialGroup			string		`json:"buyerMaterialGroup"`
	ProductName					string		`json:"productName"`
	ProductDescription			string		`json:"productDescription"`
	Quantity					string		`json:"quantity"`
	QuantityUnit				string		`json:"quantityUnit"`
	PricePerUnit				string		`json:"pricePerUnit"`	
	Currency					string		`json:"currency"`
	NetAmount				string		`json:"netAmount"`	
}


type AllPurchaseOrderNumbers struct{
	PurchaseOrderNumbers []string `json:"purchaseOrderNumbers"`
}

type AllPurchaseOrderDetails struct{
	PurchaseOrders []PurchaseOrder `json:"purchaseOrders"`
}

type VendorSalesOrder struct {
	SalesOrderNumber					string		`json:"salesOrderNumber"`
	PurchaseOrderRefNumber				string		`json:"purchaseOrderRefNumber"`
	PurchaseOrderRefDate				string		`json:"purchaseOrderRefDate"`
	PurchaserCompany					string		`json:"purchaserCompany"`
	PurchaserCompanyDept				string		`json:"purchaserCompanyDept"`
	PurchaserContactPersonName			string		`json:"purchaserContactPersonName"`
	PurchaserContactPersonAddress		string		`json:"purchaserContactPersonAddress"`
	PurchaserContactPersonPhone			string		`json:"purchaserContactPersonPhone"`
	PurchaserContactPersonEmail			string		`json:"purchaserContactPersonEmail"`
	DeliverToPersonName					string		`json:"deliverToPersonName"`
	DeliveryAddress						string		`json:"deliveryAddress"`
	InvoicePartyId						string		`json:"invoicePartyId"`
	InvoicePartyAddress					string		`json:"invoicePartyAddress"`
	MaterialList						[]VendorMaterial		`json:"materialList"`
	Status				string	`json:"status"`
	StatusUpdatedOn				string	`json:"statusUpdatedOn"`
	StatusUpdatedBy				string	`json:"statusUpdatedBy"`
}


type VendorMaterial struct {
	MaterialId					string		`json:"materialId"`
	ProductName					string		`json:"productName"`
	ProductDescription			string		`json:"productDescription"`
	Quantity					string		`json:"quantity"`	
	QuantityUnit				string		`json:"quantityUnit"`
	PricePerUnit				string		`json:"pricePerUnit"`	
	Currency					string		`json:"currency"`
	NetAmount					string		`json:"netAmount"`
	DispatchedQuantity			string		`json:"dispatchedQuantity"`
}

type AllVendorSalesOrderNumbers struct{
	SalesOrderNumbers 		[]string		`json:"salesOrderNumbers"`
}

type AllVendorSalesOrderDetails struct{
	VendorSalesOrders 		[]VendorSalesOrder		`json:"vendorSalesOrders"`
}

type LogisticTransaction struct {
	ConsignmentNumber				string		`json:"consignmentNumber"`
	GoodsIssueRefNumber			string		`json:"goodsIssueRefNumber"`
	PurchaseOrderRefNumber	string		`json:"purchaseOrderRefNumber"`
	SupplierNumber	string		`json:"supplierNumber"`
	ShipToParty	string		`json:"shipToParty"`
	PickedupDatetime	string		`json:"pickedupDatetime"`
	ExpectedDeliveryDatetime	string		`json:"expectedDeliveryDatetime"`	
	ActualDeliveryDatetime	string		`json:"actualDeliveryDatetime"`
	HazardousMaterial	string		`json:"hazardousMaterial"`	
	PackagingInstruction	string		`json:"packagingInstruction"`	
}


type AllLogisticTransactionIds struct{
	ConsignmentNumbers []string `json:"ConsignmentNumbers"`
}

type AllLogisticTransactionDetails struct{
	LogisticTransactions []LogisticTransaction `json:"logisticTransactions"`
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
	
	var allPurchaseOrderNumbers AllPurchaseOrderNumbers
	jsonAsBytesAllPurchaseOrderNumbers, _ := json.Marshal(allPurchaseOrderNumbers)
	err = stub.PutState("allPurchaseOrderNumbers", jsonAsBytesAllPurchaseOrderNumbers)
	if err != nil {		
		return shim.Error(err.Error())
	}

	// // Vendor SalesOrder 
	var allVendorSalesOrderNumbers AllVendorSalesOrderNumbers
	jsonAsBytesallVendorSalesOrderNumbers, _ := json.Marshal(allVendorSalesOrderNumbers)
	err = stub.PutState("allVendorSalesOrderNumbers", jsonAsBytesallVendorSalesOrderNumbers)
	if err != nil {		
		return shim.Error(err.Error())
	}

	var allLogisticTransactionIds AllLogisticTransactionIds
	jsonAsBytesAllLogisticTransactionIds, _ := json.Marshal(allLogisticTransactionIds)
	err = stub.PutState("allLogisticTransactionIds", jsonAsBytesAllLogisticTransactionIds)
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
	} else if function == "getAllPurchaseOrders" {
		return getAllPurchaseOrders(stub, args[0], args[1])
	} else if function == "savePurchaseOrder" {
		return savePurchaseOrder(stub, args)
	} else if function == "updatePurchaseOrder" {
		return updatePurchaseOrder(stub, args)
	} else if function == "getUniqueId" {
		return getUniqueId(stub, args[0], args[1])
	} else if function == "saveLogisticTransaction" {
		return saveLogisticTransaction(stub, args)
	} else if function == "getAllLogisticTransactions" {
		return getAllLogisticTransactions(stub, args[0], args[1])
	}  else if function == "getAllVendorSalesOrders" {
		return getAllVendorSalesOrders(stub, args[0], args[1])
	} else if function == "saveVendorSalesOrder" {
		return saveVendorSalesOrder(stub, args)
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