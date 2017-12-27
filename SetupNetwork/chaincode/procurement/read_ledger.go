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
	"strconv"
	
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)


// ============================================================================================================================
// Get All Purchase Orders
// ============================================================================================================================
func getAllPurchaseOrders(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllPurchaseOrders: Looking for All Purchase Orders");

	//get the LogisticTransactions index
	allBAsBytes, err := stub.GetState("allPurchaseOrderNumbers")
	if err != nil {
		return shim.Error("Failed to get all Purchase order numbers")
	}

	var res AllPurchaseOrderNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Purchase order records")
	}
	var sb PurchaseOrder
	var allIds AllPurchaseOrderNumbers
	var allDetails AllPurchaseOrderDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Purchase Order record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.PurchaseOrderNumber != "" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.PurchaseOrderNumbers{

		sbAsBytes, err := stub.GetState(res.PurchaseOrderNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Purchase Order record.")
		}
		var sb PurchaseOrder
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.PurchaseOrderNumbers = append(allIds.PurchaseOrderNumbers, sb.PurchaseOrderNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		} else if strings.ToLower(option) == "created" && strings.ToLower(sb.Status) == "created" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		} else if strings.ToLower(option) == "approved" && strings.ToLower(sb.Status) == "approved" {
			allDetails.PurchaseOrders = append(allDetails.PurchaseOrders, sb);	
		}
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "created" || strings.ToLower(option) == "approved" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get unique number
// ============================================================================================================================
func getUniqueId(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	prefix := ""	
	if strings.ToLower(option) == "logistic" {
		prefix = "LID-"
		allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
		if err != nil {
			return shim.Error("Failed to get all allLogisticTransactionIds")
		}
		var res AllLogisticTransactionIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Logistic Transactions records")
		}
		uniqueId := ""
		if len(res.ConsignmentNumbers) != 0 {
			uniqueId = res.ConsignmentNumbers[len(res.ConsignmentNumbers) - 1]
			p := strings.Split(uniqueId, "-")
			
			input, e := strconv.Atoi(p[1])
			if e != nil {
				fmt.Println(e)
			}
			output := (input + 1)
			uniqueId = prefix + strconv.Itoa(output)
			
		} else {
			uniqueId = prefix +"1000"
		}
		rabAsBytes, _ := json.Marshal(uniqueId)
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "goods-receipt" {
		prefix = "BGRID-"
		allBAsBytes, err := stub.GetState("allGoodsReceiptIds")
		if err != nil {
			return shim.Error("Failed to get all allGoodsReceiptIds")
		}
		var res AllGoodsReceiptIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all allGoodsReceiptIds")
		}
		uniqueId := ""
		if len(res.GoodsReceiptNumbers) != 0 {
			uniqueId = res.GoodsReceiptNumbers[len(res.GoodsReceiptNumbers) - 1]
			p := strings.Split(uniqueId, "-")
			
			input, e := strconv.Atoi(p[1])
			if e != nil {
				fmt.Println(e)
			}
			output := (input + 1)
			uniqueId = prefix + strconv.Itoa(output)
			
		} else {
			uniqueId = prefix +"1000"
		}
		rabAsBytes, _ := json.Marshal(uniqueId)
		return shim.Success(rabAsBytes)	
		} else if strings.ToLower(option) == "vendor" {
			prefix = "VSOID-"
			allBAsBytes, err := stub.GetState("allVendorSalesOrderNumbers")
			if err != nil {
				return shim.Error("Failed to get all allVendorSalesOrderNumbers")
			}
			var res AllVendorSalesOrderNumbers
			err = json.Unmarshal(allBAsBytes, &res)
			if err != nil {
				fmt.Println("Printing Unmarshal error:-");
				fmt.Println(err);
				return shim.Error("Failed to Unmarshal all allVendorSalesOrderNumbers")
			}
			uniqueId := ""
			if len(res.SalesOrderNumbers) != 0 {
				uniqueId = res.SalesOrderNumbers[len(res.SalesOrderNumbers) - 1]
				p := strings.Split(uniqueId, "-")
				
				input, e := strconv.Atoi(p[1])
				if e != nil {
					fmt.Println(e)
				}
				output := (input + 1)
				uniqueId = prefix + strconv.Itoa(output)
				
			} else {
				uniqueId = prefix +"1000"
			}
			rabAsBytes, _ := json.Marshal(uniqueId)
			return shim.Success(rabAsBytes)	
			} else if strings.ToLower(option) == "goods-issue" {
				prefix = "GIID-"
				allBAsBytes, err := stub.GetState("allGoodsIssueNumbers")
				if err != nil {
					return shim.Error("Failed to get all AllGoodsIssueNumbers")
				}
				var res AllGoodsIssueNumbers
				err = json.Unmarshal(allBAsBytes, &res)
				if err != nil {
					fmt.Println("Printing Unmarshal error:-");
					fmt.Println(err);
					return shim.Error("Failed to Unmarshal all AllGoodsIssueNumbers")
				}
				uniqueId := ""
				if len(res.GoodsIssueNumbers) != 0 {
					uniqueId = res.GoodsIssueNumbers[len(res.GoodsIssueNumbers) - 1]
					p := strings.Split(uniqueId, "-")
					
					input, e := strconv.Atoi(p[1])
					if e != nil {
						fmt.Println(e)
					}
					output := (input + 1)
					uniqueId = prefix + strconv.Itoa(output)
					
				} else {
					uniqueId = prefix +"1000"
				}
				rabAsBytes, _ := json.Marshal(uniqueId)
				return shim.Success(rabAsBytes)	
			}

	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Logistic Transactions
