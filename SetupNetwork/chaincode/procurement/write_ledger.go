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
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

//Create AbattoirInward block
func savePurchaseOrder(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running savePurchaseOrder..")

	if len(args) != 22 {
		fmt.Println("Incorrect number of arguments. Expecting 22 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 22")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);
	fmt.Println("Arguments :"+args[13]+","+args[14]+","+args[15]+","+args[16]+","+args[17]+","+args[18]+","+args[19]+","+args[20]+","+args[21]);
	allBAsBytes, err := stub.GetState("allPurchaseOrderNumbers")
	if err != nil {
		return shim.Error("Failed to get all Purchase Order Numbers")
	}
	var allb AllPurchaseOrderNumbers
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all PO Numbers")
	}
	if checkDuplicateId(allb.PurchaseOrderNumbers, args[0]) == 0{
		return shim.Error("Duplicate PO Number - "+ args[0])
	}

	var bt PurchaseOrder
	bt.PurchaseOrderNumber				= args[0]
	bt.PurchaseOrderDate				= args[1]
	bt.ShoppingOrderNumber				= args[2]	
	bt.ShoppingOrderDate				= args[3]		
	bt.OrderBy 							= args[4]
	bt.BuyerCompany						= args[5]
	bt.BuyerDepartment					= args[6]
	bt.BuyerContactPerson				= args[7]
	bt.BuyerContactPersonAddress		= args[8]
	bt.BuyerContactPersonPhone			= args[9]
	bt.BuyerContactPersonEmail			= args[10]
	bt.DeliverToPersonName				= args[11]	
	bt.DeliverToPersonAddress			= args[12]	
	bt.InvoiceAddress					= args[13]	
	bt.TotalOrderAmount					= args[14]
	bt.AccountingType					= args[15]
	bt.CostCenter						= args[16]
	bt.GLAccount						= args[17]
	bt.TermsOfPayment					= args[18]
	bt.InternalNotes					= args[19]
	bt.ExternalNotes					= args[20]

	var material OrderMaterial
	
	if args[21] != "" {
		p := strings.Split(args[21], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			material.OrderMaterialId = 		c[0]
			material.BuyerMaterialGroup = 	c[1]
			material.ProductName = 			c[2]
			material.ProductDescription = 	c[3]
			material.Quantity = 			c[4]
			material.QuantityUnit = 		c[5]
			material.PricePerUnit = 		c[6]
			material.Currency = 			c[7]
			
			bt.OrderedMaterial = append(bt.OrderedMaterial, material)
		}
	}
	
	//Commit Inward entry to ledger
	fmt.Println("savePurchaseOrder - Commit Purchase Order To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PurchaseOrderNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//Update All Abattoirs Array	
	allb.PurchaseOrderNumbers = append(allb.PurchaseOrderNumbers, bt.PurchaseOrderNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allPurchaseOrderNumbers", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


