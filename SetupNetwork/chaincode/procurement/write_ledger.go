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

	if len(args) != 29 {
		fmt.Println("Incorrect number of arguments. Expecting 29 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 29")
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
	bt.OrderBy 							= args[2]
	bt.BuyerCompany						= args[3]
	bt.BuyerDepartment					= args[4]
	bt.BuyerContactPerson				= args[5]
	bt.BuyerContactPersonAddress		= args[6]
	bt.BuyerContactPersonPhone			= args[7]
	bt.BuyerContactPersonEmail			= args[8]
	
	bt.SupplierName						= args[9]
	bt.SupplierUniqueNo					= args[10]
	bt.SupplierContactPerson			= args[11]
	bt.SupplierContactPersonAddress		= args[12]
	bt.SupplierContactPersonAddressPhone= args[13]
	bt.SupplierContactPersonAddressEmail= args[14]

	bt.DeliverToPersonName				= args[15]	
	bt.DeliverToPersonAddress			= args[16]	
	bt.InvoicePartyId					= args[17]	
	bt.InvoiceAddress					= args[18]	
	bt.TotalOrderAmount					= args[19]
	bt.AccountingType					= args[20]
	bt.CostCenter						= args[21]
	bt.GLAccount						= args[22]
	bt.TermsOfPayment					= args[23]
	bt.InternalNotes					= args[24]
	bt.ExternalNotes					= args[25]
	bt.VatNo					= args[26]
	bt.TermsOfDelivery					= args[27]
	bt.Status = "Approved"
	var material OrderMaterial
	
	if args[28] != "" {
		p := strings.Split(args[28], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			material.Pos = 		c[0]			
			material.ProductName = 			c[1]
			material.ProductDescription = 	c[2]
			material.Quantity = 			c[3]
			material.QuantityUnit = 		c[4]
			material.PricePerUnit = 		c[5]
			material.Currency = 			c[6]
			material.ExpectedDeliveryDate = 			c[7]			
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

	if len(args) != 15 {
		fmt.Println("Incorrect number of arguments. Expecting 15 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 15")
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
	bt.TotalOrderAmount					= args[14]
	var nbt PurchaseOrder
	var material OrderMaterial
	if args[13] != "" {
		p := strings.Split(args[13], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			material.Pos = 		c[0]			
			material.ProductName = 			c[1]
			material.ProductDescription = 	c[2]
			material.Quantity = 			c[3]
			material.QuantityUnit = 		c[4]
			material.PricePerUnit = 		c[5]
			material.Currency = 			c[6]
			material.ExpectedDeliveryDate = 			c[7]
			material.NetAmount = 			c[8]
			nbt.OrderedMaterial = append(nbt.OrderedMaterial, material)
		}
	}
	bt.OrderedMaterial = nbt.OrderedMaterial

	//Commit Inward entry to ledger
	fmt.Println("updatePurchaseOrder - Commit Purchase Order To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PurchaseOrderNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create LogisticTransaction block
func saveLogisticTransaction(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveLogisticTransaction..")

	if len(args) != 10 {
		fmt.Println("Incorrect number of arguments. Expecting 12")
		return shim.Error("Incorrect number of arguments. Expecting 12")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]);
	allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all AllLogisticTransactionIds")
	}
	var allb AllLogisticTransactionIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all AllLogisticTransactionIds")
	}
	if checkDuplicateId(allb.ConsignmentNumbers, args[0]) == 0{
		return shim.Error("Duplicate ConsignmentNumber - "+ args[0])
	}
	
	var bt LogisticTransaction
	bt.ConsignmentNumber				= args[0]
	bt.GoodsIssueRefNumber				= args[1]
	bt.PurchaseOrderRefNumber				= args[2]
	bt.SupplierNumber							= args[3]
	bt.ShipToParty			= args[4]
	bt.PickedupDatetime						= args[5]
	bt.ExpectedDeliveryDatetime						= args[6]
	bt.ActualDeliveryDatetime			= args[7]	
	bt.HazardousMaterial			= args[8]
	bt.PackagingInstruction			= args[9]

	//Commit Inward entry to ledger
	fmt.Println("saveLogisticTransaction - Commit LogisticTransaction To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All AbattoirDispatch Array	
	allb.ConsignmentNumbers = append(allb.ConsignmentNumbers, bt.ConsignmentNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allLogisticTransactionIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func saveVendorSalesOrder(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveVendorSalesOrder..")

	if len(args) != 17 {
		fmt.Println("Incorrect number of arguments. Expecting 17 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 17")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);

	allBAsBytes, err := stub.GetState("allVendorSalesOrderNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Sales Order Numbers")
	}
	var allb AllVendorSalesOrderNumbers
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Sales Order Numbers")
	}
	if checkDuplicateId(allb.SalesOrderNumbers, args[0]) == 0{
		return shim.Error("Duplicate Sales Order Number - "+ args[0])
	}

	var bt VendorSalesOrder
	bt.SalesOrderNumber					= args[0]
	bt.PurchaseOrderRefNumber			= args[1]
	bt.PurchaseOrderRefDate				= args[2]	
	bt.PurchaserCompany					= args[3]		
	bt.PurchaserCompanyDept 			= args[4]
	bt.PurchaserContactPersonName		= args[5]
	bt.PurchaserContactPersonAddress	= args[6]
	bt.PurchaserContactPersonPhone		= args[7]
	bt.PurchaserContactPersonEmail		= args[8]
	bt.DeliverToPersonName				= args[9]
	bt.DeliveryAddress					= args[10]
	
	bt.InvoicePartyId					= args[11]
	bt.InvoicePartyAddress				= args[12]
	bt.Status				= args[14]
	bt.StatusUpdatedOn				= args[15]
	bt.StatusUpdatedBy				= args[16]

	var material VendorMaterial
	
	if args[13] != "" {
		p := strings.Split(args[13], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			material.MaterialId 		= 		c[0]
			material.ProductName 		= 		c[1]
			material.ProductDescription = 		c[2]
			material.Quantity 			= 		c[3]
			material.QuantityUnit 		= 		c[4]
			material.PricePerUnit 		= 		c[5]
			material.Currency 			= 		c[6]
			material.NetAmount 			= 		c[7]
			bt.MaterialList = append(bt.MaterialList, material)
		}
	}
	
	//Commit Sales Order entry to ledger
	fmt.Println("saveVendorSalesOrder - Commit Sales Order To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.SalesOrderNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//Update All Abattoirs Array	
	allb.SalesOrderNumbers = append(allb.SalesOrderNumbers, bt.SalesOrderNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allVendorSalesOrderNumbers", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


func saveGoodsReceipt(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveGoodsReceipt..")

	if len(args) != 17 {
		fmt.Println("Incorrect number of arguments. Expecting 17 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 17")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);

	allBAsBytes, err := stub.GetState("allGoodsReceiptIds")
	if err != nil {
		return shim.Error("Failed to get allGoodsReceiptIds")
	}
	var allb AllGoodsReceiptIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal allGoodsReceiptIds")
	}
	if checkDuplicateId(allb.GoodsReceiptNumbers, args[0]) == 0{
		return shim.Error("Duplicate GoodsReceiptIds - "+ args[0])
	}

	var bt GoodsReceipt
	bt.GoodsReceiptNumber					= args[0]
	bt.GoodsReceiptDate			= args[1]
	bt.PurchaseOrderRefNumber				= args[2]	
	bt.GoodIssueNumber			= args[3]
	bt.ConsignmentNumber		= args[4]
	bt.PurchaserCompany					= args[5]		
	bt.PurchaserCompanyDept 			= args[6]
	bt.PurchaserContactPersonName		= args[7]
	bt.PurchaserContactPersonAddress	= args[8]
	bt.PurchaserContactPersonPhone		= args[9]
	bt.PurchaserContactPersonEmail		= args[10]
	bt.DeliverToPersonName				= args[11]
	bt.DeliveryAddress					= args[12]	
	bt.TotalOrderAmount				= args[13]
	bt.Fdf					= args[14]

	var material VendorMaterial
	
	if args[15] != "" {
		p := strings.Split(args[15], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			material.MaterialId 		= 		c[0]
			material.ProductName 		= 		c[1]
			material.ProductDescription = 		c[2]
			material.Quantity 			= 		c[3]
			material.QuantityUnit 		= 		c[4]
			material.PricePerUnit 		= 		c[5]
			material.Currency 			= 		c[6]
			material.NetAmount 			= 		c[7]
			bt.MaterialList = append(bt.MaterialList, material)
		}
	}
	
	//Commit Sales Order entry to ledger
	fmt.Println("saveGoodsReceipt - Commit GoodsReceiptNumber To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.GoodsReceiptNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//Update All Abattoirs Array	
	allb.GoodsReceiptNumbers = append(allb.GoodsReceiptNumbers, bt.GoodsReceiptNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allGoodsReceiptIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


// Save Goods Issue

func saveGoodsIssue(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveGoodsIssue..")

	if len(args) != 6 {
		fmt.Println("Incorrect number of arguments. Expecting 17 - ..")
		return shim.Error("Incorrect number of arguments. Expecting 17")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]);

	allBAsBytes, err := stub.GetState("allGoodsIssueNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Sales Order Numbers")
	}
	var allb AllGoodsIssueNumbers
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Goods Issue Numbers")
	}
	if checkDuplicateId(allb.GoodsIssueNumbers, args[0]) == 0{
		return shim.Error("Duplicate Goods Issue Number - "+ args[0])
	}

	var bt GoodsIssue
	bt.GoodsIssueNumber					= args[0]
	bt.SalesOrderNumber					= args[1]
	bt.DeliverToPersonName				= args[2]	
	bt.DeliveryAddress					= args[3]		
	bt.LogisticsProvider 				= args[4]

	var material VendorMaterial
	
	if args[5] != "" {
		p := strings.Split(args[5], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			material.MaterialId 		= 		c[0]
			material.ProductName 		= 		c[1]
			material.ProductDescription = 		c[2]
			material.Quantity 			= 		c[3]
			material.QuantityUnit 		= 		c[4]
			material.PricePerUnit 		= 		c[5]
			material.Currency 			= 		c[6]
			material.NetAmount 			= 		c[7]
			material.DispatchedQuantity	= 		c[8]
			material.BatchNumber		= 		c[9]
			bt.MaterialList = append(bt.MaterialList, material)
		}
	}
	
	//Commit Sales Order entry to ledger
	fmt.Println("saveGoodsIssue - Commit Goods Issue To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.GoodsIssueNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//Update All Abattoirs Array	
	allb.GoodsIssueNumbers = append(allb.GoodsIssueNumbers, bt.GoodsIssueNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allGoodsIssueNumbers", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}
