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

	if len(args) != 28 {
		fmt.Println("Incorrect number of arguments. Expecting 28 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 28")
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
	
	bt.SupplierName						= args[11]
	bt.SupplierUniqueNo					= args[12]
	bt.SupplierContactPerson			= args[13]
	bt.SupplierContactPersonAddress		= args[14]
	bt.SupplierContactPersonAddressPhone= args[15]
	bt.SupplierContactPersonAddressEmail= args[16]

	bt.DeliverToPersonName				= args[17]	
	bt.DeliverToPersonAddress			= args[18]	
	bt.InvoiceAddress					= args[19]	
	bt.TotalOrderAmount					= args[20]
	bt.AccountingType					= args[21]
	bt.CostCenter						= args[22]
	bt.GLAccount						= args[23]
	bt.TermsOfPayment					= args[24]
	bt.InternalNotes					= args[25]
	bt.ExternalNotes					= args[26]
	bt.Status = "Created"
	var material OrderMaterial
	
	if args[27] != "" {
		p := strings.Split(args[27], ",")
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
			material.NetAmount = 			c[8]
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

func updatePurchaseOrder(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running updatePurchaseOrder..")

	if len(args) != 13 {
		fmt.Println("Incorrect number of arguments. Expecting 13 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 13")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);
	
	var bt PurchaseOrder
	sbAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get Purchase Order record.")
	}
	json.Unmarshal(sbAsBytes, &bt)
	
	bt.BuyerContactPerson				= args[1]
	bt.SupplierName						= args[2]
	bt.SupplierContactPerson			= args[3]
	bt.DeliverToPersonName				= args[4]	
	bt.DeliverToPersonAddress			= args[5]	
	bt.InvoiceAddress					= args[6]	
	bt.CostCenter						= args[7]
	bt.GLAccount						= args[8]
	bt.TermsOfPayment					= args[9]
	bt.InternalNotes					= args[10]
	bt.ExternalNotes					= args[11]
	bt.Status = args[12]
	//Commit Inward entry to ledger
	fmt.Println("updatePurchaseOrder - Commit Purchase Order To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PurchaseOrderNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


