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

type IkeaReceived struct {
	IkeaReceivedNumber					string	`json:"ikeaReceivedNumber"`
	IkeaId							string	`json:"ikeaId"`
	PurchaseOrderNumber					string	`json:"purchaseOrderNumber"`	
	ConsignmentNumber					string	`json:"consignmentNumber"`	
	TransportConsitionSatisfied			string	`json:"transportConsitionSatisfied"`
	GUIDNumber							string	`json:"guidNumber"`
	MaterialName						string	`json:"materialName"`
	MaterialGrade						string	`json:"materialGrade"`	
	Quantity							string	`json:"quantity"`
	QuantityUnit						string	`json:"quantityUnit"`	
	UsedByDate							string	`json:"usedByDate"`
	ReceivedDate						string	`json:"receivedDate"`	
	TransitTime							string	`json:"transitTime"`
	Storage								string	`json:"storage"`
	AcceptanceCheckList					[]AcceptanceCriteria	`json:"acceptanceCheckList"`
	UpdatedOn							string	`json:"updatedOn"`
	UpdatedBy							string	`json:"updatedBy"`
}

type AcceptanceCriteria struct {
	Id						string	`json:"id"`	
	RuleCondition			string	`json:"ruleCondition"`
	ConditionSatisfied		string	`json:"conditionSatisfied"`
}


type IkeaDispatch struct {
	IkeaDispatchNumber					string	`json: "ikeaDispatchNumber"`
	IkeaReceivedNumber					string	`json:"ikeaReceivedNumber"`
	IkeaId							string	`json:"ikeaId"`
	GUIDNumber							string	`json:"guidNumber"`
	MaterialName						string	`json:"materialName"`
	MaterialGrade						string	`json:"materialGrade"`	
	Quantity							string	`json:"quantity"`
	QuantityUnit						string	`json:"quantityUnit"`	
	DispatchDateTime					string	`json:"dispatchDateTime"`
	SoldFromDate					string	`json:"soldFromDate"`
	SoldUntillDate					string	`json:"soldUntillDate"`
	PreparedBy					string	`json:"preparedBy"`
	PreparedOn					string	`json:"preparedOn"`
	SoldAt					string	`json:"soldAt"`
}

type IkeaBill struct {
	BillNumber							string	`json:"billNumber"`	
	BillDateTime						string	`json:"billDateTime"`		
	IkeaFamily							string	`json:"ikeaFamily"`
	GUIDUniqueNumber					string	`json:"guidUniqueNumber"`
	MaterialName						string	`json:"materialName"`
	Quantity							string	`json:"quantity"`
	IkeaDispatchNumber					string	`json:"ikeaDispatchNumber"`
	Amount							string	`json:"amount"`
}

type AllIkeaReceivedIds struct{
	IkeaReceivedNumbers []string	`json:"ikeaReceivedNumbers"`
}

type AllIkeaReceivedDetails struct{
	IkeaReceived []IkeaReceived	`json:"ikeaReceived"`
}

type AllIkeaDispatchIds struct{
	IkeaDispatchNumbers []string	`json:"ikeaDispatchNumbers"`
}

type AllIkeaDispatchDetails struct{
	IkeaDispatch []IkeaDispatch	`json:"ikeaDispatch"`
}

type AllIkeaBillNumbers struct{
	IkeaBillNumbers []string	`json:"ikeaBillNumbers"`
}

type AllIkeaBillNumberDetails struct{
	IkeaBillNumbers []IkeaBill	`json:"ikeaBillNumbers"`
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
	
	var allIkeaReceivedIds AllIkeaReceivedIds
	jsonAsBytesAllIkeaReceivedIds, _ := json.Marshal(allIkeaReceivedIds)
	err = stub.PutState("allIkeaReceivedIds", jsonAsBytesAllIkeaReceivedIds)
	if err != nil {		
		return shim.Error(err.Error())
	}

	var allIkeaDispatchIds AllIkeaDispatchIds
	jsonAsBytesAllIkeaDispatchIds, _ := json.Marshal(allIkeaDispatchIds)
	err = stub.PutState("allIkeaDispatchIds", jsonAsBytesAllIkeaDispatchIds)
	if err != nil {		
		return shim.Error(err.Error())
	}

	var allIkeaBillNumbers AllIkeaBillNumbers
	jsonAsBytesAllIkeaBillNumbers, _ := json.Marshal(allIkeaBillNumbers)
	err = stub.PutState("allIkeaBillNumbers", jsonAsBytesAllIkeaBillNumbers)
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
	} else if function == "getAllIkeaReceived" {
		return getAllIkeaReceived(stub, args[0], args[1])
	} else if function == "saveIkeaReceived" {
		return saveIkeaReceived(stub, args)
	} else if function == "getAllIkeaDispatch" {
		return getAllIkeaDispatch(stub, args[0], args[1])
	} else if function == "saveIkeaDispatch" {
		return saveIkeaDispatch(stub, args)
	} else if function == "saveIkeaBill" {
		return saveIkeaBill(stub, args)
	} else if function == "getIkeaBillDetails" {
		return getIkeaBillDetails(stub, args[0], args[1])
	} else if function == "getUniqueId" {
		return getUniqueId(stub, args[0], args[1])
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