// ============================================================================================================================
func getAllLogisticTransactions(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllLogisticTransactions: Looking for All Logistic Transactions");

	//get the LogisticTransactions index
	allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all allLogisticTransactionIds")
	}

	var res AllLogisticTransactionIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Logistic Transactions records")
	}
	var sb LogisticTransaction
	var allIds AllLogisticTransactionIds
	var allDetails AllLogisticTransactionDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.ConsignmentNumber != "" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	for i := range res.ConsignmentNumbers{

		sbAsBytes, err := stub.GetState(res.ConsignmentNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		var sb LogisticTransaction
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers, sb.ConsignmentNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		}	
	}

	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Vendor Sales Orders
// ============================================================================================================================
func getAllVendorSalesOrders(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllVendorSalesOrders: Looking for All Vendor Sales Orders");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allVendorSalesOrderNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Sales order numbers")
	}

	var res AllVendorSalesOrderNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Vendor Sales order records")
	}
	var sb VendorSalesOrder
	var allIds AllVendorSalesOrderNumbers
	var allDetails AllVendorSalesOrderDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Sales Order record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.SalesOrderNumber != "" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.SalesOrderNumbers{

		sbAsBytes, err := stub.GetState(res.SalesOrderNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Sales Order record.")
		}
		var sb VendorSalesOrder
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.SalesOrderNumbers = append(allIds.SalesOrderNumbers, sb.SalesOrderNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		} else if strings.ToLower(option) == "receipt" && strings.ToLower(sb.Status) == "receipt" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		} else if strings.ToLower(option) == "issued" && strings.ToLower(sb.Status) == "issued" {
			allDetails.VendorSalesOrders = append(allDetails.VendorSalesOrders, sb);	
		}
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "receipt" || strings.ToLower(option) == "issued" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Goods Receipt Details
// ============================================================================================================================
func getAllGoodsReceiptDetails(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("allGoodsReceiptIds: Looking for allGoodsReceiptIds");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allGoodsReceiptIds")
	if err != nil {
		return shim.Error("Failed to get allGoodsReceiptIds")
	}

	var res AllGoodsReceiptIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal allGoodsReceiptIds")
	}
	var sb GoodsReceipt
	var allIds AllGoodsReceiptIds
	var allDetails AllGoodsReceiptDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Sales Order record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.GoodsReceiptNumber != "" {
			allDetails.GoodsReceiptNumbers = append(allDetails.GoodsReceiptNumbers, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.GoodsReceiptNumbers{

		sbAsBytes, err := stub.GetState(res.GoodsReceiptNumbers[i])
		if err != nil {
			return shim.Error("Failed to get goods receipt record.")
		}
		var sb GoodsReceipt
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.GoodsReceiptNumbers = append(allIds.GoodsReceiptNumbers, sb.GoodsReceiptNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.GoodsReceiptNumbers = append(allDetails.GoodsReceiptNumbers, sb);	
		}
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Vendor - Goods Issue
// ============================================================================================================================
func getAllGoodsIssue(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllGoodsIssue: Looking for All Vendor Goods Issue");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allGoodsIssueNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Sales order numbers")
	}

	var res AllGoodsIssueNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Vendor Goods Issue records")
	}
	var sb GoodsIssue
	var allIds AllGoodsIssueNumbers
	var allDetails AllGoodsIssueDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Goods Issue record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.GoodsIssueNumber != "" {
			allDetails.GoodsIssueList = append(allDetails.GoodsIssueList, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.GoodsIssueNumbers{

		sbAsBytes, err := stub.GetState(res.GoodsIssueNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Goods Issue record.")
		}
		var sb GoodsIssue
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.GoodsIssueNumbers = append(allIds.GoodsIssueNumbers, sb.GoodsIssueNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.GoodsIssueList = append(allDetails.GoodsIssueList, sb);	
		}
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}


// ============================================================================================================================
// Get All Vendor - Invoice
// ============================================================================================================================
func getAllVendorInvoices(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllVendorInvoices: Looking for All Vendor Invoices");

	//get the VendorSales Orders index
	allBAsBytes, err := stub.GetState("allVendorInvoiceNumbers")
	if err != nil {
		return shim.Error("Failed to get all Vendor Invoice numbers")
	}

	var res AllVendorInvoiceNumbers
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Vendor Invoice records")
	}

	var sb VendorInvoice
	var allIds AllVendorInvoiceNumbers
	var allDetails AllVendorInvoiceDetails
	
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Vendor Invoice record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.InvoiceNumber != "" {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	fmt.Println("loop all");
	for i := range res.InvoiceNumbers{

		sbAsBytes, err := stub.GetState(res.InvoiceNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Goods Issue record.")
		}
		var sb VendorInvoice
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.InvoiceNumbers = append(allIds.InvoiceNumbers, sb.InvoiceNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.VendorInvoices = append(allDetails.VendorInvoices, sb);	
		}
	}
	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}
