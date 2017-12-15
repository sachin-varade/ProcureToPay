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
	ShoppingOrderDate			string		`json:"ShoppingOrderDate"`
	OrderBy						string		`json:"orderBy"`
	BuyerCompany				string		`json:"buyerCompany"`
	BuyerDepartment				string		`json:"buyerDepartment"`
	BuyerContactPerson			string		`json:"buyerContactPerson"`
	BuyerContactPersonAddress	string		`json:"buyerContactPersonAddress"`
	BuyerContactPersonPhone		string		`json:"buyerContactPersonPhone"`
	BuyerContactPersonEmail		string		`json:"buyerContactPersonEmail"`
	DeliverToPersonName			string		`json:"deliverToPersonName"`
	DeliverToPersonAddress		string		`json:"DeliverToPersonAddress"`
	InvoiceAddress				string		`json:"InvoiceAddress"`
	TotalOrderAmount			string		`json:"totalOrderAmount"`
	AccountingType				string		`json:"accountingType"`
	CostCenter					string		`json:"costCenter"`
	GLAccount					string		`json:"glAccount"`
	TermsOfPayment				string		`json:"TermsOfPayment"`
	InternalNotes				string		`json:"internalNotes"`
	ExternalNotes				string		`json:"externalNotes"`
	OrderedMaterial				[]OrderMaterial	`json:"orderedMaterial"`
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
}


type AllPurchaseOrderNumbers struct{
	PurchaseOrderNumbers []string `json:"purchaseOrderNumbers"`
}

type AllPurchaseOrderDetails struct{
	PurchaseOrders []PurchaseOrder `json:"purchaseOrders"`
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